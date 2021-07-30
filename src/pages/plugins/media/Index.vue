<template>
  <div class="col-auto">
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
          <q-select
              v-model="dialogForm.media_type_id"
              :options="options_media_type"
              label="请选择素材分类"
              dense
              option-value="value"
              option-label="label"
              emit-value
              map-options
              class="col-6 col-sm-4 col-md-3 col-lg-2"
            >
              <template v-if="dialogForm.media_type_id" v-slot:append>
                <q-icon
                  name="cancel"
                  @click.stop="dialogForm.media_type_id = null"
                  class="cursor-pointer"
                />
              </template>
          </q-select>
          <q-input dense v-model="dialogForm.name" outlined  autofocus label="名称" class="q-my-md"/>
          <q-input type="textarea" dense v-model="dialogForm.content" outlined label="内容"/>
        </q-card-section>
        <q-card-actions align="right" class="bg-white ">
          <q-btn unelevated label="保存" @click="editData" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-card>
        <q-tabs
          v-model="tabIndex"
          dense
          align="left"
          class="bg-white  no-shadow"
          active-color="primary"
          indicator-color="primary"
        >
          <q-tab :name="`${n.name}`" :label="`${n.label}`" class="q-mx-lg" v-for="n in tab" @click="tabData(`${n.name}`)" :key="`tabs-${n.name}`"/>
        </q-tabs>

        <q-tab-panels v-model="tabIndex" animated class="bg-white text-primary">
          <q-tab-panel  :name="`${n.name}`" v-for="n in tab" :key="`tab-panel-${n.name}`" class="q-px-none q-pb-none">
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
              style="height:100%"
            >
              <template v-slot:top="props">
                <div class="row q-col-gutter-x-md q-col-gutter-y-xs full-width">
                  <div class="col-auto q-pl-none q-gutter-sm no-wrap">
                    <q-btn dense color="primary" @click="openEditDialog(n.name)" icon="add"  v-show="parseInt(tabIndex)"/>
                    <q-btn
                      dense
                      color="primary"
                      icon="edit"
                      :disable="selected.length !== 1"
                      @click="getItemData(selected[0].id,tabIndex)"
                      v-show="parseInt(tabIndex)"
                    />
                    <q-btn
                      dense
                      color="primary"
                      icon="delete"
                      @click="deleteData(0,parseInt(tabIndex))"
                      :disable="selected.length === 0"
                      v-show="parseInt(tabIndex)"
                    />
                  </div>
                  <q-space />
                  <q-select
                      v-model="mediaTypeSearch"
                      :options="options_media_type"
                      label="请选择素材分类"
                      dense
                      class="col-6 col-sm-4 col-md-3 col-lg-2"
                    >
                      <template v-if="mediaTypeSearch" v-slot:append>
                        <q-icon
                          name="cancel"
                          @click.stop="mediaTypeSearch = null"
                          class="cursor-pointer"
                        />
                      </template>
                  </q-select>
                  <q-input
                    v-model="textSearch"
                    class="col-6 col-sm-4 col-md-3 col-lg-2"
                    dense
                    placeholder="素材名称/内容"
                  />
                  
                  <q-space />

                  <q-btn-group flat rounded class="col-auto">
                    <q-btn color="grey-3" @click="getDataList(`${n.name}`)" text-color="dark" icon="search" />
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
                    @click="resetSearch(`${n.name}`)"
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
                    {{ props.row.name }}
                  </q-td>
                  <q-td key="content" :props="props">
                    {{ props.row.content }}
                  </q-td>
                  <q-td key="media_type_id" :props="props">
                    {{ formatMediaTypeData(props.row.media_type_id) }}
                  </q-td>
                  <q-td key="type" :props="props">
                    <q-badge color="positive" :label="formatTypeData(props.row.type)" class="text-subtitle2" />
                  </q-td>
                  <q-td key="create_time" :props="props">
                    {{ formatDate(props.row.created_at) }}
                  </q-td>
                  <q-td key="action" :props="props">
                    <q-btn outline color="primary" label="编辑" @click="getItemData(props.row.id,tabIndex)" class="q-mr-xs"  v-show="viewEditBtn(props.row.type)"/>
                    <q-btn outline color="info" label="移动" @click="moveTypeItem(props.row)" class="q-mr-xs"/>
                    <q-btn outline color="negative" label="删除" @click="deleteData(props.row.id,parseInt(props.row.type))" class="q-mr-xs"/>
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
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
  </div>
</template>

