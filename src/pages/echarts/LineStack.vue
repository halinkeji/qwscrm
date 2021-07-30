<template>
  <q-card>
    <q-card-section>
      <div class="row justify-between">
        <div class="text-h6 col-md-2 col-lg-2 col-sm-3 col-xs-12 text-weight-bold">
          企业数据汇总分析
        </div>

        <div class="col-md-10 col-lg-10 col-sm-9 col-xs-12 float-right	">
          <div class="q-gutter-sm items-center row justify-end">
            <q-btn
              unelevated
              class="col-md-2 col-lg-1 col-sm-3 col-xs-12"
              :color="bodyData.search.diffDay == 7 ? 'primary' : 'grey' "
              label="近一周"
              @click="setDiffDay(7)"
              
            />
            <q-btn
              unelevated
              class="col-md-2 col-lg-1 col-sm-3 col-xs-12"
              :color="bodyData.search.diffDay == 30 ? 'primary' : 'grey' "
              label="近一月"
              @click="setDiffDay(30)"
            />
            <q-btn
              unelevated
              class="col-md-2 col-lg-1 col-sm-3 col-xs-12"
              :color="bodyData.search.diffDay == 90 ? 'primary' : 'grey' "
              label="近三月"
              @click="setDiffDay(90)"
            />
            <div class="col-md-1 col-lg-1 col-sm-6 col-xs-12 text-center">
              按日期
            </div>

            <q-input
              color="grey-3"
              class="col-md-2 col-lg-2 col-sm-5 col-xs-12"
              dense
              label-color="grey"
              outlined
              v-model="bodyData.search.startTime"
              label="开始时间"
              readonly
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date :options="optionsStartDate"  mask="YYYY-MM-DD" v-model="bodyData.search.startTime">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="确定"
                          color="primary"
                          flat
                          @click="getBodyData"
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <q-input
              color="grey-3"
              class="col-md-2 col-lg-2 col-sm-5 col-xs-12"
              label-color="grey"
              dense
              outlined
              v-model="bodyData.search.endTime"
              label="结束时间"
              readonly
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date  :options="optionsEndDate" mask="YYYY-MM-DD" v-model="bodyData.search.endTime">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="确定"
                          color="primary"
                          flat
                           @click="getBodyData"
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-btn-toggle
        v-model="secondModel"
        @input = "drawPieChart"
        spread
        class="my-custom-toggle"
        no-caps
        unelevated
        toggle-color="primary"
        toggle-text-color="white"
        color="white"
        text-color="grey-9"
        :options="[
          { label: '客户分析', value: 1 },
          { label: '聊天总数', value: 2 },
          { label: '发送消息数', value: 3 },
          { label: '已回复聊天平均占比', value: 4 },
          { label: '平均首次回复时长', value: 5 }
        ]"
      />
    </q-card-section>

    <q-card-section
      :style="{
        height: $q.screen.height * 0.58 + 'px'
      }"
    >
      <div id="homeLineStackId" class="full-width full-height"></div>
    </q-card-section>
    <q-inner-loading :showing="loadingVisible">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-card>
</template>

