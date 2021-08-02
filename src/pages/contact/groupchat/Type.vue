<template>
  <div>
    <q-dialog
      v-model="editDialogStatus"
      persistent
    >
      <q-card :style="{
        width:this.$q.screen.width * 0.3 + 'px',
        'min-width':this.$q.screen.width * 0.3+ 'px',
      }">
       <q-form
        @submit="editData"
        class="q-gutter-md"
        ref="dialogFormRef"
        >
        <q-card-section>
          <div class="text-h6">{{ dialogForm.id ? '修改' : '新增' }} 群标签分组</div>
        </q-card-section>
 
        <q-card-section class="q-pt-none">
          <q-input dense v-model="dialogForm.group_name" outlined  autofocus @keyup.enter="editData"  label="群标签分组名称" :rules="[ val => !!val  || '请输入群标签分组名称']" />
          <q-input outlined v-model="item.name" label="标签名称" dense class="q-my-sm q-ml-md"  v-for="(item, index) in dialogForm.tag" :key="`tag-${index}`" :rules="[ val => !!val  || '请输入标签名称']">
            <template v-slot:append>
              <q-icon v-if="item.name !== ''" name="close" @click="item.name = ''" class="cursor-pointer" />
            </template>
            <template v-slot:after>
              <q-btn round dense flat icon="remove_circle_outline"  v-show="index > 0" @click="delTagInput(index)"/>
            </template>
          </q-input>
          <q-btn dense color="primary" @click="addTagInput" icon="add"  class="q-ml-md">
            新增标签
          </q-btn>
        </q-card-section>
        <q-card-actions align="right" class="bg-white ">
          <q-btn unelevated label="保存" @click="editData" color="primary"  />
          <q-btn flat label="关闭" color="primary"  v-close-popup  class="q-ml-xl"/>
        </q-card-actions>
       </q-form>
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
            <q-btn dense color="primary" @click="openEditDialog" icon="add">
              <q-tooltip class="bg-amber text-black">
                新增群标签分组
              </q-tooltip>
            </q-btn>
            <q-btn
              dense
              color="primary"
              icon="edit"
              :disable="selected.length !== 1"
              @click="getItemData(selected[0])"
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
            v-model="textTypeSearch"
            class="col-6 col-sm-4 col-md-3 col-lg-2"
            dense
            placeholder="群名称"
          />
          <q-input
            v-model="textTagSearch"
            class="col-6 col-sm-4 col-md-3 col-lg-2"
            dense
            placeholder="标签名称"
          />
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
          <q-td key="group_name" :props="props">
            <q-btn unelevated outline color="primary" :label="props.row.name" />
          </q-td>
          <q-td key="action" :props="props">
            <q-btn dense color="primary" @click="addTag(props.row)" icon="add">
              <q-tooltip
                transition-show="scale"
                transition-hide="scale"
                class="bg-red"
              >
                新增标签
              </q-tooltip>
            </q-btn>
          </q-td>
          <q-td key="tags"  :props="props">
            <q-chip class="float-left" outline removable @remove="delTag(tag)" color="primary" text-color="white" v-for="tag in props.row.tags" :key="`tag-${tag.id}`">
              {{ tag.name }}
            </q-chip>
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
  name: "GroupChatType",
  components:{
  },
  data() {
    return {
      textTypeSearch: null,
      textTagSearch: null,
      page: {
        pageIndex: 1,
        pSize: 15,
        totalCount: 0
      },
      loading: false,
      dialogForm: {
         group_name:"",
         tag:[
           { 
             name: "",
             id: 0,
           }
         ]
      }, 
      selected: [],
      columns: [
        { name: "id", label: "ID", field: "id" },
        {
          name: "group_name",
          field: "group_name",
          required: true,
          label: "群标签分组",
          align: "center",
          format: val => `${val}`,
          sortable: true
        },
        { name: "action", label: "操作", align: "center" },
        { name: "tags", label: "标签", field: "tags", align: "left" },
        
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
        type_name: this.textTypeSearch,
        tag_name: this.textTagSearch,
      };
      this.$store
        .dispatch("groupchatTag/getList", payload)
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
    // 获取单条数据
    getItemData(row){
      console.log(row)
      this.dialogForm = {}
      this.editDialogStatus = true
      this.dialogForm = {
        id:row.id,
        group_name:row.name,
        tag:[]
      }
      var arr = row.tags
      
      for (var i=0; i<arr.length; i++)
      { 
        var push_data = {
          id:arr[i].id,
          name: arr[i].name
        }
        this.dialogForm.tag.push(push_data)
      }
    },
    // 更新或修改信息
    editData(){
      this.$refs.dialogFormRef.validate().then(success => {
        if (success) {
          let item = {
              ...this.dialogForm
            }
           console.log(item)
          this.$store.dispatch("groupchatTag/editData",item)
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
                  this.selected = []
                  this.dialogForm = {
                    group_name:"",
                    tag:[
                      { 
                        name: "",
                        id: 0,
                      }
                    ]
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
        }
      })
    },

    // 重置搜索项
    resetSearch(){
      var that = this
      this.textTypeSearch = ""
      this.textTagSearch = ""
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
        .dispatch("groupchatTag/deleteData",{delIds})
         .then(res => {
          if (res.code == 200 && res.data) {
             this.getDataList()
             this.$q.notify({
              message: "成功",
              caption: `已删除 ${res.data} 条信息`,
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
          this.selected = []
          this.dialogForm = {
            group_name:"",
            tag:[
              { 
                name: "",
                id: 0,
              }
            ]
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
        group_name:"",
         tag:[
           { 
             name: "",
             id: 0,
           }
         ]
      }
    },
    delTag (tag) {
      this.loading = true
      this.$store.dispatch("groupchatTag/delTagData",tag)
         .then(res => {
          if (res.code == 200 && res.data) {
             this.getDataList()
             this.$q.notify({
              message: "成功",
              caption: `已删除 ${res.data} 条信息`,
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
          this.selected = []
          this.dialogForm = {
            group_name:"",
            tag:[
              { 
                name: "",
                id: 0,
              }
            ]
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
        })
    },
    addTagInput(){
      var push_data = {
        name: "",
        id: 0,
      }
      this.dialogForm.tag.push(push_data)
    },
    delTagInput(i){
      this.dialogForm.tag.splice(i,1)
    },
    addTag(row){
      this.$q.dialog({
        title: '添加标签',
        message: '标签名称 1~15 个字符！',
        ok: {
          push: true
        },
        cancel: {
          push: true,
          color: 'negative'
        },
        prompt: {
          model: '',
          isValid: val => val.length > 0, 
          type: 'text' // optional
        },
        persistent: true
      }).onOk(data => {
        this.loading = true
        let item = {
          group_chat_type_id: row.id,
          tag_name: data
        }
        this.$store.dispatch("groupchatTag/addTagData",item)
          .then(res => {
            if (res.code == 200 && res.data) {
              this.getDataList()
              this.$q.notify({
                message: "成功",
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
            this.selected = []
            this.dialogForm = {
              group_name:"",
              tag:[
                { 
                  name: "",
                  id: 0,
                }
              ]
            }
          })
          .catch(error => {
            this.$q.notify({
                message: "失败",
                caption: "新增失败！",
                icon: "ion-close-circle-outline",
                color: "red",
                timeout: 500,
                position: "top-right"
              });
          })
      })
      
    }
  }
}
</script>