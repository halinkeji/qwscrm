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
          <q-input dense v-model="dialogForm.order" outlined  label="排序" class="q-my-md"/>
          <q-input dense v-model="dialogForm.name" outlined  autofocus  label="名称"/>
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
          </div>

          <q-space />

          <q-input
            v-model="textSearch"
            class="col-6 col-sm-4 col-md-3 col-lg-2"
            dense
            placeholder="分类名称"
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
          <q-td key="order"  :props="props">
            {{ props.row.order }}
            <q-popup-edit v-model="props.row.order" title="编辑" buttons>
              <q-input type="number" v-model="props.row.order" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
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
export default {
  name: "MediaType",
  components:{
  },
  data() {
    return {
      page: {
        pageIndex: 1,
        pSize: 15,
        totalCount: 0
      },
      textSearch: "",
      searchToggle: false,
      loading: false,
      dialogForm: {
        order: 0,// 排序
        name: "",// 名称
      }, 
      selected: [],
      columns: [
        { name: "id", label: "ID", field: "id", align: "left"},
        { name: "order", label: "排序", field: "order" , align: "left"},
        {
          name: "name",
          field: "name",
          required: true,
          label: "分类名称",
          align: "left",
          format: val => `${val}`,
          sortable: true
        }
      ],
      dataList: [],// 列表数据
      editDialogStatus:false,// 弹窗开关
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
        .dispatch("pluginMedia/getTypeList", payload)
        .then(res => {
          if (res.code == 200) { 
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
    // 更新或修改分类信息
    editData(){
      let item = {
        ...this.dialogForm
      }
      this.$store
        .dispatch("pluginMedia/editTypeData",item)
        .then(res => {
            if (res.code == 200) {
                this.getDataList();
                this.loading = false
                this.$q.notify({
                message: "成功",
                caption: `${this.dialogForm.id ? '修改' : '新增'}成功！`,
                icon: "ion-checkmark-circle-outline",
                color: "green",
                timeout: 500,
                position: "top-right"
              });
              this.editDialogStatus = false
              this.selected = []
            }
            else{
              this.$q.notify({
                message: "失败",
                caption: `${this.dialogForm.id ? '修改' : '新增'}失败！`,
                icon: "ion-close-circle-outline",
                color: "red",
                timeout: 500,
                position: "top-right"
              });
            }
            this.dialogForm = {
              order: 0,// 排序
            }
          })
          .catch(error => {
        
            this.$q.notify({
                message: "失败",
                caption: `${this.dialogForm.id ? '修改' : '新增'}失败！`,
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
      this.$store.dispatch("pluginMedia/deleteTypeData",{delIds})
         .then(res => {
            if (res.code == 200 && res.data) {
              this.getDataList()
              this.$q.notify({
                message: "成功",
                caption: `已删除 ${res.data} 条分类信息`,
                icon: "ion-checkmark-circle-outline",
                color: "green",
                timeout: 500,
                position: "top-right"
              });
              this.selected = []
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
              caption: "删除失败！",
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
      this.dialogForm = {
        order: 0,// 排序
      }
    },
    // 获取分类单条数据
    getItmeData(id){
       this.editDialogStatus = true
      let payload = {
            id
        }
        console.log(payload)
      this.$store.dispatch("pluginMedia/getTypeItem", payload)
        .then(res => {
          if (res.code == 200 && res.data) { 
             this.dialogForm = res.data
          }else{
             this.$q.notify({
              message: "失败",
              caption: "获取分类信息失败！",
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
              caption: "获取分类信息失败！",
              icon: "ion-close-circle-outline",
              color: "red",
              timeout: 500,
              position: "top-right"
            });
        })
    }
  }
}
</script>
