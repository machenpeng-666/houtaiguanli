<template>
    <div>
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
            <span>{{title}}</span>
            <el-select v-model="value" placeholder="请选择" @change="selectOne">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                ></el-option>
            </el-select>
            <el-button @click="showData">显示信息</el-button>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closed">取 消</el-button>
                <el-button type="primary" @click="closed">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
  mounted() {
    console.log(this.dialogVisible);
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    options:{
        type:Array,
        default:null
    },
    title: null
  },
  data() {
    return {
      // innerVisible: this.dialogVisible,
       value:null,
    };
  },
  watch: {
    //   innerVisible() {
    //       this.innerVisible=this.dialogVisible
    //       console.log(this.innerVisible)
    //   }
  },
  methods: {
    //按钮显示信息
    showData(e) {
        alert(e)
    },
    closed() {
      //    this.dialogVisible=false
      this.$emit('update:dialogVisible', false);
    },
    selectOne(event,item) {
        console.log(event)
        this.$emit('diasub',event)
    },
    // handleClose(done) {
    //   this.$confirm("确认关闭？")
    //     .then(_ => {
    //       done();
    //     })
    //     .catch(_ => {});
    // }
  }
};
</script>
<style scoped lang="less">
</style>