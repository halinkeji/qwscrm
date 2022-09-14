<template>
  <q-dialog v-model="logDialogStatus" maximized persistent>
    <q-layout view="Lhh lpR fff" container class="bg-white">
      <q-header class="row q-pa-sm items-center bg-white text-dark">
        <div class="text-subtitle">跟进事件</div>
        <q-space />
        <q-btn dense @click="closeDialog" flat icon="close" />
      </q-header>
      <q-page-container>
        <q-page class="q-pa-sm">
          <q-form ref="followEventForm" class="row">
            <div class="col-12 q-px-xs">
              <q-input outlined v-model="followForm.order" dense label="排序" :rules="[(val) => !!val || '请输入排序']" />
            </div>
            <div class="col-12 q-px-xs">
              <q-input outlined v-model="followForm.name" dense label="事件名称" :rules="[(val) => !!val || '请输入事件名称']" />
            </div>
            <div class="col-12 q-px-xs">
              <q-select
                dense
                map-options
                outlined
                option-label="label"
                option-value="value"
                emit-value
                label="权重"
                v-model="followForm.level"
                :options="eventLevelArr"
                bottom-slots
              />
            </div>

            <div class="col-12 q-px-xs" v-if="!eventId">
              <q-select
                dense
                map-options
                outlined
                option-label="label"
                option-value="value"
                bottom-slots
                emit-value
                label="状态"
                v-model="followForm.status"
                :options="eventStatusArr"
              />
            </div>

            <div class="col-12 q-px-xs">
              <q-input
                outlined
                v-model="followForm.description"
                type="textarea"
                dense
                label="事件说明"
                :rules="[(val) => !!val || '请输入事件说明']"
              />
            </div>
            <hl-upload-image
              :limitNumber="10"
              :multiple="true"
              @imageInfo="getImageInfoLoop"
              :emptyImage="false"
              :deleteImg="true"
              :imageData="followImage"
            />
            <hl-file-upload
              :contactId="followForm.contact_id"
              cardTitle="上传附件"
              :valuePath="followForm.file_attach.file"
              :multiple="true"
              @filePath="getUploadData"
              @deleteFile="getUploadData"
            ></hl-file-upload>
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
      eventStatusArr: this.$store.state.eventManage.eventStatusArr,
      eventLevelArr: this.$store.state.eventManage.eventLevelArr,
      applyDataList: [],
      currenApplyInfo: {},
      followForm: {
        contact_id: '',
        order: '0',
        name: '',
        description: '',
        status: '',
        level: '0',
        file_attach: {
          image: [],
          file: []
        }
      },
      eventId: '',
      followFile: [],
      followImage: []
    }
  },
  computed: {},
  mounted () {},
  created () {},
  methods: {
    init (eventId, contact_id) {
      this.logDialogStatus = true
      this.followForm.contact_id = contact_id

      if (eventId > 0) {
        this.eventId = eventId
        this.getEventInfo()
      }
    },
    getEventInfo () {
      this.$store
        .dispatch('eventManage/getItem', this.eventId)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.followForm = res.data
            if (this.followForm && this.followForm.file_attach) {
              const file_attach = JSON.parse(this.followForm.file_attach)
              this.followFile = file_attach.file

              this.followImage = file_attach.image

              this.followForm.file_attach = file_attach
            } else {
              this.followForm.file_attach = {
                image: [],
                file: []
              }
            }
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

    saveLog () {
      this.$refs.followEventForm.validate().then((success) => {
        if (success) {
          const obj = {
            ...this.followForm
          }
          this.$store
            .dispatch('eventManage/setData', obj)
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
    },
    getUploadData (e) {
      if (this.followForm.file_attach.file) {
        this.followForm.file_attach.file.push(e)
      }
    },
    getImageInfoLoop (info) {
      if (info) {
        this.followForm.file_attach.image = []
        info.forEach((val, key) => {
          this.followForm.file_attach.image.push({
            url: val.url
          })
        })
      } else {
        this.followForm.file_attach.image = []
      }
    }
  }
}
</script>
