<template>
  <q-page class="bg-white q-pb-md">
    <!-- 顶部导航 -->
    <q-header class="bg-white" bordered>
      <q-toolbar class="text-grey-8">
        <q-btn flat round dense icon="las la-angle-left" @click="$router.go(-1)" />
        <q-toolbar-title class="text-subtitle1 no-padding q-pt-xs">
          发票详情
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <!-- 内容 -->
    <q-card class="my-card q-mt-sm q-mx-sm no-shadow">
      <q-item>
        <q-item-section>
          <q-item-label lines="1" side>
            <span>电子发票</span>
            <span class="q-ml-lg">
              <span v-if="itemData.pr_status == 0">
                开票中
              </span>
              <span v-if="itemData.pr_status == 1">
                已开票
              </span></span
            >
          </q-item-label>
        </q-item-section>
        <!-- <q-item-section side>
          查看
        </q-item-section> -->
      </q-item>
    </q-card>
    <div class="bg-white">
      <div class="q-mx-sm">
        <div class="row q-pa-sm">
          <div class="col-3 text-grey">发票类型</div>
          <div class="col text-left text-bold text-subtitle2">
            <span>电子发票 </span>
          </div>
        </div>
        <div class="row q-pa-sm">
          <div class="col-3 text-grey">单据金额</div>
          <div class="col text-left text-bold text-subtitle2">
            {{ $store.state.member.storeBaseConfig.consume_base_moneySymbol }}{{ itemData.pr_invoice_amount }}
          </div>
        </div>
        <div class="row q-pa-sm">
          <div class="col-3 text-grey">发票金额</div>
          <div class="col text-left text-bold text-subtitle2">
            {{ $store.state.member.storeBaseConfig.consume_base_moneySymbol }}{{ itemData.pr_total_amount }}
          </div>
        </div>
        <div class="row q-pa-sm">
          <div class="col-3 text-grey">发票单据号</div>
          <div class="col text-left text-bold text-subtitle2">{{ itemData.pr_invoice_code }}</div>
        </div>
        <div class="row q-pa-sm">
          <div class="col-3 text-grey">发票代码</div>
          <div class="col text-left text-bold text-subtitle2">{{ itemData.pr_status == 0 ? '开票中' : itemData.pr_invoice_code_info }}</div>
        </div>
        <div class="row q-pa-sm">
          <div class="col-3 text-grey">发票号码</div>
          <div class="col text-left text-bold text-subtitle2">{{ itemData.pr_status == 0 ? '开票中' : itemData.pr_invoice_number }}</div>
        </div>
        <div class="row q-pa-sm">
          <div class="col-3 text-grey">抬头类型</div>
          <div class="col text-left text-bold text-subtitle2">{{ itemData.pr_type == 1 ? '个人/事业单位' : '单位' }}</div>
        </div>
        <div class="row q-pa-sm">
          <div class="col-3 text-grey">发票抬头</div>
          <div class="col text-left text-bold text-subtitle2">
            {{ itemData.pr_title_name }}
          </div>
        </div>
        <div class="row q-pa-sm" v-if="itemData.pr_type == 2">
          <div class="col-3 text-grey">纳税人识别号</div>
          <div class="col text-left text-bold text-subtitle2">
            {{ itemData.pr_identification_number }}
          </div>
        </div>
        <div class="row q-pa-sm">
          <div class="col-3 text-grey">联系电话</div>
          <div class="col text-left text-bold text-subtitle2">
            {{ itemData.pr_phone }}
          </div>
        </div>
        <div class="row q-pa-sm">
          <div class="col-3 text-grey">邮箱地址</div>
          <div class="col text-left text-bold text-subtitle2">
            {{ itemData.pr_email }}
          </div>
        </div>
        <div class="row q-pa-sm" v-if="itemData.pr_type == 2 && itemData.pr_bank">
          <div class="col-3 text-grey">开户行</div>
          <div class="col text-left text-bold text-subtitle2">
            {{ itemData.pr_bank }}
          </div>
        </div>
        <div class="row q-pa-sm" v-if="itemData.pr_type == 2 && itemData.pr_bank_number">
          <div class="col-3 text-grey">银行账号</div>
          <div class="col text-left text-bold text-subtitle2">
            {{ itemData.pr_bank_number }}
          </div>
        </div>
        <div class="row q-pa-sm" v-if="itemData.pr_type == 2 && itemData.pr_address">
          <div class="col-3 text-grey">单位地址</div>
          <div class="col text-left text-bold text-subtitle2">
            {{ itemData.pr_address }}
          </div>
        </div>

        <div class="row q-pa-sm">
          <div class="col-3 text-grey">申请时间</div>
          <div class="col text-left  text-bold text-subtitle2">
            {{ $q_date.formatDate(itemData.created_at * 1000, 'YYYY-MM-DD  HH:mm:ss') }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="itemData.record" class="q-px-sm">
      <q-expansion-item expand-separator :label="`包含单据(` + itemData.record.length + `)`">
        <div v-for="(item, key) in itemData.record" :key="key">
          <q-list bordered separator>
            <q-item class="q-pa-sm" v-if="item.invoice">
              <q-item-section>
                <div class="row text-caption text-grey q-mt-xs">
                  <div class="col-12 ellipsis">单据号：{{ item.invoice.sc_invoiceCode }}</div>
                  <div class="col-6 ellipsis">消费类型：{{ item.invoice.sc_consumeTypeName }}</div>
                  <div class="col-6 ellipsis">实收金额：{{ item.invoice.sc_realMoneyCount }}</div>
                  <div class="col-6 ellipsis">时间：{{ $q_date.formatDate(item.invoice.created_at * 1000, 'YYYY-MM-DD HH:mm:ss') }}</div>
                  <div class="col-6 ellipsis">备注：{{ item.invoice.sc_note }}</div>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-expansion-item>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'memberReceiptDetail',
  data () {
    return {
      itemData: {
        record: []
      },
      member_id: ''
    }
  },
  created () {
    if (this.$store.state.oauth.memberRelation && this.$store.state.oauth.memberRelation.member_id) {
      this.member_id = this.$store.state.oauth.memberRelation.member_id

      this.$nextTick(() => {
        this.getViewData()
      })
    } else {
      this.$q.notify({
        message: '错误',
        caption: '当前客户未激活会员！',
        icon: 'ion-close-circle-outline',
        color: 'red',
        timeout: 500,
        position: 'top-right'
      })
      this.$router.push({ name: 'home' })
      return false
    }
  },
  mounted () {

  },
  computed: {},
  methods: {
    getViewData () {
      this.$store
        .dispatch('member/postApi', {
          do: 'getOpenReceiptDetail',
          recordId: this.$route.params.id,
          member_id: this.member_id
        })
        .then((res) => {
          if (res.code == 200) {
            this.itemData = res.data ? res.data : []
          }
        })
        .catch((error) => {})
    }
  }
}
</script>
