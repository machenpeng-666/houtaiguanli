<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="12">
          <el-input placeholder="请输入内容" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="编号"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="order_pay">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.order_pay==0" type="danger">未付款</el-tag>
            <el-tag v-if="scope.row.order_pay==1" type="primary">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- <pre>{{scope.row}}</pre> -->
            <el-button
              icon="el-icon-edit"
              type="primary"
              size="mini"
              @click="edit(scope.row.order_id)"
            ></el-button>
            <el-button icon="el-icon-location" type="success" size="mini" @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="4"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
      ></el-pagination>
    </el-card>
    <!-- 地址修改对话框 -->
    <el-dialog
      title="添加地址"
      :visible.sync="editDialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="editFormRef" :model="editForm" label-width="80px" :rules="addressFormRules">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="selectedArea"
            :options="citydata"
            :props="{ expandTrigger: 'hover' }"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流信息对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="adressDialogVisible"
      width="30%"
    >
      <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(activity, index) in kuaidiList"
          :key="index"
          :timestamp="item.time"
        >{{item.context}}</el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adressDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// 全局使用放 main.js  模块化
import citydata from '../../assets/citydata.js'
export default {
  created () {
    this.getOrderList()
  },
  data () {
    return {
      queryInfo: {
        pagenum: 1,
        pagesize: 4
      },
      total: 0,
      // 列表数据
      orderList: [],
      editDialogVisible: false,
      adressDialogVisible: false,
      // 修改表单
      editForm: {
        address1: [],
        address2: ''
      },
      // 表单规则
      addressFormRules: {
        address1: [
          { required: true, message: '请输入省市区/县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      // 省市区信息
      citydata,
      selectedArea: [],
      // 物流信息
      kuaidiList: []
    }
  },
  methods: {
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status != 200) return this.$message.error('获取列表失败')
      //   this.$message.success('获取列表成功')
      this.total = res.data.total
      this.orderList = res.data.goods
      console.log(this.orderList)
    },
    // 分页功能
    handleSizeChange (pagesize) {
      this.queryInfo.pagesize = pagesize
      this.getOrderList()
    },
    handleCurrentChange (pagenum) {
      this.queryInfo.pagenum = pagenum
      this.getOrderList()
    },
    // 修改功能
    edit (id) {
      this.editDialogVisible = true
    },
    // 查询快递信息
    async showProgressBox () {
      const { data: res } = await this.$http.get(`/kuaidi/1106975712662`)
      console.log(res)
      if (res.meta.status != 200) return this.$message.error('获取物流信息失败')
      this.kuaidiList = res.data
      this.adressDialogVisible = true
    }
  }
}
</script>
<style scoped lang="less">
</style>
