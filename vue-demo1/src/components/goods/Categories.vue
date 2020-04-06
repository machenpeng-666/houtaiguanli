<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!--  -->
        <el-card>
             <el-button type="primary" @click="addCate">添加分类</el-button>

                <!--selection-type：是否显示复选框
                    expand-type：是否显示展开行
                    show-index：是否显示索引列
                    index-text：设置索引列标题
                    show-row-hover：是否有鼠标高亮效果
                    border：边框 -->
            <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border stripe>
                <template slot="isDeleted" slot-scope="scope">
                    <!-- {{scope.row.cat_deleted}} -->
                    <i class="el-icon-success" style="color:green" v-if="scope.row.cat_deleted==false"></i>
                    <i class="el-icon-error" style="color:red" v-else></i>
                </template>
                 <template slot="level" slot-scope="scope">
                    <!-- {{scope.row.cat_level}} -->
                     <el-tag v-if="scope.row.cat_level==0" type="warning">一级</el-tag>
                        <el-tag type="success" v-else-if="scope.row.cat_level==1">二级</el-tag>
                        <el-tag type="danger" v-else>三级</el-tag>
                </template>
                <template slot="option" slot-scope>
                    <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                </template>
            </tree-table>
           <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"  :page-sizes="[1, 2, 3, 4]"
             :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <!-- -添加分类对话框 -->
        <el-dialog title="提示" :visible.sync="addDialogVisible" width="30%" :before-close="handleClose">
            <el-form ref="addCateFormRef" :model="addCateForm" :rules="addCateFormRules" label-width="80px">
                <el-form-item label="分类名称" prop="cat_name">
                  <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <!-- 级联选择器         options用来指定数据源   -->
                    <el-cascader v-model="selectKeys" :options="parentCateList" :props="{ expandTrigger: 'hover',label:'cat_name',value:'cat_id',checkStrictly:true}" clearable
                    @change="cascaderChange"></el-cascader>
                </el-form-item>
          </el-form>
             <span slot="footer" class="dialog-footer">
               <el-button @click="addDialogVisible = false">取 消</el-button>
               <el-button type="primary" @click="saveCate">确 定</el-button>
             </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
  created () {
    this.getCategoriesList()
  },
  data () {
    return {
      // 对话框
      addDialogVisible: false,
      // 商品分类参数
      queryInfo: {
        type: 3, // 3级分类
        pagenum: 1,
        pagesize: 2 // 每页显示的条数
      },
      cateList: [],
      total: 0, // 总页数
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template', // 表示当前这一列是自定义模板列
          template: 'isDeleted' // 具名slot
        },
        {
          prop: 'cat_level',
          label: '排序',
          type: 'template',
          template: 'level'
        },
        {
          // prop:'cat_level',
          label: '操作',
          type: 'template',
          template: 'option'
        }
      ],
      // 添加分类表单数据
      addCateForm: {
        cat_pid: 0,
        cat_name: '', // 父级分类id
        cat_level: 0 // 父级分类等级
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '分类名称不能为空', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在3到15之间', trigger: 'blur' }
        ]
      },
      // 父级分类数据
      parentCateList: [],
      selectKeys: []
    }
  },
  methods: {
    async getCategoriesList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      // console.log(res);
      if (res.meta.status != 200) return this.$message.error('获取列表失败')
      // this.$message.success('获取列表成功')
      this.cateList = res.data.result
      this.total = res.data.total
    },
           // 分页
    handleSizeChange (pagesize) {
      console.log(pagesize)
      this.queryInfo.pagesize = pagesize
      this.getCategoriesList()
    },
    handleCurrentChange (pagenum) {
      this.queryInfo.pagenum = pagenum
      this.getCategoriesList()
    },
    // 展示添加分类的对话框
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    addCate () {
      this.addDialogVisible = true
      this.getParentsCateList()
    },
    // 获取父级分类数据
    async getParentsCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      console.log(res)
      if (res.meta.status != 200) return this.message.error('获取数据失败')
      this.parentCateList = res.data
      console.log(this.parentCateList)
    },
    //
    cascaderChange () {
      console.log(this.selectKeys)
      if (this.selectKeys.length == 0) {
        // 当前要添加的一级分类
        this.addCateForm.cat_pid = 0
      } else {
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
      }
      this.addCateForm.cat_level = this.selectKeys.length
    },
    // 重置添加分类表单
    resetCateForm () {
      this.$refs.addCateFormRef.resetFields()
      this.selectKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 保存添加的分类
    async saveCate () {
      const { data: res } = await this.$http.post('categories', this.addCateForm)
      // console.log(res);
      if (res.meta.status != 201) return this.$message.error('请求数据失败')
      this.getCategoriesList()
      this.addDialogVisible = false
    }

  }
}
</script>
<style scoped lang="less">

</style>
<style lang="less">
    .el-cascader-menu {
        height: 240px;
    }
</style>
