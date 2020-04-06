<template>
    <div>
        <router-link to="/yiqing">
            <span>累计确诊</span>
        </router-link>|
        <router-link to="/reports">
            <span>实时列表</span>
        </router-link>
        <div id="map" style="width:100%;height:800px;"></div>
    </div>
</template>
<script>
import Vue from 'vue'
import "echarts/map/js/china"; //引入中国地图
import { debuglog } from 'util';
import { type } from 'os';
// Vue.use(jsonp)
let option = {
  //标题
  title: {
    text: "2020国内疫情地图",
    x: "center",
    textStyle: {
      color: "#9c0505",
      fontSize: 20
    }
  },
  tooltip: {
    //提示信息
    trigger: "item", //类型
    formatter: "地区: {b}确诊: {c}<br />死亡:{c}"
  },
  //数据
  series: [
    {
      type: "map",
      map: "china",
      data: [
        // {name:'山西',value:20}
      ],
      label: {
        show: true
      },
      left: "center",
      emphasis: {
        //高亮状态下的设置
        label: {
          //图形上文字标签
          color: "#fff"
        },
        itemStyle: {//鼠标滑动区域颜色
          areaColor: "skyblue"
        }
      }
    }
  ],
  //视觉地图
  visualMap: {
    type: "piecewise", //分段型
    show:true,
    pieces: [
      { min: 10000}, // 不指定 max，表示 max 为无限大（Infinity）。
      { min: 1000, max: 9999 },
      { min: 100, max: 999 },
      { min: 10, max: 99 },
      { min: 1, max: 9},
      { value: 0}, // 表示 value 等于 123 的情况。
    ],
    // text: ["High", "Low"],
    // realtime: false,
    // calculable: true,
    inRange: {//范围值
      color: ["#fff", "#FFAA85", "#FF7B69",'#855436','#8C0D0D']
    },
    itemWidth:20,
    itemHeight:10,
  }
};
export default {
  data() {
    return {
      map:'',
      // lists:[],
    };
  },
  created() {
      // option.series.data=this.lists
  },
  methods:{
      //获取真实数据
     getData() {
        this.$jsonp('https://gwpre.sina.cn/interface/news/wap/topdata.d.json?_=1584779920300&callback=Zepto118389353999').then(res=>{
          // console.log(res)
          const {list}=res.result.data
          console.log(list)
          var lists=list.map(item=>{
            return {name:item.name,value:item.conadd}
          })
          console.log(lists)
          option.series[0].data=lists
          this.map.setOption(option);
        })
     }
  },
  mounted() {
    this.getData()
    //基于准备好的dom，初始化实例
    this.map = this.$echarts.init(document.getElementById("map"));
    //把数据显示在列表
    // this.map.setOption(option);
  }
};
</script>
<style scoped lang="less">
a {
  text-decoraction: none;
}
.router-link {
  text-decoration: none;
}
</style>