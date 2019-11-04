<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="login_avatar">
                <img src="../assets/logo.png" alt="" class="logo">
            </div>
            <!-- 表单区域 -->
            <el-form ref="loginFormRef" label-width="0px" class="login_form" :model="loginForm" :rules='loginFormRules'>
                <el-form-item prop="username">
                    <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
                </el-form-item>
                 <el-form-item prop="password">
                    <el-input prefix-icon="iconfont icon-3702mima" type="password" v-model="loginForm.password"></el-input>
                </el-form-item>
                 <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
               </el-form-item>
            </el-form>
            
        </div>
    </div>
</template>.
<script>
import { log } from 'util'
export default {
    name:'login',
    data () {
        return {
            loginForm:{
                username:'admin',
                password:'123456'
            },
            loginFormRules:{
             username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
            ],
            password:[
                     { required: true, message: '请输入用户密码', trigger: 'blur' },
                     { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
            ],
        }
        }
        
    },
    methods:{
      resetLoginForm() {
          this.$refs.loginFormRef.resetFields()
      },
      login() {
          //validate 返回布尔值
          this.$refs.loginFormRef.validate(async valid=>{
              //如果验证失败就结束，如果成功继续发送
              if(!valid) return console.log('验证失败');
              //解构赋值 data是最外层data
              const{data:res}  =await this.$http.post('login',this.loginForm)
            //   console.log(res.data);
              if(res.meta.status!=200) return this.$message.error('用户名或密码错误')
            //   console.log('验证通过');
                this.$message.success('验证通过')
                //token保存到sessionStorage
                window.sessionStorage.setItem('token',res.data.token)
                //编程式导航
                this.$router.push('/home')
          })
      }
    }
}
</script>
<style scoped lang="less">
    .login_container {
        background-color: #2b4b6b;
        height: 100%;
         .login_box {
                    width: 450px;
                    height: 300px;
                    background-color: #fff;
                    border-radius: 3px;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%,-50%);

                    .login_avatar {
                        width: 130px;
                        height: 130px;
                        padding: 10px;
                        border: 1px solid #eee;
                        border-radius: 50%;
                        box-shadow: 0 0 10px #fff;
                        background-color: #fff;
                        position: absolute;
                        left: 50%;
                        transform: translate(-50%,-50%);

                        .logo {
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                            border:1px solid #eee;
                            box-sizing: border-box;
                            background-color: #ccc;
                        }

                    }
                    .login_form {
                        position:absolute;
                        left: 0;
                        bottom: 0;
                        width: 100%;
                        box-sizing: border-box;
                        padding: 0 20px;
                        .btns {
                            display: flex;
                            justify-content: flex-end;
                        }
                    }
                    }
    }
   
</style>