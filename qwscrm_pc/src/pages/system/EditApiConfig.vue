<template>
  <q-dialog v-model="dilogStatue" persistent>
    <q-card
      :style="{
        width: $q.screen.width * 0.3 + 'px',
        'min-width': $q.screen.width * 0.3 + 'px',
      }"
    >
      <q-card-section class="text-body1">
        API配置
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form ref="dataFormRef" class="row">
          <div class="col-12 q-px-xs">
            <q-input outlined v-model="dataForm.url" dense label="应用接收消息服务器URL" :rules="[(val) => !!val || '请输入应用接收消息服务器URL']" />
          </div>
          <div class="col-12 q-px-xs">
            <q-input outlined v-model="dataForm.token" dense label="应用Token" :rules="[(val) => !!val || '请输入应用Token']" >
               <template v-slot:append>
                <q-btn color="primary" label="生成" @click="dataForm.token = randomString(16)" />
              </template>
            </q-input>
          </div>
           <div class="col-12 q-px-xs">
            <q-input outlined v-model="dataForm.encodingAesKey" dense label="应用的EncodingAESKey" :rules="[(val) => !!val || '请输入应用的EncodingAESKey']" >
                <template v-slot:append>
                <q-btn color="primary" label="生成" @click="dataForm.encodingAesKey = randomString(43)" />
              </template>
            </q-input>
          </div>
        </q-form>
      </q-card-section>
      <q-separator />
      <q-card-section class="text-center q-gutter-sm">
        <q-btn color="primary" class="q-px-md" unelevated @click="saveConfig" label="保存" />
        <q-btn color="grey" class="q-px-md" unelevated @click="closeDialog" label="关闭" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'EditAgent',
  components: {},
  data () {
    return {
      dilogStatue: false,
      agentId: '',
      dataForm: {
        id: '',
        url: '',
        token: '',
        encodingAesKey: ''
      },

      uploadImgStatus: false,
      contactDialogStatus: false,
      currentAgentId: ''
    }
  },
  computed: {
    contactUrl () {
      const system_local = this.$q.localStorage.getItem('qwscrm_system_local')
      const corpData = this.$q.localStorage.getItem('qwscrm_corp_data')
      if (system_local) {
        return system_local.info.site_url + '/qwscrm/v1/agent/event-callback?CorpId=' + corpData.id + '&AgentId=' + this.currentAgentId
      }

      return ''
    }
  },
  mounted () {},
  created () {},
  methods: {
    init (agentId) {
      this.dilogStatue = true
      if (agentId > 0) {
        this.agentId = agentId
        this.getData()
      } else {
        this.dataForm.url = this.contactUrl
      }
    },
    getData () {
      this.$store
        .dispatch('agent/getItem', this.agentId)
        .then((res) => {
          if (res.code == 200) {
            const configData = res.data
            this.currentAgentId = configData && configData.agentid ? configData.agentid : ''
            this.dataForm.url = configData && configData.url ? configData.url : this.contactUrl
            this.dataForm.token = configData && configData.token ? configData.token : ''
            this.dataForm.encodingAesKey = configData && configData.encodingAesKey ? configData.encodingAesKey : ''
          }
        })
        .catch((error) => {})
    },

    closeDialog () {
      this.dilogStatue = false
      this.$emit('closeDialog')
    },

    randomString (n) {
      const str = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      let res = ''
      for (let i = 0; i < n; i++) {
        const id = Math.ceil(Math.random() * 35)
        res += str[id]
      }
      return res
    },

    saveConfig () {
      this.$refs.dataFormRef.validate().then((success) => {
        if (success) {
          const obj = {
            ...this.dataForm,
            id: this.agentId
          }
          this.$store
            .dispatch('agent/editData', obj)
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
    }
  }
}
</script>
