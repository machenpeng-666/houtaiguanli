<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <!-- 搜素添加区域 -->
            <el-row :gutter="20">
                 <el-col :span="10">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear='getUserList'>
                    <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>   
                <el-col :span="14">
                    <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区域 -->
            <el-table :data="userslist" border stripe>
                   <el-table-column type="index"></el-table-column>
                   <el-table-column label="姓名" prop="username" width="80px"></el-table-column>
                   <el-table-column label="邮箱" prop="email"></el-table-column>
                   <el-table-column label="电话" prop="mobile"></el-table-column>
                   <el-table-column label="角色" prop="role_name"></el-table-column>
                   <el-table-column label="状态">
                       <!--作用域插槽 scoped -->
                       <template slot-scope="scope">
                           <el-switch v-model="scope.row.mg_state" @change="change(scope.row)"></el-switch>
                       </template>
                   </el-table-column>
                   <el-table-column label="操作" class="caozuo">
                       <template slot-scope="scope">
                           <!-- scope.row代表每一行的数据 -->
                              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteByuserId(scope.row.id)"></el-button>
                              <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
                                  <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                              </el-tooltip>
                       </template>
                   </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination
                 @size-change="handleSizeChange"
                 @current-change="handleCurrentChange" 
                 :current-page="queryInfo.pagenum"
                 :page-sizes="[1, 2, 3, 4]"
                 :page-size="queryInfo.pagesize"
                 layout="total, sizes, prev, pager, next, jumper"
                 :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加用户对话框 -->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="30%" @close="addFormClose">
                 <el-form ref="addFormRef" :model="addForm" label-width="80px" :rules="addFormRules">
                     <el-form-item label="用户名" prop="username">
                        <el-input v-model="addForm.username"></el-input>
                     </el-form-item>
                       <el-form-item label="密码" prop="password">
                        <el-input v-model="addForm.password"></el-input>
                     </el-form-item>
                       <el-form-item label="邮箱" prop="email">
                        <el-input v-model="addForm.email"></el-input>
                     </el-form-item>
                       <el-form-item label="手机" prop="mobile">
                        <el-input v-model="addForm.mobile"></el-input>
                     </el-form-item>
                </el-form>
                 <span slot="footer" class="dialog-footer">
                   <el-button @click="addDialogVisible = false">取 消</el-button>
                   <el-button type="primary" @click="addUser">确 定</el-button>
                 </span>
        </el-dialog>
        <!-- 修改用户对话框 -->
        <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="30%" @close='editDialogClose'>
                 <el-form ref="editFormRef" :model="editForm" label-width="80px" :rules="editFormRules">
                     <el-form-item label="用户名" prop="username">
                        <el-input v-model="editForm.username" disabled></el-input>
                     </el-form-item>
                       <el-form-item label="邮箱" prop="email">
                        <el-input v-model="editForm.email"></el-input>
                     </el-form-item>
                       <el-form-item label="手机" prop="mobile">
                        <el-input v-model="editForm.mobile"></el-input>
                     </el-form-item>
                </el-form>
                 <span slot="footer" class="dialog-footer">
                   <el-button @click="editDialogVisible = false">取 消</el-button>
                   <el-button type="primary" @click="editUserInfo">确 定</el-button>
                 </span>
        </el-dialog>
    </div>
