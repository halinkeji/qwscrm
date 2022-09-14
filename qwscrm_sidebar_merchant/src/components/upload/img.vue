<template>
  <div class="q-pa-sm">
    <div class="row">
      <div class="col-3 q-pa-xs" v-for="(file, key) in uploadImageData">
        <q-img :src="$store.state.member.cdn_url + file.path" width="80px" height="80px" :ratio="1">
          <q-icon class="absolute-top-right text-weight-bolder" @click="deleteImgFile(key)" color="red" size="sm" name="delete_forever"> </q-icon>
        </q-img>
      </div>
      <div class="col-3 q-pa-xs" v-if="uploadImageData.length < limitNumber">
        <q-uploader
          class="component-uploader-img"
          ref="qUploadedImgRef"
          color="white"
          text-color="black"
          accept=".jpg, image/*"
          flat
          bordered
          :field-name="'file'"
          :multiple="multiple"
          :factory="factoryFn"
          @added="uploaderHandle"
        >
          <template v-slot:header="scope">
            <div class="full-width full-height flex flex-center">
              <q-icon color="grey-9" name="photo_filter" size="50px">
                <q-uploader-add-trigger />
              </q-icon>
            </div>
          </template>
        </q-uploader>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['showOperateIndex', 'multiple', 'expandKey', 'emptyImage', 'deleteImg', 'imageData', 'limitNumber'],
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      uploadImageData: []
    }
  },
  watch: {
    imageData (v) {
      if (v) {
        this.uploadImageData = v
      }
    }
  },
  created () {},
  mounted () {},
  methods: {
    factoryFn (file) {
      const that = this
      const formData = new FormData()
      formData.append('file', file[0])
      this.$store
        .dispatch('upload/image', formData)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '上传图片成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })
            this.uploadImageData.push(res.data)

            this.$emit('imageInfo', this.uploadImageData, this.expandKey)
            setTimeout(() => {
              this.$refs.qUploadedImgRef.reset()
            }, 1000)
          } else {
            this.$q.notify({
              message: '失败',
              caption: '上传图片失败，上传列表清空，请重新上传',
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
    deleteImgFile (key) {
      this.uploadImageData.splice(key, 1)
      this.$emit('imageInfo', this.uploadImageData, this.expandKey)
    },
    uploaderHandle () {
      this.$refs.qUploadedImgRef.upload()
    }
  }
}
</script>
<style>
.component-uploader-img .q-uploader__list {
  max-height: 0px;
  padding: 0;
  min-height: 0px;
}

.component-uploader-img {
  width: 80px;
  height: 80px;
  border: 1px dashed #000;
}
.component-uploader-img .q-uploader__header {
  width: 100%;
  height: 100%;
}
</style>
