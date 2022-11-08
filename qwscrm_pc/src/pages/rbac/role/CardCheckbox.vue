<template>
  <div>
    <q-card flat horizontal bordered class="q-mt-xs" :key="`card-${k}-i`" v-for="(i, k) in currentChildData">
      <q-card-section horizontal>
        <q-card-section horizontal class="q-px-sm">
          <q-checkbox size="sm" v-model="i.check_name" @input="changMenuDataValue(i, $event, currentData)" :val="i.name" :label="i.title" />
        </q-card-section>
        <q-separator vertical />
        <q-card-section>
          <!-- <div class="text-red" v-if="i.default_meta && i.default_meta.length > 0">权限</div>
          <q-separator v-if="i.default_meta && i.default_meta.length > 0" /> -->

          <q-checkbox
            size="sm"
            @input="changeMetaData(i,  $event, currentData)"
            v-model="i.check_meta"
            :key="index"
            :val="value.id"
            :label="value.title"
            v-for="(value, index) in i.default_meta"
          />

          <div v-if="i && i.children"><card-checkbox :currentData="i" @changeChildMetaData="changeChildMetaData" @changMenuData="changMenuData" :currentChildData="i.children" /></div>
        </q-card-section>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
export default {
  name: 'CardCheckbox',
  components: {},
  props: {
    currentChildData: {
      type: Array
    },
    currentData: {
      type: Object
    }
  },
  data () {
    return {
      metaData: [],
      menuData: [],
      menuCurrentData: []
    }
  },

  mounted () {},
  created () {},
  computed: {},
  methods: {
    changeMetaData (item, meta, currentData) {
      const that = this

      if (meta && meta.length > 0) {
        item.check_name = [item.name]
        that.$emit('changMenuData', item, 1, currentData)
      }

      if (meta && meta.length <= 0) {
        item.check_name = []
        that.$emit('changMenuData', item, -1, currentData)
      }

      that.$emit('changeChildMetaData', item, meta)
    },

    changMenuDataValue (value, checkData, currentData) {
      const that = this

      if (checkData.indexOf(value.name) > -1) {
        if (value.default_meta && value.default_meta.length > 0) {
          value.check_meta = value.default_meta.map((item) => {
            return item.id
          })

          value.meta = value.default_meta.map((item) => {
            return item
          })
        }
        that.loopChangMenu(value, 1, currentData)
        this.$emit('changMenuData', value, 1)
      } else {
        value.check_meta = []
        value.meta = []
        that.loopChangMenu(value, -1, currentData)
        this.$emit('changMenuData', value, -1)
      }
    },

    changMenuData (value, status, currentData) {
      this.$emit('changMenuData', value, status)
    },

    loopChangMenu (data, status, currentData) {
      const that = this
      if (status > 0 && data && data.children && data.children.length > 0) {
        data.children.forEach(function (item, key) {
          item.check_name = [item.name]
          if (item && item.default_meta) {
            item.check_meta = item.default_meta.map((i) => {
              return i.id
            })
            item.meta = item.default_meta.map((i) => {
              return i
            })
          }

          that.$emit('changMenuData', item, 1, currentData)
          if (item && item.children) {
            that.loopChangMenu(item, status, currentData)
          }
        })
      } else {
        if (data && data.children && data.children.length > 0) {
          data.children.forEach(function (item, key) {
            item.check_name = []
            if (item && item.default_meta) {
              item.check_meta = []
              item.meta = []
            }
            that.$emit('changMenuData', item, -1, currentData)
            if (item && item.children) {
              that.loopChangMenu(item, status, currentData)
            }
          })
        }
      }
    },
    changeChildMetaData (item, meta) {
      this.$emit('changeChildMetaData', item, meta)
    }
  }
}
</script>
