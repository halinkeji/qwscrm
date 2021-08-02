<template>
  <div  >
    <q-dialog
      v-model="editDialogStatus"
      :style="{
        width:this.$q.screen.width * 0.3,
      }"
    >
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">{{ dialogForm.id ? '编辑' : '修改' }}</div>
        </q-card-section>
 
        <q-card-section class="q-pt-none">
          <q-input  v-model="dialogForm.name" outlined  autofocus @keyup.enter="editData" />
        </q-card-section>
        <q-card-actions align="right" class="bg-white ">
          <q-btn unelevated label="保存" @click="editData" color="primary" v-close-popup />
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
          <div class="col-auto q-pl-none q-gutter-sm no-wrap">
            <!-- <q-btn dense color="primary" @click="openEditDialog" icon="add" /> -->
            <!-- <q-btn
              dense
              color="primary"
              icon="edit"
              :disable="selected.length !== 1"
              @click="getItmeData(selected[0].id)"
            />
            <q-btn
              dense
              color="primary"
              icon="delete"
              @click="deleteData()"
              :disable="selected.length === 0"
            /> -->
            <q-btn
              dense
              color="primary"
              icon="las la-sync"
              @click="refreshData"
            />
            <q-btn-dropdown
              auto-close
              dense
              icon="more_vert"
              color="primary"
              class="btn-dropdown-hide-droparrow"
            >
              <div class="row no-wrap q-pa-sm">
                <div class="column">
                  <q-btn
                    label="其他操作"
                  ></q-btn>
                </div>
              </div>
            </q-btn-dropdown>
            <q-btn flat :label="`最后一次同步时间：${syncDate}`" />
          </div>

          <q-space />

          <q-input
            v-model="textSearch"
            class="col-6 col-sm-4 col-md-3 col-lg-2"
            dense
            placeholder="姓名"
          />
          <q-select
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
          </q-select>
          <q-select
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
          </q-select>
          <q-space />

          <q-btn-group flat rounded class="col-auto">
            <q-btn color="grey-3" @click="getDataList" text-color="dark" icon="search" />
            <q-btn
              color="grey-3"
              text-color="dark"
              icon="las la-search-minus"
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
            <q-item clickable v-ripple>
              <q-item-section side>
                <q-avatar size="48px" class="shadow-1">
                  <img :src="props.row.thumb_avatar" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <q-btn color="blue" flat>
                     {{ props.row.name }}
                     <q-icon class="q-ml-sm" :name="viewIcon(parseInt(props.row.gender))"  :class="viewIconColor(parseInt(props.row.gender))"/>
                  </q-btn>
                </q-item-label>
                <q-item-label caption>{{ props.row.mobile }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                职务<q-badge :color="props.row.position ? 'teal' : 'grey'" :label="props.row.position ? props.row.position : '暂无'" />
              </q-item-section>
            </q-item>
          </q-td>
          <q-td key="status"  :props="props">
            <q-btn outline rounded :color="viewStatusColor(parseInt(props.row.status))">
              {{ viewStatus(parseInt(props.row.status)) }}
            </q-btn>
          </q-td>
          <q-td key="tags"  :props="props">
            <q-badge outline color="primary"
              v-for="tag in props.row.workerTag" 
              :label="`${tag.name}`"
              :key="`tag-${tag.id}`"
            />
          </q-td>
          <q-td key="departments"  :props="props">
            <q-badge outline color="teal"
              :label="`${props.row.workerDepartment.name}`"
              class="text-caption"
            />
          </q-td>
          <q-td key="contact_auth"  :props="props">
            <q-toggle
              v-model="props.row.contact_auth"
              color="green"
              :true-value="'1'"
              :false-value="'2'"
            />
          </q-td>
          <q-td key="action" :props="props">
            <q-btn outline color="orange" label="查看统计" @click="getAnalysisData(props.row)" class="q-mr-xs"/>
            <!-- <q-btn outline color="negative" label="删除" @click="deleteData(props.row.id)" class="q-mr-xs"/> -->
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
  name: "SystemWorker",
  components:{
  },
  data() {
    return {
      options_status: [],
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
      loading: false,
      dialogForm: {
         name:"",// 文本框名称
      }, 
      selected: [],
      tableFullscreen: null,
      columns: [
        { name: "id", label: "ID", field: "id" },
        {
          name: "name",
          field: "name",
          required: true,
          label: "企业职员",
          align: "left",
          format: val => `${val}`,
          sortable: true
        },
        { name: "status", label: "状态", field: "status" },
        { name: "tags", label: "标签", field: "tags" },
        { name: "departments", label: "所属部门", field: "departments" },
        { name: "contact_auth", label: "外部联系人权限", field: "contact_auth" },
        { name: "action", label: "成员统计", align: "center" }
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
      syncDate:''
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
      this.page.pSize = val;
      this.page.pageIndex = 1;
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.page.pageIndex = val;
      this.getDataList()
    },
   
    // 加载列表
    getDataList() {
    
      this.loading = true
      let payload = {
        pageIndex: this.page.pageIndex,
        pSize: this.page.pSize,
        name: this.textSearch,
        status: this.statusSearch ? this.statusSearch.value : null,
        contact_auth: this.contactAuthSearch ? this.contactAuthSearch.value : null,
      };
      this.$store
        .dispatch("worker/getList", payload)
        .then(res => {
          if (res.code == 200) { 
            //最后同步时间
            this.syncDate = res.data.sync_date ? date.formatDate(res.data.sync_date * 1000, 'YYYY-MM-DD  HH:mm:ss') : '还未同步'
            // 判断返回值是否为真 
            this.dataList = res.data ? res.data.list : []
            this.options_status = res.data.worker_status
            
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

    // 更新员工信息
    refreshData(){
       this.loading = true
       this.$store
        .dispatch("worker/refreshData")
        .then(res => {
          if (res.code == 200) {
             //最后同步时间
            this.syncDate = res.data.sync_date ? date.formatDate(res.data.sync_date * 1000, 'YYYY-MM-DD  HH:mm:ss') : '还未同步'
              // 判断返回值是否为真 
             this.dataList = res.data ? res.data.list : []

             // 给分页组件传总数量
             this.page.totalCount = res.data ? res.data.page.totalCount : 0;

             this.loading = false
             this.$q.notify({
              message: "成功",
              caption: "同步成功！",
              icon: "ion-checkmark-circle-outline",
              color: "green",
              timeout: 500,
              position: "top-right"
            });
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
            });
        });
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
                this.getDataList()
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

    // 删除列表数据
    deleteData(id){
      var delIds = []
      if(id){
        delIds = [{id}]
      }
      else{
      delIds = this.selected.map(item => {
          return {
              id: item.id
          }
      })

      }
 
    this.loading = true
    this.$store
        .dispatch("workerDepartment/deleteData",{delIds})
         .then(res => {
          if (res.code == 200 && res.data) {
             this.getDataList()
             this.$q.notify({
              message: "成功",
              caption: `已删除 ${res.data} 条部门信息`,
              icon: "ion-checkmark-circle-outline",
              color: "green",
              timeout: 500,
              position: "top-right"
            });
          }
          else{
            this.$q.notify({
              message: "失败",
              caption: res.message,
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
              caption: "删除失败，请联系管理员！",
              icon: "ion-close-circle-outline",
              color: "red",
              timeout: 500,
              position: "top-right"
            });
        });
 
    },

    // 新增弹出框
    openEditDialog(){
      this.editDialogStatus = true

      this.dialogForm = {}
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
                return '已激活'
                break;
            case 2:
                return '已禁用'
                break;
            case 4:
                return '未激活'
                break;
            case 5:
                return '退出企业'
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
                return 'grey'
                break;
            case 4:
                return 'primary'
                break;
            case 5:
                return 'negative'
                break;
        }
    },

  }
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 260px
</style>