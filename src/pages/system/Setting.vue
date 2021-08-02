<template>
  <div class="col-auto  self-start q-mx-lg ">
    <q-form
      @submit="onSubmit"
      class="q-gutter-md"
      :style="{ 'max-width':$q.screen.width * 0.6 + 'px'}"
    >
      <div class="text-subtitle2"><q-icon name="las la-square-full" class="text-primary" />基本信息</div>
      <q-separator />
      <q-input dense outlined v-model="corp.name" label="企业名称" />
      <q-input dense outlined v-model="corp.social_code" label="企业统一社会信用代码" />
      <q-input dense outlined v-model="corp.corpid" label="企业微信ID（corpid）" />
      <div class="text-subtitle2"><q-icon name="las la-square-full" class="text-primary" />客户联系人配置</div>
      <q-separator />
      <q-input dense outlined v-model="corp.contact_secret" label="客户联系Secret" />
      <q-input dense outlined v-model="corp.contact_url" label="客户联系接收事件服务器URL">
        <template v-slot:append>
          <q-btn unelevated color="primary" label="复制"  @click="doCopy(corp.contact_url)"/>
        </template>
      </q-input>
      <q-input dense outlined v-model="corp.contact_token" label="客户联系接收事件服务器Token" >
        <template v-slot:append>
          <q-btn unelevated color="primary" label="复制"  @click="doCopy(corp.contact_token)"/>
        </template>
      </q-input>
      <q-input dense outlined v-model="corp.contact_encodingAesKey" label="客户联系接收事件服务器EncodingAESKey" >
        <template v-slot:append>
          <q-btn unelevated color="primary" label="复制"  @click="doCopy(corp.contact_encodingAesKey)"/>
        </template>
      </q-input>
      <div class="text-subtitle2"><q-icon name="las la-square-full" class="text-primary" />通讯录配置</div>
      <q-separator />
      <q-input dense outlined v-model="corp.book_secret" label="通讯录Secret" />
      <q-input dense outlined v-model="corp.book_url" label="通讯录接收事件服务器URL" >
        <template v-slot:append>
          <q-btn unelevated color="primary" label="复制"  @click="doCopy(corp.book_url)"/>
        </template>
      </q-input>
      <q-input dense outlined v-model="corp.book_token" label="通讯录接收事件服务器Token" >
        <template v-slot:append>
          <q-btn unelevated color="primary" label="复制"  @click="doCopy(corp.book_token)"/>
        </template>
      </q-input>
      <q-input dense outlined v-model="corp.book_encodingAesKey" label="通讯录接收事件服务器EncodingAESKey" >
        <template v-slot:append>
          <q-btn unelevated color="primary" label="复制"  @click="doCopy(corp.book_encodingAesKey)" />
        </template>
      </q-input>
      <div>
        <q-btn label="提 交" type="submit" color="primary"  class="q-px-xl" />
      </div>
    </q-form>
  </div>
</template>

<script>
import { copyToClipboard } from 'quasar'
export default {
  name: 'SystemSet',
  data () {
    return {
      corp: {}
    }
  },
  created () {
    this.getCorp()
  },
  methods: {
    getCorp() {
      this.$store
        .dispatch("corp/getCorp")
        .then(res => {
          if (res.code == 200) {
            if(res.data){
              this.corp = res.data ? res.data : {}
              this.corp.contact_url = res.data.contact_url ? res.data.contact_url : process.env.BASE_URL_API + '/v1/contact/contact-callback?CorpId=' + res.data.id
              this.corp.book_url = res.data.book_url ? res.data.book_url : process.env.BASE_URL_API + '/v1/worker/worker-callback?CorpId=' + res.data.id
              console.log(this.corp)
            }
          }
        })
        .catch(error => {})
    },
    onSubmit () {
      this.$store
        .dispatch("corp/setCorp", this.corp)
        .then(res => {
          if (res.code == 200) {
            this.corp = res.data ? res.data : {}
            this.$q.notify({
              color: 'positive',
              textColor: 'white',
              position: 'top-right',
              icon: 'ion-checkmark-circle-outline',
              message: '提交成功'
            })
          }
        })
        .catch(error => {
          this.$q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: '系统异常.'
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
    }
  }
}
</script>
