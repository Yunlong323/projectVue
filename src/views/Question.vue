<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-input v-model="query.name" placeholder="景点名" class="handle-input mr10"></el-input>
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
                <el-table-column prop="markerName" label="景点名" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="禁用状态" width="80" align="center">
                    <template #default="scope">
                      <el-switch v-model="scope.row.markerState" active-color="#13ce66" inactive-color="#ff4949">
                      </el-switch>
                    </template>
                </el-table-column>

                <el-table-column prop="question" label="题目"></el-table-column>
                <el-table-column label="选项">
                    <template #default="scope">
                      <el-checkbox-group v-if="scope.row.type === 'check'" v-model="scope.row.answerList">
                        <el-checkbox v-for="(value,key) in scope.row.options" :key="key" :label="key+'：'+value" disabled></el-checkbox>
                      </el-checkbox-group>
                      <el-radio-group v-else-if="scope.row.type === 'radio'"  v-model="scope.row.answer">
                        <el-radio v-for="(value,key) in scope.row.options" :label="key" :key="key" disabled>{{key + '：'+ value}}</el-radio>
                      </el-radio-group>
                      <div v-else>
                        {{scope.row.answer}}
                      </div>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="answer" label="答案" width="150"></el-table-column> -->
                <el-table-column label="操作" width="150" align="center">
                    <template #default="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
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
        <!-- 添加弹出框 -->
        <el-dialog title="添加题目" v-model="addVisible" width="90%" >
            <el-form ref="newForm" :model="newForm" label-position="top" label-width="70px">
                <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="景点名">
                        <!-- todo 数据库自动搜景点名，后填充-->
                          <el-input v-model="newForm.name"></el-input>
                      </el-form-item>
                      <el-form-item label="题目类型">
                        <el-input v-model="newForm.detail"></el-input>
                      </el-form-item>
                      <!-- todo -->
                      <el-radio-group v-model="radio" label="题目类型">
                        <el-radio :label="3">单选</el-radio>
                        <el-radio :label="6">多选</el-radio>
                        <el-radio :label="9">填空</el-radio>
                        <el-radio :label="9">问答</el-radio>
                      </el-radio-group>
                      <el-form-item label="题目">
                        <el-input v-model="newForm.detail"></el-input>
                      </el-form-item>
                      <el-form-item label="选项">
                        <el-input v-model="newForm.detail"></el-input>
                      </el-form-item>
                      <el-form-item label="答案">
                        <el-input v-model="newForm.detail"></el-input>
                      </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveAdd">新 增</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑题目" v-model="editVisible" width="90%">
            <el-form ref="form" :model="form" label-width="70px">
                 <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="景点名">
                          <el-input v-model="form.name"></el-input>
                      </el-form-item>
                      <el-form-item label="状态">
                          <el-switch v-model="form.state"></el-switch>
                      </el-form-item>
                      <el-form-item label="景点图片">
                          <div class="crop-demo">
                              <img :src="cropImg" class="pre-img" />
                              <div class="crop-demo-btn">
                                  选择图片
                                  <input
                                      class="crop-input"
                                      type="file"
                                      name="image"
                                      accept="image/*"
                                      @change="setImage"
                                  />
                              </div>
                          </div>
                          <el-dialog title="裁剪图片" v-model="dialogVisible" width="600px">
                              <vue-cropper
                                  ref="cropper"
                                  :src="imgSrc"
                                  :ready="cropImage"
                                  :zoom="cropImage"
                                  :cropmove="cropImage"
                                  style="width:100%;height:300px;"
                              ></vue-cropper>
                              <template #footer>
                                  <span class="dialog-footer">
                                      <el-button @click="cancelCrop">取 消</el-button>
                                      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                                  </span>
                              </template>
                          </el-dialog>
                      </el-form-item>
                      <el-form-item label="景点详情">
                        <el-input type="textarea" rows="5" v-model="form.detail"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="选择地点">
                            <div id="map"></div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">保 存</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { app } from '@/api/common';
