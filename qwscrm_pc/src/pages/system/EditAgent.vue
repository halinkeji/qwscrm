<template>
  <q-dialog v-model="dilogStatue" persistent>
    <q-card
      :style="{
        width: $q.screen.width * 0.3 + 'px',
        'min-width': $q.screen.width * 0.3 + 'px',
      }"
    >
      <q-card-section class="text-body1">
        新增应用
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form ref="dataFormRef" class="row">
          <div class="col-12 q-px-xs">
            <q-input outlined v-model="dataForm.agentid" dense label="企业应用id" :rules="[(val) => !!val || '请输入企业应用id']" />
          </div>
          <div class="col-12 q-px-xs">
            <q-input outlined v-model="dataForm.secret" dense label="应用Secret" :rules="[(val) => !!val || '请输入应用Secret']" />
          </div>
        </q-form>
      </q-card-section>
      <q-separator />
      <q-card-section class="text-center q-gutter-sm">
        <q-btn color="primary" class="q-px-md" unelevated @click="saveLog" label="保存" />
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
        corpid: '',
        type: '',
        agentid: '',
        secret: '',
        name: '',
        square_logo_url: '',
        description: '',
        allow_userinfos: [],
        allow_partys: [],
        close: '1',
        allow_tags: [],
        redirect_domain: '1',
        report_location_flag: '1',
        is_reportenter: '1',
        home_url: '',
        customized_publish_status: '1',
        user_type: ''
      },
      statusArr: [
        {
          label: '是',
          value: '0'
        },
        {
          label: '否',
          value: '1'
        }
      ],

      flagArr: [
        {
          label: '不上报',
          value: '0'
        },
        {
          label: '进入会话上报',
          value: '1'
        }
      ],
      reportenterArr: [
        {
          label: '不接收',
          value: '0'
        },
        {
          label: '接收',
          value: '1'
        }
      ],

      publishArr: [
        {
          label: '待开发-企业已授权 服务商未创建应用',
          value: '0'
        },
        {
          label: '开发中-服务商已创建应用 未上线',
          value: '1'
        },
        {
          label: '已上线-服务商已上线应用且不存在未上线版本',
          value: '2'
        },
        {
          label: '存在未上线版本-服务商已上线应用但存在未上线版本',
          value: '3'
        }
      ],
      typeArr: [
        {
          label: '自建应用',
          value: '1'
        },
        {
          label: '第三方代开发应用',
          value: '2'
        },
        {
          label: '第三方标准应用',
          value: '3'
        }
      ],
      userTypeArr: [
        {
          label: '平台',
          value: 'saas'
        },
        {
          label: '商家',
          value: 'merchant'
        }
      ],
      uploadImgStatus: false,
      contactDialogStatus: false
    }
  },
  computed: {},
  mounted () {},
  created () {},
  methods: {
    init (agentId) {
      this.dilogStatue = true
      if (agentId > 0) {
        this.agentId = agentId
        this.getData()
      }
    },
    getData () {
      this.$store
        .dispatch('agent/getItem', this.agentId)
        .then((res) => {
          if (res.code == 200) {
            this.dataForm = res.data ? res.data : {}
            if (this.dataForm && this.dataForm.allow_userinfos) {
              this.dataForm.allow_userinfos = JSON.parse(this.dataForm.allow_userinfos)
            }

            if (this.dataForm && this.dataForm.allow_partys) {
              this.dataForm.allow_partys = JSON.parse(this.dataForm.allow_partys)
            }

            if (this.dataForm && this.dataForm.allow_tags) {
              this.dataForm.allow_tags = JSON.parse(this.dataForm.allow_tags)
            }
          }
        })
        .catch((error) => {})
    },
    getImageData (info) {
      this.uploadImgStatus = false
      this.dataForm.square_logo_url = info[0].base_url
    },

    closeDialog () {
      this.dilogStatue = false
      this.$emit('closeDialog')
    },
    closeUpload () {
      this.uploadImgStatus = false
    },
    openSelectWorker () {
      this.contactDialogStatus = true
      this.$nextTick(() => {
        this.$refs.contactListsRef.init()
      })
    },
    bindUserRelation (data) {
      this.contactDialogStatus = false
      if (data && data.length > 0) {
        const that = this
        data.forEach(function (item) {
          if (
            _.findIndex(that.dataForm.allow_userinfos, function (o) {
              return o.userid == item.qw_userid
            }) < 0
          ) {
            that.dataForm.allow_userinfos.push({
              userid: item.qw_userid,
              name: item.name
            })
          }
        })
      }
    },
    deleteUserInfos (key) {
      this.dataForm.allow_userinfos.splice(key, 1)
    },

    saveLog () {
      this.$refs.dataFormRef.validate().then((success) => {
        if (success) {
          const obj = {
            AgentId: this.dataForm.agentid,
            Secret: this.dataForm.secret
          }
          this.$store
            .dispatch('agent/cloudSyncGet', obj)
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
