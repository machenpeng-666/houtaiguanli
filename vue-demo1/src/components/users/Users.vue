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
                 <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear='getUserList'>
                    <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="8">
                  <!-- <el-checkbox checked="isChecked" v-model="isChecked"></el-checkbox> -->
                    <el-button :type="isChecked?'primary':'danger'" @click="addDialogVisible=true">添加用户</el-button>
                </el-col>
                 <el-col :span="4">
                    <btns buttonName="马英俊" @btnsAlert="sonName"></btns>
                 </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="10">
                  <el-upload class="upload-demo" action="'http://127.0.0.1:8888/api/private/v1/users" :on-change="onChange" :on-remove="handleRemove" :before-remove="beforeRemove"  accept=".xls, .xlsx" :limit="1" :on-exceed="handleExceed" :file-list="fileList" :auto-upload="false">
                        <el-button size="small" type="primary">导入excel</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件，且不超过500kb</div>
                  </el-upload>
              </el-col>
            </el-row>
            <!-- 深度监听 -->
             <!-- <p>{{watchData.allname}}</p> -->
                <!-- <el-input placeholder="深度监听" v-model="watchData.name"></el-input> -->
            <!-- nexttick使用 -->
            <p>{{watchData.aa.cc}}</p>
            <span ref="mydata">{{mydata}}</span>
            <el-button type="primary" @click="changeData">改变数据</el-button>
            <!-- 用户列表区域 [-->
            <el-table :data="userslist" border stripe>
                   <el-table-column type="index"></el-table-column>
                   <el-table-column label="姓名" prop="username" width="80px"></el-table-column>
                   <el-table-column label="邮箱" prop="email"></el-table-column>
                   <el-table-column label="电话" prop="mobile"></el-table-column>
                   <el-table-column label="角色" prop="role_name"></el-table-column>
                   <el-table-column label="状态">
                       <!--作用域插槽 scoped -->
                       <template slot-scope="scope">
                            <!-- {{scope.row}} -->
                           <el-switch v-model="scope.row.mg_state" @change="change(scope.row)"></el-switch>
                       </template>
                   </el-table-column>
                   <el-table-column label="操作" class="caozuo">
                       <template slot-scope="scope">
                           <!-- scope.row代表每一行的数据 -->
                              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)" v-has="'edit'"></el-button>
                              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteByuserId(scope.row.id)" v-has="'del'"></el-button>
                              <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
                                  <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
                              </el-tooltip>
                       </template>
                   </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <fenye :total="total"  :page-size="queryInfo.pagesize"  @handleSizeChangeSub="handleSizeChangeFun"
      @handleCurrentChangeSub="handleCurrentChangeFun"></fenye>
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
        <!-- 分配角色对话框 -->
        <el-dialog title="提示" :visible.sync="roleDialogVisible" width="30%">
                   <!-- {{userInfo}} -->
                    <p>用户名：{{userInfo.username}}</p>
                    <p>当前角色：{{userInfo.role_name}}</p>
                    <p>
                        切换新的角色：
                          <el-select v-model="selectedRoleId" placeholder="请选择">
                            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
                            </el-option>
                          </el-select>
                    </p>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="roleDialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="saveRole">确 定</el-button>
                </span>
        </el-dialog>
        <p> <span>{{this.$store.state.name}}</span></p>
        <p>{{$store.getters.meihua}}</p>
        <el-button type="warning" @click="$store.commit('add')">增加</el-button>
        <el-button type="warning" @click="$store.dispatch('addAsync')">异步增加</el-button>
    </div>
</template>
<script>
import { log } from 'util'
import LoginVue from '../Login.vue'
import fenye from '../commons/fenye.vue'
import btns from '../commons/button.vue'
import {mapState} from 'vuex'
//自定义指令
// const has=Vue.directive('has',{
//   inserted:function(el,binding) {
//     //获取页面权限
//     if(!Vue.prototype.$_has(binding.value)) {
//       el.parentNode.removeChild(el)
//     }
//   }
// })
// Vue.prototype.$_has=function(value) {
//   let isExit = false

