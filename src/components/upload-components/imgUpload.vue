<template>
  <div class="q-pa-sm">
    <div class="row">
      <div class="col-12">
        <q-uploader
          ref="qUploadedImgRef"
          color="white"
          text-color="black"
          accept=".jpg, image/*"
          style="width:100%;"
          flat
          bordered
          :field-name="'file'"
          :multiple="multiple"
          :factory="factoryFn"
        >
          <template v-slot:list="scope">
            <div class="row">
              <div class="col-2 q-ma-sm " v-for="file in scope.files">
                <img :src="file.__img.src" style="width: 100%" :ratio="1" />
              </div>
            </div> </template
        ></q-uploader>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["showOperateIndex", "multiple"],
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false
    };
  },
  created() {},
  mounted() {},
  methods: {
    factoryFn(file) {
      var that = this;
      let formData = new FormData();
      formData.append("file", file[0]);
      this.$store
        .dispatch("upload/image", formData)
        .then(res => {
          if (res.code == 200) {
            this.$q.notify({
              message: "成功",
              caption: "上传图片成功",
              icon: "ion-checkmark-circle-outline",
              color: "green",
              timeout: 500,
              position: "top-right"
            });

            setTimeout(() => {
              this.$refs.qUploadedImgRef.reset();
            }, 1000);
          } else {
            this.$q.notify({
              message: "失败",
              caption: "上传图片失败，上传列表清空，请重新上传",
              icon: "ion-close-circle-outline",
              color: "red",
              timeout: 500,
              position: "top-right"
            });
            setTimeout(() => {
              this.$refs.qUploadedImgRef.reset();
            }, 1000);
          }
        })
        .catch(error => {
          this.$q.notify({
            message: "失败",
            caption: "上传图片失败，上传列表清空，请重新上传",
            icon: "ion-close-circle-outline",
            color: "red",
            timeout: 500,
            position: "top-right"
          });
          setTimeout(() => {
            this.$refs.qUploadedImgRef.reset();
          }, 1000);
        });
    }
  }
};
</script>

<style>
.overflow_area_500 {
  overflow: auto;
  height: 360px;
}
</style>
