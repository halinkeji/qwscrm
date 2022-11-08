<template>
  <q-card square class="no-shadow">
    <q-card-section
      :style="{
        height: $q.screen.height * 0.5 + 'px'
      }"
    >
      <div id="contactBarStackId" class="full-width full-height"></div>
    </q-card-section>
  </q-card>
</template>

<script>
import * as echarts from "echarts";
import "echarts/theme/macarons";
import { debounce } from "../../utils";
export default {
  props: ["sevenSummary"],
  data() {
    return {
      chart: null
    };
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    window.removeEventListener("resize", this.__resizeHandler);
    this.chart.dispose();
    this.chart = null;
  },
  mounted() {
    this.$nextTick(() => {
      this.drawPieChart();
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize();
        }
      }, 100);
      window.addEventListener("resize", this.__resizeHandler);
    });
  },
  watch: {
    sevenSummary() {
      this.drawPieChart();
    }
  },
  methods: {
    drawPieChart() {
      this.$store.dispatch("analysis/getContactTopAnalysis")
        .then(res => {
          if (res.code == 200 && res.data) {
            
            this.chart = echarts.init(
              document.getElementById("contactBarStackId"),
              "macarons"
            );

            this.chart.setOption({
              tooltip: {
                  trigger: 'axis',
                  backgroundColor: "white",
                  axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                      type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                  }
              },
              grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
              },
              xAxis: [
                  {
                      type: 'category',
                      data: res.data.name,
                      axisTick: {
                          alignWithLabel: true
                      }
                  }
              ],
              yAxis: [
                  {
                      type: 'value'
                  }
              ],
              series: [
                  {
                      name: '客户总人数（单位：人）',
                      type: 'bar',
                      barWidth: '50%',
                      data: res.data.count
                  }
              ]
            })
          }
          else{
            this.$q.notify({
              message: "失败",
              caption: "数据加载失败！",
              icon: "ion-close-circle-outline",
              color: "red",
              timeout: 500,
              position: "top-right"
            });
          }
          this.loadingVisible = false
        })
        .catch(error => {
          this.$q.notify({
              message: "失败",
              caption: "数据加载失败！",
              icon: "ion-close-circle-outline",
              color: "red",
              timeout: 500,
              position: "top-right"
            })
        })
    }
  }
};
</script>
