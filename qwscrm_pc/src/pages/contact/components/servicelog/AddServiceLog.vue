<template>
  <q-dialog v-model="logDialogStatus"  persistent>
    <q-layout view="Lhh lpR fff" container class="bg-white">
      <q-header class="row q-pa-sm items-center bg-white text-dark">
        <div class="text-subtitle">新增售后日志</div>
        <q-space />
        <q-btn dense @click="closeDialog" flat icon="close" />
      </q-header>
       <q-page-container>
      <q-page class="q-pa-sm">
        <q-form ref="logFormRef" class="row">
          <q-card flat bordered class="col-12 q-mb-md">
            <q-card-section>
                <div class="col-12 q-px-xs">
                  <q-select
                    dense
                    map-options
                    outlined
                    option-label="client_name"
                    option-value="client_id"
                    emit-value
                    label="选择站点"
                    v-model="siteClientId"
                    :options="siteInfoList"
                   @input="getApplyList"
                    :rules="[(val) => !!val || '请选择授权应用']"
                  />
                </div>
                <div class="col-12 q-px-xs">
                  <q-select
                    dense
                    map-options
                    outlined
                    option-label="label"
                    option-value="id"
                    emit-value
                    label="授权应用"
                    v-model="logForm.clients_apply_id"
                    :options="applyDataList"
                    @input="changeClient"
                    :rules="[(val) => !!val || '请选择授权应用']"
                  />
                </div>
            </q-card-section>
            <q-separator />
            <div v-if="currenApplyInfo.id">
              <q-item>
                <q-item-section avatar> 安装时间 ：</q-item-section>
                <q-item-section>
                  {{ formatDate(currenApplyInfo.install_at) }}
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar> 授权起始时间 ：</q-item-section>
                <q-item-section>
                  {{ formatDate(currenApplyInfo.start_at) }}
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar> 授权结束时间 ：</q-item-section>
                <q-item-section>
                  {{ formatDate(currenApplyInfo.end_at) }}
                </q-item-section>
              </q-item>
            </div>
          </q-card>

          <div class="col-12 q-px-xs">
            <q-input outlined v-model="logForm.title" dense label="日志标题" :rules="[(val) => !!val || '请输入日志标题']" />
          </div>
          <div class="col-12 q-px-xs">
            <q-select
              dense
              map-options
              outlined
              option-label="label"
              option-value="value"
              emit-value
              label="日志类型"
              v-model="logForm.type"
              :options="logTypeData"
              :rules="[(val) => !!val || '请选择日志类型']"
            />
          </div>
         <div class="col-12 q-px-xs" v-if="[2, 3,6].indexOf(parseInt(logForm.type)) > -1">
              <q-input outlined v-model="logForm.end_time" label="延期日期" dense readonly :rules="[(val) => !!val || '请填写到期时间']">
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-date v-model="logForm.end_time" mask="YYYY-MM-DD HH:mm" today-btn minimal>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="确定" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
                <template v-slot:append>
                <q-icon color="grey"  name="cancel"></q-icon>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="logForm.end_time" mask="YYYY-MM-DD HH:mm" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
              </q-input>

              <q-input
                outlined
                v-if="!currenApplyInfo.start_at"
                v-model="logForm.start_time"
                label="授权起始时间"
                dense
                readonly
                :rules="[(val) => !!val || '请选择授权起始时间']"
              >
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-date v-model="logForm.start_time" mask="YYYY-MM-DD HH:mm" today-btn minimal>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="确定" color="primary" flat />
            </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
                <template v-slot:append>
                  <q-icon color="grey" name="cancel"></q-icon>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-time v-model="logForm.start_time" mask="YYYY-MM-DD HH:mm" format24h>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="确定" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          <div class="col-12 q-px-xs">
            <q-input v-model="logForm.content" outlined :rows="10" label="日志内容" type="textarea" />
          </div>
        </q-form>
      </q-page>
       </q-page-container>

      <q-footer class="bg-white">
        <q-toolbar class="justify-center">
          <q-btn unelevated rounded color="primary" @click="saveLog" label="保存" class="q-px-xl" />
        </q-toolbar>
      </q-footer>
    </q-layout>
  </q-dialog>
</template>

<script>
import { date } from 'quasar'
export default {
  name: 'AddServiceLog',
  components: {},
  data () {
    return {
      logDialogStatus: false,

      options: [
        {
          label: '常规售后',
          value: '1'
        },
        {
          label: '开户授权',
          value: '6'
        },
        {
          label: '停用授权',
          value: '7'
        },
        {
          label: '续费延期',
          value: '2'
        },
        {
          label: '赠送延期',
          value: '3'
        },
        {
          label: '功能开发',
          value: '4'
        },
        {
          label: '其他事务',
          value: '5'
        }
      ],
      optionsObject: {
        1: '常规售后',
        2: '续费延期',
        3: '赠送延期',
        4: '功能开发',
        5: '其他事务'
      },
      date: null,
      logForm: {
        content: '',
        title: '',
        type: '1',
        clients_apply_id: '',
        end_time: date.formatDate(new Date(), 'YYYY-MM-DD  HH:mm:ss'),
        start_time: ''
      },
      siteClientId: '',
      logTypeData: this.$store.state.serviceLog.logTypeArr,
      applyDataList: [],
      currenApplyInfo: {},
      siteInfoList: []
    }
  },
  computed: {},
  mounted () {},
  created () {},
  methods: {
    init () {
      this.logDialogStatus = true
      this.getData()
    },
    getData () {
      this.applyDataList = []
      this.$store
        .dispatch('siteManage/getData', { user_id: this.$store.state.oauth.qwUserInfo.relationUser.relation_user_id })
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.siteInfoList = res.data
          }
        })
        .catch((error) => {})
    },
    formatDate (val) {
      if (val) {
        return date.formatDate(val * 1000, 'YYYY年MM月DD日 HH:mm:ss')
      }
      return '未授权'
    },

    closeDialog () {
      this.logDialogStatus = false
      this.$emit('closeDialog')
    },

    getApplyList () {
      this.$store
        .dispatch('serviceLog/getAllApply', {
          client_id: this.siteClientId
        })
        .then((res) => {
          if (res.code == 200) {
            this.applyDataList = res.data ? res.data : []
          }
        })
        .catch((error) => {})
    },

    changeClient () {
      const that = this
      if (that.logForm.clients_apply_id) {
        const findIndex = _.findIndex(that.applyDataList, function (o) {
          return parseInt(o.id) == parseInt(that.logForm.clients_apply_id)
        })

        if (findIndex > -1) {
          that.currenApplyInfo = that.applyDataList[findIndex]
        }
      }
    },

    saveLog () {
      this.$refs.logFormRef.validate().then((success) => {
        if (success) {
          const obj = {
            ...this.logForm
          }
          this.$store
            .dispatch('serviceLog/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '保存成功！',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })

                this.closeDialog()
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'red'
                })
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'red'
              })
            })
        }
      })
    }
  }
}
</script>