<script>
import { date } from 'quasar'
var _ = require('lodash')
export default {
  name: "MediaList",
  components:{
  },
  data() {
    return {
      tabIndex:"",
      tab: [
        {
          label: '全部',
          name: '0',
        },
        {
          label: '文本',
          name: '1',
        },
        {
          label: '图片',
          name: '2',
        },
        {
          label: '音频',
          name: '3',
        },
        {
          label: '视频',
          name: '4',
        },
        {
          label: '小程序',
          name: '5',
        },
        {
          label: '文件',
          name: '6',
        },
        {
          label: '图文',
          name: '7',
        }
      ],
      selectSearch: null,
      mediaTypeSearch: null,
      options_media_type: [],
      page: {
        pageIndex: 1,
        pSize: 15,
        totalCount: 0
      },
      textSearch: "",
      searchToggle: false,
      loading: false,
      loadingSpinner: {
        type: String,
        default: 'ball',
        validator: v => ['', 'cycle', 'gears', 'ios', 'ball', 'dots'].includes(v)
      },
      dialogForm: {
        type:"",
        name:"",
        content:"",
        media_type_id: ""
      }, 
      selected: [],
      columns: [
        { name: "id", label: "ID", field: "id" },
        {
          name: "name",
          field: "name",
          required: true,
          label: "名称",
          align: "left",
          format: val => `${val}`,
          sortable: true
        },
        { name: "content",label: "内容", align: "center" },
        { name: "media_type_id",label: "素材分类", align: "center" },
        { 
          name: "type",
          field: "type",
          label: "类型", 
          align: "center"
        },
        { 
          name: "create_time",
          field: "create_time",
          label: "创建时间", 
          align: "center"
        },
        { name: "action", label: "操作", align: "center" }
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
    this.tabIndex = this.tab[0].name
    console.log("pageTable created");
    this.getTypeDataList()
    this.getDataList(this.tabIndex)
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
    selectedTable(){
      let selected = this.dataList.map(item => {
            return item.id
        })
      this.selected = selected
    },

    // 每页数
    sizeChangeHandle(val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.page.pageIndex = va
      this.getDataList()
    },
   
    // 加载列表
    getDataList(val) {
      this.loading = true
      let payload = {
        pageIndex: this.page.pageIndex,
        pSize: this.page.pSize,
        name:this.textSearch,
        type:val,
        media_type_id: this.mediaTypeSearch ? this.mediaTypeSearch.value : 0,
      };
      this.$store
        .dispatch("pluginMedia/getMediaList", payload)
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
          console.log(error)
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
    // 更新或修改素材信息
    editData(){
      let item = {
        id: this.dialogForm.id,
        type: parseInt(this.dialogForm.type),
        name:this.dialogForm.name,
        content:this.dialogForm.content,
        media_type_id: this.dialogForm.media_type_id,
      }
      this.$store.dispatch("pluginMedia/editMediaData",item)
        .then(res => {
         
            if (res.code == 200) {
                this.getDataList(parseInt(this.tabIndex));
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
              type: parseInt(this.dialogForm.type),
              name: "",
              content: "",
              media_type_id: ""
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
        })
    },

    // 重置搜索项
    resetSearch(val){
      var that = this
      this.textSearch = ""
      this.mediaTypeSearch = ""
      // 等待搜索项清空 执行查询列表
      this.$nextTick(()=>{
         that.getDataList(val)
      })
    },

    // 删除列表数据
    deleteData(id,val){
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
      this.$store.dispatch("pluginMedia/deleteMediaData",{delIds})
          .then(res => {
            if (res.code == 200 && res.data) {
              this.getDataList(val)
              this.$q.notify({
                message: "成功",
                caption: `已删除 ${res.data} 条素材信息`,
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
                caption: "删除失败！",
                icon: "ion-close-circle-outline",
                color: "red",
                timeout: 500,
                position: "top-right"
              });
          });
    },

    // 新增弹出框
    openEditDialog(val){
      this.editDialogStatus = true
      this.dialogForm = {
        type: val,
        name: "",
        content: "",
        media_type_id: ""
      }
    },
    // 获取素材单条数据
    getItemData(id,index){
      this.tabIndex = index
      this.editDialogStatus = true
      let payload = {
            id
        };
      this.$store
        .dispatch("pluginMedia/getMediaItem", payload)
        .then(res => {
          if (res.code == 200 && res.data) { 
             this.dialogForm = res.data
          }else{
             this.$q.notify({
              message: "失败",
              caption: "获取素材信息失败！",
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
              caption: "获取素材信息失败！",
              icon: "ion-close-circle-outline",
              color: "red",
              timeout: 500,
              position: "top-right"
            });
        });
    },
    // 加载分类列表
    getTypeDataList() {
      this.$store
        .dispatch("pluginMedia/getTypeListData")
        .then(res => {
          if (res.code == 200 && res.data) { 
            var ar = []
            for (var i=0;i<res.data.length;i++){ 
              var d = {
                  label: res.data[i].name,
                  value: res.data[i].id,
                }
              ar.push(d)
            }
            this.options_media_type = ar
          }
        })
        .catch(error => {
          this.$q.notify({
              message: "失败",
              caption: "a更新失败！",
              icon: "ion-close-circle-outline",
              color: "red",
              timeout: 500,
              position: "top-right"
            });
        });
 
    },
    tabData(val){
      this.getDataList(val)
    },
    formatDate(val){
      return date.formatDate(val * 1000, 'YYYY-MM-DD  HH:mm:ss')
    },
    formatTypeData(val){
      let x = _.findIndex(this.tab, function(o) { 
          return o.name == val
        })
        if(x >= 0){
          return this.tab[x].label
        }
    },
    formatMediaTypeData(val){
      if(this.options_media_type.length > 0 ){
        let y = _.findIndex(this.options_media_type, function(o) { 
          return parseInt(o.value) == parseInt(val)
        })
        if(y >= 0){
          return this.options_media_type[y].label
        }
      }
      
    },
    viewEditBtn(val){
      switch (parseInt(val)) {
          case 1:
              return 1
              break
          case 2:
              return 0
              break
          case 3:
              return 0
              break
          case 4:
              return 0
              break
          case 5:
              return 1
              break
          case 6:
              return 0
              break
          case 7:
              return 1
              break
      } 
    },
    // 变更素材分类
    moveTypeItem(id){
       this.editDialogStatus = true
      let payload = {
            id
        };
      this.$store
        .dispatch("pluginMedia/getTypeItem", payload)
        .then(res => {
          if (res.code == 200 && res.data) { 
             this.dialogForm = res.data
          }else{
             this.$q.notify({
              message: "失败",
              caption: "获取素材信息失败！",
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
              caption: "获取素材信息失败！",
              icon: "ion-close-circle-outline",
              color: "red",
              timeout: 500,
              position: "top-right"
            });
        });
    },
  }
}
</script>
