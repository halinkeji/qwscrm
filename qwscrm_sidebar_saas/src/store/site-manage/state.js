export default function () {
  return {
    applyStatusArr: [
      {
        label: '免费版',
        value: 'm'
      },
      {
        label: '商业版',
        value: 's'
      },
      {
        label: '运营版',
        value: 'w'
      },
      {
        label: '源码版',
        value: 'y'
      },
      {
        label: '盗版',
        value: 'p'
      }
    ],
    applyStatusObject: {
      m: '免费版',
      s: '商业版',
      w: '运营版',
      y: '源码版',
      p: '盗版'
    },
    siteStatusObject: {
      1: '已授权',
      0: '未授权',
      '-1': '禁用'
    },
    siteStatusArr: [
      {
        label: '已授权',
        value: 1
      },
      {
        label: '未授权',
        value: 0
      },
      {
        label: '禁用',
        value: '-1'
      }

    ],

    siteOperateActionItem: {
      auth: '更改授权',
      status: '更改站点状态',
      install: '安装',
      upgrade: '升级',
      edit: '信息修改'
    }
  }
}
