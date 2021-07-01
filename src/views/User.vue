<template>
    <div>
        <div class="container">
            <el-tabs v-model="message">
                <el-tab-pane :label="`管理员`" name="admin">
                  <div class="handle-box">
                      <el-input v-model="query.nickName" placeholder="请输入用户名" class="handle-input mr10" style="width:170px;"></el-input>
                      <el-select v-model="query.state" placeholder="请选择禁用状态" class="handle-input mr10" style="width:170px;">
                        <el-option
                          v-for="item in options1"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                      <el-select v-model="query.superAdmin" placeholder="请选择管理员权限" class="handle-input mr10" style="width:170px;">
                        <el-option
                          v-for="item in options2"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                      <div class="handle-input" style="width:150px;">
                          <el-date-picker
                              type="date"
                              placeholder="注册开始日期"
                              v-model="query.startDate"
                              style="width:100%;"
                          ></el-date-picker>
                      </div>
                      至
                      <div class="handle-input mr10" style="width:150px;">
                          <el-date-picker
                              type="date"
                              placeholder="注册结束日期"
                              v-model="query.endDate"
                              style="width: 100%;"
                          ></el-date-picker>
                      </div>
                      <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                  </div>
                  <el-table
                      v-loading="loading"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      :data="tableData"
                      border
                      class="table"
                      ref="multipleTable"
                      header-cell-class-name="table-header"
                      max-height="520"
                  >
                      <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                      <el-table-column prop="username" label="用户名" align="center"></el-table-column>
                      <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
                       <el-table-column label="权限禁用状态" width="120" align="center">
                          <template #default="scope">
                            <el-switch v-model="scope.row.state" @change="changeState(scope.row)"  active-color="#13ce66" inactive-color="#ff4949">
                            </el-switch>
                          </template>
                      </el-table-column>
                       <el-table-column label="超级管理员权限" width="120" align="center">
                          <template #default="scope">
                            <el-switch v-model="scope.row.super" @change="changeSuper(scope.row)"  active-color="#13ce66" inactive-color="#ff4949">
                            </el-switch>
                          </template>
                      </el-table-column>                      
                      <!-- <el-table-column prop="registertime" label="注册时间" width="150" align="center"></el-table-column> -->
                      <el-table-column prop="registertime" label="注册时间" align="center"></el-table-column>
                      <el-table-column prop="updatetime" label="上次登录时间" align="center"></el-table-column>
                      <el-table-column label="操作" align="center">
                          <template #default="scope">
                              <el-button
                                  type="text"
                                  icon="el-icon-delete"
                                  class="red"
                                  @click="handleDelete(scope.$index, scope.row)"
                              >删除</el-button>
                          </template>
                      </el-table-column>
                  </el-table>
                  <div class="pagination">
                      <el-pagination
                          background
                          layout="total, prev, pager, next"
                          :current-page="query.pageIndex"
                          :page-size="query.pageSize"
                          :total="pages.total"
                          @current-change="handlePageChange"
                      ></el-pagination>
                  </div>
                </el-tab-pane>
                <el-tab-pane :label="`小程序用户`" name="user">
                  <!-- todo -->
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import { app } from '@/api/common';
import { getFormatDate, getFormatDateTime } from '@/helper';
export default {
    name: "comment",
    data() {
      return {
            query: {
                pageIndex: 1,
                pageSize:0,
                nickName:"",
                state:'',
                superAdmin:'',
                startDate: '',
                endDate: ''
            },
            loading:true,
            tableData: [],
            multipleSelection: [],
            pages:{},
            id: -1,
            total:0,
            message:"admin",
            options1: [{
              value: 0,
              label: '禁用'
            }, {
              value: 1,
              label: '开启'
            }],
            options2: [{
              value: 0,
              label: '普通管理员'
            }, {
              value: 1,
              label: '超级管理员'
            }],
            shortcuts: [{
              text: '最近一周',
              value: (() => {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                return [start, end]
              })(),
            }, {
              text: '最近一个月',
              value: (() => {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                return [start, end]
              })(),
            }, {
              text: '最近三个月',
              value: (() => {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                return [start, end]
              })(),
            }],
          }
    },
    created(){
      // 每页条数
      this.query.pageSize = this.$store.state.query.pageSize?this.$store.state.query.pageSize:10;
      this.getData();
    },
    methods: {
        // 触发搜索按钮
        handleSearch() {
            this.getData();
        },
        // 禁用状态改变
        changeState(row) {
            const query = {};
            query._id = row._id;
            query.state = row.state;
            query.collection = 'admins';
            app.callFunction({
                name: 'updateStateById',
                data: query
            }).then(() => {
                let message = row.state?'管理员权限已开启':'管理员权限已禁用';
                this.$message.success(message);
            })
            .catch(() => {
                let message = row.state?'管理员权限开启失败':'管理员权限禁用失败';
                this.$message.error(message);
            });
        },
        // 超级管理员状态改变
        changeSuper(row) {
            const query = {};
            query._id = row._id;
            query.super = row.super;
            query.collection = 'admins';
            app.callFunction({
                name: 'updateSuperById',
                data: query
            }).then(() => {
                let message = row.state?'超级管理员权限已开启':'超级管理员权限已禁用';
                this.$message.success(message);
            })
            .catch(() => {
                let message = row.state?'超级管理员权限开启失败':'超级管理员权限禁用失败';
                this.$message.error(message);
            });
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm("确定要删除吗？", "提示", {
                type: "warning"
            })
            .then(() => {
                // const query = {};
                // query._ids = [row._id];
                // app.callFunction({
                //     name: 'deleteCommentsById',
                //     data: query
                // }).then(() => {
                //     // this.tableData.splice(index, 1);
                //     this.getData();
                //     this.$message.success("删除成功");
                // })
                // .catch(() => {
                //     this.$message.error("删除失败");
                // });
                this.$message.error("不允许删除");
            })
            .catch(() => { });
        },
        // 分页导航
        handlePageChange(val) {
            this.query.pageIndex = val;
            this.getData();
        },
        handleError() {
            this.$notify.error({
                title: "上传失败",
                message: "图片上传接口上传失败，可更改为自己的服务器接口"
            });
        },
        // 获取评论数据 - 通过云函数  - 不需开启云上admins表的用户读权限
        // todo 云函数getAdminsBy 还需要完善各种参数的查询
        getData(){
          this.loading = true;
          app.callFunction({
              name: 'getAdminsBy',
              data: this.query
          }).then((res) => {
              let n = res.result.adminsList.length;
              for (let i = n-1; i >= 0; i--) {
                res.result.adminsList[i].updatetime = getFormatDateTime(res.result.adminsList[i].updatetime);
                res.result.adminsList[i].registertime = getFormatDateTime(res.result.adminsList[i].registertime);
              }
              this.tableData = res.result.adminsList;
              this.pages.total = res.result.total; // 总条数
              this.loading = false;
          });
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 200px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
.pre-img {
    width: 100px;
    height: 100px;
    background: #f8f8f8;
    border: 1px solid #eee;
    border-radius: 5px;
}
.crop-demo {
    display: flex;
    align-items: flex-end;
}
.crop-demo-btn {
    position: relative;
    width: 100px;
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    margin-left: 30px;
    background-color: #409eff;
    color: #fff;
    font-size: 14px;
    border-radius: 4px;
    box-sizing: border-box;
}
.crop-input {
    position: absolute;
    width: 100px;
    height: 40px;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
}
</style>
