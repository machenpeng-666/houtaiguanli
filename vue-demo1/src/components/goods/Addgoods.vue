<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon></el-alert>
      <!-- 步骤条区域 -->
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="动态属性"></el-step>
        <el-step title="静态属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏 -->
      <el-form :model="addForm" action="http://127.0.0.1:8888/api/private/v1/upload" :headers="headers" ref="addFormRef" label-width="100px" :rules="addFormRules" label-position="top">
        <el-tabs
          :tab-position="tabPosition"
          v-model="activeIndex"
          :before-leave="beforeLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catlist"
                expand-trigger="hover"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="动态属性" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item1"
                  border
                  v-for="(item1,index) in item.attr_vals"
                  :key="index"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- on-success 钩子函数，图片上传成功时触发 -->
            <el-upload
              class="upload-demo"
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :file-list="fileList"
              :headers="headers"
              list-type="picture"
              :on-success="handleSuccess"
              :on-remove="handleRemove"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
            <!-- <quill-editor
              v-model="addForm.goods_introduce"
            ></quill-editor> -->
            <el-button type="primary" @click="addInfo">添加</el-button>
          </el-tab-pane>
        </el-tabs>

      </el-form>
    </el-card>
    <!-- preview对话框 -->
    <el-dialog title="预览" :visible.sync="previewVisible" width="30%">
      <img :src="previewPath" alt="">
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  created () {
    // 获取商品分类数据
    this.gerCatList()
  },
  data () {
    return {
      // tab栏方向
      tabPosition: 'left',
      activeIndex: '0',

      // 添加商品表单数据
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [1, 4, 27],
        pics: [],
        goods_introduce: '',
        attrs: [] // 动态属性和静态属性合集
      },
      // 商品分类数据
      catlist: [],
      // 静态属性和动态数据
      manyTableData: [],
      onlyTableData: [],
      // 分类数据
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 表头信息
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      },

      // 表单验证规则
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请输入商品分类', trigger: 'blur' }
        ]
      },

      // 预览
      previewVisible: false,
      previewPath: ''
    }
  },
  methods: {
    // 获取商品选择分类数据
    async gerCatList () {
      const { data: res } = await this.$http.get('categories')
      // console.log(res);
      if (res.meta.status != 200) return this.$message.error('获取数据失败')
      this.$message.success('获取成功')
      this.catlist = res.data
      // console.log(this.catlist);
    },
    // 值改变时触发
    handleChange () {
      console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length != 3) {
        this.addForm.goods_cat = []
        this.$message.error('只能选择三级分类')
      }
    },
    // 切换状态栏判断
    beforeLeave (activeName, oldActiveName) {
      console.log(activeName, oldActiveName)
      // 如果当前用户是从基本信息切换到其他标签页，并且分类长度不是3，阻止切换
      if (oldActiveName == '0' && this.addForm.goods_cat.length < 3) {
        this.$message.error('只能选择三级分类')
        return false
      }
    },
    // 获取选中商品的分类属性
    async tabClicked () {
      // console.log(this.cateId);
      if (this.activeIndex == '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: 'many' } }
        )
        res.data.forEach(item => {
          if (item.attr_vals == '') {
            item.attr_vals = []
          } else {
            item.attr_vals = item.attr_vals.split(',')
          }
        })
        console.log(res)
        this.manyTableData = res.data
      } else if (this.activeIndex == '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: 'only' } }
        )
        // console.log(res);
        this.onlyTableData = res.data
        console.log(this.onlyTableData)
      }
    },
    // 图片上传
    handleSuccess (res) {
      if (res.meta.status == 200) {
        this.addForm.pics.push({ pic: res.data.tmp_path })
      }
    },
    handleRemove (file) {
      console.log(file)
      var path = file.response.data.tmp_path
      var index = this.addForm.pics.findIndex(item => item.pic == path)
      this.addForm.pics.splice(index, 1)
    },
    // 预览
    handlePreview (file) {
      console.log(file)
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    addInfo () {
      // console.log(123);

      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('验证失败')
        var form = _.cloneDeep(this.addForm) // 深拷贝
        form.goods_cat = this.addForm.goods_cat.join(',')
        var arr = []
        console.log(this.manyTableData)
        this.manyTableData.forEach(item => {
          var obj = { attr_id: item.attr_id, attr_value: item.attr_vals.join(',') }
          arr.push(obj)
        })
        console.log(this.onlyTableData)
        this.onlyTableData.forEach(item => {
          var obj = { attr_id: item.attr_id, attr_value: item.attr_vals }
          arr.push(obj)
        })
        // this.addForm.attrs=arr
        form.attrs = arr
        const { data: res } = await this.$http.post('goods', form)
        this.$message.success('添加成功')
        // 跳转到商品列表烈面
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    // 获取三级分类商品的id
    cateId () {
      return this.addForm.goods_cat[2]
    }
  }
}
</script>
<style scoped lang="less">
.el-steps {
  margin-top: 20px;
  margin-left: 50px;
}
</style>
<style lang="less">
.el-step__title {
  font-size: 12px !important;
}
.quill-editor {
  height: 300PX !important;
}
</style>
