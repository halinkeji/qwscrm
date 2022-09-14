<template>
  <div>
    <hl-table
      row-key="id"
      dense
      stickyHeader
      :data="dataList"
      :columns="columns"
      selection="multiple"
      :selected.sync="selected"
      :fullscreen.sync="tableFullscreen"
      :loading="loading"
      separator="cell"
    >
      <template v-slot:top="props">
        <div class="row q-col-gutter-x-md q-col-gutter-y-xs full-width">
          <!-- <div class="col-auto q-pl-none q-gutter-sm no-wrap">
            <q-btn dense @click="openEditDialog" color="primary" icon="add" />
            <q-btn
              dense
              @click="openEditDialog(selected[0])"
              color="primary"
              icon="edit"
              :disable="selected && selected.length == 1 ? false : true"
            />
            <q-btn dense color="primary" @click="deleteData()" icon="delete" :disable="selected && selected.length > 0 ? false : true" />
          </div> -->
          <!-- <q-space /> -->

          <q-input v-model="conditionForm.name" class="col-6 col-sm-4 col-md-3 col-lg-2" dense placeholder="签约企业" />
          <q-select
            v-model="conditionForm.status"
            :options="contractStatusArr"
            label="请选择状态"
            option-label="label"
            option-value="value"
            map-options
            emit-value
            dense
            class="col-6 col-sm-4 col-md-3 col-lg-2"
          >
            <template v-if="conditionForm.status" v-slot:append>
              <q-icon name="cancel" @click.stop="conditionForm.status = null" class="cursor-pointer" />
            </template>
          </q-select>

          <q-input
            readonly
            v-model="conditionForm.dateTime"
            rounded
            dense
            class="q-py-xs col-6 col-sm-4 col-md-3 col-lg-2"
            placeholder="请选择日期时间搜索"
          >
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date minimal v-model="conditionForm.dateTime" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
            <template v-slot:append>
              <q-icon v-if="!conditionForm.dateTime" name="search" />
              <q-icon v-else name="clear" class="cursor-pointer" @click="conditionForm.dateTime = ''" />
            </template>
          </q-input>

          <q-space />

          <q-btn-group flat rounded class="col-auto">
            <q-btn color="grey-3" @click="getDataList" text-color="dark" icon="search" />
            <q-btn color="grey-3" text-color="dark" icon="las la-search-minus" @click="resetSearch" />
          </q-btn-group>
        </div>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-checkbox v-model="selected" size="sm" :val="props.row.id" />
          </q-td>
          <q-td key="contact_id" :props="props" class="text-center">
            {{ props.row.contact ? props.row.contact.name : '' }}
          </q-td>

          <q-td key="company" :props="props" class="text-center">
            {{ props.row.company }}
          </q-td>

          <q-td key="type" :props="props" class="text-center">
            {{ typeObject[props.row.type] }}
          </q-td>
          <q-td key="contract_time" :props="props" class="text-center">
            {{ formatDate(props.row.contract_time) }}
          </q-td>

          <q-td key="money" :props="props" class="text-center">
            {{ props.row.money }}
          </q-td>

          <q-td key="service_money" :props="props" class="text-center">
            {{ props.row.service_money }}
          </q-td>

          <q-td key="contract_starttime" :props="props" class="text-center">
            {{ formatDate(props.row.contract_starttime) }}
          </q-td>

          <q-td key="contract_endtime" :props="props" class="text-center">
            {{ formatDate(props.row.contract_endtime) }}
          </q-td>

          <q-td key="status" :props="props" class="text-center">
            {{ contractStatusObject[props.row.status] }}
          </q-td>

          <q-td key="id" :props="props" class="text-center">
            <q-btn outline color="orange" label="查看详情" @click="getLogData(props.row.id)" class="q-mr-xs" />
            <q-btn outline color="positive" label="合同编辑" @click="addContract(props.row.id)" class="q-mr-xs" />
          </q-td>
        </q-tr>
      </template>

      <template v-slot:pagination>
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.pageIndex"
          :page-sizes="[15, 30, 50, 100, 200, 300, 500, 1000]"
          :page-size="page.pSize"
          :total="page.totalCount"
          layout="total, sizes, prev, pager, next, jumper"
        ></hl-pagination>
      </template>
    </hl-table>
    <edit-contract v-if="addContractStatus" ref="editContractRef" @closeDialog="getDataList" />

    <contact-detail v-if="contactDetailStauts" ref="contactDetailRef" />
  </div>
