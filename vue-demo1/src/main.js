import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'
import echarts from 'echarts'
// 配置quill富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 导入axios
import axios from 'axios'
// 引入事件过滤器
import './filter.js'
//引入xlsx插件,全局挂载
import XLSX from 'xlsx'
Vue.prototype.XLSX = XLSX
    //引入excel所需js文件
import Blob from './excel/Blob.js'
import Export2Excel from './excel/Export2Excel.js'
//全局使用vuex
import store from './store/store.js'
// import Vuex from 'vuex'
// Vue.use(Vuex)

// const store = new Vuex.store({
//     state: { count: 6666 }
// })
import jsonp from 'vue-jsonp'
//引入手淘rem适配
import 'lib-flexible/flexible.js'



Vue.use(jsonp)

Vue.prototype.$echarts = echarts
Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor /* { default global options } */ )

// 配置接口基准地址 $http
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    // axios请求拦截器---axios拦截器是为了复用代码，把每个ajax都要设置的头信息提取到拦截器当中(通过token向服务器获取数据)
axios.interceptors.request.use(function(config) {
    config.headers.Authorization = sessionStorage.getItem('token')
    return config
}, function(error) {
    console.log(error)
})


//封装get请求
function getdata(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, { params: param })
            .then(res => {
                resolve(res.data)
            }, err => {
                reject(err)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

Vue.prototype.$get = getdata


// 将axios挂载到vue的原型对象上，其他组件可以直接使用
Vue.prototype.$http = axios

console.log(process.env.NODE_ENV)

Vue.config.productionTip = false



//自定义指令
const has = Vue.directive('has', {
    inserted: function(el, binding) {
        //获取页面权限
        if (!Vue.prototype.$_has(binding.value)) {
            el.parentNode.removeChild(el)
        }
    }
})
Vue.prototype.$_has = function(value) {
    let isExit = false
    let buttonpermsStr = sessionStorage.getItem('btnpermission').split(',')
    if (buttonpermsStr === undefined || buttonpermsStr === null) {
        return false
    } else if (buttonpermsStr.includes(value)) {
        isExit = true
    }
    // for (let i = 0; i < buttonpermsStr.length; i++) {
    //     if (value === buttonpermsStr[i]) {
    //         isExit = true
    //         break
    //     }
    // }
    return isExit
}









new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app')