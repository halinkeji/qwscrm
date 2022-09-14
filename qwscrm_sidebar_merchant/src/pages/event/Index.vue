<template>
  <q-page class="bg-color-EAE full-width column no-wrap">
    <div class="q-mx-xs q-mt-md q-mb-xl">
      <q-card class="shadow-box q-mb-sm" :key="`card-${key}`" v-for="(item, key) in eventData">
        <q-card-section class="q-pb-none">
          <div class="row items-center no-wrap">
            <div class="col">
              <div class="text-subtitle1">事件名称：{{ item.name }}</div>
            </div>
            <div class="col-auto">
              <q-btn color="grey-7" round flat icon="more_vert" v-if="parseInt(item.status) < 3">
                <q-menu cover auto-close>
                  <q-list class="q-menu-list-width">
                    <q-item clickable class="q-px-sm" @click="addEventWorker(item.id)">
                      <q-item-section>事件跟进</q-item-section>
                      <q-item-section side><q-icon name="keyboard_arrow_right" /></q-item-section>
                    </q-item>
                    <q-item clickable class="q-px-sm" @click="editEvent(item.id)">
                      <q-item-section>事件详情</q-item-section>
                      <q-item-section side><q-icon name="keyboard_arrow_right" /></q-item-section>
                    </q-item>
                    <q-item clickable class="q-px-sm" @click="updateStoreStatus(item.id)">
                      <q-item-section>事件状态</q-item-section>
                      <q-item-section side><q-icon name="keyboard_arrow_right" /></q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pa-sm">
          <q-list bordered separator>
            <q-item clickable v-ripple class="q-px-sm">
              <q-item-section>
                <q-item-label caption><span class="text-dark">事件说明：</span>{{ item.description }}</q-item-label>
                <q-item-label class="q-my-sm" v-if="item.file_attach">
                  <div
                    class="fixed-full image-gallery__blinder bg-grey-8"
                    :class="indexZoomed !== void 0 ? 'image-gallery__blinder--active' : void 0"
                    @click="zoomImage()"
                  />

                  <div class="row justify-left q-gutter-sm q-mx-auto scroll relative-position">
                    <q-img
                      v-for="(src, index) in JSON.parse(item.file_attach).image"
                      :key="index"
                      ref="refThumb"
                      class="image-gallery__image"
                      :style="index === indexZoomed ? 'opacity: 0.3' : void 0"
                      :src="src.url"
                      @click="zoomImage(index, JSON.parse(item.file_attach).image)"
                    />
                  </div>
                </q-item-label>
                <div v-if="item.file_attach">
                  <q-item-label class="q-mt-sm text-italic" :key="`label-${k}`" v-for="(i, k) in JSON.parse(item.file_attach).file">
                    <q-icon name="attach_file" />

                    <span class="text-primary" @click="openFile(i.url)">
                      {{ i.name }}
                    </span>
                  </q-item-label>
                </div>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section v-if="parseInt(item.create_worker_id) > 0">
                <q-item-label>{{ item.createWorkerInfo ? item.createWorkerInfo.name : '' }}</q-item-label>
                <q-item-label caption>事件创建人</q-item-label>
              </q-item-section>
              <q-item-section v-if="parseInt(item.archive_worker_id) > 0">
                <q-item-label>{{ item.archiveWorkerInfo ? item.archiveWorkerInfo.name : '' }}</q-item-label>
                <q-item-label caption>事件归档人</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label>事件添加时间：{{ formatDate(item.created_at) }}</q-item-label>
                <q-item-label caption>事件开启至今已耗时：{{ distanceDays(item.created_at, parseInt(Date.now() / 1000)) }}天</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple v-if="parseInt(item.status) == 3">
              <q-item-section>
                <q-item-label>处理完成时间：{{ formatDate(item.updated_at) }}</q-item-label>
                <q-item-label caption>事件总耗时：{{ distanceDays(item.updated_at, parseInt(Date.now() / 1000)) }}天</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section v-if="item.workers && item.workers.length > 0">
                <q-item-label>最近一次处理时间：{{ formatDate(item.workers[0].created_at) }}</q-item-label>
              </q-item-section>
              <q-item-section v-else>
                <q-item-label>最近一次处理时间：{{ formatDate(item.updated_at) }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item class="q-pa-none" dense>
              <q-item-section>
                <q-expansion-item dense header-class="bg-grey-2">
                  <template v-slot:header>
                    <q-item-section avatar>
                      <q-icon color="primary" name="alarm_on" />
                    </q-item-section>

                    <q-item-section> 事件跟进时间轴 </q-item-section>
                  </template>

                  <q-card class="q-px-md">
                    <q-timeline color="primary" class="q-pt-md">
                      <q-timeline-entry :key="k + 'worker'" v-for="(i, k) in item.workers">

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
                  </q-card>
                </q-expansion-item>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator />

        <q-card-actions align="around">
          <q-btn outline dense color="deep-orange">{{ eventStatusObject[item.status] }}</q-btn>
          <q-btn outline dense color="positive">{{ eventLevelObject[item.level] }}</q-btn>
        </q-card-actions>
      </q-card>
    </div>

    <q-img
      ref="refFull"
      class="image-gallery__image image-gallery__image-full fixed-center"
      :class="indexZoomed !== void 0 ? 'image-gallery__image-full--active' : void 0"
      :src="currentImage[indexZoomed]"
      @load="imgLoadedResolve"
      @error="imgLoadedReject"
      @click="zoomImage()"
    />

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab color="primary" direction="up">
        <template v-slot:icon="{ opened }">
          <q-icon :class="{ 'example-fab-animate--hover': opened !== true }" name="keyboard_arrow_up" />
        </template>

        <template v-slot:active-icon="{ opened }">
          <q-icon :class="{ 'example-fab-animate': opened === true }" name="close" />
        </template>

        <q-fab-action external-label label-position="left" color="positive" @click="editEvent" icon="add" label="新增事件" />
      </q-fab>
    </q-page-sticky>

    <q-footer bordered class="bg-grey-2 text-white">
      <q-item class="q-pa-none">
        <q-item-section class="q-pa-none">
          <q-input readonly v-model="dateTime" rounded outlined dense class="q-py-xs" placeholder="请选择日期时间搜索">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date minimal v-model="dateTime" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" @click="getList" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
            <template v-slot:append>
              <q-icon v-if="dateTime === ''" name="search" />
              <q-icon
                v-else
                name="clear"
                class="cursor-pointer"
                @click="
                  dateTime = '';
                  getList();
                "
              />
            </template>
          </q-input>
        </q-item-section>

        <q-item-section class="q-pa-none">
          <q-input v-model="name" @change="getList" label="事件标题|描述" dense clearable @clear="getList" />
        </q-item-section>
      </q-item>

      <q-toolbar>
        <q-toolbar-title class="flex flex-center">
          <q-pagination @input="changePaginationHandle" v-model="page.page" :max-pages="6" :max="maxPage" input input-class="text-orange-10" />
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
    <event-worker ref="eventWorkerRef" v-if="eventDialogStatus" @closeDialog="getList" />
    <edit-worker ref="editWorkerRef" v-if="eventWorkerDialogStatus" @closeDialog="getList" />
    <set-status ref="setStatusDialogRef" v-if="setStatusDialog" @closeDialog="getList" />
  </q-page>
</template>

<script>
import { morph, date } from 'quasar'
import EventWorker from './EventWorker'
import EditWorker from './EditWorker'
import SetStatus from './SetStatus.vue'
export default {
  name: 'PageEvent',
  components: {
    EventWorker,
    EditWorker,
    SetStatus
  },
  data () {
    return {
      current: 3,
      indexZoomed: void 0,
      imgLoaded: {
        promise: Promise.resolve(),
        resolve: () => {},
        reject: () => {}
      },
      currentImage: [],
      dateTime: '',
      page: {
        pSize: 20,
        page: 1,
        totalCount: 0
      },
      eventData: [],
      eventDialogStatus: false,
      contact_id: '',
      eventStatusObject: this.$store.state.eventManage.eventStatusObject,
      eventLevelObject: this.$store.state.eventManage.eventLevelObject,
      eventWorkerDialogStatus: false,
      setStatusDialog: false,
      name: ''
    }
  },
  computed: {
    maxPage () {
      return Math.ceil(this.page.totalCount / this.page.pSize) && Math.ceil(this.page.totalCount / this.page.pSize) != 'Infinity'
        ? Math.ceil(this.page.totalCount / this.page.pSize)
        : 1
    }
  },
  mounted () {
    this.getList()
  },
  created () {
    if (this.$store.state.oauth.qwUserInfo && this.$store.state.oauth.qwUserInfo.id) {
      this.contact_id = this.$store.state.oauth.qwUserInfo.id
    } else {
      this.$router.push({ name: 'home' })
    }
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
    formatDate (val) {
      if (val) {
        return date.formatDate(val * 1000, 'YYYY年MM月DD日 HH:mm:ss')
      }
      return ''
    },
    distanceDays (starTime, endTime) {
      if (starTime && endTime) {
        const lastTime = endTime - starTime

        if (lastTime > 0) {
          return parseInt(lastTime / (60 * 60 * 24))
        }
      }
    },
    changePaginationHandle () {
      this.getList()
    },
    getList () {
      this.eventDialogStatus = false
      this.eventWorkerDialogStatus = false
      this.$store
        .dispatch('eventManage/getData', { ...this.page, dateTime: this.dateTime, contact_id: this.contact_id, name: this.name })
        .then((res) => {
          if (res.code == 200) {
            this.eventData = res.data ? res.data.list : []
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((error) => {})
    },

    editEvent (eventId) {
      this.eventDialogStatus = true
      this.$nextTick(() => {
        this.$refs.eventWorkerRef.init(eventId, this.contact_id)
      })
    },
    addEventWorker (eventId) {
      this.eventWorkerDialogStatus = true
      this.$nextTick(() => {
        this.$refs.editWorkerRef.init(eventId, this.contact_id)
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
    },
    updateStoreStatus (eventId) {
      this.setStatusDialog = true
      this.$nextTick(() => {
        this.$refs.setStatusDialogRef.init(eventId)
      })
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
      max-width: 70vw
      z-index: 2002
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
