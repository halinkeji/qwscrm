<template>
  <div>
    <q-editor
      v-model="nowCount"
      ref="nowCountRef"
      :dense="$q.screen.lt.md"
      @input="onEditorChange"
      :definitions="{
        upload: {
          tip: '图片上传',
          icon: 'photo_library',
          handler: uplodImgSubmit
        }
      }"
      :toolbar="[
        [
          {
            label: $q.lang.editor.align,
            icon: $q.iconSet.editor.align,
            fixedLabel: true,
            options: ['left', 'center', 'right', 'justify']
          }
        ],
        ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
        ['token', 'hr', 'link', 'custom_btn'],
        ['print', 'fullscreen'],
        [
          {
            label: $q.lang.editor.formatting,
            icon: $q.iconSet.editor.formatting,
            list: 'no-icons',
            options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code']
          },
          {
            label: $q.lang.editor.fontSize,
            icon: $q.iconSet.editor.fontSize,
            fixedLabel: true,
            fixedIcon: true,
            list: 'no-icons',
            options: [
              'size-1',
              'size-2',
              'size-3',
              'size-4',
              'size-5',
              'size-6',
              'size-7'
            ]
          },
          {
            label: $q.lang.editor.defaultFont,
            icon: $q.iconSet.editor.font,
            fixedIcon: true,
            list: 'no-icons',
            options: [
              'default_font',
              'arial',
              'arial_black',
              'comic_sans',
              'courier_new',
              'impact',
              'lucida_grande',
              'times_new_roman',
              'verdana'
            ]
          },
          'removeFormat'
        ],
        ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

        ['undo', 'redo'],
        ['upload', 'viewsource']
      ]"
      :fonts="{
        arial: 'Arial',
        arial_black: 'Arial Black',
        comic_sans: 'Comic Sans MS',
        courier_new: 'Courier New',
        impact: 'Impact',
        lucida_grande: 'Lucida Grande',
        times_new_roman: 'Times New Roman',
        verdana: 'Verdana'
      }"
    />

    <upload-img
      v-if="imageData"
      @imageData="getImageData"
      :multiple="multiple"
      @closeUpload="closeUpload"
    ></upload-img>
  </div>
</template>
<script>
export default {
  name: "hl-editor",
  props: ["content"],
  data() {
    return {
      nowCount: "",
      imageData: false,
      multiple: true
    };
  },
  watch: {
    content(v) {
      this.nowCount = v ? v : "";
    },
    nowCount(v) {
      this.$nextTick(() => {});
    }
  },
  components: {},

  methods: {
    onEditorChange(html) {
      this.$emit("change", html);
    },
    getImageData(v) {
      this.imageData = false;

      v.forEach(item => {
        let img = `<img src="${item.base_url}" width="${this.$q.screen.width *
          0.2}" height="${this.$q.screen.width * 0.2}" />`;
        this.nowCount = this.nowCount + img;
      });
      this.$nextTick(() => {
        this.$emit("change", this.nowCount);
      });
    },
    closeUpload(v) {
      this.imageData = false;
    },
    uplodImgSubmit() {
      this.imageData = true;
    }
  }
};
</script>
