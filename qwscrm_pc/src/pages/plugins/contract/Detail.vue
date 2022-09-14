<template>
  <q-dialog v-model="logDialogStatus" persistent>
    <q-card
      :style="{
        width: $q.screen.width * 0.5 + 'px',
        'min-width': $q.screen.width * 0.5 + 'px',
      }"
    >
      <div class="row q-pa-sm items-center bg-white text-dark">
        <div class="text-subtitle">开票详情</div>
        <q-space />
        <q-btn dense @click="closeDialog" flat icon="close" />
      </div>
      <q-card flat class=" q-mb-sm">
        <q-card-section class="q-pb-none">
          <div class="row items-center no-wrap">
            <div class="col">
              <div class="text-subtitle1">{{ contractDataForm.no }}</div>
              <div class="text-subtitle2">签约企业：{{ contractDataForm.company }}</div>
            </div>
            <div class="col-auto">
              <q-btn color="grey-7" round flat icon="more_vert">
                <q-menu cover auto-close>
                  <q-list class="q-menu-list-width">
                    <q-item clickable class="q-px-sm" @click="addContract(contractDataForm.id)">
                      <q-item-section>合同信息</q-item-section>
                      <q-item-section side><q-icon name="keyboard_arrow_right"/></q-item-section>
                    </q-item>

                    <q-item clickable class="q-px-sm" @click="updateStoreStatus(contractDataForm.id)">
                      <q-item-section>合同状态</q-item-section>
                      <q-item-section side><q-icon name="keyboard_arrow_right"/></q-item-section>
                    </q-item>

                    <q-item clickable class="q-px-sm" @click="clickBindWorker(contractDataForm)">
                      <q-item-section>售后人员</q-item-section>
                      <q-item-section side><q-icon name="keyboard_arrow_right"/></q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pa-sm">
          <q-list bordered separator>
            <q-item>
              <q-item-section>
                <q-item-label>{{ parseInt(contractDataForm.type) == 1 ? '纸质合同' : '电子合同' }}</q-item-label>
                <q-item-label caption>签约日期：{{ formatDate(contractDataForm.contract_time) }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ parseInt(contractDataForm.pay_type) == 1 ? '对公转账' : '对私转账' }}</q-item-label>
                <q-item-label caption>合同金额：{{ contractDataForm.money }}元</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label>售后技术服务费：</q-item-label>
                <q-item-label>{{ contractDataForm.service_money }}元/年</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>授权站点</q-item-label>
                <q-item-label>{{ contractDataForm.authorize_url }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>

                <q-item-label>{{ formatDate(contractDataForm.contract_starttime) }}</q-item-label>
                <q-item-label caption>合同开始时间</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ formatDate(contractDataForm.contract_endtime) }}</q-item-label>
                <q-item-label caption>合同结束时间</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption lines="3"><span class="text-dark">合同备注：</span>{{ contractDataForm.remark }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="contractDataForm.file_attach">
              <q-item-section>
                <q-item-label class="q-my-sm">
                  <div
                    class="fixed-full image-gallery__blinder bg-grey-8"
                    :class="indexZoomed !== void 0 ? 'image-gallery__blinder--active' : void 0"
                    @click="zoomImage()"
                  />

                  <div class="row justify-left q-gutter-sm q-mx-auto scroll relative-position">
                    <q-img
                      v-for="(src, index) in contractDataForm.file_attach.image"
                      :key="index"
                      ref="refThumb"
                      class="image-gallery__image"
                      :style="index === indexZoomed ? 'opacity: 0.3' : void 0"
                      :src="src.url"
                      @click="zoomImage(index, contractDataForm.file_attach.image)"
                    />
                  </div>
                </q-item-label>
                <q-item-label class="q-mt-sm text-italic" :key="`label-${k}`" v-for="(i, k) in contractDataForm.file_attach.file">
                  <q-icon name="attach_file" color="primary" />
                  <span class="text-primary" @click="openFile(i.url)">
                    {{ i.name }}
                  </span>
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item class="q-pa-none" dense v-if="contractDataForm.product && contractDataForm.product.length > 0">
              <q-item-section>
                <q-expansion-item header-class="bg-grey-2">
                  <template v-slot:header>
                    <q-item-section avatar>
                      <q-icon color="primary" name="apps" />
                    </q-item-section>

                    <q-item-section>
                      合同签约产品
                    </q-item-section>
                  </template>

                  <q-card>
                    <q-card-section class="q-pa-xs">
                      <q-list bordered separator dense>
                        <q-item clickable v-ripple :key="`produck-${k}`" v-for="(i, k) in contractDataForm.product">
                          <q-item-section>
                            <q-item-label>{{ i.name }}</q-item-label>
                            <q-item-label caption>授权价格： {{ i.money }} 元 ，售后技术服务费： {{ i.service_money }} 元/年</q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="around">
          <q-btn outline dense color="deep-orange">{{ contractStatusObject[contractDataForm.status] }}</q-btn>

          <q-btn outline dense>{{
            contractDataForm.serviceWorker && contractDataForm.serviceWorker.name ? contractDataForm.serviceWorker.name : ''
          }}</q-btn>
          <q-btn outline dense v-if="parseInt(contractDataForm.status) < 8" @click="updateRefundStatus(contractDataForm.id)">退款</q-btn>
        </q-card-actions>
      </q-card>
      <q-img
        ref="refFull"
        class="image-gallery__image image-gallery__image-full fixed-center"
        :class="indexZoomed !== void 0 ? 'image-gallery__image-full--active' : void 0"
        :src="currentImage[indexZoomed]"
        @load="imgLoadedResolve"
        @error="imgLoadedReject"
        @click="zoomImage()"
      />
      <edit-contract v-if="addContractStatus" ref="editContractRef" @closeDialog="getContractLog" />
      <bind-worker ref="bindWorkerRef" v-if="bindWorkerStatus" @closeDialog="getContractLog" />
      <set-status ref="setStatusDialogRef" v-if="setStatusDialog" @closeDialog="getContractLog" />
      <set-refund ref="setRefundDialogRef" v-if="setRefundStatusDialog" @closeDialog="getContractLog" />
    </q-card>
  </q-dialog>
</template>

<script>
import { date, morph } from 'quasar'
import EditContract from './EditContract'
import BindWorker from './BindWorker.vue'
import SetStatus from './SetStatus.vue'
import SetRefund from './SetRefund.vue'
export default {
  name: 'AddBillData',
  components: {
    EditContract,
    BindWorker,
    SetStatus,
    SetRefund
  },
  data () {
    return {
      logDialogStatus: false,
      contractListData: [],
      addContractStatus: false,
      contractStatusObject: this.$store.state.contract.contractStatusObject,
      indexZoomed: void 0,
      imgLoaded: {
        promise: Promise.resolve(),
        resolve: () => {},
        reject: () => {}
      },
      currentImage: [],
      bindWorkerStatus: false,
      setStatusDialog: false,
      setRefundStatusDialog: false,
      contractDataForm: {}
    }
  },
  computed: {},
  mounted () {},
  created () {},
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
    init (contractId) {
      this.logDialogStatus = true

      if (contractId > 0) {
        this.contractId = contractId
        this.getContractLog()
      }
    },
    formatDate (val) {
      if (val) {
        return date.formatDate(val * 1000, 'YYYY年MM月DD日 HH:mm:ss')
      }
      return ''
    },
    addContract (contartId) {
      this.addContractStatus = true
      this.$nextTick(() => {
        this.$refs.editContractRef.init(contartId, this.contact_id)
      })
    },

    getContractLog () {
      this.addContractStatus = false
      this.bindWorkerStatus = false
      this.setStatusDialog = false
      this.setRefundStatusDialog = false
      this.$store
        .dispatch('contract/getItem', this.contractId)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.contractDataForm = res.data

            if (this.contractDataForm.product) {
              this.contractDataForm.product = JSON.parse(this.contractDataForm.product)
            }

            if (this.contractDataForm && this.contractDataForm.file_attach) {
              const file_attach = JSON.parse(this.contractDataForm.file_attach)
              this.followFile = file_attach.file

              this.followImage = file_attach.image

              this.contractDataForm.file_attach = file_attach
            } else {
              this.contractDataForm.file_attach = {
                image: [],
                file: []
              }
            }
          }
        })
        .catch((error) => {})
    },

    closeDialog () {
      this.logDialogStatus = false
      this.$emit('closeDialog')
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
    clickBindWorker (item) {
      this.bindWorkerStatus = true
      this.$nextTick(() => {
        this.$refs.bindWorkerRef.init(item.id)
      })
    },
    updateStoreStatus (eventId) {
      this.setStatusDialog = true
      this.$nextTick(() => {
        this.$refs.setStatusDialogRef.init(eventId)
      })
    },
    updateRefundStatus (eventId) {
      this.setRefundStatusDialog = true
      this.$nextTick(() => {
        this.$refs.setRefundDialogRef.init(eventId)
      })
    }
  }
}
</script>
<style lang="scss">
.q-menu-list-width {
  min-width: 100px;
}
.q-item__section--main ~ .q-item__section--side {
  align-items: flex-end;
  padding-right: 0;
  padding-left: 0px;
}
.q-btn--fab .q-btn__wrapper {
  padding: 6px;
  min-height: 40px;
  min-width: 40px;
}
</style>

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
