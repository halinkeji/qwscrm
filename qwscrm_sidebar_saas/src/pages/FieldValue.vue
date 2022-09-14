<template>
  <q-dialog v-model="fieldDialogStatus">
    <q-card
      :style="{
        width: $q.screen.width + 'px',
        'max-width': $q.screen.width + 'px',
      }"
    >
      <q-card-section>
        <div class="text-subtitle2">修改信息</div>
      </q-card-section>

      <q-card-section class="q-pt-none" v-if="parseInt(currentFieldData.type) == 0">
        <q-input outlined v-model="currentValue" :label="currentFieldData.label" dense />
      </q-card-section>

      <q-card-section class="q-pt-none" v-if="parseInt(currentFieldData.type) == 1">
        <q-radio v-model="currentValue" :val="item.label" :label="item.label" :key="`radio-${key}`" v-for="(item, key) in currnetFieldData" />
      </q-card-section>

      <q-card-section class="q-pt-none" v-if="parseInt(currentFieldData.type) == 2">
        <q-checkbox v-model="currentValue" :val="item.label" :label="item.label" :key="`checkbox-${key}`" v-for="(item, key) in currnetFieldData" />
      </q-card-section>

      <q-card-section class="q-pt-none" v-if="parseInt(currentFieldData.type) == 3">
        <q-select
          outlined
          map-options
          dense
          emit-value
          option-label="label"
          option-value="label"
          v-model="currentValue"
          :options="currnetFieldData"
          :label="currentFieldData.label"
        />
      </q-card-section>

      <q-card-section class="q-pt-none" v-if="parseInt(currentFieldData.type) == 4">

        <hl-file-upload
          :cardTitle="currentFieldData.label"
          :multiple="true"
          ref="hlFileUploadRef"
          :valuePath="currentValue"
          @filePath="getUploadData"
          @deleteFile="getUploadData"
        ></hl-file-upload>
      </q-card-section>

      <q-card-section class="q-pt-none" v-if="parseInt(currentFieldData.type) == 5">
        <q-date v-model="currentValue" flat class="full-width" minimal />
      </q-card-section>

      <q-card-section class="q-pt-none" v-if="parseInt(currentFieldData.type) == 6">
        <q-time v-model="currentValue" flat class="full-width" />
      </q-card-section>

      <q-card-section class="q-pt-none" v-if="parseInt(currentFieldData.type) == 7">
        <q-input outlined v-model="currentValue" :label="currentFieldData.label" type="number" dense />
      </q-card-section>

      <q-card-section class="q-pt-none" v-if="parseInt(currentFieldData.type) == 8">
        <q-input outlined v-model="currentValue" :label="currentFieldData.label" dense>
          <template v-slot:append> % </template>
        </q-input>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn unelevated class="q-px-xl" label="保存" @click="saveFieldValue" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'FieldValue',
  components: {},
  data () {
    return {
      fieldDialogStatus: false,
      currentFieldData: {},
      currentValue: null,
      contact_id: '',
      currnetFieldData: []
    }
  },
  computed: {},
  mounted () {},
  watch: {},
  created () {},
  methods: {
    init (item, contact_id) {
      this.fieldDialogStatus = true
      this.currentFieldData = item
      this.contact_id = contact_id

      this.currnetFieldData = JSON.parse(item.field_data)

      if (item.value) {
        if (parseInt(item.type) == 2) {
          this.filterEmptyData(JSON.parse(item.value))
        } else if (parseInt(item.type) == 4) {
          this.$nextTick(() => {
            this.currentValue = JSON.parse(item.value)
          })
        } else {
          this.currentValue = item.value
        }
      } else {
        if (parseInt(item.type) == 2) {
          this.currentValue = []
        } else if (parseInt(item.type) == 4) {
          this.currentValue = []
        }
      }
    },
    filterEmptyData (val) {
      if (val) {
        const that = this
        if (this.currnetFieldData && this.currnetFieldData.length > 0) {
          that.currentValue = []
          val.forEach(function (item, key) {
            if (_.findIndex(that.currnetFieldData, function (o) { return o.label == item }) > -1) {
              that.currentValue.push(item)
            }
          })
        } else {
          this.currentValue = []
        }
      }
    },
    saveFieldValue () {
      const item = {
        contact_field_id: this.currentFieldData.id,
        contact_id: this.contact_id
      }
      if (parseInt(this.currentFieldData.type) == 2) {
        item.value = JSON.stringify(this.currentValue)
      } else if (parseInt(this.currentFieldData.type) == 4) {
        item.value = JSON.stringify(this.currentValue)
      } else {
        item.value = this.currentValue
      }
      this.$store
        .dispatch('contact/setFieldValueData', item)
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
    },
    closeDialog () {
      this.fieldDialogStatus = false
      this.$emit('closeDialog')
    },
    getUploadData (e) {
      if (this.currentValue) {
        this.currentValue.push(e)
      }
    }
  }
}
</script>
