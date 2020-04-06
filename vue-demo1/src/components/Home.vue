<template>
    <el-container class="home_container">
        <el-header>
                 <div class="left">
                     <img src="../assets/heima.png" alt="">
                     <h3>电商后台管理系统</h3>
                 </div>
                 <!-- <el-button type="primary" @click="logout">退出登录</el-button> -->
                      <el-button type="primary" @click.native="logout">退出</el-button>
        </el-header>
         <el-container class="son_container">
                 <el-aside :width="isCollapse==true?'64px':'200px'">
                     <div class="toggle-button" @click="toggleCollapse"> |||</div>
                     <el-menu background-color=" #333744" text-color="#fff" active-text-color="red" unique-opened :collapse='isCollapse' :collapse-transition="false" router :default-active="activePath">
                             <el-submenu :index="item.id+''" v-for="item in list" :key="item.id">
                               <template slot="title"> <i class="iconfont" :class="iconsObj[item.id]"></i> <span>{{item.authName}}</span> </template>
                               <el-menu-item :index="'/'+items.path" v-for="items in item.children" :key="items.id" @click="toggleActivePath('/'+items.path)"><i class="el-icon-menu"></i> <span>{{items.authName}}</span></el-menu-item>
                               <!-- <!-- <el-menu-item index="2-2">选项2</el-menu-item> -->
                                <el-menu-item index="/yiqing" @click="toggleActivePath('/yiqing')"><i class="el-icon-menu"></i>疫情地图</el-menu-item>
                             </el-submenu>
                     </el-menu>
                 </el-aside>
                <el-main> 
                    <!-- {{name}}
                      <el-button type="primary" @click="delcount">减少</el-button>
                       <el-button type="primary" @click="yanchi">异步减少</el-button> -->
                    <router-view></router-view> 
                  </el-main>
        </el-container>
    </el-container>

</template>
<script>
import {mapState} from 'vuex'
import {mapMutations} from 'vuex'
import {mapActions} from 'vuex'
export default {
  name: 'home',
  created () {
    // 不宜放入太多逻辑
    this.getMenuList()
    // 页面创建阶段获取高亮
    this.activePath = window.sessionStorage.getItem('activePath')
    this.huoqu()
  },
  data () {
    return {
      list: [],
      iconsObj: {
        125: 'icon-user',
        103: 'icon-tijikongjian',
        101: 'icon-3702mima',
        102: 'icon-danju',
        145: 'icon-baobiao'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  computed:{
    ...mapState(['name'])
  },
  methods: {
    ...mapMutations(['del']),
    ...mapActions(['delAsync']),
    yanchi() {
      this.delAsync()
    },
    delcount() {
      this.del()
    },
    logout() {
      console.log(11)
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取左侧菜单栏
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      // console.log(res);
      if (res.meta.status != 200) return this.$message.error('获取列表失败')
      this.list = res.data
      console.log(this.list);
    },
    // 切换菜单
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 点击切换高亮效果 将item.path传进来
    toggleActivePath (activePath) {
      // 页面刷新会消失
      this.activePath = activePath
      // 持久存储
      window.sessionStorage.setItem('activePath', activePath)
    },
    //获取封装
     async huoqu() {
       const res=await this.$get('http://127.0.0.1:8888/api/private/v1//api/system/menu/findMenu').then(res=>{
          console.log(res)
          console.log('获取数据成功')
        }).catch(err=>{
          console.log('获取数据失败')
        })
    }
  }
}
</script>
<style lang="less" scoped>
    .home_container {
        height: 100%;
        .el-header {
            // position: fixed;
            // left: 0;
            // right: 0;
            background-color: #333744;
            display: flex;
            justify-content: space-between;
            padding-left: 0;
            align-items: center;
            .left {
                display: flex;
                align-items: center;
                color: #fff;
                font-size: 20px;
                h3 {
                    margin-left: 10px;
                    font-weight: 400;
                }
            }
        };
        .el-aside {
            position: absolute;
            top: 0;
            bottom: 0;
            height: 100%;
            background-color: #333744;
            .toggle-button {
                text-align: center;
                color: #fff;
                cursor: pointer;
                letter-spacing: 2px;
            }
            .el-menu {
                border-right: none;
            }
            .iconfont {
                margin-right: 10px
            }
        };
        .el-main {
            height: 100%;
            position: absolute;
            // position: fixed;
            // top: 60px;
            left: 200px;
            right: 0;
            // bottom: 0;
            background: #eaedf1;

        };
        .son_container {
            position: relative;
            height: 100%;
        }
    }
</style>
