<template>
    <div>
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品参数</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
             <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning">
             </el-alert>
            <!-- 级联选择器 -->
            <div>
             <span>请选择商品分类：</span>
             <!-- selectKeys 选中的商品分类数据 -->
             <el-cascader v-model="selectKeys" :options="cateList" :props="{ expandTrigger: 'hover',label:'cat_name',value:'cat_id',children:'children' }" @change="handleChange"></el-cascader>
            </div>
            <!-- 动态参数区域 -->
            <el-tabs v-model="activeName" @tab-click="handleClick">
                  <!-- many 动态参数 -->
                 <el-tab-pane label="动态属性" name="many">
                     <el-button type="primary" :disabled="isDisabled" @click="addAttrDialogVisible=true">添加属性</el-button>
                     <el-table :data="manyTableData" border stripe>
                         <el-table-column type="expand">
                             <!-- 可选项 -->
                             <template slot-scope="scope">
                                 <!-- <pre>
                                     {{scope.row}}
                                 </pre> -->
                                 <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="removeTag(i,scope.row)">{{item}}</el-tag>
                                 <!-- input 和button 同时只能显示一个 -->
                                 <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                 @keyup.enter.native="handleInputConfirm(scope.row)"
                                 @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

                             </template>
                         </el-table-column>
                         <el-table-column type="index"></el-table-column>
                         <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                         <el-table-column label="操作">
                             <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCateList(scope.row.attr_id)" >删除</el-button>
                                <!-- attr_id 分类参数id -->
                             </template>
                         </el-table-column>
                     </el-table>
            </el-tab-pane>
                 <!--  -->
            <el-tab-pane label="静态属性" name="only">
                     <el-button type="primary" :disabled="isDisabled" @click="addAttrDialogVisible=true">添加参数</el-button>
                       <el-table :data="onlyTableData" border stripe>
                         <el-table-column type="expend"></el-table-column>
                         <el-table-column type="index"></el-table-column>
                         <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                         <el-table-column label="操作">
                             <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCateList(scope.row.attr_id)" >删除</el-button>
                             </template>
                         </el-table-column>
                    </el-table>
                 </el-tab-pane>
             </el-tabs>
        </el-card>
        <!--添加资料框  -->
        <el-dialog :title="'添加'+currentTitle" :visible.sync="addAttrDialogVisible" width="30%" @close="resetForm">
                <el-form ref="attrFormRef" :model="attrForm" label-width="80px" :rules="attrFormRules">
                    <el-form-item :label="currentTitle">
                    <el-input v-model="attrForm.attr_name"></el-input>
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                 <el-button @click="dialogVisible = false">取 消</el-button>
                 <el-button type="primary" @click="saveAttrs">确 定</el-button>
                </span>
        </el-dialog>
        <!-- 修改属性对话框 -->
         <el-dialog :title="'添加'+currentTitle" :visible.sync="editAttrDialogVisible" width="30%" @close="resetEditForm">
                <el-form ref="editAttrFormRef" :model="editAttrForm" label-width="80px" :rules="editAttrFormRules">
                    <el-form-item :label="currentTitle">
                    <el-input v-model="editAttrForm.attr_name"></el-input>
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                 <el-button @click="editAttrDialogVisible = false">取 消</el-button>
                 <el-button type="primary" @click="saveEditAttrs">确 定</el-button>
                </span>
        </el-dialog>

    </div>
