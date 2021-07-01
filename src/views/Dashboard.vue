<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20" style="height:252px;">
                    <div class="user-info">
                        <img src="../assets/img/admin.png" class="user-avator" alt />
                        <div class="user-info-cont">
                            <div class="user-info-name">{{ name }}</div>
                            <div>{{ role }}</div>
                        </div>
                    </div>
                    <div class="user-info-list">
                        上次登录时间：
                        <span>{{ datetime }}</span>
                    </div>
                    <div class="user-info-list">
                        上次登录地点：
                        <span>厦门</span>
                    </div>
                </el-card>
                <!-- <el-card shadow="hover" style="height:252px;">
                    <template #header>
                        <div class="clearfix">
                            <span>语言详情</span>
                        </div>
                    </template>
                    Vue
                    <el-progress :percentage="71.3" color="#42b983"></el-progress>JavaScript
                    <el-progress :percentage="24.1" color="#f1e05a"></el-progress>CSS
                    <el-progress :percentage="13.7"></el-progress>HTML
                    <el-progress :percentage="5.9" color="#f56c6c"></el-progress>
                </el-card> -->
                <!-- <div class="block" style="height:252px;"> -->
                <div class="block">
                  <el-carousel trigger="click" height="260px">
                    <el-carousel-item v-for="item in imgList" :key="item.name">
                        <img :src="item.src" style="height:100%;width:100%;" alt="图片丢失了" :title="item.title" />
                    </el-carousel-item>
                  </el-carousel>
                </div>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-user-solid grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">320</div>
                                    <div>今日用户访问量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-map-location grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">90</div>
                                    <div>今日打卡人数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-notebook-2 grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">120</div>
                                    <div>今日答题人数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="24">
                        <el-card shadow="hover">
                            <schart ref="line3" class="schart" canvasId="line3" :options="options3"></schart>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>            
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="bar" class="schart" canvasId="bar" :options="options"></schart>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="line2" class="schart" canvasId="line2" :options="options2"></schart>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Schart from "vue-schart";
import { app } from '@/api/common';
import { getFormatDateTime, getFormatDate, getChFormatDate } from '@/helper';
export default {
    name: "dashboard",
    data() {
        return {
            imgList: [
              {
                name: "xmu2",
                src: require("@/assets/img/xmu/xmu-cover-001.jpg"),
                title: "陈嘉庚铜像"
              },
              {
                name: "xmu3",
                src: require("@/assets/img/xmu/xmu-cover-002.jpg"),
                title: "罗扬才烈士陵园"
              },
              {
                name: "xmu3",
                src: require("@/assets/img/xmu/xmu-cover-006.jpg"),
                title: "上弦场及建南楼群"
              },
              {
                name: "xmu1",
                src: require("@/assets/img/xmu/xmu-cover-007.jpg"),
                title: "芙蓉湖及嘉庚楼群"
              }
            ],
            options: {
                type: "bar",
                title: {
                    text: "各个地图打卡图"
                },
                xRorate: 25,
                labels: ["周一", "周二", "周三", "周四", "周五"],
                datasets: [
                    {
                        label: "百年厦大",
                        data: [234, 278, 270, 190, 230]
                    },
                    {
                        label: "红色龙岩",
                        data: [164, 178, 190, 135, 160]
                    }
                ]
            },
            options2: {
                type: "line",
                title: {
                    text: "小程序端数据监控"
                },
                labels: ["6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                datasets: [
                    {
                        label: "打开次数",
                        data: [2340, 2780, 2700, 1900, 2300, 1400, 2700]
                    },
                    {
                        label: "访问人数",
                        data: [1640, 1780, 1500, 1350, 1600, 2600, 2000]
                    },
                    {
                        label: "访问次数",
                        data: [659, 2000, 500, 1500, 1000, 400, 2300]
                    },
                    {
                        label: "人均停留时间",
                        data: [740, 1180, 2000, 2350, 900, 1500, 1000]
                    }
                ]
            },
            options3: {
                type: "line",
                title: {
                    text: "小程序端数据监控"
                },
                labels: [],
                datasets: []
            }
        };
    },
    components: {
        Schart
    },
    computed: {
      name(){
          let userInfo = this.$store.state.userInfo;
          if (!userInfo) return ;
          return userInfo.username ? userInfo.username : "厦大云上四史";
      },
      role() {
          let userInfo = this.$store.state.userInfo;
          if (!userInfo) return ;
          return userInfo.super === true ? "超级管理员" : "普通管理员";
      },
      datetime(){
          let userInfo = this.$store.state.userInfo;
          if (!userInfo) return ;
          let datetime = getFormatDateTime(userInfo.updatetime);
          return datetime ? datetime : getFormatDateTime(new Date());
      }
    },
    created(){
      this.getWCStatistics();
    },
    methods: {
        changeDate() {
            const now = new Date().getTime();
            this.data.forEach((item, index) => {
                const date = new Date(now - (6 - index) * 86400000);
                item.name = `${date.getFullYear()}/${date.getMonth() +
                    1}/${date.getDate()}`;
            });
        },
        getWCStatistics(){
            app.callFunction({
                  name: 'getWCStatistics'
              }).then((res) => {
                  this.fillLineChart(res);
              })
              .catch((err) => {
                  console.log(err);
              });
        },
        fillLineChart(data) {
          const res = data.result;
          // console.log(res);
          const labels = [];
          const datasets = [];
          const data1 = [];
          const data2 = [];
          const data3 = [];
          const data4 = [];
          for (let obj of res) {
            const arr = obj.list[0];
            labels.push(getChFormatDate(arr.ref_date)); // 日期，格式为 yyyymmdd
            data1.push(arr.session_cnt); // 打开次数
            data2.push(arr.visit_pv); // 访问次数
            data3.push(arr.visit_uv); // 访问人数
            data4.push(arr.stay_time_uv); // 人均停留时长 (浮点型，单位：秒)
          }
          datasets.push({
            label: "打开次数",
            data:data1.reverse()
          });
          datasets.push({
            label: "访问次数",
            data:data2.reverse()
          });
          datasets.push({
            label: "访问人数",
            data:data3.reverse()
          });
          datasets.push({
            label: "人均停留时长（秒）",
            data:data4.reverse()
          });
          this.options3.labels = labels.reverse();
          this.options3.datasets = datasets;
        }
    }
};
</script>

<style scoped>
.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}
.user-info-name {
  margin-bottom:5px;
}
.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 20px;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: rgb(161, 159, 159);
}

.schart {
    width: 100%;
    height: 368px;
}
.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
}
</style>
