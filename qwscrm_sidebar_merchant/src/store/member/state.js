export default function () {
  return {
    payStatusData: [
      { value: 4, text: '未支付' },
      { value: 1, text: '支付成功' },
      { value: 2, text: '支付失败' },
      { value: 3, text: '退款成功' }
    ],
    consumePayType: [
      { value: '储值支付', text: '储值支付' },
      { value: '积分支付', text: '积分支付' },
      { value: '银行卡支付', text: '银行卡支付' },
      { value: '(刷卡)微信支付', text: '(刷卡)微信支付' },
      { value: '(刷卡)支付宝支付', text: '(刷卡)支付宝支付' },
      { value: '个人微信支付', text: '个人微信支付' },
      { value: '个人支付宝支付', text: '个人支付宝支付' },
      { value: '现金支付', text: '现金支付' },
      { value: '其他支付', text: '其他支付' }
    ],
    consumeTypeData: [
      { value: 'consume', label: '消费收银' },
      { value: 'quickConsume', label: '快速消费' },
      { value: 'addCount', label: '增加计次' },
      { value: 'addGroupCount', label: '套餐充次' },
      { value: 'rechargeMoney', label: '会员充值' },
      { value: 'addDuration', label: '增加计时' },
      { value: 'addGroupDuration', label: '套餐充时' },
      { value: 'wxmall', label: '会员商城' },
      { value: 'jfmall', label: '积分商城' },
      { value: 'Paidreg', label: '开卡营销' },
      { value: 'Kmjh', label: '卡密营销' },
      { value: 'Market', label: '分佣营销' },
      { value: 'checkin', label: '签到营销' },
      { value: 'bmtk', label: '报名拓客营销' }
    ],
    returnStatusData: [
      { value: 1, text: '按原路退回' },
      { value: 2, text: '余额--退款', rechargeMoney: true },
      { value: 3, text: '现金--退款' },
      { value: 4, text: '微信--退款' },
      { value: 5, text: '支付宝-退款' },
      { value: 6, text: '银行卡-退款' },
      { value: 7, text: '其他--退款' }
    ],
    returnData: [
      { value: 2, text: '余额--退款' },
      { value: 3, text: '现金--退款' },
      { value: 4, text: '微信--退款' },
      { value: 5, text: '支付宝-退款' },
      { value: 6, text: '银行卡-退款' },
      { value: 7, text: '其他--退款' }
    ],
    storeBaseConfig: {
      consume_base_isPassword: '0',
      consume_base_countUnit: '次',
      consume_base_balanceUnit: '储值',
      consume_base_integralUnit: '积分',
      consume_base_moneyUnit: '元',
      consume_base_moneySymbol: '￥',
      consume_base_memberCardPassword: '888888',
      consume_base_balancePayVerify: '0',
      consume_base_balanceNoSecret: '0',
      consume_base_integralPayVerify: '0',
      consume_base_integralConvert: '3',
      consume_base_attachmentShare: '0',
      consume_base_regBindFormField: ''
    },
    cdn_url: '',
    propertyItem: {
      1: '免费领取',
      2: '储值购买',
      3: '积分兑换',
      4: '主动购买',
      5: '混合领取',
      6: '其他属性',
      7: '主动群发'
    },
    typeItem: {
      1: '折扣券',
      2: '代金券',
      3: '礼品券',
      4: '团购券',
      5: '优惠券',
      6: '积分券',
      7: '储值券'
    },
    memberInfo: {}

  }
}