import { getFormatDate, getFormatDateTime } from '@/helper';
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
export default {
    name:'question',
    data() {
        return {
            query: {
                pageIndex: 1,
                pageSize:0,
                name:""
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            addVisible: false,
            editVisible: false,
            pages:{},
            newForm: {state:false},
            imgSrc:"",
            form: {},
            idx: -1,
            id: -1,
            newMap:"",
            cropImg: "",
            dialogVisible: false,
            total:0,
            loading:true
        };
    },
    components: {
        VueCropper
    },
    created() {
        this.query.pageSize = this.$store.state.query.pageSize?this.$store.state.query.pageSize:10;
        this.getData();
    },
    mounted(){
    },
    methods: {
        // todo 模仿Comment.vue中getAllComments 或者User.vue中getAdminsBy
        getData() {
          this.loading = true;
          app.callFunction({
              name: 'getQuestionsBy',
              data: this.query
          }).then((res) => {
              for (let obj of res.result.questionsList) {
                if (obj.type === "check") {
                  obj.answerList = obj.answer.split('');
                  let n = obj.answerList.length;
                  for (let i=0; i<n; i++) {
                    obj.answerList[i] = obj.answerList[i] +'：' + obj.options[obj.answerList[i]];
                  }
                }
              }
              this.tableData = res.result.questionsList;
              this.pages.total = res.result.total; // 总条数
              this.loading = false;
          });
        },
        // 触发搜索按钮
        handleSearch() {
            this.getData();
        },
        // 删除操作
        handleDelete(index) {
            // 二次确认删除
            this.$confirm("确定要删除吗？", "提示", {
                type: "warning"
            })
                .then(() => {
                    this.tableData.splice(index, 1);
                    // TODO删除API
                    this.$message.success("删除成功");
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = "";
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + " ";
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        // 添加操作
        handleAdd() {
            this.addVisible = true;
        },
        // 保存添加
        saveAdd() {
            // todo 写入数据库
            // if (this.newForm.name === "" || this.newForm.name === undefined) {
            //     // ElMessage.error('景点名未填写');
            //     this.$notify.error(`景点名未填写`);
            //     return;
            // }
            // if (this.newForm.detail === "" || this.newForm.detail === undefined) {
            //     this.$notify.error(`景点介绍未填写`);
            //     return;
            // }
            // if (this.imgSrc === "" || this.imgSrc === undefined) {
            //     this.$notify.error(`景点图片未上传`);
            //     return;
            // }
            // if (!this.newForm.lng || !this.newForm.lat) {
            //     this.$notify.error(`地点未选择`);
            //     return;
            // }
            this.addVisible = false;
            console.log("新增题目信息", this.newForm);
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index+1;
            this.form = row;
            console.log("编辑的景点", index, row);
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            // TODO 保存编辑 写入数据库
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
        },
        // 分页导航
        handlePageChange(val) {
            this.query.pageIndex = val;
            this.getData();
        },
        setImage(e) {
            const file = e.target.files[0];
            if (!file.type.includes("image/")) {
                return;
            }
            const reader = new FileReader();
            // 将文件以Data URL形式读入页面
            reader.readAsDataURL(file);
            reader.onload = event => {
                this.dialogVisible = true;
                // 显示图片
                this.imgSrc = event.target.result;
                // 显示放大后图片
                this.$refs.cropper &&
                    this.$refs.cropper.replace(event.target.result);
            };
        },
        cropImage() {
            this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
        },
        cancelCrop() {
            this.dialogVisible = false;
            this.cropImg = this.defaultSrc;
        },
        imageuploaded(res) {
            console.log(res);
        },
        handleError() {
            this.$notify.error({
                title: "上传失败",
                message: "图片上传接口上传失败，可更改为自己的服务器接口"
            });
        }
    },
    watch:{
    }
};
</script>

<style scoped>
#newMap, #map {
    width: 550px;
    height: 350px;
}
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
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
