<template>
  <div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="1"
      :page-sizes="[2, 3, 4]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <el-button type="primary" @click="chuanzhi" >传值</el-button>
  </div>
</template>
<script>
import eventBus from './eventBus.js'
export default {
  props:{
    total:{
      type:Number
    },
    pagenum: Number,
    pagesize: Number,
    pagesizes:Array
  },
  data() {
    return {
      info:'我是分页组件的信息'
    };
  },
  methods: {
    // 每页展示的条数
     handleSizeChange(val) {
      //事件传递
      this.$emit('handleSizeChangeSub', val);
    },
    //点击当前页
     handleCurrentChange(val) {
      //事件传递
      this.$emit('handleCurrentChangeSub', val);
      // this.$emit('update:pagenum',val)
      // this.$parent.getUserList()
    },
    //兄弟组件传值
    chuanzhi() {
      eventBus.$emit('brother',this.info)
    },
  }
};
</script>
<style scoped lang="less">
</style>