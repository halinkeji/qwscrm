<template>
  <div class="col-auto  self-start q-mx-lg ">
    <q-form @submit="onSubmit" class="q-gutter-md" :style="{ 'max-width': $q.screen.width * 0.6 + 'px' }">

      <div class="text-subtitle2"><q-icon name="las la-square-full" class="text-primary" />通讯配置</div>
      <q-separator />
      <q-input dense outlined v-model="providerForm.corpid" label="服务商的corpid" />
      <q-input dense outlined v-model="providerForm.secret" label="服务商的secret">

      </q-input>
      <q-input dense outlined readonly v-model="providerForm.url" label="服务商系统事件接收URL" v-if="providerForm.id > 0">
        <template v-slot:append>
          <q-btn unelevated color="primary" label="复制" @click="doCopy(providerForm.url)" />
        </template>
      </q-input>
      <q-input dense outlined v-model="providerForm.token" label="服务商Token">
        <template v-slot:append>
          <q-btn unelevated color="primary" label="复制" v-if="providerForm.token" @click="doCopy(providerForm.token)" />
           <q-btn color="primary" label="生成新的" v-else @click="providerForm.token = randomString(16)" />
        </template>
      </q-input>

      <q-input dense outlined v-model="providerForm.encodingAesKey" label="服务商EncodingAESKey">
        <template v-slot:append>
          <q-btn unelevated color="primary" label="复制" v-if="providerForm.encodingAesKey" @click="doCopy(providerForm.encodingAesKey)" />
           <q-btn color="primary" label="生成新的"  v-else @click="providerForm.encodingAesKey = randomString(32)" />
        </template>
      </q-input>

      <div>
        <q-btn label="提 交" type="submit" color="primary" class="q-px-xl" />
      </div>
    </q-form>
  </div>
</template>

<script>
import { LocalStorage, copyToClipboard } from 'quasar'

export default {
  name: 'SystemSet',
  data () {
    return {
      providerForm: {
        corpid: '',
        secret: '',
        url: '',
        token: '',
        encodingAesKey: ''
      }
    }
  },
  created () {
    this.getProviderData()
  },
  computed: {
    contactUrl () {
      const system_local = this.$q.localStorage.getItem('qwscrm_system_local')

      if (system_local) {
        return system_local.info.site_url + '/qwscrm/v1/provider/callback?ProviderId='
      }

      return ''
    }
  },
  methods: {
    getProviderData () {
      this.$store
        .dispatch('provider/getData')
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.providerForm = res.data ? res.data : {}
            } else {
              this.providerForm.url = this.contactUrl
            }
          }
        })
        .catch((error) => {})
    },
    onSubmit () {
      this.$store
        .dispatch('provider/setData', this.providerForm)
        .then((res) => {
          if (res.code == 200) {
            this.providerForm = res.data ? res.data : {}
            // LocalStorage.set('qwscrm_corp_data', res.data)
            this.$q.notify({
              color: 'positive',
              textColor: 'white',
              position: 'top-right',
              icon: 'ion-checkmark-circle-outline',
              message: '提交成功'
            })
          } else {
            this.$q.notify({
              color: 'red-5',
              textColor: 'white',
              position: 'top-right',
              icon: 'warning',
              message: res.message
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: error.message
          })
        })
    },
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
    },
    randomString (n) {
      const str = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      let res = ''
      for (let i = 0; i < n; i++) {
        const id = Math.ceil(Math.random() * 35)
        res += str[id]
      }
      return res
    }
  }
}
</script>
