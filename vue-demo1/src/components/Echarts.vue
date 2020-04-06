<template>
  <div id="box">
    <header>
      <h1>2019教资人员分布统计</h1>
    </header>
    <!-- 页面主体部分 -->
    <section class="mainbox">
      <div class="column">
        <div class="panel bar">
          <h2>柱状图-就业行情</h2>
          <div class="chart"></div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel line">
          <h2>折线图-人员变化</h2>
          <div class="chart"></div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel pie">
          <h2>饼状图-会员占比</h2>
          <div class="chart">图表</div>
          <div class="panel-footer">底部</div>
        </div>
      </div>
      <div class="column">
        <!-- 中间布局 -->
        <div class="no">
          <div class="no-hd">
            <ul>
              <li>125811</li>
              <li>104563</li>
            </ul>
          </div>
          <div class="no-bd">
            <ul>
              <li>教资报考人数</li>
              <li>涨幅人数</li>
            </ul>
          </div>
        </div>
        <!-- 地图模块 -->
        <div class="map">
          <div id="map-zhejiang"></div>
          <div class="map1"></div>
          <div class="map2"></div>
          <div class="map3"></div>
        </div>
      </div>
      <div class="column">
        <div class="panel bar1">
          <h2>柱状图-就业行情</h2>
          <div class="chart">
              <BarChart></BarChart>
          </div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel line1">
          <h2>折线图-人员变化</h2>
          <div class="chart"></div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel pie1">
          <h2>饼状图-会员占比</h2>
          <div class="chart">图表</div>
          <div class="panel-footer">底部</div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import Vue from "vue";
// import '../echart/echart.js'
import "echarts/map/js/province/zhejiang.js"; //引入中国地图
import BarChart from './commons/bar.vue'

