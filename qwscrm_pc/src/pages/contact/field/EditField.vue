<template>
  <q-dialog v-model="editDialogStatus">
    <q-card
      class="full-width"
      :style="{
        width: this.$q.screen.width * 0.4,
      }"
    >
      <q-form ref="fieldFormRef">
        <q-card-section>
          <div class="text-h6">{{ fieldForm.id ? '修改' : '新增' }}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input v-model="fieldForm.order" dense label="字段排序" outlined autofocus />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input v-model="fieldForm.label" :rules="[(val) => !!val || '请输入字段名称']" dense label="字段名称" outlined autofocus />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-select
            v-model="fieldForm.status"
            :options="options_status"
            outlined
            label="请选择状态"
            dense
            option-label="label"
            option-value="value"
            map-options
            emit-value
            :rules="[(val) => val >= 0 || '请输入内容']"
          ></q-select>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-select
            v-model="fieldForm.type"
            :options="fieldTypeArr"
            outlined
            label="格式"
            dense
            option-label="label"
            option-value="value"
            map-options
            emit-value
            :rules="[(val) => val >= 0 || '请输入内容']"
          ></q-select>
        </q-card-section>

        <q-card-section class="q-pt-none" v-if="['1', '2', '3'].indexOf(fieldForm.type) > -1">
          <q-card flat bordered>
            <q-card-section>
              选项内容
            </q-card-section>
            <q-separator />
            <q-card-section>
              <div v-for="(item, key) in fieldForm.field_data">
                <q-input outlined v-model="item.label" label="内容项" dense :rules="[(val) => !!val || '请输入内容']">
                  <template v-slot:after>
                    <q-btn round flat unelevated color="negative" @click="removeData(key)" dense icon="remove_circle" />
                  </template>
                </q-input>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-actions align="center">
              <q-btn unelevated class="q-px-md" color="primary" @click="addFieldData">新增</q-btn>
            </q-card-actions>
          </q-card>
        </q-card-section>

        <q-card-actions align="right" class="bg-white ">
          <q-btn unelevated label="保存" @click="editData" class="q-px-sm" color="primary" />
          <q-btn unelevated label="关闭" @click="closeDialog" class="q-px-sm" color="grey" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { date } from 'quasar'
export default {
  name: 'ContactField',
  components: {},
  data () {
    return {
      editDialogStatus: false,
      fieldForm: {
        name: '',
        label: '',
        type: '0',
        field_data: [],
        status: '1',
        order: '0'
      },
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
      fieldId: ''
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
    init (fieldId) {
      this.editDialogStatus = true
      if (fieldId > 0) {
        this.fieldId = fieldId
        this.getFieldDetail()
      }
    },
    getFieldDetail () {
      this.$store
        .dispatch('contactField/getData', this.fieldId)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.fieldForm = res.data
            if (this.fieldForm && this.fieldForm.field_data) {
              this.fieldForm.field_data = JSON.parse(this.fieldForm.field_data)
            }
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
    addFieldData () {
      this.fieldForm.field_data.push({
        label: '',
        value: ''
      })
    },
    removeData (key) {
      if (this.fieldForm && this.fieldForm.field_data) {
        this.fieldForm.field_data.splice(key, 1)
      }
    },
    closeDialog () {
      this.editDialogStatus = false

      this.$nextTick(() => {
        this.$emit('closeDialog')
      })
    },
    editData () {
      this.$refs.fieldFormRef.validate().then((success) => {
        if (success) {
          const payload = {
            ...this.fieldForm
          }
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
                this.closeDialog()
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
        } else {
          // oh no, user has filled in
          // at least one invalid value
        }
      })
    }
  }
}
</script>
