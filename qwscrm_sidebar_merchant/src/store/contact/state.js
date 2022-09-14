export default function () {
  return {
    billTypeArray: [
      {
        label: '增值税电子普通发票',
        value: '0'
      },
      {
        label: '增值税电子专用发票',
        value: '1'
      },
      {
        label: '纸质发票',
        value: '2'
      }

    ],
    billTypeObject: {
      0: '增值税电子普通发票',
      1: '增值税电子专用发票',
      2: '纸质发票'
    },
    billStatusArray: [
      {
        label: '未开票',
        value: '0'
      },
      {
        label: '开票中',
        value: '1'
      },
      {
        label: '已开票',
        value: '2'
      }

    ],
    billStatusObject: {
      0: '未开票',
      1: '开票中',
      2: '已开票'
    },

    groupContactObject: {
      1: '正常',
      2: '退群'
    },

    groupObject: {
      0: '正常',
      1: '跟进人离职',
      2: '离职继承中',
      3: '离职继承完成',
      4: '已解散'
    },
    groupContactObjectColor: {
      1: 'positive',
      2: 'negative'
    },

    groupObjectColor: {
      0: 'positive',
      1: 'secondary',
      2: 'info',
      3: 'warning',
      4: 'negative'
    }

  }
}
