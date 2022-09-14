<template>
  <q-dialog v-model="logDialogStatus">
    <q-card class="full-width">
      <div class="row q-pa-sm items-center bg-white text-dark">
        <div class="text-subtitle">应用授权</div>
        <q-space />
        <q-btn dense @click="closeDialog" flat icon="close" />
      </div>

      <q-form ref="applyAuthorizeForm" class="row">
        <q-card flat bordered class="col-12 q-mb-md q-pa-sm">
          <q-select
            dense
            map-options
            outlined
            option-label="label"
            option-value="id"
            emit-value
            label="授权应用"
            v-model="clients_apply_id"
            :options="applyDataList"
            @input="changeClient"
            :rules="[(val) => !!val || '请选择授权应用']"
          />
          <q-separator v-if="currenApplyInfo.id" />
          <div v-if="currenApplyInfo.id">
            <q-item>
              <q-item-section avatar> 安装时间 ：</q-item-section>
              <q-item-section class="q-pa-none">
                {{ formatDate(currenApplyInfo.install_at) }}
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar> 授权起始时间 ：</q-item-section>
              <q-item-section class="q-pa-none">
                {{ formatDate(currenApplyInfo.start_at) }}
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar> 授权结束时间 ：</q-item-section>
              <q-item-section class="q-pa-none">
                {{ formatDate(currenApplyInfo.end_at) }}
              </q-item-section>
            </q-item>
          </div>
        </q-card>

        <div class="col-12 q-px-xs">
          <q-select
            dense
            map-options
            outlined
            option-label="label"
            option-value="value"
            emit-value
            label="授权类型"
            v-model="status"
            :options="siteStatusArr"
          />
        </div>
      </q-form>
      <q-card-actions>
        <q-btn unelevated rounded color="primary" @click="saveLog" label="保存" class="q-px-xl full-width" />
      </q-card-actions>
    </q-card>
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

      date: null,
      status: '',
      siteStatusArr: this.$store.state.siteManage.siteStatusArr,
      applyDataList: [],
      currenApplyInfo: {},
      clients_apply_id: ''
    }
  },
  computed: {},
  mounted () {},
  created () {},
  methods: {
    init (client_id) {
      this.logDialogStatus = true
      this.getApplyList(client_id)
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

    getApplyList (client_id) {
      this.$store
        .dispatch('serviceLog/getAllApply', {
          client_id
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
      if (that.clients_apply_id) {
        const findIndex = _.findIndex(that.applyDataList, function (o) {
          return parseInt(o.id) == parseInt(that.clients_apply_id)
        })

        if (findIndex > -1) {
          that.currenApplyInfo = that.applyDataList[findIndex]
        }
      }
    },

    saveLog () {
      this.$refs.applyAuthorizeForm.validate().then((success) => {
        if (success) {
          const obj = {
            clients_apply_id: this.clients_apply_id,
            status: this.status
          }
          this.$store.dispatch('siteManage/setApplyData', obj)
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
