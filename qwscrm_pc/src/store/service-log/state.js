export default function () {
  return {
    logTypeArr: [
      {
        label: '常规售后',
        value: '1'
      },
      {
        label: '续费延期',
        value: '2'
      },
      {
        label: '赠送延期',
        value: '3'
      },
      {
        label: '功能开发',
        value: '4'
      },
      {
        label: '其他事务',
        value: '5'
      }
    ],
    logTypeObject: {
      1: '常规售后',
      2: '续费延期',
      3: '赠送延期',
      4: '功能开发',
      5: '其他事务'
    },
    applyObject: {
      platform: '平台管理端',
      docs: '文档管理系统',
      onlystore: '通用单门店版',
      oneyouka: '智慧油卡单店版',
      myouka: '智慧油卡多站版',
      chainstore: '通用多店版',
      lsonestore: '智慧零售单店版',
      lschainstore: '智慧零售多店版',
      myonestore: '智慧美业单店版',
      mychainstore: '智慧美业多店版',
      cyonestore: '智慧餐饮单店版',
      cychainstore: '智慧餐饮多店版',
      fzonestore: '智慧服装单店版',
      fzchainstore: '智慧服装多店版',
      qwscrm: '哈林企微SCRM',
      hlpay: '哈林数字支付系统',
      hlshop: '哈林电商系统'
    }

  }
}
