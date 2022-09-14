export default function () {
  return {
    contractStatusArr: [
      {
        label: '乙方已签章',
        value: '0'
      },
      {
        label: '待甲方签章',
        value: '1'
      },
      {
        label: '甲方已签章',
        value: '2'
      },
      {
        label: '已归档',
        value: '3'
      },
      {
        label: '待邮寄',
        value: '4'
      },
      {
        label: '已邮寄',
        value: '5'
      },
      {
        label: '待回邮',
        value: '6'
      }

    ],
    dianziContractStatus: [
      {
        label: '乙方已签章',
        value: '0'
      },
      {
        label: '待甲方签章',
        value: '1'
      },
      {
        label: '甲方已签章',
        value: '2'
      },
      {
        label: '已归档',
        value: '3'
      }

    ],
    returnContractStatus: [
      {
        label: '退款中',
        value: '7'
      },
      {
        label: '已退款',
        value: '8'
      }
    ],

    contractStatusObject: {
      0: '乙方已签章',
      1: '待甲方签章',
      2: '甲方已签章',
      3: '已归档',
      4: '待邮寄',
      5: '已邮寄',
      6: '待回邮',
      7: '退款中',
      8: '已退款'
    }

  }
}
