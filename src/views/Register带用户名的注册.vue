<template>
    <div class="register-wrap">
        <div class="ms-register">
            <div class="ms-title">四史后台管理系统</div>
              <el-form :model="param" :rules="rules" ref="register" label-width="80px" class="ms-content">
                  <el-form-item prop="phone" label="手机号">
                      <el-input v-model="param.phone" placeholder="请输入手机号">
                      </el-input>
                  </el-form-item>
                  <el-form-item prop="phoneCode" label="验证码">
                      <el-input placeholder="请输入验证码" v-model="param.phoneCode" @keyup.enter="registerByPhoneCode('register')" style="width:60%"></el-input>
                      <el-button type="primary" v-if="!param.computedTime" @click="sendPhoneCode()" style="width:40%">获取验证码</el-button>
                      <el-button type="primary" v-else style="width:40%">已发送({{param.computedTime}}s)</el-button>
                  </el-form-item>
                  <el-form-item prop="password" label="密码">
                    <el-input type="password" v-model="param.password" autocomplete="off" placeholder="请输入密码">
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="checkPass" label="确认密码">
                    <el-input type="password" v-model="param.checkPass" autocomplete="off" placeholder="请输入确认密码">
                    </el-input>
                  </el-form-item>
                  <el-form-item>
                    <div class="other-btn">
                      <el-button type="primary" @click="registerByPhoneCode('register')">注册</el-button>
                      <el-button type="primary" @click="resetForm('register')">重置</el-button>
                      <el-button type="primary" @click="goBack()">返回</el-button>
                    </div>
                  </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { isPureNumbers } from '@/helper'
export default {
    data() {
        // 用户名不为空，不能有空格，不能纯数字，不能有特殊字符
        let validateUsername = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入用户名'));
            } else if (value.indexOf(" ") !== -1) { // 有空格
                callback(new Error('用户名不能有空格'));
            } else if (isPureNumbers(value)) { // 纯数字
                callback(new Error('用户名不能为纯数字'));
            } else {
                this.$store.dispatch('isUsernameRegistered', value)
                .then(() => {
                  callback();
                })
                .catch(() => {
                  callback(new Error('该用户名已被绑定过'));
                });
            }
        }
        // todo 密码长度不小于 8 位，不大于 32 位，需要包含字母和数字。
        let validatePass = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入密码'));
          } else {
            if (this.param.checkPass !== '') {
              this.$refs.register.validateField('checkPass');
            }
            callback();
          }
        };
        let validatePass2 = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else if (value !== this.param.password) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        };
        return {
            param: {
                // username: '',
                // phone: '',
                // phoneCode: '',
                // password: '',
                // checkPass: '',
                // username: "zhiming",
                // phone: "13860613563",
                // username: "chenhui",
                // phone: "18859377408",
                // username: "jianyi",
                // phone: "18959209683",
                // username: "xiaohai",
                // username: "文轩",
                // phone: "15162145776",
                username: "晓海",
                phone: "18852857190",
                phoneCode: "961485",
                password: "Mars@2018",
                checkPass:"Mars@2018",
                computedTime:false,
                computedTime:0,
                timer:null
            },
            rules: {
                phone: [
                    { required: true, message: "请输入手机号码", trigger: "blur" },
                    // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                phoneCode: [
                    { required: true, message: "请输入验证码", trigger: "blur" }
                ],
                username: [
                  { required: true, validator: validateUsername, trigger: "blur" }
                ],
                password: [
                    { required: true, validator: validatePass, trigger: 'blur' }
                ],
                checkPass:[
                   { required: true, validator: validatePass2, trigger: 'blur' }
                ]
            }
        };
    },
    created() {
        // this.$store.commit("clearTags");
    },
    methods: {
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
        registerByPhoneCode(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$store.dispatch('registerByPhoneCode', this.param)
                    .then(res => {
                      this.$message.success(res.msg);
                      this.resetForm('register');
                      this.$store.dispatch('exitLogin')
                        .then(res=>{
                          this.$router.push("/login");
                          // this.goBack(-1);
                        })
                        .catch(err => {
                          this.$message.error(err.msg);
                        });
                    })
                    .catch(err => {
                      console.log(err);
                      this.$message.error(err.msg);
                    });
                } else {
                    this.$message.error("注册发生错误，请仔细检查信息");
                }
            });
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
        },
        goBack(){
          this.$router.go(-1);
        }
    }
};
</script>

<style scoped>
.register-wrap {
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
    color: #000;
    border-bottom: 1px solid #ddd;
}
.ms-register {
    position: absolute;
    left: 50%;
    top: 40%;
    width: 400px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.5);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.other-btn {
    display:flex;
    align-items:center;
    justify-content:space-between; /* space-around */
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>
