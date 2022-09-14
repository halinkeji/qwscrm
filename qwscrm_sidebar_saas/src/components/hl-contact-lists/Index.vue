<template>
  <q-dialog v-model="contactDialogStatus" persistent maximized transition-show="slide-up" transition-hide="slide-down">
    <q-layout view="Lhh lpR fff" container class="bg-white">
      <q-header class=" q-pa-sm items-center bg-white text-dark">
        <div class="row">
          <div class="text-subtitle">选择用户</div>
          <q-space />
          <q-btn dense @click="closeDialog" flat icon="close" />
        </div>

        <div class="row">
          <q-input outlined class="full-width" dense v-model="name" @clear="getContactList" clearable label="可搜索昵称|姓名">
            <template v-slot:after>
              <q-btn color="primary" label="搜索" @click="getContactList" unelevated />
            </template>
          </q-input>
        </div>
      </q-header>
      <q-page-container>
        <q-page>
          <q-list bordered separator v-if="contactDataList && contactDataList.length > 0">
            <q-item clickable v-ripple :key="`contact-${key}`" v-for="(item, key) in contactDataList">
              <q-item-section avatar>
                <q-avatar>
                  <q-img ratio="1" :src="item.avatar" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ item.name }}</q-item-label>
                <q-item-label caption lines="1">
                  昵称：{{ item.nick_name }}
                  <span class="text-positive" v-if="parseInt(item.type) == 2"> @企业微信联系人 </span>
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-btn round unelevated size="sm" @click="getCheckContact(item)" color="primary" icon="add" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-page>
      </q-page-container>
      <q-footer bordered class="bg-grey-2 text-white">
        <q-toolbar>
          <q-toolbar-title class="flex flex-center">
            <q-pagination @input="changePaginationHandle" v-model="page.page" :max-pages="6" :max="maxPage" input input-class="text-orange-10" />
          </q-toolbar-title>
        </q-toolbar>
      </q-footer>
    </q-layout>
  </q-dialog>
</template>

<script>
export default {
  name: 'hl-contact-lists',
  components: {},
  data () {
    return {
      contactDialogStatus: false,
      contactDataList: [],
      page: {
        pSize: 20,
        page: 1,
        totalCount: 0
      },
      name: ''
    }
  },
  computed: {
    maxPage () {
      return Math.ceil(this.page.totalCount / this.page.pSize) && Math.ceil(this.page.totalCount / this.page.pSize) != 'Infinity'
        ? Math.ceil(this.page.totalCount / this.page.pSize)
        : 1
    }
  },
  mounted () {},
  created () {},
  methods: {
    init () {
      this.contactDialogStatus = true
      this.getContactList()
    },
    closeDialog () {
      this.contactDialogStatus = false
      this.$emit('closeDialog')
    },
    getContactList () {
      this.$store
        .dispatch('contact/getList', { ...this.page, name: this.name })
        .then((res) => {
          if (res.code == 200) {
            this.contactDataList = res.data ? res.data.list : []
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((error) => {})
    },
    changePaginationHandle () {
      this.getContactList()
    },
    getCheckContact (item) {
      if (item.id) {
        this.contactDialogStatus = false

        this.$nextTick(() => {
          this.$emit('getCheckContact', item)
        })
      }
    }
  }
}
</script>
