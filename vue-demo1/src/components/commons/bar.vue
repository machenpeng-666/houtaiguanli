<template>
    <div id="echart" style="height:100%">echart</div>
</template>
<script>
export default {
  data() {
    return {
      echart: null,
      axisOption: {
        xAxis: [
          {
            type: "category",
            data: []
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: []
      },
      normalOption: {
        series: []
      }
    };
  },
  methods: {
    getBar() {
      var myColor = ["#1089E7", "#F57474", "#56D0E3", "#F8B448", "#8B78F6"];
      var titlename = ["HTML5", "CSS3", "javascript", "VUE", "NODE"];
      var valdata = [702, 350, 610, 793, 664];
      let maps = this.$echarts.init(document.getElementById("echart"));
      let option = {
        // title: {
        //   text: "报名类型",
        //   subtext: "数据来源于网络",
        //    textStyle: {
        //     color: "#fff"
        //   }
        // },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: {
          data: ["2018年", "2019年"]
        },
        grid: {
          top: "10%",
          left: "12%",
          bottom: "10%",
          containLabel: true
        },
        xAxis: {
          show: false
        },
        yAxis: [
          {
            show: true,
            data: titlename,
            inverse: true,
            axisLine: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: "#fff",

              rich: {
                lg: {
                  backgroundColor: "#339911",
                  color: "#fff",
                  borderRadius: 15,
                  // padding: 5,
                  align: "center",
                  width: 15,
                  height: 15
                }
              }
            }
          },
          {
            show: true,
            inverse: true,
            data: valdata,
            axisLabel: {
              textStyle: {
                fontSize: 12,
                color: "#fff"
              }
            }
          }
        ],
        series: [
          {
            name: "条",
            type: "bar",
            data: [70, 34, 60, 78, 69],
            yAxisIndex: 0,
            itemStyle: {
              // 修改柱子圆角
              barBorderRadius: 20,
              //颜色
              color: function(params) {
                console.log(params);
                return myColor[params.dataIndex];
              }
            },
            //柱子之间的距离
            barCategoryGap: 50,
            //柱子宽度
            barWidth: 10,
            //
            label: {
              show: true,
              position: "inside",
              formatter: "{c}%"
            }
          },
          {
            name: "框",
            type: "bar",
            data: [100, 100, 100, 100, 100],
            yAxisIndex: 1,
            itemStyle: {
              // 修改柱子圆角
              //  barBorderRadius: 20
              color: "none",
              borderColor: "#00c1de",
              borderWidth: 3,
              barBorderRadius: 15
            },
            //柱子之间的距离
            barCategoryGap: 50,
            //柱子宽度
            barWidth: 15
          }
        ]
      };
      maps.setOption(option);
      window.addEventListener("resize", () => {
        // console.log(this)
        maps.resize();
      });
    }
  },
  mounted() {
    this.getBar();
  }
};
</script>
<style scoped lang="less">
</style>