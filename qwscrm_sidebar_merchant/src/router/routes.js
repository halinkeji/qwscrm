
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', component: () => import('pages/Index.vue'), meta: { auth: true }, name: 'home' },
      { path: '/track', component: () => import('pages/Track.vue'), meta: { auth: true } },
      { path: '/event', component: () => import('pages/event/Index.vue'), meta: { auth: true } },
      { path: '/member-track-record', component: () => import('pages/member-track/Record.vue'), meta: { auth: true }, name: 'memberTrackRecord' }

    ]
  },
  {
    path: '/',
    component: () => import('layouts/MemberLayout.vue'),
    children: [

      { path: '/member-tag', component: () => import('pages/member-tag/Index.vue'), meta: { auth: true }, name: 'memberTag' },
      { path: '/member-card-secret', component: () => import('pages/member-manage/CardSecret.vue'), meta: { auth: true }, name: 'memberCardSecret' },
      { path: '/member-change-card', component: () => import('pages/member-manage/ChangeCard.vue'), meta: { auth: true }, name: 'memberChangeCard' },
      { path: '/member-extension', component: () => import('pages/member-manage/Extension.vue'), meta: { auth: true }, name: 'memberExtension' },
      { path: '/member-reg', component: () => import('pages/member-manage/Reg.vue'), meta: { auth: true }, name: 'memberReg' },
      { path: '/member-edit', component: () => import('pages/member-manage/Edit.vue'), meta: { auth: true }, name: 'memberEdit' },
      { path: '/member-code', component: () => import('pages/member-manage/Code.vue'), meta: { auth: true }, name: 'memberCode' },
      { path: '/member-upgrade', component: () => import('pages/member-manage/Upgrade.vue'), meta: { auth: true }, name: 'memberUpgrade' },
      { path: '/member-consume-invoice', component: () => import('pages/member-invoice/Index.vue'), meta: { auth: true }, name: 'memberConsumeInvoice' },
      { path: '/member-invoice-detail', component: () => import('pages/member-invoice/Detail.vue'), meta: { auth: true }, name: 'memberInvoiceDetail' },
      { path: '/member-balance-invoice', component: () => import('pages/member-invoice/Balance.vue'), meta: { auth: true }, name: 'memberBalanceInvoice' },
      { path: '/member-integral-invoice', component: () => import('pages/member-invoice/Integral.vue'), meta: { auth: true }, name: 'memberIntegralInvoice' },
      { path: '/member-grow-record', component: () => import('pages/member-invoice/GrowRecord.vue'), meta: { auth: true }, name: 'memberGrowRecord' },
      { path: '/member-count-card', component: () => import('pages/member-invoice/CountCard.vue'), meta: { auth: true }, name: 'memberCountCard' },
      { path: '/member-count-recharge', component: () => import('pages/member-invoice/CountRecharge.vue'), meta: { auth: true }, name: 'memberCountRecharge' },
      { path: '/member-count-consume', component: () => import('pages/member-invoice/CountConsume.vue'), meta: { auth: true }, name: 'memberCountConsume' },
      { path: '/member-timing-card', component: () => import('pages/member-invoice/TimingCard.vue'), meta: { auth: true }, name: 'memberTimingCard' },
      { path: '/member-timing-recharge', component: () => import('pages/member-invoice/TimingRecharge.vue'), meta: { auth: true }, name: 'memberTimingRecharge' },
      { path: '/member-timing-consume', component: () => import('pages/member-invoice/TimingConsume.vue'), meta: { auth: true }, name: 'memberTimingConsume' },
      { path: '/member-coupon-list', component: () => import('pages/member-invoice/CouponList.vue'), meta: { auth: true }, name: 'memberCouponList' },
      { path: '/member-jfmall-order-record', component: () => import('pages/member-invoice/JfmallOrderRecord.vue'), meta: { auth: true }, name: 'memberJfmallOrder' },
      { path: '/member-jfmall-order-detail', component: () => import('pages/member-invoice/JfmallOrderDetail.vue'), meta: { auth: true }, name: 'memberJfmallOrderDetail' },
      { path: '/member-hyjc-record', component: () => import('pages/member-hyjc/Index.vue'), meta: { auth: true }, name: 'memberHyjcRecord' },
      { path: '/member-hyjc-edit', component: () => import('pages/member-hyjc/Edit.vue'), meta: { auth: true }, name: 'memberHyjcEdit' },
      { path: '/member-hyjc-inOut', component: () => import('pages/member-hyjc/InOut.vue'), meta: { auth: true }, name: 'memberHyjcInOut' },
      { path: '/member-hyjc-detail', component: () => import('pages/member-hyjc/Detail.vue'), meta: { auth: true }, name: 'memberHyjcDetail' },
      { path: '/member-receipt-index', component: () => import('pages/member-receipt/Index.vue'), meta: { auth: true }, name: 'memberReceiptIndex' },
      { path: '/member-receipt-title', component: () => import('pages/member-receipt/Title.vue'), meta: { auth: true }, name: 'memberReceiptTitle' },
      { path: '/member-receipt-edit-title', component: () => import('pages/member-receipt/EditTitle.vue'), meta: { auth: true }, name: 'memberReceiptEditTitle' },
      { path: '/member-receipt-open', component: () => import('pages/member-receipt/OpenReceipt.vue'), meta: { auth: true }, name: 'memberOpenReceipt' },
      { path: '/member-receipt-record', component: () => import('pages/member-receipt/Record.vue'), meta: { auth: true }, name: 'memberReceiptRecrod' },
      { path: '/member-receipt-detail', component: () => import('pages/member-receipt/ReceiptDetail.vue'), meta: { auth: true }, name: 'memberReceiptDetail' },
      { path: '/member-track-edit', component: () => import('pages/member-track/EditTrack.vue'), meta: { auth: true }, name: 'memberEditTrack' }

    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/Login.vue')
  },
  {
    path: '/bind-member',
    name: 'BindMember',
    component: () => import('pages/BindMember.vue')
  },
  
  {
    path: '/bind-success',
    name: 'bindSuccess',
    component: () => import('pages/Success.vue')
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    name: 'error',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
