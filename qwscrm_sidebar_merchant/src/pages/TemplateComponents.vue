<template>
  <q-card flat>
    <q-form ref="addTemplateRef">
      <div v-if="fieldData">
        <div v-for="(item, key) in fieldData" :key="key">
          <div v-if="item.pff_field_attribute == 'input'" class="q-mb-sm">
            <q-input
              outlined
              dense
              v-model="fieldTemplateData[item.pff_field_name]"
              :label="item.pff_field_label"
              :placeholder="item.pff_field_placeholder"
              :rules="[
                (val) =>
                  (parseInt(item.pff_is_required) != 1 ? true : !!val && parseInt(item.pff_is_required) == 1 ? true : false) ||
                  item.pff_field_label + '为必填项',
              ]"
            />
          </div>
          <div v-if="item.pff_field_attribute == 'textarea'" class="q-mb-sm">
            <q-input
              outlined
              dense
              v-model="fieldTemplateData[item.pff_field_name]"
              :label="item.pff_field_label"
              :placeholder="item.pff_field_placeholder"
              type="textarea"
              :rows="3"
            />
          </div>
          <div v-if="item.pff_field_attribute == 'select'" class="q-mb-sm">
            <q-select
              outlined
              dense
              v-model="fieldTemplateData[item.pff_field_name]"
              :options="item.pff_field_param"
              :label="item.pff_field_label"
              clearable
              emit-value
              map-options
              :rules="[
                (val) =>
                  (parseInt(item.pff_is_required) != 1 ? true : !!val && parseInt(item.pff_is_required) == 1 ? true : false) ||
                  item.pff_field_label + '为必填项',
              ]"
            />
          </div>
          <div v-if="item.pff_field_attribute == 'checkbox'" class="q-mb-sm">
            <q-field
              outlined
              v-model="fieldTemplateData[item.pff_field_name]"
              :label="item.pff_field_label"
              stack-label
              :rules="[
                (val) =>
                  (parseInt(item.pff_is_required) != 1 ? true : val.length > 0 && parseInt(item.pff_is_required) == 1 ? true : false) ||
                  item.pff_field_label + '为必填项',
              ]"
            >
              <template v-slot:control>
                <q-checkbox v-model="fieldTemplateData[item.pff_field_name]" :val="i" :label="i" v-for="(i, k) in item.pff_field_param" :key="k" />
              </template>
            </q-field>
          </div>
          <div v-if="item.pff_field_attribute == 'radio'" class="q-mb-sm">
            <q-field
              outlined
              v-model="fieldTemplateData[item.pff_field_name]"
              :label="item.pff_field_label"
              stack-label
              :rules="[
                (val) =>
                  (parseInt(item.pff_is_required) != 1 ? true : !!val && parseInt(item.pff_is_required) == 1 ? true : false) ||
                  item.pff_field_label + '为必填项',
              ]"
            >
              <template v-slot:control>
                <q-radio v-model="fieldTemplateData[item.pff_field_name]" :val="i" :label="i" v-for="(i, k) in item.pff_field_param" :key="k" />
              </template>
            </q-field>
          </div>
        </div>
      </div>
    </q-form>
  </q-card>
</template>
<script>
export default {
  name: 'TemplateComponetns',
  components: {},
  props: ['saveStatus'],
  data () {
    return {
      tableName: {
        name: ''
      },
      memberId: '',
      otherId: '',
      fieldTemplateData: {},
      fieldData: []
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    getList (formItem) {
      const params = formItem
      this.memberId = formItem.memberId
      this.otherId = formItem.otherId
      this.$store
        .dispatch('formfield/getFormFieldList', params)
        .then((res) => {
          if (res.code == 200) {
            this.tableName.name = res.data.formField.pff_table_name
            this.fieldData = res.data.formField.field ? res.data.formField.field : []
            this.fieldTemplateData = res.data.formData ? res.data.formData : {}
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    setData () {
      this.$refs.addTemplateRef.validate().then((success) => {
        if (success) {
          if (this.saveStatus) {
            return {
              fieldTemplateData: this.fieldTemplateData
            }
          }
          const params = {
            memberId: this.memberId,
            otherId: this.otherId,
            ...this.tableName,
            fieldTemplateData: this.fieldTemplateData
          }
          this.$store
            .dispatch('formfield/setFormData', params)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.fieldTemplateData.id > 0 ? '修改' : '新增'}` + '成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.$emit('saveSuccess', res.data)
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
              }
            })
            .catch((err) => {
              this.$q.notify({
                message: '失败',
                caption: err.message,
                color: 'red',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            })
        }
      })
    }
  }
}
</script>
