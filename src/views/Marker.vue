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
                <el-table-column prop="customCallout.content" label="景点名" align="center"></el-table-column>
                <el-table-column label="景点图(查看大图)" align="center">
                    <template #default="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.imgURL"
                            :preview-src-list="[scope.row.imgURL]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="longitude" label="经度" width="100" align="center"></el-table-column>
                <el-table-column prop="latitude" label="维度" width="100" align="center"></el-table-column>
                <el-table-column prop="likes.length" label="景点获赞数" width="100" align="center"></el-table-column>
                <el-table-column label="禁用状态" width="80" align="center">
                    <template #default="scope">
                      <el-switch v-model="scope.row.state" active-color="#13ce66" inactive-color="#ff4949">
                      </el-switch>
                    </template>
                </el-table-column>

                <el-table-column prop="createtime" label="创建时间" width="150" align="center"></el-table-column>
                <el-table-column prop="createtime" label="更新时间" width="150" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
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
        <el-dialog title="添加景点" v-model="addVisible" width="90%" >
            <el-form ref="newForm" :model="newForm" label-position="top" label-width="70px">
                <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="景点名">
                          <el-input v-model="newForm.name"></el-input>
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
                      <el-form-item label="景点介绍">
                        <el-input type="textarea" rows="8" v-model="newForm.detail"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="状态">
                            <el-switch v-model="newForm.state"></el-switch>
                        </el-form-item>
                        <el-form-item label="选择地点">
                            <div id="newMap"></div>
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
        <el-dialog title="编辑景点" v-model="editVisible" width="90%">
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
import {loadMap} from '@/helper/map.js';
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
export default {
  // name:'markers',
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
            instance:"",
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
      this.instance = loadMap();
    },
    methods: {
        // todo 模仿Comment.vue中getAllComments 或者User.vue中getAdminsBy
        getData() {
          this.loading = true;
          app.callFunction({
              name: 'getMarkersByName',
              data: this.query
          }).then((res) => {
              this.tableData = res.result.markersList;
              let n =  res.result.markersList.length;
              for (let i = 0; i < n; i++) {
                this.tableData[i].imgURL = null;
                app.getTempFileURL({
                    fileList: [ res.result.markersList[i].coverURL]
                  })
                  .then((res1) => {
                    res1.fileList.forEach((el) => {
                      if (el.code === "SUCCESS") {
                        this.tableData[i].imgURL = el.tempFileURL;
                      } else {
                        //获取下载链接失败
                      }
                    });
                  });
                  this.tableData[i].createtime = getFormatDateTime(this.tableData[i].createtime);
              }
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
            this.instance.then(() => {
              this.initMap("newMap", this.newMap, this.newForm);
            });
        },
        // todo
        // 保存添加
        saveAdd() {
            console.log("新景点信息", this.newForm)
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
            this.newForm.imgSrc = JSON.stringify(this.imgSrc);
            console.log(this.newForm);
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index+1;
            this.form = row;
            console.log("编辑的景点", index, row);
            this.editVisible = true;
            this.instance.then(() => {
              this.initMap("map", this.map, this.form);
            });
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            // TODO保存编辑API
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            // this.$set(this.tableData, this.idx, this.form);
        },
        // 分页导航
        handlePageChange(val) {
            this.query.pageIndex = val;
            this.getData();
        },
        // 初始化地图
        initMap:function(classId, map, form){
          map = new BMap.Map(classId,{enableMapClick:false});//new 一个地图对象
          let point;
          if(form.lng === undefined && form.lat === undefined){//新增
              // point = new BMap.Point(118.103106,24.444323);        //设置地图的中心点
              point = new BMap.Point(118.106198,24.443892);        //设置地图的中心点
          } else {//修改
              point=new BMap.Point(form.lng, form.lat);        //设置地图的中心点
              var myIcon = new BMap.Icon("https://passport.xmu.edu.cn/static/images/common/map_icon.png", new BMap.Size(36,36));
              var marker = new BMap.Marker(point,{icon:myIcon});  // 创建标注
              map.addOverlay(marker);              // 将标注添加到地图中
              marker.setAnimation(BMAP_ANIMATION_BOUNCE);
          }
          var zoom=16;                                            //设置地图的等级
          map.centerAndZoom(point, zoom);                         // 在地图中显示
          // map.panBy(350, 250);//中心点偏移多少像素(width,height)为div 宽高的1/2;
          map.enableScrollWheelZoom();                 //启用滚轮放大缩小
          map.enableContinuousZoom();         //启用地图惯性拖拽，默认禁用
          map.enableAutoResize();//设置当地图容器发生改变时地图自动适应
          map.addEventListener("click", function(e){    //给地图添加点击事件
              map.clearOverlays();
              var lng=e.point.lng;
              var lat=e.point.lat;
              //创建标注位置
              var pt = new BMap.Point(lng,lat);
              var myIcon = new BMap.Icon("https://passport.xmu.edu.cn/static/images/common/map_icon.png", new BMap.Size(36,36));
              var marker = new BMap.Marker(pt,{icon:myIcon});  // 创建标注
              map.addOverlay(marker);              // 将标注添加到地图中
              marker.setAnimation(BMAP_ANIMATION_BOUNCE);
              form.lng = lng;
              form.lat = lat;
          });
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
