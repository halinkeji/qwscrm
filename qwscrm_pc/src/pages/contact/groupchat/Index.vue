<template>
  <div  >
    <!-- <q-dialog
      v-model="editDialogStatus"
      persistent
    >
      <q-card :style="{
        'min-width':this.$q.screen.width * 0.6 + 'px',
      }">
        <q-card-section>
          <div class="text-h6">{{ dialogForm.name }} - 群分组/打标签</div>
        </q-card-section>
 
        <q-card-section class="q-pt-none">
          <q-select 
              dense 
              outlined 
              v-model="dialogForm.group" 
              :options="dialogForm.group_model" 
              label="请选择群分组"  
              class="q-mb-md"
              map-options
              emit-value
              option-value="id"
              option-label="name"
              @input="getGroupChatDataTag"
          />

          <q-option-group
            :options="dialogForm.tags_model"
            type="checkbox"
            v-model="dialogForm.tags"
          />
        </q-card-section>
        <q-card-actions align="right" class="bg-white ">
          <q-btn unelevated label="保存" @click="saveGroupData" color="primary"  />
          <q-btn flat label="关闭" color="primary"  v-close-popup  class="q-ml-xl"/>
        </q-card-actions>
      </q-card>
    </q-dialog> -->
    <q-dialog
      v-model="editDialogStatus"
      persistent
    >
      <q-card :style="{
        'min-width':this.$q.screen.width * 0.6 + 'px',
      }">
        <q-card-section>
          <div class="text-h6">{{ dialogForm.name }} - 群分组/打标签</div>
        </q-card-section>
 
        <q-card-section class="q-pt-none">
          
          <div class="q-pa-md row q-col-gutter-sm">
        
            <q-tree class="col-12 col-sm-6"
              :nodes="dialogForm.group_model"
              node-key="id"
              label-key="name"
              tick-strategy="leaf"
              :ticked.sync="ticked"
           />
            <div class="col-12 col-sm-6 q-gutter-sm">
              <div class="row">
                <div class="col-auto" v-for="tick in tagsData" :key="`ticked-${tick}`">
                  <q-badge outline  color="primary" :label="tick" />
                </div>
              </div>
            </div>
          </div>


        </q-card-section>
        <q-card-actions align="right" class="bg-white ">
          <q-btn unelevated label="保存" @click="saveGroupData" color="primary"  />
          <q-btn flat label="关闭" color="primary"  v-close-popup  class="q-ml-xl"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog
      v-model="analysisDialogStatus"
      persistent
    >
      <q-card :style="{
        'min-width':this.$q.screen.width * 0.6 + 'px',
      }">
        <q-card-section>
          <div class="text-h6">{{ analysisDialogInfo.name }} - 群成员详情</div>
        </q-card-section>
 
        <q-card-section class="q-pt-none">
          <hl-table
            row-key="id"
            dense
            stickyHeader
            :data="analysisData"
            :columns="analysis_columns"
            :loading="loadingMember"
            separator="cell"
            style="height:400px"
          >
            <template v-slot:top="props">
              <div class="row q-col-gutter-x-md q-col-gutter-y-xs full-width">
                <q-input
                  v-model="textMemberSearch"
                  class="col-6 col-sm-4 col-md-3 col-lg-2"
                  dense
                  placeholder="成员名字/昵称"
                />
                <q-btn-group flat rounded class="col-auto">
                  <q-btn color="grey-3" @click="getAnalysisData(analysisDialogInfo)" text-color="dark" icon="search" />
                  
                  <q-btn
                    color="grey-3"
                    text-color="dark"
                    icon="find_replace"
                  @click="resetMemberSearch"
                  />
                </q-btn-group>
              </div>
            </template>

            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="id"  :props="props">
                  {{ props.row.id }}
                </q-td>
                <q-td key="name" :props="props">
                  <div class="text-weight-bolder">
                    <q-avatar size="sm" rounded v-if="props.row.contact">
                      <img :src="props.row.contact.avatar">
                    </q-avatar>
                    {{ props.row.name }} <span class="q-ml-sm text-positive">群昵称@{{ props.row.group_nickname }}</span>
                  </div>
                </q-td>
                <q-td key="type" :props="props">
                  <div class="text-weight-medium" >{{ viewMemberType(props.row.type) }}</div>
                </q-td>
                <q-td key="contact"  :props="props">
                  <div class="text-overline" v-if="props.row.contact">{{ props.row.contact.name }}</div>
                </q-td>
                <q-td key="worker"  :props="props">
                  <div class="text-overline" v-if="props.row.worker">
                    <q-avatar size="sm" rounded>
                      <img :src="props.row.worker.avatar">
                    </q-avatar>{{ props.row.worker.name }}</div>
                </q-td>
                <q-td key="status"  :props="props">
                  <q-btn size="sm" outline :color="viewStatusColor(props.row.status)">
                    {{ viewStatus(props.row.status) }}
                  </q-btn>
                </q-td>
                <q-td key="join_time"  :props="props">
                  {{ viewDate(props.row.join_time) }}
                </q-td>
                <q-td key="out_time"  :props="props">
                    {{ viewDate(props.row.out_time) }}
                </q-td>
              </q-tr>
            </template>
            <template v-slot:pagination>
              <hl-pagination
                @size-change="sizeChangeHandleMember"
                @current-change="currentChangeHandleMember"
                :current-page="memberPage.pageIndex"
                :page-sizes="[10,15, 30, 50, 100, 200, 300, 500, 1000]"
                :page-size="memberPage.pSize"
                :total="memberPage.totalCount"
                layout="total, sizes, prev, pager, next, jumper"
              ></hl-pagination>
            </template>
          </hl-table>
        </q-card-section>
        <q-card-actions align="center" class="bg-white ">
          <q-btn unelevated label="关闭" @click="closeDialog" color="primary" v-close-popup />
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
          <div class="col-auto q-pl-none q-gutter-sm no-wrap">
            <q-btn
              dense
              color="primary"
              icon="las la-sync"
              @click="refreshData"
            />
            <q-btn flat :label="`最后一次同步时间：${syncDate}`" />
          </div>

          <q-space />

          <q-input
            v-model="textSearch"
            class="col-6 col-sm-4 col-md-3 col-lg-2"
            dense
            placeholder="群名称"
          />
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
          <q-td key="name" :props="props">
            <div class="text-weight-bolder">{{ props.row.name }}</div>
            {{ props.row.qw_chat_id }}
          </q-td>
          <q-td key="owner"  :props="props">
            <div class="text-overline" v-if="props.row.workers">{{ props.row.workers.name }}</div>
          </q-td>
          <q-td key="worker"  :props="props">
          <div class="float-left" v-if="props.row.chatRelationAdmin && props.row.chatRelationAdmin.workers">
            <q-badge outline color="primary"
              v-for="worker in props.row.chatRelationAdmin.workers" 
              :label="`${worker.name}`"
              :key="`tag-${worker.id}`"
            />
          </div>
          </q-td>
          <q-td key="chat_tag" :props="props">
            <div v-if="props.row.groupChatTag.length > 0">
              <q-badge outline color="primary"
                  v-for="tag in props.row.groupChatTag" 
                  :label="`${tag.groupChatTag.name}`"
                  :key="`tag-${tag.groupChatTag.id}`"
                  class="float-left q-mx-xs"
                />
            </div>
          </q-td>
          <q-td key="chat_count"  :props="props">
               <div class="text-weight-bolder text-subtitle1">{{ props.row.chatCount.length }} 人</div>
          </q-td>
          <q-td key="notice" :props="props">
            <div class="ellipsis" style="max-width:200px">{{ props.row.notice }}</div>
          </q-td>
          <q-td key="createtime"  :props="props">
            {{ viewDate(props.row.create_time) }}
          </q-td>
          
          <q-td key="status"  :props="props">
            <q-btn size="sm" outline :color="viewChatStatusColor(props.row.status)">
              {{ viewChatStatus(props.row.status) }}
            </q-btn>
          </q-td>
          <q-td key="action" :props="props">
            <q-btn unelevated color="orange" label="成员详情" @click="getAnalysisData(props.row)" class="q-mr-xs"/>
            <q-btn unelevated color="primary" label="打标签" @click="relationTagData(props.row)" class="q-mr-xs"/>
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
  name: "GroupChat",
  components:{
  },
  data() {
    return {
      textSearch: null,
      textMemberSearch: null,
      statusSearch: null,
      contactAuthSearch: null,
      page: {
        pageIndex: 1,
        pSize: 15,
        totalCount: 0
      },
      memberPage: {
        pageIndex: 1,
        pSize: 6,
        totalCount: 0
      },
      searchToggle: false,
      loading: false,
      loadingMember: false,
      dialogForm: {
        name:"",// 文本框名称
        group_model:[],
        tags_model: [],
        group:"",
        tags:[], 
      }, 
      selected: [],
      tableFullscreen: null,
      columns: [
        { name: "id", label: "ID", field: "id" },
        {
          name: "name",
          field: "name",
          required: true,
          label: "群名称",
          align: "left",
          format: val => `${val}`,
          sortable: true
        },
        { name: "owner", label: "群主", field: "owner" },
        { name: "worker", label: "群管理", field: "worker" },
        { name: "chat_tag", label: "群标签", field: "chat_tag" },
        { name: "chat_count", label: "群人数", field: "chat_count" },
        { name: "notice", label: "群公告", field: "notice" },
        { name: "createtime", label: "创建时间", field: "createtime" },
        // { name: "status", label: "今日入群/退群", field: "status" },
        { name: "status", label: "状态", field: "status" },
        { name: "action", label: "操作", align: "center" }
      ],
      dataList: [],// 列表数据
      editDialogStatus:false,// 弹窗开关
      analysisDialogStatus:false,// 弹窗开关
      analysisDialogInfo:{},// 弹窗内信息
      analysisData: [], 
      analysis_columns: [
        { name: "id", label: "ID", field: "id" },
        {
          name: "name",
          field: "name",
          required: true,
          label: "成员名字/昵称",
          align: "left",
          format: val => `${val}`,
          sortable: true
        },
        { name: "type", label: "成员类型", field: "type" },
        { name: "contact", label: "客户联系人名称", field: "contact" },
        { name: "worker", label: "邀请人", field: "worker" },
        { name: "status", label: "状态", field: "status" },
        { name: "join_time", label: "入群时间", field: "join_time" },
        { name: "out_time", label: "退群时间", field: "out_time" },  
      ],
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
      syncDate:'',
      sync: {
        cursor: '',
      },
   
      ticked: [],
      tagsData:[],

    };
  },
  computed:{
  },
  watch: {
    ticked(v,o){

      this.$nextTick(()=>{
         this.getTickedData(v);
      })
     
    }
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
    sizeChangeHandleMember(val) {
      this.memberPage.pSize = val
      this.memberPage.pageIndex = 1
      this.getAnalysisData(this.analysisDialogInfo)
    },
    // 当前页
    currentChangeHandle(val) {
      this.page.pageIndex = val
      this.getDataList()
    },
    currentChangeHandleMember(val) {
      this.memberPage.pageIndex = val
      this.getAnalysisData(this.analysisDialogInfo)
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
        .dispatch("groupchat/getList", payload)
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
              caption: "更新失败，请联系管理员！",
              icon: "ion-close-circle-outline",
              color: "red",
              timeout: 500,
              position: "top-right"
            });
        });
 
    },

    // 同步客户群信息
    refreshData(){
       this.loading = true
       let item = {
          cursor: this.sync.cursor,
        }
       this.$store.dispatch("groupchat/refreshData",item)
          .then(res => {
            if (res.code == 200) {
              if(res.data.cursor){
                this.sync.cursor = res.data.cursor
                this.refreshData()
              }else{
                this.$q.notify({
                  message: "成功",
                  caption: "同步成功！",
                  icon: "ion-checkmark-circle-outline",
                  color: "green",
                  timeout: 500,
                  position: "top-right"
                });
                this.sync.cursor = ''
                this.loading = false
                this.getDataList()
              }
            }
            else{
              this.$q.notify({
                message: "失败",
                caption: "同步失败！",
                icon: "ion-close-circle-outline",
                color: "red",
                timeout: 500,
                position: "top-right"
              });
            }
          })
          .catch(error => {
            this.$q.notify({
                message: "失败",
                caption: "同步失败！",
                icon: "ion-close-circle-outline",
                color: "red",
                timeout: 500,
                position: "top-right"
              })
          })
    },

    // 更新或修改成员信息
    editData(){
      let item = {
        ...this.dialogForm
      }
      this.$store
        .dispatch("workerDepartment/editData",item)
        .then(res => {
         
            if (res.code == 200) {
                this.getDataList();
                this.loading = false
                this.$q.notify({
                message: "成功",
                caption: `${this.dialogForm.id ? '编辑' : '修改'}成功！`,
                icon: "ion-checkmark-circle-outline",
                color: "green",
                timeout: 500,
                position: "top-right"
              });
              this.editDialogStatus = false
            }
            else{
              this.$q.notify({
                message: "失败",
                caption: `${this.dialogForm.id ? '编辑' : '修改'}失败，请联系管理员1`,
                icon: "ion-close-circle-outline",
                color: "red",
                timeout: 500,
                position: "top-right"
              });
            }
            this.dialogForm = {}
          })
          .catch(error => {
        
            this.$q.notify({
                message: "失败",
                caption: `${this.dialogForm.id ? '编辑' : '修改'}失败，请联系管理员2`,
                icon: "ion-close-circle-outline",
                color: "red",
                timeout: 500,
                position: "top-right"
              });
              this.editDialogStatus = false
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

    // 重置群成员列表搜索项
    resetMemberSearch(){
      this.textMemberSearch = ""
      console.log(this.analysisDialogInfo)
      this.getAnalysisData(this.analysisDialogInfo)
    },
    // 关闭弹窗
    closeDialog(){
      this.analysisDialogStatus = false
      this.analysisDialogInfo = {}
    },
    // 获取统计分析数据
    getAnalysisData(data){
      console.log(data)
      this.analysisDialogInfo = data
      this.analysisDialogStatus = true
      this.loadingMember = true
      let payload = {
          pageIndex: this.memberPage.pageIndex,
          pSize: this.memberPage.pSize,
          name: this.textMemberSearch,
          group_chat_id: data.id,
        }
      this.$store
        .dispatch("groupchat/getItemList", payload)
        .then(res => {
          if (res.code == 200 && res.data) { 
              // 判断返回值是否为真 
            this.analysisData = res.data ? res.data.list : []

            // 给分页组件传总数量
            this.memberPage.totalCount = res.data ? res.data.page.totalCount : 0;
            
          }else{
             this.$q.notify({
              message: "失败",
              caption: "获取数据失败！",
              icon: "ion-close-circle-outline",
              color: "red",
              timeout: 500,
              position: "top-right"
            });
            this.analysisDialogStatus = false
          }
          this.loadingMember = false
        })
        .catch(error => {
          this.$q.notify({
              message: "失败",
              caption: "获取数据失败！",
              icon: "ion-close-circle-outline",
              color: "red",
              timeout: 500,
              position: "top-right"
            });
        });
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
      switch(parseInt(val))
        {
            case 1:
                return '正常'
                break;
            case 2:
                return '退群'
                break;
        }
    },
    // 显示状态颜色
    viewStatusColor (val){
      switch(parseInt(val))
        {
            case 1:
                return 'positive'
                break;
            case 2:
                return 'negative'
                break;
        }
    },
    // 显示群状态
    viewChatStatus (val){
      switch(parseInt(val))
        {
            case 0:
                return '正常'
                break;
            case 1:
                return '跟进人离职'
                break;
            case 2:
                return '离职继承中'
                break;
            case 3:
                return '离职继承完成'
                break;
            case 4:
                return '已解散'
                break;
        }
    },
    // 显示群状态颜色
    viewChatStatusColor (val){
      switch(parseInt(val))
        {
            case 0:
                return 'positive'
                break;
            case 1:
                return 'negative'
                break;
            case 2:
                return 'accent'
                break;
            case 3:
                return 'secondary'
                break;
            case 3:
                return 'dark'
                break;
        }
    },
    // 显示成员的类型
    viewMemberType (val){
      switch(parseInt(val))
        {
            case 1:
                return '企业成员'
                break;
            case 2:
                return '外部联系人'
                break;
        }
    },
    // 显示日期格式
    viewDate (val){
     return parseInt(val) ? date.formatDate(parseInt(val) * 1000, 'YYYY-MM-DD  HH:mm:ss') : '暂无时间'
    },
    // 打标签
    relationTagData (val){
      this.editDialogStatus = true
      this.dialogForm.group_model = []
      this.dialogForm.name = val.name 
      this.dialogForm.group_chat_id = val.id
      this.dialogForm.group = ""
      this.dialogForm.tags_model = []
      this.$store
        .dispatch("groupchatTag/getGroupDataList",{
          group_chat_id:val.id
        })
        .then(res => {
          if (res.code == 200) { 
            this.dialogForm.group_model = res.data ? res.data.node_array : []
            this.ticked = res.data ? res.data.group_tag : []
          } 
        })
        .catch(error => {
          this.$q.notify({
              message: "失败",
              caption: "更新失败，请联系管理员！",
              icon: "ion-close-circle-outline",
              color: "red",
              timeout: 500,
              position: "top-right"
            });
        }); 
    },

    // getGroupChatDataTag(value){
    //   let groupTagIndex =  _.findIndex(this.dialogForm.group_model, function(o) { return parseInt(o.id) == parseInt(value); });
    //   let groupTagData = this.dialogForm.group_model[groupTagIndex]
 
    //  if(groupTagData){
    //     this.dialogForm.group_chat_type_id = groupTagData.id
    //     if(groupTagData.tags && groupTagData.tags.length > 0){
    //       this.dialogForm.tags_model = groupTagData.tags.map(item => {
    //           return {
    //               label: item.name, 
    //               value: item.id
    //           }
    //       })
    //       return false;
    //     }
    //  }

    // },

    // 保存群标签
    saveGroupData(){
      let item = {
        ...this.dialogForm, 
      }
      this.$store
        .dispatch("groupchatTag/saveGroupChatTag",item)
        .then(res => {
            if (res.code == 200) {
                this.$q.notify({
                message: "成功",
                caption: `保存成功！`,
                icon: "ion-checkmark-circle-outline",
                color: "green",
                timeout: 500,
                position: "top-right"
              });
              this.editDialogStatus = false
            }
            else{
              this.$q.notify({
                message: "失败",
                caption: `保存失败，请联系管理员`,
                icon: "ion-close-circle-outline",
                color: "red",
                timeout: 500,
                position: "top-right"
              });
            }
           
          })
          .catch(error => {
            this.$q.notify({
                message: "失败",
                caption: `保存失败，请联系管理员`,
                icon: "ion-close-circle-outline",
                color: "red",
                timeout: 500,
                position: "top-right"
              });
              this.editDialogStatus = false
          }); 
    },


    getTickedData(val){
      var that = this
      that.dialogForm.tags_model = []
      that.tagsData = []
      if(val && val.length){
        _.forEach(val, function(value, key) {
          if(value){
              let item = JSON.parse(value)
                if(_.findIndex(that.dialogForm.tags_model, function(o) { return o.id == item.id; }) < 0){
                  that.dialogForm.tags_model.push({
                    id:item.id,
                    pid:item.pid
                  })
                  that.tagsData.push(item.name)
              }
          }
        });
      }
    }

  }
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 200px
  
</style>