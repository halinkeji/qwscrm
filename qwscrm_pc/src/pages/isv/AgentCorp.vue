<template>
  <q-dialog v-model="dilogStatue" persistent full-height>
    <q-card
      :style="{
        width: $q.screen.width * 0.8 + 'px',
        'min-width': $q.screen.width * 0.8 + 'px',
      }"
      class="fit"
    >
      <q-card-section class="text-body1 row q-pa-sm">
        授权企业 <q-space /> <q-btn round color="dark" @click="closeDialog" dense flat  icon="las la-times-circle" />
      </q-card-section>
      <q-separator />
      <q-card-section>
       <hl-table
          row-key="id"
          dense
          stickyHeader
          :data="dataList"
          :columns="columns"
          :loading="loading"
          separator="cell"
          hide-pagination
        >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="corpid" :props="props">
            {{ props.row.corpid }}
          </q-td>
          <q-td key="corp_name" :props="props">
            {{ props.row.corp_name }}
          </q-td>
            <q-td key="corp_type" :props="props">
            {{ typeObject[props.row.corp_type] }}
          </q-td>

          <q-td key="corp_round_logo_url" :props="props">
            <q-img ratio="1" width="32px" height="32px" :src="props.row.corp_round_logo_url" />
          </q-td>
            <q-td key="corp_square_logo_url" :props="props">
             <q-img ratio="1" width="32px" height="32px" :src="props.row.corp_square_logo_url" />
          </q-td>
            <q-td key="corp_user_max" :props="props">
            {{ props.row.corp_user_max }}
          </q-td>

            <q-td key="corp_full_name" :props="props">
            {{ props.row.corp_full_name }}
          </q-td>
            <q-td key="verified_end_time" :props="props">
            {{ props.row.verified_end_time }}
          </q-td>

          <q-td key="subject_type" :props="props">
            {{ typeSubjectObject[props.row.subject_type] }}
          </q-td>

          <q-td key="corp_scale" :props="props">
            {{ props.row.corp_scale }}
          </q-td>

          <q-td key="corp_industry" :props="props">
            {{ props.row.corp_industry }}
          </q-td>

          <q-td key="corp_sub_industry" :props="props">
            {{ props.row.corp_sub_industry }}
          </q-td>
           <q-td key="location" :props="props">
            {{ props.row.location }}
          </q-td>

        </q-tr>
      </template>
       </hl-table>
      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'AgentCorp',
  components: {},
  data () {
    return {
      dilogStatue: false,
      agentData: {},
      dataList: [],
      columns: [
        { name: 'corpid', label: '授权方企业微信id', field: 'corpid', align: 'left' },
        { name: 'corp_name', label: '授权方企业名称', field: 'corp_name', align: 'left' },
        { name: 'corp_type', label: '授权方企业类型', field: 'corp_type', align: 'left' },
        { name: 'corp_round_logo_url', label: '授权方企业圆形头像', field: 'corp_round_logo_url', align: 'left' },
        { name: 'corp_square_logo_url', label: '授权方企业方形头像', field: 'corp_square_logo_url', align: 'left' },
        { name: 'corp_user_max', label: '授权方企业用户规模', field: 'corp_user_max', align: 'left' },
        { name: 'corp_full_name', label: '授权方企业的主体名称', field: 'corp_full_name', align: 'left' },
        { name: 'verified_end_time', label: '认证到期时间', field: 'verified_end_time', align: 'left' },
        { name: 'subject_type', label: '企业类型', field: 'subject_type', align: 'left' },
        { name: 'corp_scale', label: '企业规模', field: 'corp_scale', align: 'left' },
        { name: 'corp_industry', label: '企业所属行业', field: 'corp_industry', align: 'left' },
        { name: 'corp_sub_industry', label: '企业所属子行业', field: 'corp_sub_industry', align: 'left' },
        { name: 'location', label: '地址', field: 'location', align: 'left' }
      ],
      uploadImgStatus: false,
      contactDialogStatus: false,
      loading: true,
      typeObject: {
        verified: '认证号',
        unverified: '注册号'
      },
      typeSubjectObject: {
        1: '企业',
        2: '政府以及事业单位',
        3: '其他组织',
        4: '团队号'
      }
    }
  },
  computed: {

  },
  mounted () {},
  created () {},
  methods: {
    init (agentData) {
      this.loading = false
      this.dilogStatue = true
      this.agentData = agentData
      this.getData()
    },
    getData () {
      this.$store
        .dispatch('providerSuite/getCropList', {
          providerSuiteId: this.agentData.id
        })
        .then((res) => {
          if (res.code == 200) {
            this.dataList = res.data ? res.data : []
          }
        })
        .catch((error) => {})
    },

    closeDialog () {
      this.dilogStatue = false
      this.$emit('closeDialog')
    }

  }
}
</script>
