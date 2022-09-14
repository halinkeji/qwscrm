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
          <div class="col-auto q-pl-none q-gutter-sm no-wrap">
            <q-btn dense @click="openEditDialog" color="primary" icon="add" />
            <q-btn
              dense
              @click="openEditDialog(selected[0])"
              color="primary"
              icon="edit"
              :disable="selected && selected.length == 1 ? false : true"
            />
            <q-btn dense color="primary" @click="deleteData()" icon="delete" :disable="selected && selected.length > 0 ? false : true" />
          </div>
          <q-space />

          <q-input v-model="conditionForm.label" class="col-6 col-sm-4 col-md-3 col-lg-2" dense placeholder="字段名称" />
          <q-select v-model="conditionForm.status" :options="options_status" label="请选择状态" option-label="label" option-value="value" map-options emit-value dense class="col-6 col-sm-4 col-md-3 col-lg-2">
            <template v-if="conditionForm.status" v-slot:append>
              <q-icon name="cancel" @click.stop="conditionForm.status = null" class="cursor-pointer" />
            </template>
          </q-select>
          <q-select v-model="conditionForm.type" :options="fieldTypeArr" option-label="label" option-value="value" map-options emit-value label="格式" dense class="col-6 col-sm-4 col-md-3 col-lg-2">
            <template v-if="conditionForm.type" v-slot:append>
              <q-icon name="cancel" @click.stop="conditionForm.type = null" class="cursor-pointer" />
            </template>
          </q-select>
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

          <q-td key="order" :props="props" class="text-center">
            {{ props.row.order }}
              <q-popup-edit v-model="props.row.order" label-set="确定" buttons @save="updateOrder(props.row.id, props.row.order)" title="编辑排序">
                <q-input v-model="props.row.order" dense autofocus counter />
              </q-popup-edit>
          </q-td>
          <q-td key="label" :props="props" class="text-center">
            {{ props.row.label }}
             <q-popup-edit v-model="props.row.label" label-set="确定" buttons @save="updateLabel(props.row.id, props.row.label)" title="编辑字段名称">
                <q-input v-model="props.row.label" dense autofocus counter />
              </q-popup-edit>
          </q-td>
          <q-td key="status" :props="props" class="text-center">
            <q-toggle color="green" true-value="1" false-value="0" @input="updateStatus(props.row)" v-model="props.row.status" />
          </q-td>
          <q-td key="type" :props="props" class="text-center">
            {{ fieldTypeObject[props.row.type] }}
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
    <edit-field v-if="editDilogStatus" ref="dialogFieldRef" @closeDialog="closeDialog" />
  </div>
</template>

<script>
import { date } from 'quasar'
import EditField from './EditField.vue'
export default {
  name: 'ContactField',
  components: {
    EditField
  },
  data () {
    return {
      textSearch: null,
      statusSearch: null,
      contactAuthSearch: null,
      page: {
        pageIndex: 1,
        pSize: 15,
        totalCount: 0
      },
      loading: false,

      selected: [],
      tableFullscreen: null,
      columns: [
        {
          name: 'order',
          label: '排序',
          field: 'order',
          align: 'cneter'
        },
        {
          name: 'label',
          field: 'label',
          label: '字段名称',
          align: 'cneter'
        },
        {
          name: 'status',
          label: '状态',
          field: 'status',
          align: 'cneter'
        },
        {
          name: 'type',
          label: '字段类型',
          field: 'type',
          align: 'cneter'
        }
      ],
      dataList: [], // 列表数据

      syncDate: '',
      fieldTypeObject: this.$store.state.contactField.fieldTypeObject,
      fieldTypeArr: this.$store.state.contactField.fieldTypeArr,
      options_status: [
        {
          label: '展示',
          value: '1'
        },
        {
          label: '不展示',
          value: '0'
        }
      ],

      conditionForm: {
        status: '',
        label: '',
        type: ''
      },
      editDilogStatus: false
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getDataList()
  },
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

    // 加载列表
    getDataList () {
      this.loading = true
      const payload = {
        pageIndex: this.page.pageIndex,
        pSize: this.page.pSize,
        ...this.conditionForm
      }
      this.$store
        .dispatch('contactField/getList', payload)
        .then((res) => {
          if (res.code == 200) {
            // 给分页组件传总数量
            this.dataList = res.data ? res.data.list : []
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
          }
          this.loading = false
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

    // 重置搜索项
    resetSearch () {
      const that = this
      this.conditionForm = {
        status: '',
        label: '',
        type: ''
      }

      // 等待搜索项清空 执行查询列表
      this.$nextTick(() => {
        that.getDataList()
      })
    },

    // 删除列表数据
    deleteData (id) {
      let delIds = []
      if (id) {
        delIds = [id]
      } else {
        delIds = this.selected
      }

      this.loading = true
      this.$store
        .dispatch('contactField/deteleField', { delIds })
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.getDataList()
            this.$q.notify({
              message: '成功',
              caption: `已删除 ${res.data} 条字段信息`,
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })
          } else {
            this.$q.notify({
              message: '失败',
              caption: res.message,
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
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
    closeDialog () {
      this.editDilogStatus = false
      this.getDataList()
    },

    // 新增弹出框
    openEditDialog (fieldId) {
      this.editDilogStatus = true
      this.$nextTick(() => {
        this.$refs.dialogFieldRef.init(fieldId)
      })
    },
    updateOperate (payload) {
      this.$store
        .dispatch('contactField/saveData', payload)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '保存成功！',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })
            this.getDataList()
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
    updateStatus (row) {
      this.updateOperate({
        status: row.status,
        id: row.id
      })
    },
    updateOrder (id, value) {
      this.updateOperate({
        order: value,
        id
      })
    },
    updateLabel (id, value) {
      this.updateOperate({
        order: value,
        id
      })
    }
  }
}
</script>