// }
export default {
  watch:{
    watchData:{
      handler(n,o) {
        this.watchData.allname=n.name+n.aa.bb
      },
      immediate: true,
      deep:true
    }
  },
  created () {
    // 获取用户列表数据
    this.getUserList()
    this.$route.meta.btnPermission=['delete','edit']
     window.sessionStorage.setItem('btnpermission', this.$route.meta.btnPermission )
    //  var buttonpermsStr = sessionStorage.getItem('btnpermission').split(',')
    // console.log(buttonpermsStr)
  },
  components:{
    fenye,
    btns
  },
  data () {
    // 自定义校验邮箱的规则
    var checkEmail = (rule, value, callback) => {
      var regEmail = /^[\w\-]+@[a-zA-Z\d\-]+(\.[a-zA-Z]{2,8}){1,2}$/
      if (!regEmail.test(value)) {
        return callback(new Error('邮箱不合法'))
      }
      callback()
    }
    var checkMobile = (rule, value, callback) => {
      var regMobile = /^[1][3,4,5,7,8][0-9]{9}$/
      if (!regMobile.test(value)) {
        return callback(new Error('手机号不合法'))
      }
      callback()
    }
    // query 搜索关键字
    return {
       mydata:'我是之前的数据',
      //深度监听的值
       watchData:{
         allname:'',
         name:'hhh',
         aa:{
           bb:'666'
         }
       },
       fileList: [],
       isChecked:true,
       queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2,
        pagesizes:[2,3,4,5]
      },
      userslist: [],
      total: 30,
      // 对话框默认隐藏 添加 修改
      addDialogVisible: false,
      editDialogVisible: false,
      roleDialogVisible: false,
      userInfo: '', // 当前用户信息
      rolesList: [], // 所有的角色信息
      selectedRoleId: '',
      // 添加的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 校验规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改用户规则
      editFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //nextTick
    changeData() {
      this.mydata='我是之后的数据'
      this.watchData.aa.cc='999'
      this.$nextTick(()=>{
         //获取的是dom更新之后的数据
         console.log(this.$refs.mydata.innerHTML)
      })
    },
    async getUserList () {
      // 传参方式 (url,{params:数据对象})
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status != 200) return this.$message.error('请求列表失败')
      console.log(res.data);
      this.total = res.data.total
      this.userslist = res.data.users
    },
    //子组件按钮传来的值
    sonName(n) {
      alert(n)
    },
    handleSizeChangeFun (newSize) {
      //    console.log(newSize);
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChangeFun (newPage) {
      //    console.log(newPage);
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 改变用户状态
    async change (info) {
      const { data: res } = await this.$http.put(`users/${info.id}/state/${info.mg_state}`)
      console.log(res)
      if (res.meta.status != 200) return this.$message.error('修改失败')
    },
    // 重置添加对话框表单
    addFormClose () {
      // ref加在子组件上，可以调用子组件的方法 固定值不加: 变量加:
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户
    addUser () {
      /// 表单预校验
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return console.log('表单校验失败')
        console.log('表单校验成功')
        const { data: res } = await this.$http.post('users', this.addForm)
        // console.log(res);

        if (res.meta.status != 201) return this.$message.error('添加失败')
        this.getUserList()
        this.addDialogVisible = false
      })
    },
    // 展示修改用户对话框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get(`users/${id}`)
      // console.log(res);
      if (res.meta.status != 200) return this.$message.error('获取用户信息失败')
      this.editForm = res.data
      this.editDialogVisible = true // 对话框显示
    },
    // 重置修改对话框
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    // 预校验--->ajax
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return console.log('验证失败')
        // console.log('验证通过');
        const { data: res } = await this.$http.put(`users/${this.editForm.id}`,
          { email: this.editForm.email, mobile: this.editForm.mobile })
        if (res.meta.status != 200) return this.$message.error('修改失败')
        this.editDialogVisible = false
        this.getUserList()
      })
    },
    // 删除用户列表
    deleteByuserId (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`users/${id}`)
        console.log(res)

        if (res.meta.status != 200) return this.$message.error('修改失败')
        this.$message.success('删除成功')
        this.queryInfo.pagenum = 1 // 解决一个删除最后一页的小bug
        this.getUserList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 分配角色
    async setRole (userInfo) {
      console.log(userInfo)
      this.roleDialogVisible = true
      this.userInfo = userInfo
      const { data: res } = await this.$http.get('roles')
      console.log(res)

      if (res.meta.status != 200) return this.$message.error('获取角色列表失败')
      this.rolesList = res.data
    },
    // 保存分配用户角色
    async  saveRole () {
      if (this.selectedRoleId == '') {
        return this.$message.error('请选择角色')
      }
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectedRoleId })
      if (res.meta.status != 200) return this.$message.error('修改角色失败')
      this.$message.success('修改角色成功')
      this.getUserList()
      this.roleDialogVisible = false
      this.selectedRoleId = '' // 重置选择器
      this.userInfo = {}
    },
    //upload上传方法
      // 文件选择回调
    onChange(file, fileList) {
      this.fileTemp = file.raw
      this.importfxx(this.fileTemp)
    },
