<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">四史后台管理系统</div>
            <el-form v-if="!param.changeLoginMethod" :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="账号/手机号">
                        <template #prepend>
                            <el-button icon="el-icon-user"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="请输入密码" v-model="param.password" @keyup.enter="login('login')">
                        <template #prepend>
                            <el-button icon="el-icon-lock"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="login('login')">登录</el-button>
                </div>
                <div class="other-btn">
                    <el-link @click.prevent="param.changeLoginMethod=!param.changeLoginMethod">手机登录</el-link>
                    <el-link @click.prevent="doRegister()">账号注册</el-link>
                </div>
            </el-form>
            <el-form v-else :model="param" :rules="rules" ref="loginWithPhone" label-width="0px" class="ms-content">
                <el-form-item prop="phone">
                    <el-input v-model="param.phone" placeholder="请输入手机号">
                        <template #prepend>
                            <el-button icon="el-icon-mobile-phone"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="phoneCode">
                    <el-input placeholder="请输入验证码" v-model="param.phoneCode" @keyup.enter="loginWithPhoneCodeOrPassword('loginWithPhone', {'username':param.username, 'phoneCode':param.phoneCode})" style="width:65%">
                        <template #prepend>
                          <el-button utton icon="el-icon-lock"></el-button>
                        </template>
                    </el-input>
                    <el-button type="primary" v-if="!param.computedTime" @click="sendPhoneCode()" style="width:35%">获取验证码</el-button>
                    <el-button type="primary" v-else style="width:35%">已发送({{param.computedTime}}s)</el-button>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="loginWithPhoneCodeOrPassword('loginWithPhone', {'username':param.username, 'phoneCode':param.phoneCode})">登录</el-button>
                </div>
                <!-- <p class="login-tips">未注册手机验证后自动登录，注册即代表同意</p> -->
                <div class="other-btn">
                    <el-link @click.prevent="param.changeLoginMethod=!param.changeLoginMethod">其他方式登录</el-link>
                    <el-link @click.prevent="doRegister()">账号注册</el-link>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import { isPureNumbers } from '@/helper'
export default {
    data() {
        return {
            param: {
                username: "",
                password: "",
                // phoneCode: "",
                // phone: "",
                // username: "zhiming",
                // phone: "13860613563",
                // username: "chenhui",
                // phone: "18859377408",
                // username: "xiaohai",
                // username: "18852857190",
                phone: "",
                // password: "Mars@2018",
                changeLoginMethod:false,
                computedTime:0
            },
            rules: {
                username: [
                    { required: true, message: "请输入账号或手机号", trigger: "blur" },
                    // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: "请输入手机号", trigger: "blur" }
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" }
                ],
                phoneCode: [
                    { required: true, message: "请输入验证码", trigger: "blur" }
                ]
            }
        };
    },
    created() {
        this.$store.commit("clearTags");
    },
    methods: {
      // 登录
      login(formName){
        // 纯数字，则手机号密码登录
        if(isPureNumbers(this.param.username)){
          const param = {};
          param.phone = this.param.username;
          param.password = this.param.password;
          this.loginWithPhoneCodeOrPassword(formName, param);
        } else {
        // 账号密码登录
          this.loginWithUsernameAndpassword(formName);
        }
      },
      // 账号密码登录
      loginWithUsernameAndpassword(formName) {
          this.$refs[formName].validate(valid => {
            if (valid) {
              this.$store.dispatch('loginWithUsernameAndpassword', this.param)
              .then(res => {
                  this.$message.success(res.msg);
              })
              .catch(err => {
                  this.$message.error(err.msg);
                  // 如果账户是登录状态，则退出登录
                  this.$store.dispatch('exitLogin')
                    .then(()=>{
                    })
                    .catch(() => {
                    });
              });
            } else {
                this.$message.error("请输入账号和密码");
            }
          });
      },
      // 手机号 验证码或密码登录
      loginWithPhoneCodeOrPassword(formName, param) {
          this.$refs[formName].validate(valid => {
            if (valid) {
              this.$store.dispatch('loginWithPhoneCodeOrPassword', param)
              .then(res => {
                  this.$message.success(res.msg);
              })
              .catch(err => {
                  this.$message.error(err.msg);
                  // 如果账户是登录状态，则退出登录
                  this.$store.dispatch('exitLogin')
                    .then(()=>{
                    })
                    .catch(() => {
                    });
              });
            } else {
                this.$message.error("请输入账号和密码");
            }
        });
      },
      // 发送手机验证码
      sendPhoneCode() {
        if (this.param.phone !== "") {
            this.$store.dispatch('sendPhoneCode', this.param)
            .then(res=>{
                this.$message.success(res.msg);
                this.param.computedTime = 30;
                this.param.timer = setInterval(() => {
                    this.param.computedTime --;
                    if (this.param.computedTime == 0) {
                        clearInterval(this.param.timer);
                    }
                }, 1000);
            })
            .catch(err=>{
                this.$message.error(err.msg);
            });
        } else {
            this.$message.error("请输入手机号");
        }
      }, 
      // 跳转注册页面
      doRegister(){
          this.$router.push("/register");
      }
    }
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 45%;
    width: 400px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.other-btn {
    display:flex;
    align-items:center;
    justify-content:space-between;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>
