import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '@/components/Welcome.vue'
import Users from '@/components/users/Users.vue'
import Rights from '@/components/rights/Rights.vue'
import Roles from '@/components/rights/Roles.vue'
//全局挂载路由
Vue.use(VueRouter)


const router = new VueRouter({
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: Login },
        {
            path: '/home',
            component: Home,
            redirect: '/welcome',
            children: [
                { path: '/welcome', component: Welcome },
                { path: '/users', component: Users },
                { path: '/rights', component: Rights },
                { path: '/roles', component: Roles }
            ]
        }
    ]
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

//a路由向b路由跳转之前执行  --未路由对象添加导航守卫(防止非法登录)
//axios拦截器是为了复用代码，把每个ajax都要设置的头信息提取到拦截器当中(通过token向服务器获取数据)
router.beforeEach(function(to, from, next) {
    // console.log(to); //要去哪
    // console.log(from); //来自哪里
    // next()
    if (to.path === '/login') return next()
        //获取token,判断有没有token,没有就跳转登录页
    let tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()


})

export default router