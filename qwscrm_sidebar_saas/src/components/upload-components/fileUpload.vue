<template>
  <div class="full-height full-width">
    <q-uploader
      ref="qUploadedImgRef"
      color="white"
      text-color="black"
      style="width: 100%"
      class="full-height"
      flat
      bordered
       accept=".docx,.xlsx,.pptx,.doc,.xls,.ppt,.pdf,.txt"
      :field-name="'file'"
      :multiple="multiple"
      :factory="factoryFn"
    >
      <template v-slot:header="scope">
        <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
          <div class="q-uploader__title">{{ cardTitle }}</div>
          <div class="q-uploader__subtitle">
            {{ scope.uploadSizeLabel }}
          </div>
          <q-space />
          <q-btn v-if="scope.canAddFiles" label="选择" type="a" icon="add_box" unelevated color="primary">
            <q-uploader-add-trigger />
          </q-btn>

          <q-btn v-if="scope.canUpload" icon="cloud_upload" label="上传" @click="scope.upload" unelevated color="primary"> </q-btn>
        </div>
      </template>

      <template v-slot:list="scope">
        <q-list separator>
          <q-item v-for="file in scope.files" :key="file.__key">
            <q-item-section>
              <q-item-label class="full-width ellipsis">
                {{ file.name }}
              </q-item-label>

              <q-item-label caption> Status: {{ file.__status }} </q-item-label>

              <q-item-label caption> {{ file.__sizeLabel }} / {{ file.__progressLabel }} </q-item-label>
            </q-item-section>

            <q-item-section v-if="file.__img" thumbnail class="gt-xs">
              <img :src="file.__img.src" />
            </q-item-section>

            <q-item-section top side>
              <q-btn  color="negative" flat dense round icon="delete" @click="scope.removeFile(file)" />
            </q-item-section>
          </q-item>

          <q-item v-for="(file,key) in uploadFileData" :key="file.__key">
            <q-item-section>
              <q-item-label class="full-width ellipsis">
                {{ file.name }}
              </q-item-label>
              <!-- <q-item-label caption class="full-width ellipsis"> 路径： {{ file.path }} </q-item-label> -->
            </q-item-section>

            <q-item-section side>
              <q-btn color="negative" flat dense round icon="delete_forever" @click="deleteFile(key)" />
            </q-item-section>
          </q-item>
        </q-list>
      </template>
    </q-uploader>
  </div>
</template>
<script>
export default {
  props: ['contactId', 'cardTitle', 'valuePath', 'multiple'],
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      uploadFileData: []
    }
  },
  created () {},
  mounted () {},
  watch: {
    valuePath (v) {
      if (v) {
        this.uploadFileData = v
      }
    }
  },
  methods: {

    factoryFn (file) {
      const that = this

      const formData = new FormData()
      formData.append('file', file[0])
      formData.append('contact_id', that.contactId)
      this.$store
        .dispatch('upload/files', formData)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '上传文件成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })
            this.$emit('filePath', res.data)

            setTimeout(() => {
              this.$refs.qUploadedImgRef.reset()
            }, 1000)
          } else {
            this.$q.notify({
              message: '失败',
              caption: '上传文件失败，上传列表清空，请重新上传',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
            setTimeout(() => {
              this.$refs.qUploadedImgRef.reset()
            }, 1000)
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
          setTimeout(() => {
            this.$refs.qUploadedImgRef.reset()
          }, 1000)
        })
    },
    deleteFile (key) {
      this.uploadFileData.splice(key, 1)
      this.$emit('imageInfo', this.uploadFileData)
    },
    setUploadFileData (files) {
      console.log('files', files)
      this.uploadFileData = files
    }
  }
}
</script>
