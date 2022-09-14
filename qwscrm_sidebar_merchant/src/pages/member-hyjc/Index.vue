<template>
  <q-page>
    <q-header class="bg-white" bordered>
      <q-toolbar class="text-dark">
        <q-btn flat round dense icon="las la-angle-left" @click="$router.go(-1)" />
        <q-toolbar-title class="text-body2 no-padding q-pt-xs"> 寄存记录 </q-toolbar-title>
        <q-btn flat round dense label="新增" color="primary"  :to="{ name: 'memberHyjcEdit' }" />
      </q-toolbar>
      <q-expansion-item expand-separator class="text-dark" label="按条件查询">
        <div class="row q-pa-sm">
          <div class="col-12">
            <q-input outlined bottom-slots v-model="memberInfo" dense clearable @change="getList" @clear="getList" label="请输入会员卡号|手机号|姓名">
              <template v-slot:append>
                <q-icon name="search" @click="getList" />
              </template>
            </q-input>
          </div>

          <div class="col-12">
            <q-input outlined bottom-slots v-model="goodsName" dense clearable @change="getList" @clear="getList" label="请输入物品名称">
              <template v-slot:append>
                <q-icon name="search" @click="getList" />
              </template>
            </q-input>
          </div>
          <div class="col-12">
            <q-input outlined bottom-slots v-model="recordRemarks" dense clearable @change="getList" @clear="getList" label="请输入备注">
              <template v-slot:append>
                <q-icon name="search" @click="getList" />
              </template>
            </q-input>
          </div>
          <div class="col-12">
            <q-select
              outlined
              dense
              bottom-slots
              v-model="goodsType"
              option-value="id"
              option-label="pht_name"
              :options="typeOptions"
              label="请选择分类"
              emit-value
              map-options
              clearable
              @input="getList"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-select>
          </div>
          <div class="col-12">
            <q-input outlined readonly bottom-slots dense v-model="startTime" label="开始时间">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date v-model="startTime" minimal mask="YYYY-MM-DD HH:mm">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup @click="getList" label="确定" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template v-slot:append>
                <q-icon name="close" @click="getList(1)" class="cursor-pointer" v-if="startTime ? true : false" />
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="startTime" mask="YYYY-MM-DD HH:mm" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup @click="getList" label="确定" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-12">
            <q-input outlined readonly bottom-slots dense label="结束时间" v-model="endTime">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date v-model="endTime" minimal mask="YYYY-MM-DD HH:mm">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup @click="getList" label="确定" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template v-slot:append>
                <q-icon name="close" @click="getList(2)" class="cursor-pointer" v-if="endTime ? true : false" />
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="endTime" mask="YYYY-MM-DD HH:mm" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup @click="getList" label="确定" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
      </q-expansion-item>
    </q-header>

    <div class="q-pa-sm " v-if="recordData.length > 0" v-for="(item, key) in recordData" :key="key">
      <q-card bordered flat >
        <q-item>
          <q-item-section avatar>
            <q-img v-if="item.phr_loop_image" :src="`${$store.state.member.cdn_url}` + item.phr_loop_image.split(',')[0]" width="60px" height="60px">
              <template v-if="!item.phr_loop_image">
                <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                  <q-icon name="wallpaper" color="grey" size="25px"> </q-icon>
                </div>
              </template>
              <template v-slot:error>
                <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                  <q-icon name="wallpaper" color="grey" size="25px"> </q-icon>
                </div>
              </template>
            </q-img>
            <q-img v-else width="60px" height="60px">
              <template>
                <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                  <q-icon name="wallpaper" color="grey" size="25px"> </q-icon>
                </div> </template
            ></q-img>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-subtitle1" lines="1">
              {{ item.phr_name }} <span class="text-caption text-grey" v-if="item.type">({{ item.type.pht_name }})</span>
            </q-item-label>
            <div class="row text-caption text-grey">
              <div class="col-6">名称: {{ item.mem_memberName }}</div>
              <div class="col-6">卡号: {{ item.mem_memberCardNum }}</div>
              <div class="col-12">手机号: {{ item.mem_memberMobile }}</div>
              <div class="col-12">数量：{{ item.phr_quantity }}</div>
              <div class="col-12">备注：{{ item.phr_remarks }}</div>
              <div class="col-12">时间：{{ $q_date.formatDate(item.created_at * 1000, 'YYYY-MM-DD HH:mm:ss') }}</div>
            </div>
          </q-item-section>
        </q-item>

        <q-separator />
        <div class="row q-py-sm text-center">
          <div class="col">
            <q-btn outline color="red" size="sm" unelevated label="查看详情" :to="{ name: 'memberHyjcDetail', query: { recordId: item.id } }" />
          </div>
          <q-separator :vertical="true" class="q-mr-xs" />
          <div class="col">
            <q-btn outline color="primary" unelevated size="sm" label="存取" :to="{ name: 'memberHyjcInOut', query: { recordId: item.id } }" />
          </div>
          <q-separator :vertical="true" class="q-mr-xs" />
          <div class="col">
            <q-btn outline color="positive" size="sm" unelevated label="编辑" :to="{ name: 'memberHyjcEdit', query: { recordId: item.id } }" />
          </div>
          <q-separator :vertical="true" class="q-mr-xs" />
          <div class="col">
            <q-btn outline color="red" size="sm" unelevated label="删除" @click="delRecord(item)" />
          </div>
        </div>
      </q-card>
    </div>

    <div class="bg-white text-h6 text-grey text-center" style="padding-top: 50px" v-if="recordData.length == 0">
      <q-icon name="fas fa-box-open" size="58px" class="text-grey-8" />
      <div class="q-pt-md">暂无寄存记录</div>
    </div>

    <q-footer class="text-black bg-white" bordered>
      <div class="flex flex-center">
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.pageIndex"
          :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
          :page-size="page.pageSize"
          :total="page.pageTotal"
        ></hl-pagination>
      </div>
    </q-footer>
  </q-page>
