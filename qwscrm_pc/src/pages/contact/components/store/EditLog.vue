<template>
  <q-dialog v-model="editStatus"  persistent>
    <q-card
      :style="{
        'min-width': $q.screen.width * 0.5 + 'px',
      }"
      class="fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-py-sm text-center">
          <q-bar class="bg-white">
            <q-icon name="las la-edit" />
            <div>操作</div>

            <q-space />

            <q-btn dense @click="closeDialog" flat icon="close" />
          </q-bar>
        </div>
        <div class="col-shrink full-height q-pa-sm q-mb-sm">
          <q-form ref="formRef" class="row">
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
            <div class="col-12 row q-col-gutter-sm">
              <div class="col-4"  v-if="[2, 3, 6, 7].indexOf(parseInt(logForm.type)) > -1">
                <q-input outlined v-model="logForm.endTime" label="延期日期" dense readonly :rules="[(val) => !!val || '请填写到期时间']">
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy transition-show="scale" transition-hide="scale">
                        <q-date v-model="logForm.endTime" today-btn minimal>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="确定" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-4"  v-if="[2, 3, 6, 7].indexOf(parseInt(logForm.type)) > -1 && limitAddStore.indexOf(setConfig.currentApplyId) > -1">
                <q-input outlined v-model="logForm.son_num" label="可创建门店数" hint="无更改可不进行填写" dense> </q-input>
              </div>
              <div class="col-4"  v-if="[2, 3, 6, 7].indexOf(parseInt(logForm.type)) > -1">
                <q-input outlined v-model="logForm.account_num" label="可创建操作员数" hint="无更改可不进行填写" dense> </q-input>
              </div>
            </div>

            <div class="col-12 q-px-xs full-height">
              <q-input outlined v-model="logForm.content" type="textarea" dense label="日志内容" :rules="[(val) => !!val || '请输入日志内容']" />
            </div>
          </q-form>
        </div>

        <div class="col-shrink bg-white q-pb-md text-center">
          <q-toolbar class="justify-center">
          <q-btn unelevated rounded color="primary" @click="saveLog" label="保存" class="q-px-xl" />
        </q-toolbar>

        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
import { date } from 'quasar'
export default {
  components: {},
  data () {
    return {
      editStatus: false,
      setConfig: '',
      logForm: {
        content: '',
        title: '',
        type: '1',
        clients_apply_id: '',
        endTime: date.formatDate(new Date(), 'YYYY-MM-DD  HH:mm:ss'),
        son_num: '',
        account_num: ''
      },
      logTypeData: this.$store.state.storeManage.logTypeArr,
      limitAddStore: ['chainstore', 'lschainstore', 'myouka', 'mychainstore', 'cychainstore', 'fzchainstore']
    }
  },

  mounted () {},
  created () {},
  computed: {},
  methods: {
    init (setConfig) {
      this.editStatus = true
      this.setConfig = setConfig
    },

    saveLog () {
      this.$refs.formRef.validate().then((success) => {
        if (success) {
          this.$store
            .dispatch('storeManage/setLogListData', {
              ...this.logForm,
              ...this.setConfig
            })
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '保存备注成功',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.closeDialog()
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                icon: 'ion-close-circle-outline',
                color: 'red',
                timeout: 500,
                position: 'top-right'
              })
            })
        }
      })
    },
    closeDialog () {
      this.editStatus = false
      this.$emit('closeDialog')
    }
  }
}
</script>
