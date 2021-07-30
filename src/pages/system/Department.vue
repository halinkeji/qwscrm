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
          <div class="text-h6">{{ dialogForm.id ? '修改' : '新增' }}</div>
        </q-card-section>
 
        <q-card-section class="q-pt-none">
          <q-input  v-model="dialogForm.name" outlined  autofocus @keyup.enter="editData" />
        </q-card-section>
        <q-card-actions align="right" class="bg-white ">
          <q-btn unelevated label="保存" @click="editData" color="primary" v-close-popup />
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
            <q-btn dense color="primary" @click="openEditDialog" icon="add" />
            <q-btn
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
            placeholder="部门名称"
          />
          
          <q-space />

          <q-btn-group flat rounded class="col-auto">
            <q-btn color="grey-3" @click="getDataList" text-color="dark" icon="search" />
            <q-btn
              color="grey-3"
              text-color="dark"
              :icon="searchToggle ? 'zoom_out' : 'zoom_in'"
              @click="searchToggle = !searchToggle"
            />
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
          <q-td key="pid"  :props="props">
            {{ props.row.pid }}
          </q-td>
          <q-td key="name" :props="props">
            <q-badge color="positive" :label="props.row.name" />
          </q-td>
          <q-td key="viewTable" :props="props">
            <q-btn outline color="primary" @click="viewItemToList(props.row.id)"  :label="propsExpand ? '查看成员' : '关闭'"  dense  />
          </q-td>
          <q-td key="action" :props="props">
            <q-btn outline color="orange" label="修改" @click="getItemData(props.row.id)" class="q-mr-xs"/>
            <q-btn outline color="negative" label="删除" @click="deleteData(props.row.id)" class="q-mr-xs"/>
          </q-td>
        </q-tr>
        <q-tr v-show="!propsExpand" :props="props">
          <q-td colspan="100%">
              <div class="text-left">
                <hl-table
                  row-key="id"
                  dense
                  stickyHeader
                  class="bg-white"
                  :data="userDataList"
                  :columns="userColumns"
                  separator="cell"
                  :style="{
                    height:$q.screen.height * 0.2 + 'px'
                  }"
                  />
              </div>
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
  name: "SystemWorkerDepartment",
  components:{
  },
  data() {
    return {
      selectSearch: null,
      page: {
        pageIndex: 1,
        pSize: 15,
        totalCount: 0
      },
      text: "",
      textSearch: "",
      searchToggle: false,
      loading: false,
      dialogForm: {
         name:"",// 文本框名称
      }, 
      selected: [],
      tableFullscreen: null,
      columns: [
        { name: "id", label: "ID", field: "id" },
        { name: "pid", label: "父ID", field: "pid" }, 
        {
          name: "name",
          field: "name",
          required: true,
          label: "部门名称",
          align: "left",
          format: val => `${val}`,
          sortable: true
        },
        { name: "viewTable",label: "查看成员", align: "center" },
        { name: "action", label: "操作", align: "center" }
      ],
      dataList: [],// 列表数据
      editDialogStatus:false,// 弹窗开关
      userColumns:[
        { name: "id", label: "ID", field: "id" },
        {
          name: "name",
          field: "name",
          required: true,
          label: "成员名称",
          align: "left",
          format: (val,row) => {
            if(row && row.workers){
                return row.workers.name
            }
            return ""
          },
          sortable: true
        },
      ],
      userDataList: [],
      propsExpand:1,
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
        name:this.textSearch
      };
      this.$store
        .dispatch("workerDepartment/getList", payload)
        .then(res => {
          if (res.code == 200) { 
            //最后同步时间
            this.syncDate = res.data.sync_date ? date.formatDate(res.data.sync_date * 1000, 'YYYY-MM-DD  HH:mm:ss') : '还未同步'
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

    // 更新部门
    refreshData(){
       this.loading = true
       this.$store
        .dispatch("workerDepartment/refreshData")
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
              caption: "更新成功！",
              icon: "ion-checkmark-circle-outline",
              color: "green",
              timeout: 500,
              position: "top-right"
            });
          }
          else{
            this.$q.notify({
              message: "失败",
              caption: "更新失败，请联系管理员！",
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
              caption: "更新失败，请联系管理员！",
              icon: "ion-close-circle-outline",
              color: "red",
              timeout: 500,
              position: "top-right"
            });
        });
    },

    // 更新或修改部门信息
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
    // 获取部门单条数据
    getItmeData(id){
       this.editDialogStatus = true
      let payload = {
            id
        };
      this.$store
        .dispatch("workerDepartment/getItem", payload)
        .then(res => {
          if (res.code == 200 && res.data) { 
             this.dialogForm = res.data
          }else{
             this.$q.notify({
              message: "失败",
              caption: "获取部门信息失败，请联系管理员！",
              icon: "ion-close-circle-outline",
              color: "red",
              timeout: 500,
              position: "top-right"
            });
            this.editDialogStatus = false
          }
            
        })
        .catch(error => {
          this.$q.notify({
              message: "失败",
              caption: "获取部门信息失败，请联系管理员！",
              icon: "ion-close-circle-outline",
              color: "red",
              timeout: 500,
              position: "top-right"
            });
        });
    },
    // 查看该标签下成员数据
    viewItemToList(id){
      this.propsExpand = !this.propsExpand
      let payload = {
        pageIndex: this.page.pageIndex,
        pSize: this.page.pSize,
        department_id: id
      };
      this.$store.dispatch("workerDepartment/getItemToList", payload)
        .then(res => {
          if (res.code == 200 && res.data) { 
             this.userDataList = res.data.list
             // 给分页组件传总数量
             //this.page.totalCount = res.data ? res.data.page.totalCount : 0;
          }else{
             this.$q.notify({
              message: "失败",
              caption: "获取职员信息失败！",
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
              caption: "获取职员信息失败！",
              icon: "ion-close-circle-outline",
              color: "red",
              timeout: 500,
              position: "top-right"
            });
        })
    },
  }
}
</script>
