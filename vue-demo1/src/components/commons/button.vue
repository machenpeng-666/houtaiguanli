<template>
    <div>
       <el-button type="danger" @click="tanchu">{{buttonName}}</el-button>
    </div>
</template>
<script>
import eventBus from './eventBus.js'
export default {
    props:{
        buttonName:{
            type:[Number,String],
            default:"皮特马"
        }
    },
    data () {
        return {
            names:'屠龙宝刀，天下第一',
            sendata:''
        };
    },
    methods:{
        tanchu() {
            console.log(this.sendata)
            // this.$emit('btnsAlert',this.names)
           
        }
    },
    created() {
         eventBus.$on('brother',(val)=>{
                this.sendata=val
            })
    }
}
</script>
<style scoped lang="less">
    
</style>