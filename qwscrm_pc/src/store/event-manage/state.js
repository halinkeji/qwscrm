export default function () {
  return {

    eventStatusArr: [
      {
        label: '未开始',
        value: '0'
      },
      {
        label: '进行中',
        value: '1'
      },
      {
        label: '挂起',
        value: '2'
      },
      {
        label: '已归档',
        value: '3'
      }

    ],
    eventStatusObject: {
      0: '未开始',
      1: '进行中',
      2: '挂起',
      3: '已归档'
    },
    eventLevelObject: {
      0: '一般',
      1: '重要',
      2: '紧急',
      3: '超紧急'
    },
    eventLevelArr: [
      {
        label: '一般',
        value: '0'
      },
      {
        label: '重要',
        value: '1'
      },
      {
        label: '紧急',
        value: '2'
      },
      {
        label: '超紧急',
        value: '3'
      }

    ]
  }
}
