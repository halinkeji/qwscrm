<template>
  <q-dialog v-model="logDialogStatus" persistent >
    <q-layout view="Lhh lpR fff" container class="bg-white" :style="{
    width:$q.screen.width * 0.5 + 'px',
     'min-width':$q.screen.width * 0.6 + 'px',
  }">
      <q-header class="row q-pa-sm items-center bg-white text-dark">
        <div class="text-subtitle">合同</div>
        <q-space />
        <q-btn dense @click="closeDialog" flat icon="close" />
      </q-header>
      <q-page-container>
        <q-page class="q-pa-sm">
          <q-form ref="contractDataRef" class="row">
            <div class="col-6 q-px-xs">
              <q-input outlined v-model="contractDataForm.order" dense label="排序" :rules="[(val) => !!val || '请输入排序']" />
            </div>

            <div class="col-6 q-px-xs">
              <q-input outlined v-model="contractDataForm.no" dense label="合同编号" :rules="[(val) => !!val || '请输入合同编号']" />
            </div>

            <div class="col-6 q-px-xs">
              <q-input outlined v-model="contractDataForm.company" dense label="签约企业" :rules="[(val) => !!val || '请输入签约企业']" />
            </div>

            <div class="col-6 q-px-xs">
              <q-input outlined v-model="contractDataForm.authorize_url" dense label="授权域名" :rules="[(val) => !!val || '请输入授权域名']" />
            </div>

           <div class="col-6 q-px-xs" v-if="!contractId">
              <q-select
                dense
                map-options
                outlined
                option-label="label"
                option-value="value"
                emit-value
                label="合同类型"
                v-model="contractDataForm.type"
                :options="[
                  {
                    label: '电子合同',
                    value: '0',
                  },
                  {
                    label: '纸质合同',
                    value: '1',
                  },
                ]"
                :rules="[(val) => !!val || '请选择合同类型']"
                @input="contractDataForm.status = ''"
              />
            </div>

            <div class="col-6 q-px-xs" v-if="!contractId">
              <q-select
                dense
                map-options
                outlined
                option-label="label"
                option-value="value"
                emit-value
                label="合同状态"
                v-model="contractDataForm.status"
                :options="parseInt(contractDataForm.type) == 0 ? dianziContractStatus : contractStatusArr"
                :rules="[(val) => !!val || '请选择合同状态']"
              />
            </div>
            <div class="col-6 q-px-xs">
              <q-input
                outlined
                v-model="contractDataForm.contract_time"
                dense
                label="合同签约时间"
                readonly
                :rules="[(val) => !!val || '请输入合同签约时间']"
              >
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-date minimal v-model="contractDataForm.contract_time" mask="YYYY-MM-DD">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="确定" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
           <div class="col-6 q-px-xs">
              <q-input outlined v-model="contractDataForm.money" dense label="合同金额" :rules="[(val) => val >= 0 || '请输入合同金额']">
                <template v-slot:append> 元 </template>
              </q-input>
            </div>

            <div class="col-6 q-px-xs">
              <q-input outlined v-model="contractDataForm.service_money" dense label="售后服务费" :rules="[(val) => val >= 0 || '请输入售后服务费']">
                <template v-slot:append> 元/年 </template>
              </q-input>
            </div>

            <div class="col-6 q-px-xs">
              <q-select
                dense
                map-options
                outlined
                option-label="label"
                option-value="value"
                emit-value
                label="付款方式"
                v-model="contractDataForm.pay_type"
                :options="[
                  {
                    label: '对公转账',
                    value: '1',
                  },
                  {
                    label: '对私转账',
                    value: '2',
                  },
                ]"
                :rules="[(val) => !!val || '请选择合同类型']"
              />
            </div>

            <div class="col-6 q-px-xs" v-if="!contractId">
              <q-select
                dense
                map-options
                outlined
                option-label="name"
                option-value="id"
                emit-value
                label="选择售后工作人员"
                v-model="contractDataForm.service_worker"
                :options="workerDataList"
                :rules="[(val) => !!val || '请选择售后工作人员']"
              />
            </div>

            <div class="col-6 q-px-xs">
              <q-input
                outlined
                v-model="contractDataForm.contract_starttime"
                dense
                label="合同开始时间"
                readonly
                :rules="[(val) => !!val || '请输入合同开始时间']"
              >
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-date minimal v-model="contractDataForm.contract_starttime" mask="YYYY-MM-DD">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="确定" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <div class="col-6 q-px-xs">
              <q-input
                outlined
                v-model="contractDataForm.contract_endtime"
                dense
                label="合同结束时间"
                readonly
                :rules="[(val) => !!val || '请输入合同结束时间']"
              >
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-date minimal v-model="contractDataForm.contract_endtime" mask="YYYY-MM-DD">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="确定" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <div class="col-6 q-px-xs">
              <q-input v-model="contractDataForm.remark" outlined :rows="3" label="合同备注" type="textarea" />
            </div>

            <div class="col-6 q-px-xs q-mt-sm">
              <q-select
                dense
                map-options
                outlined
                option-label="label"
                option-value="value"
                emit-value
                label="应用列表"
                v-model="currentApply"
                :options="applyDataList"
              >
                <template v-slot:after>
                  <q-btn unelevated @click="addProduct" color="primary" :disable="!currentApply" label="添加签约产品" />
                </template>
              </q-select>
            </div>
            <q-card class="full-width q-mt-sm" :key="`product-${k}`" flat bordered v-for="(i, k) in contractDataForm.product">
              <q-card-section class="row">
                {{ i.name }} <q-space /> <q-btn flat dense round color="negative" @click="deteleProduct(k)" icon="delete_forever" />
              </q-card-section>
              <q-card-section class="row">
                <div class="col q-px-sm">
                  <q-input outlined v-model="i.money" dense label="授权价格" :rules="[(val) => val >= 0 || '请输入授权价格']">
                    <template v-slot:append> 元 </template>
                  </q-input>
                </div>
                <div class="col q-px-sm">
                  <q-input outlined v-model="i.service_money" dense label="售后技术服务费" :rules="[(val) => val >= 0 || '请输入售后技术服务费']">
                    <template v-slot:append> 元/年 </template>
                  </q-input>
                </div>
              </q-card-section>
            </q-card>
            <q-card flat bordered class="col-12 q-my-sm">
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
              :contactId="contractDataForm.contact_id"
              cardTitle="上传附件"
              :multiple="true"
              :valuePath="contractDataForm.file_attach.file"
              @filePath="getUploadData"
              @deleteFile="getUploadData"
            ></hl-file-upload>
          </q-form>
        </q-page>
      </q-page-container>
      <upload-img v-if="uploadImgStatus" @imageData="getImageData" :multiple="true" @closeUpload="closeUpload"></upload-img>
      <q-footer class="bg-white">
        <q-toolbar class="justify-center">
          <q-btn unelevated rounded color="primary" @click="saveBillData" label="保存" class="q-px-xl" />
        </q-toolbar>
      </q-footer>
    </q-layout>
  </q-dialog>
