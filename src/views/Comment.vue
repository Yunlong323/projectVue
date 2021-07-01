<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-input v-model="query.markerName" placeholder="景点名" class="handle-input mr10"></el-input>
                <el-input v-model="query.nickName" placeholder="用户名" class="handle-input mr10"></el-input>
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
                @selection-change="handleSelectionChange"
                max-height="520"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="markerName" label="景点名" width="150" align="center"></el-table-column>
                <el-table-column prop="content" label="留言内容" align="center"></el-table-column>
                <el-table-column prop="date" label="留言时间" width="120" align="center"></el-table-column>
                <el-table-column prop="userinfo.nickName" label="留言用户" width="100" align="center"></el-table-column>
                <el-table-column prop="likes.length" label="留言获赞数" width="100" align="center"></el-table-column>
                <el-table-column label="留言精选等级" width="150" align="center">
                    <template #default="scope">
                      <el-select v-model="scope.row.selected" placeholder="请选择">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                          @click="changeSelected(scope.row)">
                        </el-option>
                      </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="留言禁用状态" width="120" align="center">
                    <template #default="scope">
                      <el-switch v-model="scope.row.state" @change="changeState(scope.row)" active-color="#13ce66" inactive-color="#ff4949">
                      </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
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
                markerName:"",
                nickName:""
            },
            tableData: [],
            multipleSelection: [],
            pages:{},
            id: -1,
            total:0,
            options: [{
              value: 0,
              label: '普通等级0'
            }, {
              value: 1,
              label: '精选等级1'
            }, {
              value: 2,
              label: '精选等级2'
            }, {
              value: 3,
              label: '精选等级3'
            }, {
              value: 4,
              label: '精选等级4'
            }, {
              value: 5,
              label: '精选等级5'
            }, {
              value: 6,
              label: '精选等级6'
            }, {
              value: 7,
              label: '精选等级7'
            }, {
              value: 8,
              label: '精选等级8'
            }, {
              value: 9,
              label: '精选等级9'
            }, {
              value: 10,
              label: '精选等级10'
            }],
            loading: true
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
        // 精选留言等级改变
        changeSelected(row) {
            const query = {};
            query._id = row._id;
            query.selected = row.selected;
            app.callFunction({
                name: 'updateCommentSelectedById',
                data: query
            }).then(() => {
                this.$message.success(`更新成功：${row.selected?'精选':'普通'}等级${row.selected}`);
            })
            .catch(() => {
                this.$message.error(`留言精选等级 更新失败`);
            });
        },
        // 禁用状态改变
        changeState(row) {
            const query = {};
            query._id = row._id;
            query.state = row.state;
            query.collection = 'comments';
            app.callFunction({
                name: 'updateStateById', 
                data: query
            }).then(() => {
                let message = row.state?'留言已开启':'留言已禁用';
                this.$message.success(message);
            })
            .catch(() => {
                let message = row.state?'留言开启失败':'留言禁用失败';
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
                const query = {};
                query._ids = [row._id];
                app.callFunction({
                    name: 'deleteCommentsById',
                    data: query
                }).then(() => {
                    // this.tableData.splice(index, 1);
                    this.getData();
                    this.$message.success("删除成功");
                })
                .catch(() => {
                    this.$message.error("删除失败");
                });
            })
            .catch(() => { });
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
            console.log(this.multipleSelection)
        },
        delAllSelection() {
            // 二次确认删除
            this.$confirm("确定要删除吗？", "提示", {
                type: "warning"
            })
            .then(() => {
                const length = this.multipleSelection.length;
                const _ids = [];
                for (let i = 0; i < length; i++) {
                    _ids.push(this.multipleSelection[i]._id);
                }
                const query = {};
                query._ids = _ids;
                app.callFunction({
                    name: 'deleteCommentsById',
                    data: query
                }).then(() => {
                    this.multipleSelection = [];
                    this.getData();
                    this.$message.success("批量删除成功");
                })
                .catch(() => {
                    this.$message.error("批量删除失败");
                });
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
        // 获取评论数据 - 通过云函数  - 不需开启云上comment表的用户读权限
        getData(){
          this.loading = true;
          app.callFunction({
              name: 'getCommentsByName',
              data: this.query
          }).then((res) => {
              this.tableData = res.result.commentList;
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
