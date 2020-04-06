import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        name: 0
    },
    mutations: {
        //处理同步操作
        add(state) {
            state.name++
                // setTimeout(function() {
                //     state.name += step
                // }, 3000)
        },
        del(state) {
            state.name--
        }
    },
    //处理异步操作
    actions: {
        addAsync(context) {
            setTimeout(() => {
                context.commit('add')
            }, 1000)
        },
        delAsync(context) {
            setTimeout(() => {
                context.commit('del')
            }, 3000)
        }
    },
    //计算属性
    getters: {
        meihua(state) {
            return '这是美化处理过的数据【' + state.name + '】'
        }
    }
})