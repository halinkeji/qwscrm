<template>
  <q-dialog v-model="logDialogStatus" persistent maximized>
    <q-layout view="Lhh lpR fff" container class="bg-white">
      <q-header class="row q-pa-sm items-center bg-white text-dark">
        <div class="text-subtitle">事件跟进</div>
        <q-space />
        <q-btn dense @click="closeDialog" flat icon="close" />
      </q-header>
      <q-page-container>
        <q-page class="q-pa-sm">
          <q-form ref="followEventForm" class="row">
            <div class="col-12 q-px-xs">
              <q-input outlined v-model="followWorkerForm.content" type="textarea" dense label="跟进内容" :rules="[(val) => !!val || '请输入内容']" />
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
              :contactId="followWorkerForm.contact_id"
              cardTitle="上传附件"
              :multiple="true"
              :valuePath="followFile"
              @filePath="getUploadData"
              @deleteFile="getUploadData"
            ></hl-file-upload>
          </q-form>
        </q-page>
      </q-page-container>
      <q-footer class="bg-white">
        <q-toolbar class="justify-center">
          <q-btn unelevated rounded color="primary" @click="saveLog" label="保存" class="q-px-xl full-width" />
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

      currenApplyInfo: {},
      followWorkerForm: {
        content: '',
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
      this.followWorkerForm.contact_follow_id = eventId
      this.followWorkerForm.contact_id = contact_id
    },
    // getEventInfo () {
    //   this.$store
    //     .dispatch('eventManage/getItem', this.eventId)
    //     .then((res) => {
    //       if (res.code == 200 && res.data) {
    //         this.followWorkerForm = res.data
    //       }
    //     })
    //     .catch((error) => {})
    // },

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
            ...this.followWorkerForm
          }
          this.$store
            .dispatch('eventManage/setWorkerData', obj)
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
      if (this.followWorkerForm.file_attach.file) {
        this.followFile.push(e)
        this.followWorkerForm.file_attach.file.push(e)
      }
    },
    getImageInfoLoop (info) {
      if (info) {
        this.followWorkerForm.file_attach.image = []
        info.forEach((val, key) => {
          this.followWorkerForm.file_attach.image.push({
            url: val.url
          })
        })
      } else {
        this.followWorkerForm.file_attach.image = []
      }
    }
  }
}
</script>
