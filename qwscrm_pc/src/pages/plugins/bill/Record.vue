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

          <q-input v-model="conditionForm.code" class="col-6 col-sm-4 col-md-3 col-lg-2" dense placeholder="发票代码|发票号码" />
          <q-select
            v-model="conditionForm.status"
            :options="options_status"
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
          <q-td key="bill_info_id" :props="props" class="text-center">
            {{ props.row.info ? props.row.info.title : '' }}
          </q-td>

          <q-td key="contract_id" :props="props" class="text-center">
            {{ props.row.contract ? props.row.contract.title : '' }}
          </q-td>

          <q-td key="contact_follow_id" :props="props" class="text-center">
            {{ props.row.follow ? props.row.follow.name : '' }}
          </q-td>
          <q-td key="fee" :props="props" class="text-center">
            {{ props.row.fee }}
          </q-td>

          <q-td key="billing_no" :props="props" class="text-center">
            {{ props.row.billing_no }}
          </q-td>

          <q-td key="billing_time" :props="props" class="text-center">
            {{ formatDate(props.row.billing_time) }}
          </q-td>

          <q-td key="billing_code" :props="props" class="text-center">
            {{ props.row.billing_code }}
          </q-td>

          <q-td key="status" :props="props" class="text-center">
            {{ billStatusObject[props.row.status] }}
          </q-td>

          <q-td key="id" :props="props" class="text-center">
            <q-btn outline color="orange" label="查看详情" @click="getLogData(props.row.id, props.row.contact_id)" class="q-mr-xs" />
            <q-btn outline color="positive" label="开票状态" @click="updateBill(props.row.id, props.row.contact_id)" class="q-mr-xs" />
            <q-btn
              outline
              color="primary"
              label="信息编辑"
              v-if="parseInt(props.row.status) == 0"
              @click="addBillData(props.row.id)"
              class="q-mr-xs"
            />
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
    <edit-bill-info ref="editBillInfoRef" v-if="editBillStatus" @closeDialog="getDataList" />
    <add-bill-data ref="addBillDataRef" v-if="addBillStatus" @closeDialog="getDataList" />
    <bill-status ref="billStatusDataRef" v-if="updateBillStatus" @closeDialog="getDataList" />
    <bill-detail v-if="billDetailStatus" ref="billDetailRef" @closeDialog="getDataList" />
  </div>
</template>

<script>
import { date } from 'quasar'
import BillDetail from './BillDetail.vue'
import AddBillData from './AddBillData.vue'
import BillStatus from './BillStatus.vue'
export default {
  name: 'PageBill',
  props: ['contact_id'],
  components: {
    BillDetail,
    AddBillData,
    BillStatus
  },
  data () {
    return {
      editBillStatus: false,
      addBillStatus: false,
      billBaseInfo: {},
      billTypeObject: this.$store.state.billManage.billTypeObject,

      dataList: [],
      updateBillStatus: false,
      loading: false,
      columns: [
        {
          name: 'bill_info_id',
          label: '客户',
          field: 'bill_info_id',
          align: 'cneter'
        },
        {
          name: 'contract_id',
          label: '合同',
          field: 'contract_id',
          align: 'cneter'
        },
        {
          name: 'contact_follow_id',
          label: '跟进事件',
          field: 'contact_follow_id',
          align: 'cneter'
        },
        {
          name: 'fee',
          field: 'fee',
          label: '开票金额',
          align: 'cneter'
        },
        {
          name: 'billing_no',
          label: '发票代码',
          field: 'billing_no',
          align: 'cneter'
        },
        {
          name: 'billing_time',
          label: '开票时间',
          field: 'billing_time',
          align: 'cneter'
        },
        {
          name: 'billing_code',
          label: '发票号码',
          field: 'billing_code',
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
        code: '',
        dateTime: null
      },
      options_status: this.$store.state.billManage.billStatusArray,
      billStatusObject: this.$store.state.billManage.billStatusObject,
      tabData: '',
      billDetailStatus: false
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
        return date.formatDate(val * 1000, 'YYYY年MM月DD日 HH:mm:ss')
      }
      return ''
    },
    getDataList () {
      this.editBillStatus = false
      this.addBillStatus = false
      this.$store
        .dispatch('billManage/getListData', {
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

    addBillData (billLogId) {
      this.addBillStatus = true
      this.$nextTick(() => {
        this.$refs.addBillDataRef.init(billLogId, this.billBaseInfo && this.billBaseInfo.id ? this.billBaseInfo.id : 0, this.contact_id)
      })
    },
    editBillBaseInfo () {
      this.editBillStatus = true
      this.$nextTick(() => {
        this.$refs.editBillInfoRef.init(this.billBaseInfo && this.billBaseInfo.id ? this.billBaseInfo.id : 0, this.contact_id)
      })
    },
    getLogData (billLogId) {
      this.billDetailStatus = true
      this.$nextTick(() => {
        this.$refs.billDetailRef.init(billLogId)
      })
    },

    // 重置搜索项
    resetSearch () {
      const that = this
      this.conditionForm = {
        status: '',
        code: '',
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
    },
    updateBill (billLogId) {
      this.updateBillStatus = true
      this.$nextTick(() => {
        this.$refs.billStatusDataRef.init(billLogId)
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