</template>
<script>
export default {
  created () {
    this.getCateList()
  },
  data () {
    return {
      cateList: [], // 分类的列表数据
      selectKeys: [], // selectKeys 选中的商品分类数据
      activeName: 'many',
      onlyTableData: [],
      manyTableData: [],
      addAttrDialogVisible: false,
      editAttrDialogVisible: false,
      attrForm: {
        attr_name: ''
      },
      // 表单验证规则
      attrFormRules: {
        attr_name: [
          { required: true, message: '属性名不能为空', trigger: 'blur' },
          { min: 2, max: 15, message: '长度必须在3到15之间', trigger: 'blur' }
        ]
      },
      // 修改表单数据
      editAttrForm: {

      },
      // 修改表单规则
      editAttrFormRules: {
        attr_name: [
          { required: true, message: '属性名不能为空', trigger: 'blur' },
          { min: 2, max: 15, message: '长度必须在3到15之间', trigger: 'blur' }
        ]
      },
      inputVisible: false,
      inputValue: ''
    }
  },
  methods: {
    // 获取所有商品分类列表
    async  getCateList () {
      const { data: res } = await this.$http.get('categories')
      // console.log(res);
      if (res.meta.status != 200) return this.$message.error('获取分类列表失败')
      this.cateList = res.data

      // console.log(this.cateList);
    },
    // 级联选择器
    handleChange () {
      this.getParamsData()
      this.manyTableData = []
      this.onlyTableData = []
    },
    // 动态参数切换事件
    handleClick () {
      this.getParamsData()
    },
    // 获取商品参数
    async getParamsData () {
      // 三级分类数组长度为3，通过数组长度判断是否为三级分类
      console.log(this.selectKeys)
      if (this.selectKeys.length <= 2) return this.selectKeys = []
      console.log('选的是三级分类')
      // 获取商品参数
      var cateId = this.selectKeys[2]
      // console.log(cateId);
      const { data: res } = await this.$http.get(`categories/${cateId}/attributes`, { params: { sel: this.activeName } })
      // console.log(res.data);
      // 打印的引用类型的数据（对象，数组），数据是最新值
      // 将res.data中的attr_vals是字符串，要循环数组将字符串转换成数组
      res.data.forEach(item => {
        if (item.attr_vals == '') {
          item.attr_vals = []
        } else {
          item.attr_vals = item.attr_vals.split(',')
        }
        item.inputVisible = false
        item.inputValue = ''
      })
      // console.log(res.data[0].attr_vals);

      if (this.activeName == 'only') {
        this.onlyTableData = res.data
        console.log(this.onlyTableData)
      } else {
        this.manyTableData = res.data
        console.log(this.manyTableData)
      }
    },
    // 显示添加属性框
    resetForm () {
      this.$refs.attrFormRef.resetFields()
    },
    // 保存添加的参数
    saveAttrs () {
      // 表单校验
      this.$refs.attrFormRef.validate(async valid => {
        console.log(valid)
        // 获取三级商品参数id
        var cateId = this.selectKeys[2]
        const { data: res } = await this.$http.post(`categories/${cateId}/attributes`, { attr_name: this.attrForm.attr_name, attr_sel: this.activeName })
        console.log(res)
        if (res.meta.status != 201) return this.$message.error('添加属性失败')
        this.addAttrDialogVisible = false
        this.getParamsData() // 重新获取参数数据列表
      })
    },
    // 显示修改对话框(获取要修改表单的数据)
    async showEditDialog (id) {
      var cateId = this.selectKeys[2]
      const { data: res } = await this.$http.get(`categories/${cateId}/attributes/${id}`)
      console.log(res)
      this.editAttrForm = res.data
      this.editAttrDialogVisible = true
    },

    resetEditForm () {
      this.$refs.editAttrFormRef.resetFields()
    },
    // 提交修改表单的数据
    saveEditAttrs () {
      // 表单校验
      this.$refs.editAttrFormRef.validate(async valid => {
        if (!valid) return
        console.log(valid)
        // 获取三级商品参数id
        var cateId = this.selectKeys[2]
        //    console.log(cateId);
        console.log(this.editAttrForm.attr_id)

        const { data: res } = await this.$http.put(`categories/${cateId}/attributes/${this.editAttrForm.attr_id}`, { attr_name: this.editAttrForm.attr_name, attr_sel: this.activeName })
        console.log(res)
        this.editAttrDialogVisible = false
        this.getParamsData()
      })
    },
    // 删除参数提示
    deleteCateList (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        var cateId = this.selectKeys[2]
        const { data: res } = await this.$http.delete(`categories/${cateId}/attributes/${id}`)
        if (res.meta.status != 200) return this.$message.error('删除参数失败')
        this.$message.success('删除成功')
        this.getParamsData()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 显示输入框
    async handleInputConfirm (row) {
      if (row.inputValue.trim() == '') {
        row.inputVisible = false
        row.inputValue = ''
        return
      }
      row.attr_vals.push(row.inputValue)
      row.inputVisible = false
      row.inputValue = ''
      // 将添加的属性发送
      var cateId = this.selectKeys[2]
      const { data: res } = await this.$http.put(`categories/${cateId}/attributes/${row.attr_id}`, { attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: row.attr_vals.join(',') })
      console.log(res)
      if (res.meta.status != 200) return this.$message.error('添加标签失败')
      this.$message.success('添加标签成功')
      this.addAttrDialogVisible = false
      this.getParamsData() // 重新获取参数数据列表
    },
    showInput (row) {
      row.inputVisible = true
      // console.log(this.$refs.saveTagInput)
      this.$nextTick(() => {
        console.log(this.$refs.saveTagInput)
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除标签
    async removeTag (index, row) {
      //   console.log(this.scope.row);

      row.attr_vals.splice(index, 1)
      var cateId = this.selectKeys[2]
      const { data: res } = await this.$http.put(`categories/${cateId}/attributes/${row.attr_id}`, { attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: row.attr_vals.join(',') })
      console.log(res)
      if (res.meta.status != 200) return this.$message.error('修改失败')
      this.$message.success('修改成功')
      this.addAttrDialogVisible = false
      this.getParamsData() // 重新获取参数数据列表
    }

  },
  computed: {
    // isDisabled -->true 禁用  false 启用
    isDisabled: function () {
      return this.selectKeys.length != 3
    },
    currentTitle () {
      if (this.activeName == 'only') {
        return '静态属性'
      } else {
        return '动态属性'
      }
    }
  }
}
</script>
<style scoped lang="less">
    .el-tag {
        margin:10px
    }
</style>
