import lodash from 'lodash'

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
export default async ({app, router, store, Vue}) => {
  Vue.prototype.$_ = lodash
}