</template>
<script>
export default {
  name: 'hyjcRecord',
  components: {},
  data () {
    return {
      memberInfo: '',
      goodsName: '',
      goodsType: '',
      recordRemarks: '',
      startTime: '',
      endTime: '',
      recordData: [],
      typeOptions: [],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      member_id: ''
    }
  },
  created () {
    if (this.$store.state.oauth.memberRelation && this.$store.state.oauth.memberRelation.member_id) {
      this.member_id = this.$store.state.oauth.memberRelation.member_id

      this.$nextTick(() => {
        this.getTypeList()
        this.getList()
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
  mounted () {

  },
  computed: {},
  methods: {
    getTypeList () {
      this.$store
        .dispatch('member/postApi', {
          do: 'getHyjcType',
          member_id: this.member_id
        })
        .then((res) => {
          if (res.code == 200) {
            this.typeOptions = res.data ? res.data : []
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '操作失败',
              color: 'red'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    getList (data) {
      if (data == 1) {
        this.startTime = ''
      }
      if (data == 2) {
        this.endTime = ''
      }
      if (this.startTime) {
        var startTime = new Date(this.startTime).getTime() / 1000
      }
      if (this.endTime) {
        var endTime = new Date(this.endTime).getTime() / 1000
      }
      const obj = {
        memberInfo: this.memberInfo,
        goodsName: this.goodsName,
        goodsType: this.goodsType,
        startTime,
        endTime,
        recordRemarks: this.recordRemarks,
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        do: 'getHyjcRecord',
        member_id: this.member_id
      }
      this.$store
        .dispatch('member/postApi', obj)
        .then((res) => {
          this.recordData = res.data ? res.data.list : []
          this.page.pageTotal = res.data ? res.data.page.totalCount : 0
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    delRecord (item) {
      this.$q
        .dialog({
          title: '提示',
          message: `确定删除【${item.phr_name}"】吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const obj = {
            hyjcRecirdId: item.id,
            do: 'deteleHyjcRecord',
            member_id: this.member_id
          }
          this.$store.dispatch('member/postApi', obj).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功删除寄存记录',
                color: 'green',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              this.getList()
            }
          })
        })
    },
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    }
  }
}
</script>
