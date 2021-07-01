<template>
    <div class="">
        <div id="allmap"></div>
        <el-dialog 
          :title="info.title"
          v-model="dialogVisible"
          width="80%"
          :close-on-click-modal="true"
          @close="close()">
          <div class="vid-wrap">
            <video ref='video' controls autoplay loop>
              <source type="video/mp4">
              您的浏览器不支持 HTML5 video 标签。
            </video>
          </div>
        </el-dialog>
    </div>
</template>
<style type="text/css">
    #allmap {
        position: absolute;
        left: 0px;
        width: 100%;
        height: 100%
    }
    .modal-backdrop {
        opacity: 0.8 !important;
        filter: alpha(opacity=0.8) !important;
    }
    /*取消百度地图logo*/
    .anchorBL {
        display: none;
    }
    .vid-wrap{
      width:100%;background: #000;
      position:relative;
      padding-bottom:56.25%;    /*需要用padding来维持16:9比例,也就是9除以16*/
      height: 0;
  }
  .vid-wrap video{
      position: absolute;
      top:0;
      left: 0;
      width: 100%;
      height: 100%
  }
</style>

<script>
// 导入BMap组件
// import BMap from 'BMap';
import { fetchPOI } from "@/api/map";
import {loadMap} from '@/helper/map.js';
import imgUrl from '@/assets/img/map_icon.png';
import { app } from '@/api/common';
export default {
    name:"Maps",
    data () {
        return {
          query:{},
          map: "", // 创建Map实例
          dialogVisible:false,     //模态框是否显示
          addLoading: false,       //是否显示loading
          info:{}
        }
    },
    created(){
    },
    mounted() {
        // this.loadMap(this.init());
        loadMap().then(() => {
          this.init();
        });
    },
    methods:{
        opendialog:function(){    // 打开模态框
          this.dialogVisible = true;
        },
        init:function(){
          // dom元素更新后执行，因此这里能正确打印更改之后的值
          this.$nextTick(
            function(){
              this.map = new BMap.Map("allmap");
              if (!BMap) {
                console.log("初始化失败")
                return false;
              }
              // var map = document.getElementById("allmap"); // 创建Map实例
              this.map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
              this.map.centerAndZoom(new BMap.Point(118.115071, 24.44031), 15); // 初始化地图,设置中心点坐标和地图级别
              this.map.setMapStyle({
                  style: 'midnight'
              })
              fetchPOI(this.query)
              .then(res => {
                  this.$message.success(res.msg);
                  this.addMarker(res.data);
              })
              .catch(err=>{
                this.$message.error(err.msg);
              });
            })
        },
        addMarker: function(data) {
            const n = data.length;
            //循环建立标注点
            for (var i = 0; i < n; i++) {
                let inf = data[i];
                let lng = inf.longitude;
                let lat = inf.latitude;
                [lng, lat] = this.qqMapToBMap(lng, lat);
                var point = new BMap.Point(lng, lat); //将标注点转化成地图上的点
                var myIcon = new BMap.Icon(imgUrl, new BMap.Size(40, 45));
                var marker = new BMap.Marker(point, {
                    icon: myIcon
                }); //将点转化成标注点
                this.map.addOverlay(marker); //将标注点添加到地图上
                let self = this;
                //添加监听事件
                (function() {
                    marker.addEventListener("click",
                        function() {
                            self.opendialog();
                            self.showInfo(inf);
                        });
                })();
            }
        },
        showInfo:function(inf){
          this.info.title = inf.customCallout.content;
          this.info.coverURL = inf.coverURL;
          this.info.videoInfo = inf.videoInfo;
          this.info.videoTitle = inf.videoInfo.videoTitle;
          this.info.videoURL = null;
          app.getTempFileURL({
                    fileList: [ inf.videoInfo.videoURL]
                  })
                  .then((res1) => {
                    res1.fileList.forEach((el) => {
                      if (el.code === "SUCCESS") {
                        this.info.videoURL = el.tempFileURL;
                        this.$refs.video.src = this.info.videoURL
                      } else {
                        //获取下载链接失败
                      }
                    });
                  });
        },
        qqMapToBMap(lng, lat) {
          if (lng == null || lng == '' || lat == null || lat == '')
              return [lng, lat];
          var x_pi = 3.14159265358979324;
          var x = parseFloat(lng);
          var y = parseFloat(lat);
          var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
          var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
          var lng = (z * Math.cos(theta) + 0.0065).toFixed(5);
          var lat = (z * Math.sin(theta) + 0.006).toFixed(5);
          return [lng, lat];
        },
        // 模态框关闭的回调事件
        close(){
          this.dialogVisible = false;
          this.$refs.video.src = "";
        }
    }
}
</script>
