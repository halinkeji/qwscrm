<template>
<q-page>
  <q-card flat square class="q-mt-sm">
    <q-card-section>
      <div class="row justify-between">
        <div class="text-h6 col-md-2 col-lg-2 col-sm-3 col-xs-12 text-weight-bold">
          趋势图
        </div>
        <div class="col-md-10 col-lg-10 col-sm-9 col-xs-12 float-right">
          <div class="q-gutter-sm items-center row justify-end">
            <q-btn
              unelevated
              class="col-md-2 col-lg-1 col-sm-3 col-xs-12"
              :color="bodyData.search.diffDay == 3 ? 'primary' : 'grey' "
              label="近三天"
              @click="setDiffDay(3)"
              
            />
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
          { label: '新增客户群数量', value: 1 },
          { label: '截至当天客户群总数量', value: 2 },
          { label: '有发过消息的客户群数量', value: 3 },
          { label: '客户群新增群人数', value: 4 },
          { label: '截至当天客户群总人数', value: 5 },
          { label: '有发过消息的群成员数', value: 6 },
          { label: '截至当天客户群消息总数', value: 7 },
          { label: '截止当天退群数', value: 8 }
        ]"
      />
    </q-card-section>
    <q-card-section
        :style="{
          height: $q.screen.height * 0.55 + 'px'
        }"
      >
      <div id="groupChatLineStackId" class="full-width full-height"></div>
    </q-card-section>
  </q-card>

  <q-card flat square class="q-mt-sm">
    <q-card-section>
      <q-btn-toggle
        v-model="tableToggle"
        class="my-custom-toggle"
        no-caps
        rounded
        unelevated
        toggle-color="primary"
        color="white"
        @input="gettableToggleData"
        text-color="primary"
        :options="[
          {label: '按日期查看', value: 1},
          {label: '按群主查看', value: 2}
        ]"
      />
      
    </q-card-section>
    <q-separator />
    <div v-if="tableToggle == 1">
      <hl-table
            row-key="id"
            dense
            stickyHeader
            :data="date_dataList"
            :columns="date_columns"
            :loading="date_loading"
            separator="cell"
            flat
            bordered
            class="q-mt-none"
            style="height:300px"
          >
      </hl-table>
    </div>

    <div v-if="tableToggle == 2">
        <hl-table
          row-key="id"
          dense
          stickyHeader
          :data="owner_dataList"
          :columns="owner_columns"
          :loading="owner_loading"
          separator="cell"
          flat
          bordered
          class="q-mt-none"
          style="height:300px"
        >
         <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="id"  :props="props">
                {{ props.row.id }}
              </q-td>
              <q-td key="name"  :props="props">
                <q-chip>
                  <q-avatar>
                    <img :src="props.row.avatar">
                  </q-avatar>
                  {{ props.row.name }}
                </q-chip>
              </q-td>
              <q-td key="new_chat_cnt"  :props="props">
                {{ props.row.new_chat_cnt }}
              </q-td>
              <q-td key="chat_total"  :props="props">
                {{ props.row.chat_total }}
              </q-td>
              <q-td key="chat_has_msg"  :props="props">
                {{ props.row.chat_has_msg }}
              </q-td>
              <q-td key="new_member_cnt"  :props="props">
                {{ props.row.new_member_cnt }}
              </q-td>
              <q-td key="member_total"  :props="props">
                {{ props.row.member_total }}
              </q-td>
              <q-td key="member_has_msg"  :props="props">
                {{ props.row.member_has_msg }}
              </q-td>
              <q-td key="msg_total"  :props="props">
                {{ props.row.msg_total }}
              </q-td>
              <q-td key="quit_total"  :props="props">
                {{ props.row.quit_total }}
              </q-td>
            </q-tr>
          </template>
        </hl-table>
    </div>
   
  </q-card>
