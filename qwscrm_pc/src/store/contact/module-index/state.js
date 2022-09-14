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
    },
    eventObject: {
      100: '企业员工添加为好友',
      101: '企业员工编辑客户信息',
      102: '企业员工删除客户',
      103: '客户删除企业员工',
      104: '客户接替失败',
      105: '客户群创建',
      106: '客户群变更',
      1061: '群主变更',
      1062: '群名称变更',
      1063: '群公告变更',
      1064: '成员入群',
      1065: '成员退群',
      107: '客户群解散',
      108: '企业客户标签创建',
      109: '企业客户标签变更',
      110: '企业客户标签删除',
      1: '给客户打标签',
      2: '编辑用户画像',
      3: '客户评论朋友圈',
      4: '客户点赞朋友圈'
    },
    eventArr: [
      {
        label: '企业员工添加为好友',
        value: '100'
      },
      {
        label: '企业员工编辑客户信息',
        value: '101'
      },
      {
        label: '企业员工删除客户',
        value: '102'
      },
      {
        label: '客户删除企业员工',
        value: '103'
      },
      {
        label: '客户接替失败',
        value: '104'
      },
      {
        label: '客户群创建',
        value: '105'
      },
      {
        label: '客户群变更',
        value: '106'
      },
      {
        label: '群主变更',
        value: '1061'
      },
      {
        label: '群名称变更',
        value: '1062'
      },
      {
        label: '群公告变更',
        value: '1063'
      },
      {
        label: '成员入群',
        value: '1064'
      },
      {
        label: '成员退群',
        value: '1065'
      },
      {
        label: '客户群解散',
        value: '107'
      },
      {
        label: '企业客户标签创建',
        value: '108'
      },
      {
        label: '企业客户标签变更',
        value: '109'
      },
      {
        label: '企业客户标签删除',
        value: '110'
      },
      {
        label: '给客户打标签',
        value: '1'
      },
      {
        label: '编辑用户画像',
        value: '2'
      },
      {
        label: '客户评论朋友圈',
        value: '3'
      },
      {
        label: '客户点赞朋友圈',
        value: '4'
      }

    ]
  }
}
