<template>
  <div class="col-auto  self-start q-mx-lg ">
    <q-form>
      <div class="text-subtitle2"><q-icon name="las la-square-full" class="text-primary" />应用主页URL</div>
      <q-separator class="q-my-sm" />
      <q-input dense bottom-slots outlined readonly v-model="contactUrl" label="应用主页URL">
        <template v-slot:append>
          <q-btn color="primary" unelevated @click="doCopy(contactUrl)" label="复制" />
        </template>
      </q-input>
      <!-- <q-input dense bottom-slots outlined readonly v-model="chatUrl" label="群聊地址">
        <template v-slot:append>
          <q-btn color="primary" unelevated @click="doCopy(chatUrl)" label="复制" />
        </template>
      </q-input> -->
    </q-form>
  </div>
</template>

<script>
import { copyToClipboard } from 'quasar'

export default {
  name: 'SystemSet',
  data () {
    return {}
  },
  created () {},
  computed: {
    contactUrl () {
      const system_local = this.$q.localStorage.getItem('qwscrm_system_local')

      if (system_local) {
        return system_local.info.site_url + '/m/qwscrm/merchant/?agentId=#'
      }

      return ''
    },
    chatUrl () {
      return ''
    }
  },
  methods: {
    doCopy (val) {
      copyToClipboard(val)
        .then(() => {
          this.$q.notify({
            color: 'positive',
            textColor: 'white',
            position: 'top-right',
            icon: 'ion-checkmark-circle-outline',
            message: '复制成功'
          })
        })
        .catch(() => {
          this.$q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: '复制失败.'
          })
        })
    }
  }
}
</script>