</q-page>
  
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
      bodyData:{
        analysis: [],
        series: [],
        search:{
          diffDay:3,
          startTime: "",
          endTime:"",
        }
      },
      date_dataList: [],
      date_loading: false,
      date_columns: [
        { name: "stat_time", label: "日期", field: "stat_time" },
        { name: "new_chat_cnt", label: "新增客户群数量", field: "new_chat_cnt" },
        { name: "chat_total", label: "截止当天客户群总数量", field: "chat_total" },
        { name: "chat_has_msg", label: "截至当天发过消息的客户群数量", field: "chat_has_msg" },
        { name: "new_member_cnt", label: "客户群新增群人数", field: "new_member_cnt" },
        { name: "member_total", label: "截至当天客户群总人数", field: "member_total" },
        { name: "member_has_msg", label: "截至当天有发过消息的群成员数", field: "member_has_msg" },
        { name: "msg_total", label: "截至当天客户群消息总数", field: "msg_total" },
        { name: "quit_total", label: "截止当天退群数", field: "quit_total" }
      ],
      tableToggle:1,
      owner_dataList: [],
      owner_loading: false,
      owner_columns: [
        { name: "id", label: "ID", field: "id" },
        { name: "name", label: "群主", field: "name" },     
        { name: "new_chat_cnt", label: "新增客户群数量", field: "new_chat_cnt" },
        { name: "chat_total", label: "截止当天客户群总数量", field: "chat_total" },
        { name: "chat_has_msg", label: "截至当天发过消息的客户群数量", field: "chat_has_msg" },
        { name: "new_member_cnt", label: "客户群新增群人数", field: "new_member_cnt" },
        { name: "member_total", label: "截至当天客户群总人数", field: "member_total" },
        { name: "member_has_msg", label: "截至当天有发过消息的群成员数", field: "member_has_msg" },
        { name: "msg_total", label: "截至当天客户群消息总数", field: "msg_total" },
        { name: "quit_total", label: "截止当天退群数", field: "quit_total" }
      ]
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
  created() {

  },
  mounted() {
    this.setDateArea(3)
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
          feature: {
              saveAsImage: {}
          }
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
      this.date_loading = true
      let payload = {
        startTime: this.bodyData.search.startTime,
        endTime: this.bodyData.search.endTime,
      };
      this.$store.dispatch("analysis/getGroupChatBody", payload)
        .then(res => {
          if (res.code == 200) {
            this.bodyData.analysis = res.data
            if(parseInt(this.tableToggle) == 1){
              this.date_dataList = res.data.result
            }
            this.chart = echarts.init(
              document.getElementById("groupChatLineStackId"),
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
                feature: {
                    saveAsImage: {}
                }
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
          this.date_loading = false
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
        this.tableToggle = 1
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
            return ['新增客户群数量']
            break;
        case 2:
            return ['截至当天客户群总数量']
            break;
        case 3:
            return ['截至当天发过消息的客户群数量']
            break;
        case 4:
            return ['客户群新增群人数']
            break;
        case 5:
            return ['截至当天客户群总人数']
            break;
        case 6:
            return ['截至当天有发过消息的群成员数']
            break;
        case 7:
            return ['截至当天客户群消息总数']
            break;
        case 8:
            return ['截止当天退群数']
            break;
      }
    },
    formatSeriesData(){
      let arr_legend = this.getLegend(this.secondModel)
      this.bodyData.series = []
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
          data: this.getArraySeriesData()
        }
        this.bodyData.series.push(obj_data)
      return this.bodyData.series
    },
    getArraySeriesData(val){
      let arr = this.bodyData.analysis.result
      switch(this.secondModel){
        case 1:
            return Array.from(arr,x=>x.new_chat_cnt)
            break;
        case 2:
            return Array.from(arr,x=>x.chat_total)
            break;
        case 3:
            return Array.from(arr,x=>x.chat_has_msg)
            break;
        case 4:
            return Array.from(arr,x=>x.new_member_cnt)
            break;
        case 5:
            return Array.from(arr,x=>x.member_total)
            break;
        case 6:
            return Array.from(arr,x=>x.member_has_msg)
            break;
        case 7:
            return Array.from(arr,x=>x.msg_total)
            break;
        case 8:
            return Array.from(arr,x=>x.quit_total)
            break;
      }
    },
    gettableToggleData(){
      if(parseInt(this.tableToggle) == 1){
        this.getBodyData()
      }
      if(parseInt(this.tableToggle) == 2){
        this.getOwnerBodyData()
      }
    },
    getOwnerBodyData(){
      this.owner_loading = true
      let payload = {
        startTime: this.bodyData.search.startTime,
        endTime: this.bodyData.search.endTime,
      };
      this.$store.dispatch("analysis/getOwnerGroupChatBody", payload)
        .then(res => {
          if (res.code == 200 && res.data) {
            this.owner_dataList = res.data.result
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
          this.owner_loading = false
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
  }
};
</script>

<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #e2e2e2
  border-radius:0px
</style>