export default {
  components:{
    BarChart
  },
  data() {
    return {
      mychart: null
    };
  },
  methods: {
    getBar() {
      //柱状图
      let mychart = this.$echarts.init(document.querySelector(".bar .chart"));
      let option = {
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        //柱状图大小
        grid: {
          left: "0%",
          top: "10px",
          right: "0%",
          bottom: "4%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: ["台州", "金华", "临海", "仙居", "绍兴", "温岭"],
          axisLabel: {
            color: "rgba(255,255,255,.6)",
            fontSize: "12"
          }
        },
        yAxis: {
          type: "value",
          axisLabel: {
            textStyle: {
              color: "rgba(255,255,255,.6)",
              fontSize: "12"
            }
          },
          splitLine: {
            lineStyle: {
              color: "rgba(255,255,255,.1)"
            }
          }
        },
        series: [
          {
            name: "教育行业",
            barWidth: "35%",
            data: [120, 500, 150, 900, 70, 110, 130],
            type: "bar",
            showBackground: false,
            itemStyle: {
              // 修改柱子圆角
              barBorderRadius: 5
            }
          }
        ]
      };
      //数据给实例对象
      mychart.setOption(option);
      window.addEventListener("resize", () => {
        mychart.resize();
      });
    },
    getLine() {
      let zhexian = this.$echarts.init(document.querySelector(".line .chart"));
      let option1 = {
        legend: {
          data: ["意向", "预购", "人员变化"],
          textStyle: {
            fontSize: 12,
            color: "#fff"
          }
        },
        grid: {
          left: "0%",
          top: "30px",
          right: "0%",
          bottom: "5%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: ["2014", "2015", "2016", "2017", "2018", "2019"],
          axisLabel: {
            color: "#fff",
            fontSize: "12"
          }
        },
        yAxis: {
          type: "value",
          axisLabel: {
            textStyle: {
              color: "#fff",
              fontSize: "12"
            }
          }
        },
        series: [
          //三条折线图的数据
          {
            name: "人员变化",
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line",
            smooth: true,
            lineStyle: {
              color: "red"
            }
          },
          {
            name: "预购",
            type: "line",
            smooth: true,
            data: [30, 182, 434, 791, 390, 30, 10],
            lineStyle: {
              color: "green"
            }
          },
          {
            name: "意向",
            type: "line",
            smooth: true,
            data: [1320, 1132, 601, 234, 120, 90, 20],
            lineStyle: {
              color: "pink"
            }
          }
        ]
      };
      zhexian.setOption(option1);
      window.addEventListener("resize", () => {
        zhexian.resize();
      });
    },
    getPie() {
      //饼状图
      let bingtu = this.$echarts.init(document.querySelector(".pie .chart"));
      let option2 = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: 10,
          data: ["金牌会员", "银牌会员", "铜牌会员", "普通会员"],
          textStyle: {
            fontSize: 12,
            color: "#fff"
          }
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center"
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "30",
                fontWeight: "bold"
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 335, name: "金牌会员" },
              { value: 310, name: "银牌会员" },
              { value: 234, name: "铜牌会员" },
              { value: 135, name: "普通会员" }
            ]
          }
        ]
      };
      bingtu.setOption(option2);
      window.addEventListener("resize", () => {
        bingtu.resize();
      });
    },
    getMap() {
      var maps = this.$echarts.init(document.getElementById("map-zhejiang"));
      //地图
      let option3 = {
        //标题
        title: {
          text: "浙江考生分布",
          x: "center",
          textStyle: {
            color: "#fff",
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
            map: "浙江",
            mapType: "province",
            data: [
              // {name:'山西',value:20}
            ],
            label: {
              show: true,
              color: "#fff",
              fontSize: 15
            },
            itemStyle: {
              // 地图区域的颜色 如果设置了visualMap, 这个属性将不起作用
              areaColor: "#1462B0",
              // 描边线宽 为 0 时无描边
              borderWidth: 2,
              // 图形的描边颜色 支持的颜色格式同 color
              borderColor: "#2ECDF6",
              // 描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'
              borderType: "solid"
            },
            left: "center",
            emphasis: {
              //高亮状态下的设置
              label: {
                //图形上文字标签
                color: "#fff"
              },
              itemStyle: {
                //鼠标滑动区域颜色
                areaColor: "skyblue"
              }
            }
          }
        ]
      };
      maps.setOption(option3);
      window.addEventListener("resize", () => {
        // console.log(this)
        maps.resize();
      });
    },
    //右侧图表
    getBar1() {
      let mychart=this.$echarts.init(document.querySelector('.bar1 .chart'))
      
    }
  },
  mounted() {
    console.log(this);
    this.getBar();
    //折线图
    this.getLine();
    this.getPie();
    //地图
    this.getMap()
    // this.$echarts.registerMap('zhejiang')
  }
};
</script>
<style scoped lang="less">
//声明字体
@font-face {
  font-family: electronicFont;
  src: url(../assets/fonts/DS-DIGIT.TTF);
}
#box {
  width: 24rem;
  background: url(../assets/images/bg.jpg);
}
header {
  width: 24rem;
  height: 1.25rem;
  background: url(../assets/images/head_bg.png) no-repeat top center;
  background-size: 100% 100%;
}
h1 {
  color: white;
  font-size: 0.475rem;
  text-align: center;
  line-height: 1rem;
}
//中间
.mainbox {
  min-width: 1024px;
  max-width: 1920px;
  margin: 0 auto;
  //   background-color: pink;
  padding: 0.125rem 0.125rem 0;
  display: flex;
  //三列
  .column {
    flex: 3;
  }
  .column:nth-child(2) {
    flex: 5;
    margin: 0 0.2rem 0.125rem;
  }
  //公共面板样式
  .panel {
    position: relative;
    box-sizing: border-box;
    height: 3.875rem;
    margin-bottom: 0.2rem;
    border: 1px solid rgba(25, 186, 139, 0.17);
    background: url(../assets/images/line1.png) no-repeat
      rgba(255, 255, 255, 0.03);
    padding: 0 0.2rem 0.533333rem;
    //利用伪元素制作边框
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      content: "";
      width: 0.133333rem;
      height: 0.133333rem;
      border-top: 0.026667rem solid #02a6b5;
      border-left: 0.026667rem solid #02a6b5;
    }
    &::after {
      position: absolute;
      top: 0;
      right: 0;
      content: "";
      width: 10px;
      height: 10px;
      border-top: 2px solid #02a6b5;
      border-right: 2px solid #02a6b5;
    }
    h2 {
      font-size: 0.266667rem;
      height: 0.64rem;
      line-height: 0.64rem;
      color: white;
      text-align: center;
      font-weight: 400;
    }
    //图表
    .chart {
      height: 3rem;
      // background-color: pink;
    }
    .panel-footer {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      &::before {
        position: absolute;
        bottom: 0;
        left: 0;
        content: "";
        width: 10px;
        height: 10px;
        border-bottom: 2px solid #02a6b5;
        border-left: 2px solid #02a6b5;
      }
      &::after {
        position: absolute;
        bottom: 0;
        right: 0;
        content: "";
        width: 10px;
        height: 10px;
        border-bottom: 2px solid #02a6b5;
        border-right: 2px solid #02a6b5;
      }
    }
  }
  //数字模块
  .no {
    background: rgba(101, 132, 226, 0.1);
    padding: 0.2rem;
    .no-hd {
      position: relative;
      &::before {
        position: absolute;
        top: 0;
        left: 0;
        content: "";
        width: 0.233333rem;
        height: 0.133333rem;
        border-top: 0.026667rem solid #02a6b5;
        border-left: 0.026667rem solid #02a6b5;
      }
      &::after {
        position: absolute;
        bottom: 0;
        right: 0;
        content: "";
        width: 0.233333rem;
        height: 0.133333rem;
        border-bottom: 2px solid #02a6b5;
        border-right: 2px solid #02a6b5;
      }
      ul {
        display: flex;
        li {
          list-style: none;
          flex: 1;
          text-align: center;
          height: 1.066667rem;
          font-size: 0.933333rem;
          color: #ffeb7b;
          font-family: "electronicFont";
        }
      }
    }
    .no-bd {
      ul {
        display: flex;
        li {
          list-style: none;
          flex: 1;
          color: #fff;
          font-size: 0.206667rem;
          text-align: center;
          font-weight: 200;
        }
      }
    }
  }
  //地图模块
  .map {
    position: relative;
    height: 10.125rem;
    // background-color: #02a6b5;
    #map-zhejiang {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 5;
      height: 10.125rem;
      width: 100%;
      opacity: 0.7;
    }
    .map1 {
      width: 6.475rem;
      height: 6.475rem;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: url(../assets/images/map.png);
      background-size: 100% 100%;
      opacity: 0.4;
    }
    .map2 {
      width: 8.0375rem;
      height: 8.0375rem;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: url(../assets/images/lbx.png) no-repeat;
      animation: mapball 15s linear infinite;
      opacity: 0.6;
    }
    .map3 {
      width: 7.075rem;
      height: 7.075rem;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: url(../assets/images/jt.png) no-repeat;
      animation: jiantou 15s linear infinite;
      opacity: 0.6;
    }
    //设置旋转球体动画
    @keyframes mapball {
      from {
        transform: translate(-50%, -50%) rotate(0deg);
      }
      to {
        transform: translate(-50%, -50%) rotate(360deg);
      }
    }
    //箭头动画
    @keyframes jiantou {
      from {
        transform: translate(-50%, -50%) rotate(0deg);
      }
      to {
        transform: translate(-50%, -50%) rotate(-360deg);
      }
    }
  }
}
</style>