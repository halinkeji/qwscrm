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
    }

  }
}
