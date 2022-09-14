<template>
  <q-dialog v-model="logDialogStatus" persistent>
    <q-card view="Lhh lpR fff" container class="bg-white">
      <div class="row q-pa-sm items-center bg-white text-dark">
        <div class="text-subtitle">事件跟进</div>
        <q-space />
        <q-btn dense @click="closeDialog" flat icon="close" />
      </div>

      <q-card-section>
        <q-form ref="followEventForm" class="row">
          <div class="col-12 q-px-xs">
            <q-input outlined v-model="followWorkerForm.content" type="textarea" dense label="跟进内容" :rules="[(val) => !!val || '请输入内容']" />
          </div>
          <q-card flat bordered class="col-12 q-mb-sm">
            <q-card-section class="text-subtitle2">
              上传图片
            </q-card-section>
            <q-separator />
            <div class="col-12 row q-pa-xs">
              <div class="col-3 q-pa-xs" v-for="(file, key) in followImage">
                <q-img :src="file.url" width="80px" height="80px" :ratio="1">
                  <q-icon
                    class="absolute-top-right text-weight-bolder cursor-pointer"
                    @click="deleteImgFile(key)"
                    color="red"
                    size="sm"
                    name="delete_forever"
                  >
                  </q-icon>
                </q-img>
              </div>
              <div class="col-3 q-pa-xs">
                <q-img width="80px" @click="clickImage" height="80px" class="cursor-pointer bg-grey-2" :ratio="1">
                  <div class="absolute-full text-subtitle2 flex flex-center">
                    <q-tooltip>
                      上传图片
                    </q-tooltip>
                    <q-icon color="white" size="sm" name="wallpaper"> </q-icon>
                  </div>
                </q-img>
              </div>
            </div>
          </q-card>

          <hl-file-upload
            :contactId="followWorkerForm.contact_id"
            cardTitle="上传附件"
            :multiple="true"
            :valuePath="followFile"
            @filePath="getUploadData"
            @deleteFile="getUploadData"
          ></hl-file-upload>
        </q-form>
      </q-card-section>

      <q-toolbar class="justify-center">
        <q-btn unelevated rounded color="primary" @click="saveLog" label="保存" class="q-px-xl full-width" />
      </q-toolbar>
      <upload-img v-if="uploadImgStatus" @imageData="getImageData" :multiple="true" @closeUpload="closeUpload"></upload-img>
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
      followImage: [],
      uploadImgStatus: false
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
          if (this.followImage && this.followImage.length > 0) {
            this.followWorkerForm.file_attach.image = this.followImage
          }

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
    getImageData (info) {
      this.uploadImgStatus = false
      if (info && info.length > 0) {
        info.forEach((val, key) => {
          this.followImage.push({
            url: val.base_url
          })
        })
      }
    },
    deleteImgFile (key) {
      this.followImage.splice(key, 1)
    },
    clickImage () {
      this.$nextTick(() => {
        this.uploadImgStatus = true
      })
    },
    closeUpload () {
      this.uploadImgStatus = false
    }
  }
}
</script>
