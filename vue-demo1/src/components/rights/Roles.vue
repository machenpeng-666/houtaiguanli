<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button type="primary">添加角色</el-button>

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
                <template slot-scope="">
                    <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                    <el-button size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>

                </template>
            </el-table-column>
        </el-table>
        <!-- 编辑 -->
    </div>
</template>
<script>
export default {
    created() {
        this.getRolesList()
    },
    data () {
        return {
            rolesList:[]
        };
    },
    methods:{
        //获取角色列表
      async getRolesList() {
            const {data:res}=await this.$http.get('roles')
            if(res.meta.status!=200) return this.$message.error('获取角色列表失败')
            // console.log(res);
            this.rolesList=res.data
        },
        //删除用户权限
        deleteRightsById(roleId,rightId) {
           this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
            const {data:res}=await this.$http.delete(`roles/${roleId}/rights/${rightId}`)
            console.log(res);
            if(res.meta.status!=200) return this.$message.error('删除权限失败')
            this.$message.success('删除成功')
            this.rolesList=res.data;
            this.getRolesList()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
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