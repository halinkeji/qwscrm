<template>
  <div  >
    <q-dialog
      v-model="analysisDialogStatus"
      persistent
    >
      <q-card :style="{
        'min-width':this.$q.screen.width * 0.6 + 'px',
      }">
        <q-card-section>
          <div class="text-h6">{{ analysisData.name }} - 工作统计汇总</div>
        </q-card-section>
 
        <q-card-section class="q-pt-none">
          <div class="q-pa-md row items-start q-gutter-md">
            <q-card class="my-card" v-for="i in app" :key="`app-${i}`">
              <q-card-actions vertical align="center">
                <div class="text-h3">333</div>
              </q-card-actions>
              <q-card-section class="bg-primary text-white">
                <div class="text-h6 text-center">发起申请数</div>
                <div class="text-caption text-weight-thin">成员通过「搜索手机号」、「扫一扫」等渠道主动向客户发起的好友申请数量。</div>
              </q-card-section>

              
            </q-card>
          </div>
        </q-card-section>
        <q-card-actions align="center" class="bg-white ">
          <q-btn unelevated label="关闭" @click="resetAnalysisData" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <hl-table
      row-key="id"
      dense
      stickyHeader
      :data="dataList"
      :columns="columns"
      selection="multiple"
      :selected.sync="selected"
      :fullscreen.sync="tableFullscreen"
      :loading="loading"
      separator="cell"
    >
      <template v-slot:top="props">
        <div class="row q-col-gutter-x-md q-col-gutter-y-xs full-width">
          <q-input
            v-model="textSearch"
            class="col-6 col-sm-4 col-md-3 col-lg-2"
            dense
            placeholder="姓名"
          />
          <!-- <q-select
            v-model="statusSearch"
            :options="options_status"
            label="请选择状态"
            dense
            class="col-6 col-sm-4 col-md-3 col-lg-2"
          >
            <template v-if="statusSearch" v-slot:append>
              <q-icon
                name="cancel"
                @click.stop="statusSearch = null"
                class="cursor-pointer"
              />
            </template>
          </q-select> -->
          <!-- <q-select
              v-model="contactAuthSearch"
              :options="options_contact_auth"
              label="是否外部联系人权限"
              dense
              class="col-6 col-sm-4 col-md-3 col-lg-2"
            >
              <template v-if="contactAuthSearch" v-slot:append>
                <q-icon
                  name="cancel"
                  @click.stop="contactAuthSearch = null"
                  class="cursor-pointer"
                />
              </template>
          </q-select> -->
          <template v-if="searchToggle" >
            <!-- <q-input v-model="textSearch" class="col-6 col-sm-4 col-md-3 col-lg-2" dense placeholder="姓名"/>
            <q-input v-model="textSearch" class="col-6 col-sm-4 col-md-3 col-lg-2" dense placeholder="姓名"/>
            <q-input v-model="textSearch" class="col-6 col-sm-4 col-md-3 col-lg-2" dense placeholder="姓名"/> -->
          </template>
          <q-space />

          <q-btn-group flat rounded class="col-auto">
            <q-btn color="grey-3" @click="getDataList" text-color="dark" icon="search" />
            <q-btn color="grey-3" text-color="dark" :icon="searchToggle?'zoom_out':'zoom_in'" @click="searchToggle = !searchToggle"/>
            <q-btn
              color="grey-3"
              text-color="dark"
              icon="find_replace"
             @click="resetSearch"
            />
          </q-btn-group>
        </div>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
              <q-td auto-width>
             <q-checkbox v-model="selected" size="sm" :val="props.row" />
          </q-td>

           <q-td key="id"  :props="props">
            {{ props.row.id }}
          </q-td>
          <q-td key="contact_info" :props="props">
            <q-item clickable v-ripple>
              <q-item-section side>
                <q-avatar rounded size="48px">
                  <img :src="props.row.avatar" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <q-btn color="blue" flat>
                     {{ props.row.name }} <span class="text-weight-light text-positive q-ml-xs">@{{ viewContactType(props.row.type) }}</span>
                     <q-icon class="q-ml-sm" :name="viewIcon(parseInt(props.row.gender))"  :class="viewIconColor(parseInt(props.row.gender))"/>
                  </q-btn>
                </q-item-label>
                <q-item-label caption>编号:{{ props.row.business_no }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                {{ props.row.qw_external_userid }}
                <q-badge :color="props.row.position ? 'teal' : 'grey'" :label="props.row.position ? props.row.position : '暂无'" />
                {{ props.row.corp_name }}
              </q-item-section>
            </q-item>
          </q-td>
          <q-td key="add_way"  :props="props">
            <div class="text-weight-bold ellipsis-2-lines">{{ viewAddWay(parseInt(props.row.relationWorker.add_way)) }}</div>
          </q-td>
          <q-td key="tags"  :props="props">
              <q-badge outline color="primary"
                v-for="tag in props.row.relationTag" 
                :label="`${tag.tag.name}`"
                :key="`tag-${tag.tag.id}`"
                class="float-left"
              />
          </q-td>
          <q-td key="worker"  :props="props">
            <q-badge outline color="teal"
              :label="`${props.row.relationWorker.work.name}`"
              class="text-caption"
            />
          </q-td>
          <q-td key="updatetime"  :props="props">
            {{ viewDate(props.row.relationWorker.updated_at) }}
          </q-td>
          <q-td key="follow_status"  :props="props">
            <q-btn size="sm" unelevated  :color="viewFollowStatusColor(parseInt(props.row.follow_status))">
              {{ viewFollowStatus(parseInt(props.row.follow_status)) }}
            </q-btn>
          </q-td>
          <q-td key="status"  :props="props">
            <q-btn size="sm" outline :color="viewStatusColor(parseInt(props.row.relationWorker.status))">
              {{ viewStatus(parseInt(props.row.relationWorker.status)) }}
            </q-btn>
          </q-td>
          <q-td key="action" :props="props">
            <q-btn outline color="orange" label="查看详情" @click="getAnalysisData(props.row)" class="q-mr-xs" disable />
          </q-td>
        </q-tr>
      </template>
      <template v-slot:pagination>
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.pageIndex"
          :page-sizes="[15, 30, 50, 100, 200, 300, 500, 1000]"
          :page-size="page.pSize"
          :total="page.totalCount"
          layout="total, sizes, prev, pager, next, jumper"
        ></hl-pagination>
      </template>
    </hl-table>
  
  </div>
</template>

<script>
import { date } from 'quasar'
export default {
  name: "DelFollowUser",
  components:{
  },
  data() {
    return {
      options_status: [
        {
          label: '已激活',
          value: '1',
        },
        {
          label: '已禁用',
          value: '2',
        },
        {
          label: '未激活',
          value: '4',
        },
        {
          label: '退出企业',
          value: '5',
        }
      ],
      options_contact_auth: [
        {
          label: '是',
          value: '1',
        },
        {
          label: '否',
          value: '2',
        }
      ],
      textSearch: null,
      statusSearch: null,
      contactAuthSearch: null,
      page: {
        pageIndex: 1,
        pSize: 15,
        totalCount: 0
      },
      searchToggle: false,
      loading: false,
      selected: [],
      tableFullscreen: null,
      columns: [
        { name: "id", label: "ID", field: "id" },
        {
          name: "contact_info",
          field: "contact_info",
          required: true,
          label: "客户信息",
          align: "left",
          format: val => `${val}`,
          sortable: true
        },
        { name: "add_way", label: "来源", field: "add_way" },
        { name: "tags", label: "标签", field: "tags" },
        { name: "worker", label: "所属员工", field: "worker" },
        { name: "updatetime", label: "删除时间", field: "updatetime" },
        { name: "follow_status", label: "跟进状态", field: "follow_status" },
        { name: "status", label: "客户状态", field: "status" },
        { name: "action", label: "操作", align: "center" }
      ],
      dataList: [],// 列表数据
      editDialogStatus:false,// 弹窗开关
      analysisDialogStatus:false,// 弹窗开关
      analysisData: {}, 
      app: [
        {
          icon: "las la-chalkboard",
          title: "PC端WEB应用",
          color: "cyan",
          release: true
        },
        {
          icon: "las la-tv",
          title: "桌面版安装应用程序",
          color: "yellow",
          release: true
        },
        {
          icon: "lab la-weixin",
          title: "微信公众号",
          color: "green",
          release: true
        },
        {
          icon: "lab la-weixin",
          title: "微信小程序",
          color: "green",
          note: "即将发布..."
        },
        {
          icon: "lab la-android",
          title: "安卓Android APP应用",
          color: "pink",
          note: "正在开发中..."
        },
        {
          icon: "lab la-apple",
          title: "苹果IOS",
          color: "red",
          note: "正在开发中..."
        },

        {
          icon: "las la-mobile",
          title: "H5移动端应用",
          color: "green",
          note: "正在开发中..."
        },

        {
          icon: "las la-comment",
          title: "企业微信",
          color: "blue",
          note: "正在开发中..."
        },
        {
          icon: " perm_device_information",
          title: "支付宝小程序",
          color: "primary",
          note: "正在开发中..."
        },
        {
          icon: "perm_device_information",
          title: "抖音小程序",
          color: "purple",
          note: "正在开发中..."
        }
      ],
    };
  },
  computed:{
  },
  watch: {
  },
  created() {
    console.log("pageTable created");
    this.getDataList()
  },
  mounted() {
    console.log("pageTable mounted");
  },
  activated() {
    console.log("pageTable activated");
  },
  deactivated() {
    console.log("pageTable deactivated");
  },
  destroyed() {
    console.log("pageTable destroyed");
  },
  methods: {
    // 每页数
    sizeChangeHandle(val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.page.pageIndex = val
      this.getDataList()
    },
   
    // 加载列表
    getDataList() {
    
      this.loading = true
      let payload = {
        pageIndex: this.page.pageIndex,
        pSize: this.page.pSize,
        name: this.textSearch,
        // status: this.statusSearch ? this.statusSearch.value : null,
        // contact_auth: this.contactAuthSearch ? this.contactAuthSearch.value : null,
      };
      this.$store
        .dispatch("contact/getDelFollowUserList", payload)
        .then(res => {
          if (res.code == 200) { 
            //最后同步时间
            this.syncDate = this.viewDate(res.data.sync_date)
            // 判断返回值是否为真 
            this.dataList = res.data ? res.data.list : []

            // 给分页组件传总数量
            this.page.totalCount = res.data ? res.data.page.totalCount : 0;
          }
          this.loading = false
        })
        .catch(error => {
          this.$q.notify({
              message: "失败",
              caption: "加载失败！",
              icon: "ion-close-circle-outline",
              color: "red",
              timeout: 500,
              position: "top-right"
            });
        });
 
    },
    // 重置搜索项
    resetSearch(){
      var that = this
      this.textSearch = ""
      this.statusSearch = ""
      this.contactAuthSearch = ""
      // 等待搜索项清空 执行查询列表
      this.$nextTick(()=>{
         that.getDataList()
      })
    },
    // 获取成员统计分析数据
    getAnalysisData(data){
      this.analysisDialogStatus = true
      console.log(data)
      this.analysisData = data
      console.log('this.analysisData',this.analysisData)
      let payload = {
           
        };
      // this.$store
      //   .dispatch("workerDepartment/getItem", payload)
      //   .then(res => {
      //     if (res.code == 200 && res.data) { 
      //        this.dialogForm = res.data
      //     }else{
      //        this.$q.notify({
      //         message: "失败",
      //         caption: "获取部门信息失败，请联系管理员！",
      //         icon: "ion-close-circle-outline",
      //         color: "red",
      //         timeout: 500,
      //         position: "top-right"
      //       });
      //       this.editDialogStatus = false
      //     }
            
      //   })
      //   .catch(error => {
        //   this.$q.notify({
        //       message: "失败",
        //       caption: "获取部门信息失败，请联系管理员！",
        //       icon: "ion-close-circle-outline",
        //       color: "red",
        //       timeout: 500,
        //       position: "top-right"
        //     });
        // });
    },
    // 重置成员统计分析数据
    resetAnalysisData (){
      this.analysisData = {}
    },
    // 显示图标
    viewIcon (val){
      switch(val)
        {
            case 0:
                return 'las la-genderless'
                break;
            case 1:
                return 'las la-mars'
                break;
            case 2:
                return 'las la-venus'
                break;
        }
    },
    // 显示颜色
    viewIconColor (val){
      switch(val)
        {
            case 0:
                return 'text-red'
                break;
            case 1:
                return 'text-primary'
                break;
            case 2:
                return 'text-pink'
                break;
        }
    },
    // 显示状态
    viewStatus (val){
      switch(val)
        {
            case 1:
                return '正常状态'
                break;
            case 2:
                return '已删除'
                break;
            case 3:
                return '已拉黑'
                break;
        }
    },
    // 显示状态颜色
    viewStatusColor (val){
      switch(val)
        {
            case 1:
                return 'positive'
                break;
            case 2:
                return 'negative'
                break;
            case 3:
                return 'warning'
                break;
        }
    },
    // 显示跟进状态
    viewFollowStatus (val){
      switch(val)
        {
            case 1:
                return '未跟进'
                break;
            case 2:
                return '跟进中'
                break;
            case 3:
                return '已拒绝'
                break;
            case 4:
                return '已成交'
                break;
            case 5:
                return '已复购'
                break;
        }
    },
    // 显示跟进状态颜色
    viewFollowStatusColor (val){
      switch(val)
        {
            case 1:
                return 'negative'
                break;
            case 2:
                return 'positive'
                break;
            case 3:
                return 'dark'
                break;
            case 4:
                return 'accent'
                break;
            case 5:
                return 'warning'
                break;
        }
    },
    // 显示外部联系人的类型
    viewContactType (val){
     
      switch(parseInt(val))
        {
            case 1:
                return '微信用户'
                break;
            case 2:
                return '企业微信用户'
                break;
        }
    },
    // 显示来源类型
    viewAddWay (val){
      switch(val)
        {
            case 0:
                return '未知来源'
                break;
            case 1:
                return '扫描二维码'
                break;
            case 2:
                return '搜索手机号'
                break;
            case 3:
                return '名片分享'
                break;
            case 4:
                return '群聊'
                break;
            case 5:
                return '手机通讯录'
                break;
            case 6:
                return '微信联系人'
                break;
            case 7:
                return '来自微信的添加好友申请'
                break;
            case 8:
                return '安装第三方应用时自动添加的客服人员'
                break;
            case 9:
                return '搜索邮箱'
                break;
            case 201:
                return '内部成员共享'
                break;
            case 202:
                return '管理员/负责人分配'
                break;
        }
    },
    // 显示日期格式
    viewDate (val){
     return val ? date.formatDate(val * 1000, 'YYYY-MM-DD  HH:mm:ss') : '暂无时间'
    },
  }
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 260px
  
</style>