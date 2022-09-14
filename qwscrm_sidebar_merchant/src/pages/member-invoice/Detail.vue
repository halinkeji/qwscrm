<template>
  <q-page class="bg-white">
    <!-- 顶部导航 -->
    <q-header class="bg-white" bordered>
      <q-toolbar class="text-grey-8">
        <q-btn flat round dense icon="las la-angle-left" @click="$router.go(-1)" />
        <q-toolbar-title class="text-subtitle1 no-padding q-pt-xs">
          账单详情
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <!-- 内容 -->
    <div class="bg-white q-pa-sm">
      <div class="text-center text-h5" v-if="invoiceData.sc_realMoneyCount">
        {{ invoiceData.sc_realMoneyCount }}
      </div>
      <div class="text-center text-h5" v-if="invoiceData.sc_return_amount > 0">
        {{ invoiceData.sc_return_amount }}
      </div>

      <q-separator class="q-my-sm" />
      <div class="row q-pa-sm">
        <div class="col">消费方式</div>
        <div class="col text-right text-grey">
          {{ invoiceData.sc_consumeTypeName }}
        </div>
      </div>
      <q-separator class="q-my-sm" />
      <q-item>
        <q-item-section>
          <q-item-label class="text-grey-8">单据号</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-item-label class="text-dark" lines="2">{{ invoiceData.sc_invoiceCode }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label class="text-grey-8">会员卡号</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-item-label class="text-dark" lines="2">{{ invoiceData.sc_memberCardNum }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label class="text-grey-8">会员姓名</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-item-label class="text-dark" lines="2">{{ invoiceData.sc_memberName }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label class="text-grey-8">时间</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-item-label class="text-dark" lines="2">{{ $q_date.formatDate(invoiceData.created_at * 1000, 'YYYY-MM-DD HH:mm:ss') }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label class="text-grey-8">应付金额</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-item-label class="text-dark" lines="2"
            >{{ $store.state.member.storeBaseConfig.consume_base_moneySymbol
            }}{{ invoiceData.sc_handleMoneyCount }}</q-item-label
          >
        </q-item-section>
      </q-item>

      <q-item v-if="invoiceData.sc_realMoneyCount > 0">
        <q-item-section>
          <q-item-label class="text-grey-8">实收金额</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-item-label class="text-dark" lines="2"
            >{{ $store.state.member.storeBaseConfig.consume_base_moneySymbol
            }}{{ invoiceData.sc_realMoneyCount }}</q-item-label
          >
        </q-item-section>
      </q-item>

      <q-item v-if="invoiceData.sc_rulePaymentCount > 0">
        <q-item-section>
          <q-item-label class="text-grey-8">商家优惠</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-item-label class="text-dark" lines="2"
            >-{{ $store.state.member.storeBaseConfig.consume_base_moneySymbol
            }}{{ invoiceData.sc_rulePaymentCount }}</q-item-label
          >
        </q-item-section>
      </q-item>

      <q-item v-if="invoiceData.sc_couponPaymentCount > 0">
        <q-item-section>
          <q-item-label class="text-grey-8">卡券优惠</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-item-label class="text-dark" lines="2"
            >-{{ $store.state.member.storeBaseConfig.consume_base_moneySymbol
            }}{{ invoiceData.sc_couponPaymentCount }}</q-item-label
          >
        </q-item-section>
      </q-item>

      <q-item v-if="invoiceData.sc_rounding_amount > 0">
        <q-item-section>
          <q-item-label class="text-grey-8">抹零金额</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-item-label class="text-dark" lines="2"
            >-{{ $store.state.member.storeBaseConfig.consume_base_moneySymbol
            }}{{ invoiceData.sc_rounding_amount }}</q-item-label
          >
        </q-item-section>
      </q-item>

      <q-item v-if="invoiceData.sc_rechargePaymentCount > 0">
        <q-item-section>
          <q-item-label class="text-grey-8"
            >{{ $store.state.member.storeBaseConfig.consume_base_balanceUnit }}支付</q-item-label
          >
        </q-item-section>

        <q-item-section side>
          <q-item-label class="text-dark" lines="2"
            >{{ $store.state.member.storeBaseConfig.consume_base_moneySymbol
            }}{{ this.formatAmount(invoiceData.sc_rechargePaymentCount) }}</q-item-label
          >
        </q-item-section>
      </q-item>

      <q-item v-if="invoiceData.sc_pointPaymentCount > 0">
        <q-item-section>
          <q-item-label class="text-grey-8"
            >{{ $store.state.member.storeBaseConfig.consume_base_integralUnit }}支付</q-item-label
          >
        </q-item-section>

        <q-item-section side>
          <q-item-label class="text-dark" lines="2"
            >{{ $store.state.member.storeBaseConfig.consume_base_moneySymbol
            }}{{ this.formatAmount(invoiceData.sc_pointPaymentCount) }}</q-item-label
          >
        </q-item-section>
      </q-item>

      <q-item v-if="invoiceData.sc_blankPaymentCount > 0">
        <q-item-section>
          <q-item-label class="text-grey-8">银行卡支付</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-item-label class="text-dark" lines="2"
            >{{ $store.state.member.storeBaseConfig.consume_base_moneySymbol
            }}{{ this.formatAmount(invoiceData.sc_blankPaymentCount) }}</q-item-label
          >
        </q-item-section>
      </q-item>

      <q-item v-if="invoiceData.sc_wechatPaymentCount > 0">
        <q-item-section>
          <q-item-label class="text-grey-8">(刷卡)微信支付</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-item-label class="text-dark" lines="2"
            >{{ $store.state.member.storeBaseConfig.consume_base_moneySymbol
            }}{{ this.formatAmount(invoiceData.sc_wechatPaymentCount) }}</q-item-label
          >
        </q-item-section>
      </q-item>

      <q-item v-if="invoiceData.sc_alipayPaymentCount > 0">
        <q-item-section>
          <q-item-label class="text-grey-8">(刷卡)支付宝支付</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-item-label class="text-dark" lines="2"
            >{{ $store.state.member.storeBaseConfig.consume_base_moneySymbol
            }}{{ this.formatAmount(invoiceData.sc_alipayPaymentCount) }}</q-item-label
          >
        </q-item-section>
      </q-item>

      <q-item v-if="invoiceData.sc_wechatPersonalPaymentCount > 0">
        <q-item-section>
          <q-item-label class="text-grey-8">个人微信支付</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-item-label class="text-dark" lines="2"
            >{{ $store.state.member.storeBaseConfig.consume_base_moneySymbol
            }}{{ this.formatAmount(invoiceData.sc_wechatPersonalPaymentCount) }}</q-item-label
          >
        </q-item-section>
      </q-item>

      <q-item v-if="invoiceData.sc_alipayPersonalPaymentCount > 0">
        <q-item-section>
          <q-item-label class="text-grey-8">个人支付宝支付</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-item-label class="text-dark" lines="2"
            >{{ $store.state.member.storeBaseConfig.consume_base_moneySymbol
            }}{{ this.formatAmount(invoiceData.sc_alipayPersonalPaymentCount) }}</q-item-label
          >
        </q-item-section>
      </q-item>

      <q-item v-if="invoiceData.sc_otherPaymentCount > 0">
        <q-item-section>
          <q-item-label class="text-grey-8">其他支付</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-item-label class="text-dark" lines="2"
            >{{ $store.state.member.storeBaseConfig.consume_base_moneySymbol
            }}{{ this.formatAmount(invoiceData.sc_otherPaymentCount) }}</q-item-label
          >
        </q-item-section>
      </q-item>

      <q-item v-if="invoiceData.sc_cashPaymentCount > 0">
        <q-item-section>
          <q-item-label class="text-grey-8">现金支付</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-item-label class="text-dark" lines="2"
            >{{ $store.state.member.storeBaseConfig.consume_base_moneySymbol
            }}{{ this.formatAmount(invoiceData.sc_cashPaymentCount) }}</q-item-label
          >
        </q-item-section>
      </q-item>

      <q-item v-if="invoiceData.sc_real_payment_cash > 0">
        <q-item-section>
          <q-item-label class="text-grey-8">现金实收</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-item-label class="text-dark" lines="2"
            >{{ $store.state.member.storeBaseConfig.consume_base_moneySymbol
            }}{{ this.formatAmount(invoiceData.sc_real_payment_cash) }}</q-item-label
          >
        </q-item-section>
      </q-item>

      <q-item v-if="invoiceData.sc_change_amount > 0">
        <q-item-section>
          <q-item-label class="text-grey-8">现金找零</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-item-label class="text-dark" lines="2"
            >{{ $store.state.member.storeBaseConfig.consume_base_moneySymbol
            }}{{ this.formatAmount(invoiceData.sc_change_amount) }}</q-item-label
          >
        </q-item-section>
      </q-item>

      <!-- <q-item>
      <q-item-section>
        <q-item-label class="text-grey-8">操作员</q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-item-label class="text-dark" lines="2">{{ invoiceData.user ? invoiceData.user.username : '操作员' }}</q-item-label>
      </q-item-section>
    </q-item> -->

      <q-item>
        <q-item-section>
          <q-item-label class="text-grey-8">备注</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-item-label class="text-dark" lines="2">{{ invoiceData.sc_note }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item v-if="parseInt(invoiceData.sc_refund_type) > 0">
        <q-item-section>
          <q-item-label class="text-grey-8">已撤单</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-item-label class="text-dark" lines="2">{{ invoiceData.sc_refund_type_label }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item v-if="invoiceData.hyryx && invoiceData.hyryx.id">
        <q-item-section>
          <q-item-label class="text-grey-8">会员日营销优惠</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-item-label class="text-dark" lines="2"
            >-{{ $store.state.member.storeBaseConfig.consume_base_moneySymbol }}
            {{ invoiceData.hyryx.hr_discount_amount }}</q-item-label
          >
        </q-item-section>
      </q-item>
    </div>

    <div class="q-mt-sm" v-if="invoiceData.consumeInvoiceDetail && invoiceData.consumeInvoiceDetail.length > 0">
      <q-table
        title="消费详情"
        :data="invoiceData.consumeInvoiceDetail"
        :columns="consumeData"
        row-key="id"
        hide-bottom
        flat
        bordered
        title-classs="bg-brown"
        separator="cell"
        :pagination="{
          rowsPerPage: 0,
        }"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <!-- <q-td key="cid_packageName" :props="props">
              <div v-if="props.row.cid_packageName">
                {{ props.row.cid_packageName }}
                <q-tooltip> {{ props.row.cid_packageName }}</q-tooltip>
              </div>
            </q-td> -->
            <q-td key="cid_goo_name" :props="props">
              <div>
                <span v-if="parseInt(props.row.cid_packageId) > 0" class="text-red">[套]</span>
                {{ props.row.cid_goo_name }}{{ props.row.cid_specificationName }}
                <q-tooltip> {{ props.row.cid_goo_name }}{{ props.row.cid_specificationName }}</q-tooltip>
              </div>
            </q-td>
            <q-td key="cid_goo_code" :props="props">
              {{ props.row.cid_goo_code }}
            </q-td>
            <q-td key="cid_consumeNumber" :props="props">
              {{ props.row.cid_consumeNumber }}
            </q-td>
            <q-td
              :key="rowSpan(props.row, props.rowIndex, 'cid_packageName') > 0 ? 'cid_goo_price' : ''"
              :rowspan="rowSpan(props.row, props.rowIndex, 'cid_packageName')"
              :props="props"
            >
              <span v-if="parseInt(props.row.cid_packageId) > 0">
                {{ $store.state.member.storeBaseConfig.consume_base_moneySymbol }} {{ props.row.cid_packagePrice }}
              </span>
              <span v-else>
                {{ $store.state.member.storeBaseConfig.consume_base_moneySymbol }} {{ props.row.cid_goo_price }}
              </span>
            </q-td>
            <q-td
              :props="props"
              :key="rowSpan(props.row, props.rowIndex, 'cid_packageName') > 0 ? 'cid_sellingPrice' : ''"
              :rowspan="rowSpan(props.row, props.rowIndex, 'cid_packageName')"
            >
              {{ $store.state.member.storeBaseConfig.consume_base_moneySymbol }}
              {{ props.row.cid_sellingPrice }}
            </q-td>

            <q-td
              :key="rowSpan(props.row, props.rowIndex, 'cid_packageName') > 0 ? 'cid_totalPrice' : ''"
              :rowspan="rowSpan(props.row, props.rowIndex, 'cid_packageName')"
              :props="props"
            >
              <span v-if="parseInt(props.row.cid_packageId) > 0">
                {{ $store.state.member.storeBaseConfig.consume_base_moneySymbol }}
                {{ formatAmount(props.row.cid_sellingPrice * (props.row.cid_consumeNumber / props.row.cid_package_number)) }}
              </span>
              <span v-else>
                {{ $store.state.member.storeBaseConfig.consume_base_moneySymbol }}
                {{ props.row.cid_totalPrice }}
              </span>
            </q-td>
            <q-td
              :key="rowSpan(props.row, props.rowIndex, 'cid_packageName') > 0 ? 'cid_total_discount' : ''"
              :rowspan="rowSpan(props.row, props.rowIndex, 'cid_packageName')"
              :props="props"
            >
              <span v-if="parseInt(props.row.cid_packageId) > 0">
                {{ $store.state.member.storeBaseConfig.consume_base_moneySymbol }}
                {{
                  formatAmount(
                    formatAmount(props.row.cid_packagePrice * (props.row.cid_consumeNumber / props.row.cid_package_number)) -
                      formatAmount(props.row.cid_sellingPrice * (props.row.cid_consumeNumber / props.row.cid_package_number))
                  )
                }}
              </span>
              <span v-else>
                {{ $store.state.member.storeBaseConfig.consume_base_moneySymbol }}
                {{
                  formatAmount(
                    formatAmount(props.row.cid_consumeNumber * props.row.cid_goo_price) -
                      formatAmount(props.row.cid_consumeNumber * props.row.cid_sellingPrice)
                  )
                }}
              </span>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>

    <div class="q-mt-sm" v-if="invoiceData.invoice && invoiceData.invoice">
      <q-table
        title="退货详情"
        :data="returnGoodsDetail"
        :columns="returnGoodsData"
        row-key="name"
        hide-bottom
        flat
        bordered
        :pagination="{
          rowsPerPage: 0,
        }"
        separator="cell"
      />
    </div>

    <div class="q-mt-sm" v-if="invoiceData.memberRechargeCountDetail && invoiceData.memberRechargeCountDetail.length > 0">
      <q-table
        title="次卡详情"
        :data="invoiceData.memberRechargeCountDetail"
        :columns="consumeCountData"
        row-key="name"
        hide-bottom
        flat
        bordered
        :pagination="{
          rowsPerPage: 0,
        }"
        separator="cell"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="mrc_goodsName" :props="props">
              <div>
                {{ props.row.mrc_goodsName }}
              </div>
            </q-td>
            <q-td key="mrc_count" :props="props">
              <div>
                {{ props.row.mrc_count }}
              </div>
            </q-td>
            <q-td key="mrc_counts" :props="props">
              {{ props.row.countDetail ? props.row.countDetail.mrc_count : 0 }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>

    <div class="q-mt-sm" v-if="invoiceData.rechargeTimeDetail && invoiceData.rechargeTimeDetail.length > 0">
      <q-table
        title="时卡详情"
        :data="invoiceData.rechargeTimeDetail"
        :columns="rechargeTimeData"
        row-key="name"
        hide-bottom
        flat
        bordered
        :pagination="{
          rowsPerPage: 0,
        }"
        separator="cell"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="rtd_goods_name" :props="props">
              <div>{{ props.row.rtd_goods_name }}-{{ props.row.rtd_spe_name ? props.row.rtd_spe_name : '' }}</div>
            </q-td>
            <q-td key="rtd_duration_total" :props="props">
              <div>
                {{ props.row.rtd_duration_total }}
              </div>
            </q-td>
            <q-td key="rtd_duration_totals" :props="props">
              {{ props.row.timeDetail.mtr_duration }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>

    <div class="q-mt-sm" v-if="invoiceData.pointsCountRecord && invoiceData.pointsCountRecord.length > 0">
      <q-table
        :title="`${$store.state.member.storeBaseConfig.consume_base_integralUnit}详情`"
        :data="invoiceData.pointsCountRecord"
        :columns="integralData"
        row-key="name"
        flat
        hide-bottom
        bordered
        :pagination="{
          rowsPerPage: 0,
        }"
        separator="cell"
      />
    </div>

    <div class="q-mt-sm" v-if="invoiceData.moneyCountRecord && invoiceData.moneyCountRecord.length > 0">
      <q-table
        :title="`${$store.state.member.storeBaseConfig.consume_base_balanceUnit}详情`"
        :data="invoiceData.moneyCountRecord"
        :columns="storedData"
        row-key="name"
        hide-bottom
        flat
        :pagination="{
          rowsPerPage: 0,
        }"
        bordered
        separator="cell"
      />
    </div>

    <div class="bg-white q-pa-sm q-mt-sm">
      <div class="text-center">
        单据条形码
      </div>
      <div class=" text-center  flex flex-center">
        <img class="full-width" style="height:100px;" id="barcode" />
      </div>
    </div>
  </q-page>
</template>

<script>
import JsBarcode from 'jsbarcode'
export default {
  name: 'invoiceDetail',
  data () {
    return {
      invoiceData: {},
      returnGoodsDetail: [],

      // 消费详情
      consumeData: [
        // {
        //   label: '套餐名称',
        //   align: 'left',
        //   name: 'cid_packageName',
        //   classes: 'ellipsis'
        // },
        {
          label: '消费项目',
          align: 'center',
          name: 'cid_goo_name',
          style: 'max-width: 150px',
          classes: 'ellipsis'
        },
        {
          align: 'center',
          label: '条码',
          name: 'cid_goo_code'
        },
        {
          label: '数量',
          align: 'center',
          name: 'cid_consumeNumber'
        },
        {
          label: '原价',
          name: 'cid_goo_price',
          align: 'left'
        },
        {
          label: '售价',
          align: 'center',
          name: 'cid_sellingPrice'
        },
        {
          label: '小计',
          name: 'cid_totalPrice',
          align: 'left'
        },
        {
          label: '优惠',
          name: 'cid_total_discount',
          align: 'left'
        }
      ],
      integralData: [
        {
          label: '变更' + this.$store.state.member.storeBaseConfig.consume_base_integralUnit,
          align: 'center',
          field: 'pcr_pointsCount'
        },
        {
          align: 'center',
          label: this.$store.state.member.storeBaseConfig.consume_base_integralUnit + '来源',
          field: 'pcr_pointsCountSource'
        },
        {
          label: this.$store.state.member.storeBaseConfig.consume_base_integralUnit + '状态',
          align: 'center',
          field: 'pcr_pointsCountStatus',
          format: this.formatStatus
        }
      ],
      storedData: [
        {
          label: '变更' + this.$store.state.member.storeBaseConfig.consume_base_balanceUnit,
          align: 'center',
          field: 'mcr_moneyCount'
        },
        {
          align: 'center',
          label: this.$store.state.member.storeBaseConfig.consume_base_balanceUnit + '来源',
          field: 'mcr_moneyCountSource'
        },
        {
          label: this.$store.state.member.storeBaseConfig.consume_base_balanceUnit + '状态',
          align: 'center',
          field: 'mcr_moneyCountStatus',
          format: this.formatStatus
        }
      ],
      // 计次详情
      consumeCountData: [
        {
          label: '消费项目',
          align: 'left',
          field: 'mrc_goodsName',
          style: 'max-width: 150px',
          classes: 'ellipsis',
          name: 'mrc_goodsName',
          format: (val, row) => {
            return row.mrc_goodsName + (row.mrc_speName ? row.mrc_speName : '')
          }
        },
        {
          label: '次数',
          align: 'center',
          field: 'mrc_count',
          name: 'mrc_count'
        },
        {
          label: '剩余次数',
          align: 'center',
          field: 'countDetail.mrc_count',
          name: 'mrc_counts'
        }
      ],
      returnGoodsData: [
        {
          label: '退货项目',
          align: 'left',
          name: 'rgd_goods_name',
          field: 'rgd_goods_name',
          style: 'max-width: 150px',
          classes: 'ellipsis'
        },
        {
          label: '退货数量',
          align: 'center',
          name: 'rgd_return_quantity',
          field: 'rgd_return_quantity'
        },

        {
          label: '售价',
          align: 'center',
          name: 'rgd_selling_price',
          field: 'rgd_selling_price'
        },
        {
          label: '小计',
          name: 'rgd_return_subtotal_price',
          field: 'rgd_return_subtotal_price',
          align: 'center'
        },
        {
          label: '备注',
          name: 'rgd_remarks',
          field: 'rgd_remarks',
          align: 'center'
        }
      ],
      consumeBasisColumn: [
        {
          label: '单据号',
          align: 'left',
          field: 'sc_invoiceCode'
        },
        {
          align: 'left',
          label: '会员卡号',
          field: 'sc_memberCardNum'
        },
        {
          label: '会员姓名',
          align: 'left',
          field: 'sc_memberName'
        },
        {
          label: '时间',
          align: 'left',
          field: 'created_at',
          format: this.formatTime
        },
        {
          label: '应付金额',
          align: 'left',
          field: 'sc_handleMoneyCount'
        },
        {
          label: '实收金额',
          align: 'left',
          field: 'sc_realMoneyCount'
        },
        {
          label: '获得' + this.$store.state.member.storeBaseConfig.consume_base_integralUnit,
          align: 'left',
          field: 'sc_getPoint'
        }
      ],
      consumPayColumn: [
        {
          label: this.$store.state.member.storeBaseConfig.consume_base_balanceUnit + '支付',
          align: 'left',
          field: 'sc_rechargePaymentCount',
          format: (val, row) => {
            return this.formatAmount(val)
          }
        },
        {
          align: 'left',
          label: this.$store.state.member.storeBaseConfig.consume_base_integralUnit + '支付',
          field: 'sc_pointPaymentCount',
          format: (val, row) => {
            return this.formatAmount(val)
          }
        },
        {
          label: '银行卡支付',
          align: 'left',
          field: 'sc_blankPaymentCount',
          format: (val, row) => {
            return this.formatAmount(val)
          }
        },
        {
          label: '(刷卡)微信支付',
          align: 'left',
          field: 'sc_wechatPaymentCount',
          format: (val, row) => {
            return this.formatAmount(val)
          }
        },
        {
          label: '(刷卡)支付宝支付',
          align: 'left',
          field: 'sc_alipayPaymentCount',
          format: (val, row) => {
            return this.formatAmount(val)
          }
        },
        {
          label: '个人微信支付',
          align: 'left',
          field: 'sc_wechatPersonalPaymentCount',
          format: (val, row) => {
            return this.formatAmount(val)
          }
        },
        {
          label: '个人支付宝支付',
          align: 'left',
          field: 'sc_alipayPersonalPaymentCount',
          format: (val, row) => {
            return this.formatAmount(val)
          }
        },
        {
          label: '现金支付',
          align: 'left',
          field: 'sc_cashPaymentCount',
          format: (val, row) => {
            return this.formatAmount(val)
          }
        },
        {
          label: '其他支付',
          align: 'left',
          field: 'sc_otherPaymentCount',
          format: (val, row) => {
            return this.formatAmount(val)
          }
        }
      ],

      rechargeTimeData: [
        {
          label: '时卡项目',
          align: 'left',
          field: 'rtd_goods_name',
          style: 'max-width: 150px',
          classes: 'ellipsis',
          name: 'rtd_goods_name',
          format: (val, row) => {
            return row.rtd_goods_name + (row.rtd_spe_name ? row.rtd_spe_name : '')
          }
        },
        {
          label: '时长（分钟）',
          align: 'center',
          field: 'rtd_duration_total',
          name: 'rtd_duration_total'
        },
        {
          label: '剩余时长（分钟）',
          align: 'center',
          field: 'timeDetail.mtr_duration',
          name: 'rtd_duration_totals'
        }
      ],
      paymentChannel: [],
      extendPay: {},
      hlPay: {}
    }
  },
  mounted () {
    this.getViewData()
  },
  created () {},
  computed: {},
  methods: {
    getViewData () {
      this.viewDetails = true

      if (this.$route.query.invId > 0) {
        this.$store
          .dispatch('member/postApi', { invoiceId: this.$route.query.invId, do: 'getInvoiceView' })
          .then((res) => {
            if (res.code == 200) {
              if (res.data) {
                this.invoiceData = res.data
                setTimeout(() => {
                  this.jsMmeberBarcode(res.data.sc_invoiceCode)
                }, 200)

                this.returnGoodsDetail = res.data.invoice ? res.data.invoice.returnGoodsDetail : {}
              } else {
                this.invoiceData = []
              }
            }
          })
          .catch((error) => {})
      }
    },
    jsMmeberBarcode (memberCardNum) {
      JsBarcode('#barcode', memberCardNum, {
        lineColor: '#333333',
        height: 100,
        displayValue: false
      })
    },
    formatStatus (val) {
      if (parseInt(val) == 1) {
        return '增加'
      } else if (parseInt(val) == 2) {
        return '减少'
      }
      return '未知'
    },
    plusXing (str, frontLen, endLen) {
      if (!str) {
        return ''
      }
      const len = str.length - frontLen - endLen
      let xing = ''
      for (let i = 0; i < len; i++) {
        xing += '*'
      }
      return str.substring(0, frontLen) + xing + str.substring(str.length - endLen)
    },

    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    }
  }
}
</script>

<style></style>
