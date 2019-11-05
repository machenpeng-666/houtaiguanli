<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
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
    </div>
</template>
<script>
export default {
    created(){
        //获取数据列表
        this.getRightsList()
    },
    data () {
        return {
            rightsList:[]
        };
    },
    methods:{
        //获取权限列表
      async getRightsList() {
        const {data:res}= await this.$http.get('rights/list')
        console.log(res);
        if(res.meta.status!=200) return this.$message.error('获取数据失败')
        this.rightsList=res.data
        }
    }
}
</script>
<style scoped lang="less">
    
</style>