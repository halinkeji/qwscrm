<template>
  <q-dialog v-model="editDialogStatus" persistent>
    <q-card
      :style="{
        width: $q.screen.width * 0.5 + 'px',
        'min-width': $q.screen.width * 0.5 + 'px',
        height: $q.screen.height * 0.8 + 'px',
      }"
      class="fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <q-card-section class="text-dark row q-pa-sm q-pb-xs ">
          <div class="text-h6">事件详情</div>
          <q-space />
          <q-btn flat round dense icon="close" @click="closeDialog" />
        </q-card-section>

        <q-separator />
        <div class="q-pa-sm">
          <q-btn label="事件跟进" color="primary" unelevated @click="editEvent"></q-btn>
        </div>
        <q-scroll-area class="fit">
          <q-timeline color="primary" class="q-pt-md q-px-md">
            <q-timeline-entry :key="k + 'worker'" icon="las la-tag" v-for="(i, k) in workersLog">
              <template v-slot:subtitle>
                <div class="text-weight-bold">{{ formatDate(i.created_at) }}</div>
              </template>
              <div>操作人：{{ i.worker ? i.worker.name : '' }}</div>
              <div v-html="i.content"></div>
              <q-item-label class="q-my-sm" v-if="i.file_attach">
                <div
                  class="fixed-full image-gallery__blinder bg-grey-8"
                  :class="indexZoomed !== void 0 ? 'image-gallery__blinder--active' : void 0"
                  @click="zoomImage()"
                />

                <div class="row justify-left q-gutter-sm q-mx-auto scroll relative-position">
                  <q-img
                    v-for="(src, index) in JSON.parse(i.file_attach).image"
                    :key="index"
                    ref="refThumb"
                    class="image-gallery__image"
                    :style="index === indexZoomed ? 'opacity: 0.3' : void 0"
                    :src="src.url"
                    @click="zoomImage(index, JSON.parse(i.file_attach).image)"
                  />
                </div>
              </q-item-label>
              <div v-if="i.file_attach">
                <q-item-label class="q-mt-sm text-italic" :key="`label-${jk}`" v-for="(j, jk) in JSON.parse(i.file_attach).file">
                  <q-icon name="attach_file" />
                  <span class="text-primary" @click="openFile(j.url)">
                    {{ j.name }}
                  </span>
                </q-item-label>
              </div>
            </q-timeline-entry>
          </q-timeline>
        </q-scroll-area>
        <q-img
          ref="refFull"
          class="image-gallery__image image-gallery__image-full fixed-center"
          :class="indexZoomed !== void 0 ? 'image-gallery__image-full--active' : void 0"
          :src="currentImage[indexZoomed]"
          @load="imgLoadedResolve"
          @error="imgLoadedReject"
          @click="zoomImage()"
        />
      </div>
      <edit-worker ref="editWorkerRef" v-if="eventDialogStatus" @closeDialog="getLogList" />
    </q-card>
  </q-dialog>
</template>

<script>
import EditWorker from './EditWorker'
import { morph, date } from 'quasar'
export default {
  name: 'ContactField',
  components: {
    EditWorker
  },
  data () {
    return {
      editDialogStatus: false,

      fieldTypeArr: this.$store.state.contactField.fieldTypeArr,
      options_status: [
        {
          label: '不展示',
          value: '0'
        },
        {
          label: '展示',
          value: '1'
        }
      ],
      fieldId: '',
      workersLog: [],
      contact_id: '',
      eventDialogStatus: false,
      indexZoomed: void 0,
      imgLoaded: {
        promise: Promise.resolve(),
        resolve: () => {},
        reject: () => {}
      },
      currentImage: []
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    console.log('pageTable mounted')
  },
  activated () {
    console.log('pageTable activated')
  },
  deactivated () {
    console.log('pageTable deactivated')
  },
  destroyed () {
    console.log('pageTable destroyed')
  },
  methods: {
    openFile (url) {
      if (url) {
        if (
          url.indexOf('docx') > -1 ||
          url.indexOf('xlsx') > -1 ||
          url.indexOf('pptx') > -1 ||
          url.indexOf('doc') > -1 ||
          url.indexOf('xls') > -1 ||
          url.indexOf('ppt') > -1
        ) {
          window.open('https://view.officeapps.live.com/op/view.aspx?src=' + url, '_blank')
        } else {
          window.open(url, '_blank')
        }
      }
    },
    init (eventId, contact_id) {
      this.editDialogStatus = true
      if (eventId > 0) {
        this.eventId = eventId
        this.contact_id = contact_id
        this.getLogList()
      }
    },
    formatDate (val) {
      if (val) {
        return date.formatDate(val * 1000, 'YYYY年MM月DD日 HH:mm:ss')
      }
      return ''
    },
    getLogList () {
      this.$store
        .dispatch('eventManage/getLogList', {
          contact_follow_id: this.eventId
        })
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.workersLog = res.data
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
    },
    editEvent () {
      this.eventDialogStatus = true
      this.$nextTick(() => {
        this.$refs.editWorkerRef.init(this.eventId, this.contact_id)
      })
    },

    closeDialog () {
      this.editDialogStatus = false

      this.$nextTick(() => {
        this.$emit('closeDialog')
      })
    },
    imgLoadedResolve () {
      this.imgLoaded.resolve()
    },

    imgLoadedReject () {
      this.imgLoaded.reject()
    },
    zoomImage (index, imageArr) {
      const { indexZoomed } = this
      if (imageArr && imageArr.length > 0) {
        this.currentImage = imageArr.map
        this.currentImage = imageArr.map((item) => {
          return item.url
        })
      }

      this.imgLoaded.reject()

      const zoom = () => {
        if (index !== void 0 && index !== indexZoomed) {
          this.imgLoaded.promise = new Promise((resolve, reject) => {
            this.imgLoaded.resolve = () => {
              this.imgLoaded.resolve = () => {}
              this.imgLoaded.reject = () => {}

              resolve()
            }
            this.imgLoaded.reject = () => {
              this.imgLoaded.resolve = () => {}
              this.imgLoaded.reject = () => {}

              reject()
            }
          })

          this.cancel = morph({
            from: this.$refs.refThumb[index].$el,
            to: this.$refs.refFull.$el,
            onToggle: () => {
              this.indexZoomed = index
            },
            waitFor: this.imgLoaded.promise,
            duration: 400,
            hideFromClone: true,
            onEnd: (end) => {
              if (end === 'from' && this.indexZoomed === index) {
                this.indexZoomed = void 0
              }
            }
          })
        }
      }

      if (indexZoomed !== void 0 && (this.cancel === void 0 || this.cancel() === false)) {
        morph({
          from: this.$refs.refFull.$el,
          to: this.$refs.refThumb[indexZoomed].$el,
          onToggle: () => {
            this.indexZoomed = void 0
          },
          duration: 200,
          keepToClone: true,
          onEnd: zoom
        })
      } else {
        zoom()
      }
    }
  }
}
</script>

<style lang="sass">
.image-gallery
  &__image
    border-radius: 3%/5%
    width: 150px
    max-width: 20vw
    cursor: pointer

    &-full
      width: 800px
      z-index: 99999
      pointer-events: none

      &--active
        pointer-events: all
  &__blinder
    opacity: 0
    z-index: 2000
    pointer-events: none
    transition: opacity 0.3s ease-in-out

    &--active
      opacity: 0.6
      pointer-events: all

      + div > .image-gallery__image
        z-index: 2001
</style>
