<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
             <el-button @click="showson" type="primary">点击显示子组件信息</el-button>
             <el-button type="warning" @click="openDia">点击弹框</el-button>
        </el-breadcrumb>
        <el-card>
            <el-table :data=rightsList>
                <el-table-column type="index" label="编号"></el-table-column>
                <el-table-column prop="authName" label="权限名称"></el-table-column>
                <el-table-column prop="path" label="路径"></el-table-column>
                <el-table-column prop="level" label="权限等级">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level==0" type="primary">一级</el-tag>
                        <el-tag type="success" v-else-if="scope.row.level==1">二级</el-tag>
                        <el-tag type="danger" v-else>三级</el-tag>
                    </template>
                </el-table-column>

            </el-table>
        </el-card>
        <!-- <dialogs :dialogVisible='dialogVisible' :title="title" @closeFun.sync='dialogVisible' :options='options' @diasub='diasub'></dialogs> -->
        <dialogs :dialogVisible.sync='dialogVisible' :title="title" :options='options' @diasub='diasub' ref="dialogs"></dialogs>
    </div>
</template>
<script>
import dialogs from '../commons/dialogs.vue'
export default {
  components:{
    dialogs
  },
  created () {
    // 获取数据列表
    this.getRightsList()
  },
  data () {
    return {
      dialogVisible:false,
      title:'封装的弹窗',
      //选择框数据
      // value:'555',
       options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }],
      rightsList: []
    }
  },
  methods: {
    showson() {
      this.$refs.dialogs.showData('显示弹框组件信息')
    },
    diasub(n) {
      console.log(n)
    },
    // closes(v) {
    //   console.log(v)
    //   this.dialogVisible=!v
    // },
    openDia() {
          this.dialogVisible=true
          console.log(this.dialogVisible)
       
    },
    // 获取权限列表
    async getRightsList () {
      const { data: res } = await this.$http.get('rights/list')
      console.log(res)
      if (res.meta.status != 200) return this.$message.error('获取数据失败')
      this.rightsList = res.data
    }
  }
}
</script>
<style scoped lang="less">

</style>