</template>
<script>
import { log } from 'util'
import LoginVue from '../Login.vue'
export default {
    created() {
        //获取用户列表数据
        this.getUserList()
    },
    data () {
         //自定义校验邮箱的规则
             var checkEmail= (rule,value,callback)=>{
                var regEmail=/^[\w\-]+@[a-zA-Z\d\-]+(\.[a-zA-Z]{2,8}){1,2}$/
                if(!regEmail.test(value)) {
                    return callback(new Error('邮箱不合法'))
                }
                callback()
            }
            var checkMobile= (rule,value,callback)=>{
                var regMobile=/^[1][3,4,5,7,8][0-9]{9}$/
                if(!regMobile.test(value)) {
                    return callback(new Error('手机号不合法'))
                }
                callback()
            }
        //query 搜索关键字
        return {
            queryInfo:{ 
                query:'',
                pagenum:1,
                pagesize:2
            }, 
            userslist:[],
            total:0,
            //对话框默认隐藏 添加 修改
            addDialogVisible:false,
            editDialogVisible:false,
            //添加的表单数据
            addForm:{
                username:'',
                password:'',
                email:'',
                mobile:''
            },
            editForm:{
                username:'',
                password:'',
                email:'',
                mobile:''
            },
            //校验规则
            addFormRules:{
                username:[
                  { required: true, message: '请输入用户名', trigger: 'blur' },
                  { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur'}
            ],
                password:[
                     { required: true, message: '请输入用户密码', trigger: 'blur' },
                     { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
            ],
                email:[
                      { required: true, message: '请输入邮箱', trigger: 'blur' },
                      {validator:checkEmail,trigger:'blur'}
                ],
                mobile:[
                      { required: true, message: '请输入手机号', trigger: 'blur' },
                       {validator:checkMobile,trigger:'blur'}
                ]
            },
            //修改用户规则
             editFormRules:{
                username:[
                  { required: true, message: '请输入用户名', trigger: 'blur' },
                  { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur'}
            ],
                password:[
                     { required: true, message: '请输入用户密码', trigger: 'blur' },
                     { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
            ],
                email:[
                      { required: true, message: '请输入邮箱', trigger: 'blur' },
                      {validator:checkEmail,trigger:'blur'}
                ],
                mobile:[
                      { required: true, message: '请输入手机号', trigger: 'blur' },
                       {validator:checkMobile,trigger:'blur'}
                ]
            },
        }
    },
    methods:{
        async getUserList() {
           // 传参方式 (url,{params:数据对象})
        const {data:res}=await this.$http.get('users',{params:this.queryInfo})
        if(res.meta.status!=200) return this.$message.error('请求列表失败')
        // console.log(res);
        this.total=res.data.total
        this.userslist=res.data.users
        },
       handleSizeChange(newSize) {
        //    console.log(newSize);  
            this.queryInfo.pagesize=newSize 
            this.getUserList()
       },
       handleCurrentChange(newPage) {
        //    console.log(newPage);
            this.queryInfo.pagenum=newPage
            this.getUserList()
       },
       //改变用户状态
       async change(info) {
            const {data:res}=await this.$http.put(`users/${info.id}/state/${info.mg_state}`)
            console.log(res);
            if(res.meta.status!=200) return this.$message.error('修改失败');
        },
        //重置添加对话框表单
        addFormClose() {
            //ref加在子组件上，可以调用子组件的方法 固定值不加: 变量加:
            this.$refs.addFormRef.resetFields()
        },
        //添加用户
        addUser() {
            ///表单预校验
            this.$refs.addFormRef.validate(async valid=>{
                if(!valid) return console.log('表单校验失败')
                console.log('表单校验成功'); 
                const {data:res}=await this.$http.post('users',this.addForm)
                // console.log(res);
                
                if(res.meta.status!=201) return this.$message.error('添加失败')
                this.getUserList()
                this.addDialogVisible=false
            })  
        },
        //展示修改用户对话框
       async showEditDialog(id) {
            const {data:res}=await this.$http.get(`users/${id}`)
            // console.log(res);
            if(res.meta.status!=200) return this.$message.error('获取用户信息失败')
            this.editForm=res.data
            this.editDialogVisible=true //对话框显示
        },
        //重置修改对话框
        editDialogClose() {
            this.$refs.editFormRef.resetFields()
        },
        //预校验--->ajax
        editUserInfo() {
            this.$refs.editFormRef.validate(async valid=>{
                if(!valid) return console.log('验证失败');
                // console.log('验证通过');
               const {data:res}= await this.$http.put(`users/${this.editForm.id}`,
                {email:this.editForm.email, mobile:this.editForm.mobile})
                if(res.meta.status!=200) return this.$message.error('修改失败')
                this.editDialogVisible=false
                this.getUserList()
            })      
        },
        //删除用户列表
        deleteByuserId(id) {
             this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning'
            }).then( async() => {
               const {data:res}=  await this.$http.delete(`users/${id}`)
                console.log(res);
                
               if(res.meta.status!=200) return this.$message.error('修改失败');
               this.$message.success('删除成功')
               this.queryInfo.pagenum=1 //解决一个删除最后一页的小bug
               this.getUserList()
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });          
            });
        }

    }
}
</script>
<style scoped lang="less">
   .el-table {
       margin-top: 20px;
   }
</style>