</template>

<script>
import { date, morph } from 'quasar'
import EditContract from './EditContract'
import ContactDetail from './Detail.vue'
export default {
  name: 'PageContract',
  props: ['contact_id'],
  components: {
    EditContract,
    ContactDetail
  },
  data () {
    return {
      contractListData: [],
      addContractStatus: false,
      contractStatusObject: this.$store.state.contract.contractStatusObject,
      contractStatusArr: this.$store.state.contract.contractStatusArr,
      typeObject: {
        0: '电子合同',
        1: '纸质合同'
      },
      dataList: [],
      updateBillStatus: false,
      loading: false,
      columns: [
        {
          name: 'contact_id',
          label: '客户',
          field: 'contact_id',
          align: 'cneter'
        },
        {
          name: 'company',
          label: '签约企业',
          field: 'company',
          align: 'cneter'
        },
        {
          name: 'type',
          label: '合同类型',
          field: 'type',
          align: 'cneter'
        },
        {
          name: 'contract_time',
          field: 'contract_time',
          label: '签约时间',
          align: 'cneter'
        },
        {
          name: 'money',
          label: '合同总金额',
          field: 'money',
          align: 'cneter'
        },
        {
          name: 'service_money',
          label: '售后服务费',
          field: 'service_money',
          align: 'cneter'
        },
        {
          name: 'contract_starttime',
          label: '合同开始时间',
          field: 'contract_starttime',
          align: 'cneter'
        },
        {
          name: 'contract_endtime',
          label: '合同结束时间',
          field: 'contract_endtime',
          align: 'cneter'
        },
        {
          name: 'status',
          label: '状态',
          field: 'status',
          align: 'cneter'
        },
        {
          name: 'id',
          label: '操作',
          field: 'id',
          align: 'cneter'
        }
      ],
      selected: [],
      tableFullscreen: null,
      page: {
        pageIndex: 1,
        pSize: 15,
        totalCount: 0
      },
      conditionForm: {
        status: '',
        name: '',
        dateTime: null
      },

      tabData: '',
      billDetailStatus: false,
      contactDetailStauts: false
    }
  },
  computed: {},
  mounted () {
    this.getDataList()
  },
  created () {},
  methods: {
    formatDate (val) {
      if (val) {
        return date.formatDate(val * 1000, 'YYYY年MM月DD日')
      }
      return '未授权'
    },
    addContract (contartId) {
      this.addContractStatus = true
      this.$nextTick(() => {
        this.$refs.editContractRef.init(contartId, this.contact_id)
      })
    },
    getDataList () {
      this.addContractStatus = false
      this.$store
        .dispatch('contract/getListData', {
          ...this.conditionForm,
          pageIndex: this.page.pageIndex,
          pSize: this.page.pSize
        })
        .then((res) => {
          if (res.code == 200) {
            this.dataList = res.data ? res.data.list : []
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((error) => {})
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

    getLogData (contartId) {
      this.contactDetailStauts = true
      this.$nextTick(() => {
        this.$refs.contactDetailRef.init(contartId)
      })
    },

    // 重置搜索项
    resetSearch () {
      const that = this
      this.conditionForm = {
        status: '',
        name: '',
        dateTime: null
      }

      // 等待搜索项清空 执行查询列表
      this.$nextTick(() => {
        that.getDataList()
      })
    },

    // 每页数
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getDataList()
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