//     readExcel(e) {
//       console.log(e);
//       let that = this;
//       const files = that.fileData;
//       console.log(files);
//        if (!files) {
//         //如果没有文件
//         return false;
//        }else if (!/\.(xls|xlsx)$/.test(files.name.toLowerCase())) {
//         this.$message.error("上传格式不正确，请上传xls或者xlsx格式");
//         return false;
//        } 
//     },
    importfxx(obj) {
    let _this = this;
    // 通过DOM取文件数据
    this.file = obj
    var rABS = false; //是否将文件读取为二进制字符串
    var f = this.file;
    var reader = new FileReader();
    //if (!FileReader.prototype.readAsBinaryString) {
    FileReader.prototype.readAsBinaryString = function(f) {
        var binary = "";
        var rABS = false; //是否将文件读取为二进制字符串
        var pt = this;
        var wb; //读取完成的数据
        var outdata;
        var reader = new FileReader();
        reader.onload = function(e) {
        var bytes = new Uint8Array(reader.result);
        var length = bytes.byteLength;
        for(var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        var XLSX = require('xlsx');
        if(rABS) {
            wb = XLSX.read(btoa(fixdata(binary)), { //手动转化
                type: 'base64'
            });
        } else {
            wb = XLSX.read(binary, {
                type: 'binary'
            });
        }
        outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);//outdata就是你想要的东西
        console.log(outdata)
            this.da = [...outdata]
            let arr = []
            this.da.map(v => {
                let obj = {}
                obj.username = v['姓名']
                obj.password = v['密码']
                obj.email=v['邮箱']
                obj.mobile=v['手机']
                // _this.addForm=obj
                // console.log(_this.addForm)
                // _this.addExcel()
                console.log(_this.userslist)
                _this.userslist.push(obj)
            })
            // console.log(arr)
            return _this.userslist
        }
        reader.readAsArrayBuffer(f);
    }
    
    if(rABS) {
        reader.readAsArrayBuffer(f);
    } else {
        reader.readAsBinaryString(f);
    }
},
     handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      //添加excel
      async addExcel() {
          const { data: res } = await this.$http.post('users', this.addForm)
        console.log(res);

        if (res.meta.status != 201) return this.$message.error('添加失败')
        // this.getUserList()
      }

  },
   computed:{
    ...mapState(['name'])
  },
}
</script>
<style scoped lang="less">
   .el-table {
       margin-top: 20px;
   }
   .el-row {
     padding-bottom: 10px;
   }
</style>