<script>
import { date } from 'quasar'
import * as echarts from "echarts";
import "echarts/theme/macarons";
import { debounce } from "../../utils";
export default {
  props: ["sevenSummary"],
  data() {
    return {
      chart: null,
      secondModel: 1,
      loadingVisible: false,
      bodyData:{
        analysis: [],
        series: [],
        search:{
          diffDay:7,
          startTime: "",
          endTime:"",
        }
      }
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
    this.setDateArea(7)
    this.$nextTick(() => {
      this.getBodyData();
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
      this.getBodyData()
    }
  },
  methods: {
    drawPieChart() {
      let xAxisData = this.bodyData.analysis.xAxisData
 
      this.chart.clear()
      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          type: "cross",
          backgroundColor: "white"
        },
        legend: {
          data: this.getLegend(this.secondModel)
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          // feature: {
          //     saveAsImage: {}
          // }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xAxisData
        },
        yAxis: {
          type: "value"
        },
        series: this.formatSeriesData()
      })
      
    },
    getBodyData(){
      this.loadingVisible = true
      let payload = {
        startTime: this.bodyData.search.startTime,
        endTime: this.bodyData.search.endTime,
      };
      this.$store.dispatch("analysis/getHomeBody", payload)
        .then(res => {
          if (res.code == 200) {
            this.bodyData.analysis = res.data
            this.chart = echarts.init(
              document.getElementById("homeLineStackId"),
              "macarons"
            )
            this.chart.setOption({
              tooltip: {
                trigger: "axis",
                type: "cross",
                backgroundColor: "white"
              },
              legend: {
                data: this.getLegend(this.secondModel)
              },
              grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true
              },
              toolbox: {
                // feature: {
                //     saveAsImage: {}
                // }
              },
              xAxis: {
                type: "category",
                boundaryGap: false,
                data: res.data.xAxisData
              },
              yAxis: {
                type: "value"
              },
              series: this.formatSeriesData()
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
    },
    setDiffDay(val){
      if(val){
        this.bodyData.search.diffDay = val
        this.setDateArea(val)
        this.getBodyData()
      }
    },
    setDateArea(val){
      let newDate = new Date()
      if(val){
        this.bodyData.search.startTime = date.formatDate(date.subtractFromDate(newDate, { days: val  }), 'YYYY-MM-DD')
      }
      this.bodyData.search.endTime = date.formatDate(date.subtractFromDate(newDate, { days: 1 }), 'YYYY-MM-DD')
    },
    optionsStartDate (now_date) {
      let newDate = new Date()
      return  now_date <= date.formatDate(date.subtractFromDate(newDate, { days:  2 }), 'YYYY/MM/DD')
    },
    optionsEndDate (now_date) {
      let newDate = new Date()
      return  now_date <= date.formatDate(date.subtractFromDate(newDate, { days:  1 }), 'YYYY/MM/DD') && now_date > date.formatDate(this.bodyData.search.startTime, 'YYYY/MM/DD')
    },
    getLegend(val){
      switch(parseInt(val)){
        case 1:
            return ['新增客户数','企业员工发起好友申请数','被客户删除拉黑数']
            break;
        case 2:
            return ['聊天总数']
            break;
        case 3:
            return ['发送消息数']
            break;
        case 4:
            return ['已回复聊天平均占比']
            break;
        case 5:
            return ['平均首次回复时长']
            break;
      }
    },
    formatSeriesData(){
      var that = this
      
      let arr_legend = that.getLegend(that.secondModel)
      if(that.secondModel == 1){
        that.bodyData.series = []
        _.forEach(arr_legend, function (value, key) {
          let obj_data = {
            name: arr_legend[key],
            type: "line",
            stack: "总数",
            lineStyle: {
              width: 5,
              shadowColor: "rgba(0,0,0,0.3)",
              shadowBlur: 10,
              shadowOffsetY: 8
            },
            data: that.getArraySeriesData(key)
          }
          that.bodyData.series.push(obj_data)
        })
        return that.bodyData.series
      }
      if(that.secondModel > 1){ 
        that.bodyData.series = []
        let obj_data = {
            name: arr_legend[0],
            type: "line",
            stack: "总数",
            lineStyle: {
              width: 5,
              shadowColor: "rgba(0,0,0,0.3)",
              shadowBlur: 10,
              shadowOffsetY: 8
            },
            data: that.getArraySeriesData()
          }
          that.bodyData.series.push(obj_data)
        return that.bodyData.series
      }
      
    },
    getArraySeriesData(val){
      
      let arr = this.bodyData.analysis.result
      if(this.secondModel == 1){
        switch(parseInt(val)){
          case 0:
              return Array.from(arr,x=>x.new_contact_cnt)
              break;
          case 1:
              return Array.from(arr,x=>x.new_apply_cnt)
              break;
          case 2:
              return Array.from(arr,x=>x.negative_feedback_cnt)
              break;
        }
      }
      if(this.secondModel == 2){
        return Array.from(arr,x=>x.chat_cnt)
      }
      if(this.secondModel == 3){
        return Array.from(arr,x=>x.message_cnt)
      }
      if(this.secondModel == 4){
        return Array.from(arr,x=>x.reply_percentage)
      }
      if(this.secondModel == 5){
        return Array.from(arr,x=>x.avg_reply_time)
      }
    },
  }
};
</script>

<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #e2e2e2
  border-radius:0px
</style>
