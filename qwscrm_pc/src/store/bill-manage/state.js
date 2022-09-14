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
      },
      {
        label: '已归档',
        value: '3'
      }

    ],

    successStatusArray: [

      {
        label: '开票中',
        value: '1'
      },
      {
        label: '已开票',
        value: '2'
      },
      {
        label: '已归档',
        value: '3'
      }

    ],
    billStatusObject: {
      0: '未开票',
      1: '开票中',
      2: '已开票',
      3: '已归档'
    }

  }
}
