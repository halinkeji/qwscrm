<template>
  <div class="col-auto  self-start q-mx-sm bg-grey-2">
    <q-card flat square>
      <q-card-section>
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-subtitle1 text-weight-bold">客户群数据</div>
          </div>

          <div class="col-auto">
            <q-btn
              dense
              color="primary"
              icon="las la-sync"
              @click="refreshData"
            />
            <q-btn flat :label="`最后一次同步时间：${syncDate}`" />
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <div class="row">
        <div class="col-2 q-pa-sm text-center q-pt-md">
          <q-card class="my-card">
            <q-card-actions vertical align="center">
              <div class="text-h3">{{ headerCount.group_chat_count }}</div>
            </q-card-actions>
            <q-card-section class="bg-primary text-white">
              <div class="text-subtitle1 text-center">客户群聊总数</div>
            </q-card-section>
          </q-card>
          <q-separator vertical inset />
        </div>
        <div class="col-2 q-pa-sm text-center q-pt-md">
          <q-card class="my-card">
            <q-card-actions vertical align="center">
              <div class="text-h3">{{ headerCount.group_chat_member_count }}</div>
            </q-card-actions>
            <q-card-section class="bg-primary text-white">
              <div class="text-subtitle1 text-center">客户群成员总人数</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-card>
    <base-line /> 
    <q-card flat square class="q-mt-sm">
      <q-card-section>
        <div class="text-subtitle1 text-weight-bold"><strong class="text-primary text-h6">TOP10</strong> 群客户量</div>
      </q-card-section>
      <q-separator />
    </q-card>
     <base-bar />
  </div>
</template>

<script>
import { date } from 'quasar'
import BaseLine from "../../echarts/BaseLine.vue";
import BaseBar from "../../echarts/BaseBar.vue";
import { QSpinnerGears } from 'quasar'
export default {
  name: "GroupChatAnalysis",
  components: {
    BaseLine,
    BaseBar,
  },
  data() {
    return {
      headerCount:{},
      syncDate:'',
    };
  },
  created() {
    this.headerData()
  },
  methods: {
    headerData(){
      this.$q.loading.show({
        spinner: QSpinnerGears,
        spinnerColor: 'orange',
        spinnerSize: 140,
      })
      let playload = {
        type: 'groupChat'
      }
      this.$store.dispatch("analysis/getHomeHeader",playload)
        .then(res => {
          if (res.code == 200) {
            this.headerCount = res.data
            //最后同步时间
            this.syncDate = this.viewDate(res.data.sync_date)
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
          this.$q.loading.hide()
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
    // 同步客户群统计分析
    refreshData(){
        this.$q.loading.show({
          spinner: QSpinnerGears,
          spinnerColor: 'orange',
          spinnerSize: 140,
        })
        let newDate  = new Date();
        let playload = {
          from: date.formatDate(date.subtractFromDate(newDate, { days:  30 }),'X'),
          to: date.formatDate(date.subtractFromDate(newDate, { days:  1 }),'X')
        }
        this.$store.dispatch("analysis/getGroupChatSync",playload)
          .then(res => {
            if (res.code == 200) {
              //最后同步时间
              this.syncDate = this.viewDate(res.data.sync_date)
              this.$q.notify({
                message: "成功",
                caption: "同步成功！",
                icon: "ion-checkmark-circle-outline",
                color: "green",
                timeout: 500,
                position: "top-right"
              });
            }
            else{
              this.$q.notify({
                message: "失败",
                caption: "同步失败！",
                icon: "ion-close-circle-outline",
                color: "red",
                timeout: 500,
                position: "top-right"
              });
            }
            this.$q.loading.hide()
          })
          .catch(error => {
            this.$q.notify({
                message: "失败",
                caption: "同步失败！",
                icon: "ion-close-circle-outline",
                color: "red",
                timeout: 500,
                position: "top-right"
              })
          })
    },
    // 显示日期格式
    viewDate (val){
     return val ? date.formatDate(val * 1000, 'YYYY-MM-DD  HH:mm:ss') : '暂无时间'
    },
  }
};
</script>
