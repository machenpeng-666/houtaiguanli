<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button type="primary" @click="dialogVisible=true">添加角色</el-button>
        <!-- 添加角色对话框 -->
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
                <el-form ref="addFormRef" :model="addForm" label-width="80px" :rules="addFormRules">
                    <el-form-item label="角色名称" prop="roleName">
                      <el-input v-model="addForm.roleName"></el-input>
                    </el-form-item>
                     <el-form-item label="角色描述" prop="roleDesc">
                      <el-input v-model="addForm.roleDesc"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="addRoles">确 定</el-button>
                </span>
        </el-dialog>
        <!-- 编辑角色对话框 -->
         <el-dialog title="提示" :visible.sync="editdialogVisible" width="30%" :before-close="handleClose">
                <el-form ref="editFormRef" :model="editForm" label-width="80px" :rules="editFormRules">

                    <el-form-item label="角色名称" prop="roleName">
                      <el-input v-model="editForm.roleName"></el-input>
                    </el-form-item>
                     <el-form-item label="角色描述" prop="roleDesc">
                      <el-input v-model="editForm.roleDesc"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="editdialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="tijiao">确 定</el-button>
                </span>
        </el-dialog>
        <!-- 分配权限 -->
        <el-dialog title="提示" :visible.sync="rightDialogVisible" width="30%" :before-close="handleClose">
                <!-- <pre>{{rightsList}}</pre> -->
                <el-tree node-key="id" show-checkbox :default-checked-keys="defKeys" :data=" rightsList" :props="defaultsProps" ref="mytree"></el-tree>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="rightDialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="fenpeiQuanxian">确 定</el-button>
                </span>
        </el-dialog>
        <!-- 角色列表区域 -->
        <el-table :data="rolesList" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <!-- 一级 -->
                    <el-row v-for="item1 in scope.row.children" :key="item1.id" class="level_one">
                        <el-col :span="5">
                            <el-tag type="primary">{{item1.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <!-- 二级 -->
                        <el-col :span="19">
                            <el-row v-for="item2 in item1.children" :key="item2.id">
                                <el-col :span="5">
                                    <el-tag type="success">{{item2.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <!-- 三级标签 -->
                                <el-col :span="19">
                                    <el-tag closable type="danger" v-for="item3 in item2.children" :key="item3.id" @click="deleteRightsById(scope.row.id,item3.id)">{{item3.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="roleName" label="角色名称"></el-table-column>
            <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit" @click="editList(scope.row.id)" v-has="'edits'">编辑</el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete" @click="delList(scope.row.id)">删除</el-button>
                    <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetDialog(scope.row)" v-has="'fenpei'">分配权限</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 编辑 -->
    </div>
</template>
<script>
import { log } from 'util'
export default {
  created () {
    this.getRolesList()
     this.$route.meta.btnPermission=['delete','edit','fenpei']
     window.sessionStorage.setItem('btnpermission', this.$route.meta.btnPermission )
  },
  data () {
    return {
      rolesList: [],
      // 对话框默认关闭
      dialogVisible: false,
      // 添加角色表单数据
      addForm: {
        roleDesc: '',
        roleName: ''
      },
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      // 编辑角色
      editForm: {

      },
      editFormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      editdialogVisible: false,
      // 分配权限
      rightDialogVisible: false,
      rightsList: [],
      defaultsProps: {
        children: 'children',
        label: 'authName'
      },
      defKeys: [105, 106],
      roleId: '' // 角色id
    }
  },
  methods: {
    // 获取角色列表
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status != 200) return this.$message.error('获取角色列表失败')
      // console.log(res);
      this.rolesList = res.data
    },
    // 删除用户权限
    deleteRightsById (roleId, rightId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`roles/${roleId}/rights/${rightId}`)
        // console.log(res);
        if (res.meta.status != 200) return this.$message.error('删除权限失败')
        this.$message.success('删除成功')
        this.rolesList = res.data
        this.getRolesList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 对话框事件
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 添加角色
    addRoles () {
      // 表单预校验
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return console.log('验证失败')
        console.log('验证成功')
        const { data: res } = await this.$http.post('roles', this.addForm)
        console.log(res)
        if (res.meta.status != 201) {
          return this.$message.error('获取信息失败1')
        }
        this.addForm = res.data
        this.dialogVisible = false
        this.getRolesList()
      })
    },
    // 编辑角色
    async editList (id) {
      this.editdialogVisible = true
      const { data: res } = await this.$http.get(`roles/${id}`)

      console.log(res)
      this.editForm = res.data
    },
    // 提交修改
    tijiao () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return console.log('验证失败')
        console.log('验证成功')
        const { data: res } = await this.$http.put(`roles/${this.editForm.roleId}`, {
          roleDesc: this.editForm.roleDesc,
          roleName: this.editForm.roleName
        })
        // console.log(res);
        if (res.meta.status != 200) return this.$message.error('获取信息失败2')
        this.editForm = res.data
        this.getRolesList()
        this.editdialogVisible = false
      })
    },
    // 删除角色
    delList (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`roles/${id}`)
        console.log(res)

        if (res.meta.status != 200) return this.$message.error('删除信息失败')
        this.editForm = res.data
        this.getRolesList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 分配权限
    async showSetDialog (role) {
      this.roleId = role.id
      var defKeys = []
      function getId (obj) {
        obj.children.forEach(item => {
          // 递归，自己调用自己，递归一定要有结束条件
          if (item.children) {
            getId(item)
          } else {
            return defKeys.push(item.id)
          }
        })
      }
      getId(role)
      this.defKeys = defKeys

      const { data: res } = await this.$http.get(`rights/tree`)
      console.log(res)
      if (res.meta.status != 200) return this.$message.error('请求数据失败')
      this.rightsList = res.data
      this.rightDialogVisible = true
    },
    // 提交分配权限
    async fenpeiQuanxian () {
      // console.log( this.$refs.mytree.getCheckedKeys());
      // console.log( this.$refs.mytree.getHalfCheckedKeys());
      var keys = [...this.$refs.mytree.getCheckedKeys(), ...this.$refs.mytree.getHalfCheckedKeys()]
      var keysStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: keysStr })
      console.log(res)

      if (res.meta.status != 200) return this.$message.error('分配权限数据失败')
      this.$message.success('分配权限数据成功')
      this.getRolesList()
      this.rightDialogVisible = false
    }

  }
}
</script>
<style scoped lang="less">
    .el-button {
        margin: 20px
    }
    .level_one {
        border-bottom: 1px solid #ccc;
    }
</style>
