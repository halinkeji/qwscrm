<template>
  <q-page class="bg-white">
    <q-header class="bg-white">
      <q-toolbar class="text-grey-8">
        <q-btn flat round dense icon="las la-angle-left" @click="$router.go(-1)" />
        <q-toolbar-title class="text-subtitle1 no-padding q-pt-xs"> 抬头管理 </q-toolbar-title>
        <q-btn unelevated color="primary" flat label="添加" :to="{ name: 'memberReceiptEditTitle' }" />
      </q-toolbar>
      <div class="row">
        <q-expansion-item label="根据条件筛选" class="full-width text-dark bg-white">
          <div class="col q-px-sm">
            <q-input
              outlined
              bottom-slots
              clearable
              v-model="name"
              label="可搜索:会员卡号/手机号/昵称"
              dense
              @change="getTitleList"
              @clear="getTitleList"
              class="q-pb-none"
            >
              <template v-slot:append>
                <q-icon name="search" @click="getTitleList" />
              </template>
            </q-input>
          </div>
          <div class="col-12 q-pa-sm">
            <q-select
              outlined
              option-value="value"
              option-label="label"
              emit-value
              map-options
              v-model="type"
              :options="options"
              @input="getTitleList"
              dense
              clearable
              label="可搜索：发票类型"
            >
              <template v-slot:append>
                <q-icon name="search" @click="getTitleList" />
              </template>
            </q-select>
          </div>
          <div class="col-12 q-pa-sm">
            <q-input
              outlined
              bottom-slots
              clearable
              v-model="nameParams"
              label="可搜索:发票抬头/邮箱"
              dense
              @change="getTitleList"
              @clear="getTitleList"
              class="q-pb-none"
            >
              <template v-slot:append>
                <q-icon name="search" @click="getTitleList" />
              </template>
            </q-input>
          </div>
        </q-expansion-item>
      </div>
    </q-header>
    <div class="q-ma-sm" v-if="titleListData.length > 0" v-for="(item, key) in titleListData" :key="key">
      <q-list bordered separator>
        <q-card class="my-card q-mt-sm q-mx-sm no-shadow">
          <q-item>
            <q-item-section>
              <q-item-label class="text-subtitle1" lines="1">抬头名称：{{ item.prt_name }}</q-item-label>
              <q-item-label caption lines="1">
                类型： <span v-if="item.prt_type == 1">个人/事业单位</span> <span v-if="item.prt_type == 2">单位</span>
              </q-item-label>
              <q-item-label caption lines="1"> 联系电话：{{ item.prt_phone }} </q-item-label>
              <q-item-label caption lines="1" v-if="item.prt_type == 2"> 税号：{{ item.prt_identification_number }} </q-item-label>
            </q-item-section>
            <q-item-section v-if="item.mem_memberCardNum">
              <q-item-label class="text-subtitle1" lines="1">卡号：{{ item.mem_memberCardNum }}</q-item-label>
              <q-item-label caption lines="1"> 昵称： {{ item.mem_memberName }} </q-item-label>
              <q-item-label caption lines="1"> 手机号：{{ item.mem_memberMobile }} </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator />
          <div class="row q-py-sm text-center">
            <div class="col">
              <q-btn outline unelevated size="12px" color="primary" :to="{ name: 'memberReceiptEditTitle', query: { id: item.id } }" label="编辑" />
            </div>
            <q-separator :vertical="true" class="q-mr-xs" />
            <div class="col"><q-btn outline unelevated size="12px" color="red" @click="delTitle(item)" class="q-ml-sm" label="删除" /></div>
          </div>
        </q-card>
      </q-list>
    </div>

    <div class="bg-white text-h6 text-grey text-center" style="padding-top: 50px" v-if="titleListData.length == 0">
      <q-icon name="fas fa-box-open" size="58px" class="text-grey-8" />
      <div class="q-pt-md">暂无发票抬头信息</div>
    </div>

    <q-footer class="text-black bg-white" bordered>
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[10, 20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pageSize"
        :total="page.pageTotal"
      ></hl-pagination>
    </q-footer>
  </q-page>
</template>
<script>
export default {
  name: 'ReceiptTitle',
  components: {},
  data () {
    return {
      titleListData: [],
      name: '',
      type: '',
      nameParams: '',
      options: [
        {
          label: '个人',
          value: 1
        },
        {
          label: '单位',
          value: 2
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 15,
        pageTotal: 0
      },
      showNoTitle: false,
      member_id: ''
    }
  },
  created () {
    if (this.$store.state.oauth.memberRelation && this.$store.state.oauth.memberRelation.member_id) {
      this.member_id = this.$store.state.oauth.memberRelation.member_id

      this.$nextTick(() => {
        this.getTitleList()
      })
    } else {
      this.$q.notify({
        message: '错误',
        caption: '当前客户未激活会员！',
        icon: 'ion-close-circle-outline',
        color: 'red',
        timeout: 500,
        position: 'top-right'
      })
      this.$router.push({ name: 'home' })
      return false
    }
  },
  mounted () {},
  computed: {},
  methods: {
    getTitleList () {
      const obj = {
        type: this.type,
        name: this.name,
        nameParams: this.nameParams,
        nomember: 1,
        pageIndex: this.page.pageIndex,
        pSize: this.page.pageSize,
        do: 'getReceiptTitleData',
        member_id: this.member_id
      }
      this.$store
        .dispatch('member/postApi', obj)
        .then((res) => {
          if (res.code == 200) {
            this.titleListData = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    delTitle (item) {
      this.$q
        .dialog({
          title: '提示',
          message: `确定删除【${item.prt_name}】吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const obj = {
            titleId: item.id,
            do: 'deteleReceiptTitle'
          }
          this.$store
            .dispatch('member/postApi', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '成功删除发票抬头',
                  color: 'green',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.getTitleList()
              }
            })
            .catch((err) => {
              this.$q.notify({
                message: '失败',
                caption: err.message,
                color: 'red',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            })
        })
    },
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getTitleList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getTitleList()
    }

  }
}
</script>