</template>

<script>
import { date } from 'quasar'
export default {
  name: 'EditContract',
  components: {},
  data () {
    return {
      logDialogStatus: false,
      contractStatusArr: this.$store.state.contract.contractStatusArr,
      dianziContractStatus: this.$store.state.contract.dianziContractStatus,
      date: null,
      contractDataForm: {
        contact_id: '',
        order: '0',
        no: '',
        company: '',
        type: '',
        contract_time: '',
        service_money: '',
        service_worker: '',
        contract_starttime: '',
        contract_endtime: '',
        status: '',
        money: '',
        remark: '',
        authorize_url: '',
        product: [],
        file_attach: {
          image: [],
          file: []
        },
        pay_type: ''
      },
      billId: '',
      contractId: '',
      applyDataList: [],
      currentApply: '',
      followFile: [],
      followImage: [],
      uploadImgStatus: false,
      workerDataList: []
    }
  },
  computed: {},
  mounted () {},
  created () {},
  methods: {
    init (contractId, contact_id) {
      this.logDialogStatus = true
      this.getAllApply()
      this.contractDataForm.contact_id = contact_id
      if (contractId > 0) {
        this.contractId = contractId
        this.getContractLog()
      } else {
        this.getWorkerData()
      }
    },
    deteleProduct (key) {
      if (this.contractDataForm && this.contractDataForm.product) {
        this.contractDataForm.product.splice(key, 1)
      }
    },
    getContractLog () {
      this.$store
        .dispatch('contract/getItem', this.contractId)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.contractDataForm = res.data
            if (this.contractDataForm.contract_time) {
              this.contractDataForm.contract_time = date.formatDate(parseInt(this.contractDataForm.contract_time) * 1000, 'YYYY-MM-DD')
            }

            if (this.contractDataForm.contract_starttime) {
              this.contractDataForm.contract_starttime = date.formatDate(parseInt(this.contractDataForm.contract_starttime) * 1000, 'YYYY-MM-DD')
            }

            if (this.contractDataForm.contract_endtime) {
              this.contractDataForm.contract_endtime = date.formatDate(parseInt(this.contractDataForm.contract_endtime) * 1000, 'YYYY-MM-DD')
            }

            if (this.contractDataForm.product) {
              this.contractDataForm.product = JSON.parse(this.contractDataForm.product)
            }

            // if (this.contractDataForm.file_attach) {
            //   this.contractDataForm.file_attach = JSON.parse(this.contractDataForm.file_attach)
            // }

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

    saveBillData () {
      this.$refs.contractDataRef.validate().then((success) => {
        if (success) {
          if (this.followImage && this.followImage.length > 0) {
            this.contractDataForm.file_attach.image = this.followImage
          }
          const obj = {
            ...this.contractDataForm
          }
          this.$store
            .dispatch('contract/setData', obj)
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

    getAllApply () {
      this.$store
        .dispatch('siteManage/getAllApply', {})
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              for (const key in res.data) {
                this.applyDataList.push({
                  label: res.data[key],
                  value: key
                })
              }
            }
          }
        })
        .catch((error) => {})
    },

    addProduct () {
      const that = this
      if (this.contractDataForm && this.currentApply) {
        const applyIndex = _.findIndex(this.applyDataList, function (o) {
          return o.value == that.currentApply
        })
        if (applyIndex > 0) {
          const applyInfo = this.applyDataList[applyIndex]
          this.contractDataForm.product.push({
            name: applyInfo.label,
            service_money: '',
            money: '',
            key: this.currentApply
          })
        }
      }
    },
    getUploadData (e) {
      if (this.contractDataForm.file_attach.file) {
        this.contractDataForm.file_attach.file.push(e)
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
    },
    getWorkerData () {
      this.$store
        .dispatch('siteManage/getWorkerData', {})
        .then((res) => {
          if (res.code == 200) {
            this.workerDataList = res.data ? res.data : []
          }
        })
        .catch((error) => {})
    }
  }
}
</script>
