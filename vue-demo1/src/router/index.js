import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '@/components/Welcome.vue'
import Users from '@/components/users/Users.vue'
import Rights from '@/components/rights/Rights.vue'
import Roles from '@/components/rights/Roles.vue'
import Categories from '@/components/goods/Categories.vue'
import Params from '@/components/goods/Params.vue'
import Goods from '@/components/goods/Goods.vue'
import Addgoods from '@/components/goods/Addgoods.vue'
import OrderList from '@/components/order/OrderList.vue'
import Reports from '@/components/report/Report.vue'
import Yiqing from '@/components/report/yiqing.vue'
//添加大屏数据可视化路由
import Echarts from '@/components/Echarts.vue'
// 全局挂载路由
Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        { path: '/', redirect: '/echarts' },
        { path: '/login', component: Login },
        {
            path: '/home',
            component: Home,
            redirect: '/welcome',
            children: [
                { path: '/welcome', component: Welcome },
                { path: '/users', component: Users },
                { path: '/rights', component: Rights },
                { path: '/roles', component: Roles },
                { path: '/categories', component: Categories },
                { path: '/params', component: Params },
                { path: '/goods', component: Goods },
                { path: '/goods/add', component: Addgoods },
                { path: '/orders', component: OrderList },
                { path: '/reports', component: Reports },
                { path: '/yiqing', component: Yiqing }
            ]
        },
        { path: '/echarts', component: Echarts }
    ]
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

// a路由向b路由跳转之前执行  --未路由对象添加导航守卫(防止非法登录)
// axios拦截器是为了复用代码，把每个ajax都要设置的头信息提取到拦截器当中(通过token向服务器获取数据)
router.beforeEach(function(to, from, next) {
    // console.log(to); //要去哪
    // console.log(from); //来自哪里
    // next()
    if (to.path === '/login') return next()
        // 获取token,判断有没有token,没有就跳转登录页
    let tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})

export default router