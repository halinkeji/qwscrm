<template>
  <q-dialog @hide="closeUpload" v-model="imgPopupStatus">
    <q-card
      flat
      bordered
      class="bg-white"
      :style="{
        width: dialogWidth,
        'max-width': dialogWidth
      }"
    >
      <q-card-section class="q-pa-none q-px-md">
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-subtitle2">图片管理</div>
          </div>

          <div class="col-auto">
            <q-btn
              color="grey-7"
              class="q-pa-none"
              round
              flat
              v-close-popup
              icon="ion-close-circle-outline"
            >
            </q-btn>
          </div>
        </div>
      </q-card-section>

      <div
        class="row"
        :style="{
          height: dialogHeight,
          'mix-height': dialogHeight
        }"
      >
        <div class="col-12 col-md-3">
          <file-group
            ref="groupRef"
            @showOperateIndex="
              v => {
                showOperateIndex = v;
              }
            "
          ></file-group>
        </div>
        <div class="col-12 col-md-9" v-if="showOperateIndex == 'upload'">
          <img-upload :multiple="multiple"></img-upload>
        </div>
        <div class="col-12 col-md-9" v-else>
          <q-layout
            view="lhh LpR lff"
            container
            :style="{
              height: dialogHeight,
              'mix-height': dialogHeight
            }"
          >
            <q-header reveal class="bg-white">
              <div class="row">
                <div class="col-4 q-px-xs">
                  <q-input
                    outlined
                    v-model="search_data.name"
                    label="文件名称"
                    dense
                  >
                    <template v-slot:append>
                      <q-btn
                        @click="getImageList"
                        round
                        dense
                        flat
                        icon="ion-search"
                      />
                    </template>
                  </q-input>
                </div>
                <div class="col-3 q-px-xs">
                  <q-select
                    outlined
                    v-model="search_data.type"
                    :options="statusList"
                    option-value="code"
                    option-label="name"
                    option-disable="inactive"
                    emit-value
                    dense
                    map-options
                    @input="getImageList"
                  />
                </div>
                <div class="col-5 q-px-xs">
                  <q-input
                    label="选择日期"
                    v-model="search_time"
                    dense
                    outlined
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          ref="qDateProxy"
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date v-model="search_time" @input="changeDate">
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="确定"
                                color="primary"
                                flat
                                @click="getImageList"
                              />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </div>
            </q-header>

            <div class="row q-py-xl" v-if="list.length > 0">
              <div
                class="col-3 col-md-2 q-ma-sm "
                v-for="(img, imgKey) in list"
              >
                <q-img
                  :src="img.base_url"
                  style="width: 100%"
                  :ratio="1"
                  native-context-menu
                  @click="handleSelectImage(img)"
                  :class="{
                    selected_img_border: img.selected
                  }"
                >
                  <q-icon
                    size="sm"
                    color="red"
                    v-if="img.selected"
                    name="ion-checkmark-circle absolute-top-right"
                  ></q-icon>

                  <div class="absolute-bottom text-body2 text-center">
                    <div>{{ img.filename }}</div>
                    <div v-if="img.label">{{ img.label }}</div>
                  </div>
                  <template v-slot:error>
                    <div
                      class="absolute-full flex flex-center bg-grey-3  text-dark"
                    >
                      图片请求错误
                    </div>
                  </template>

                  <template v-if="!img.base_url">
                    <div
                      class="absolute-full flex flex-center bg-grey-3  text-dark"
                    >
                      图片丢失
                    </div>
                  </template>
                </q-img>
              </div>
            </div>

            <div v-else class="text-center q-pt-xl">
              <div>
                <q-icon
                  name="ion-ios-cloud-outline"
                  size="150px"
                  color="primary"
                >
                </q-icon>
              </div>

              <div class="text-primary">
                暂无图片
              </div>
            </div>

            <q-footer class="bg-white q-py-sm">
              <hl-pagination
                class="q-mr-sm vertical-bottom	"
                @current-change="currentChangeHandle"
                :current-page="imgRes.pageIndex"
                :page-sizes="[15]"
                :page-size="imgRes.pSize"
                :total="imgRes.pageTotal"
              ></hl-pagination>
            </q-footer>
          </q-layout>
        </div>
      </div>

      <q-separator class="q-my-sm" />
      <div class="justify-end row q-gutter-md q-py-sm">
        <div class="col-2 text-left q-gutter-sm">
          <q-btn
            @click="openGroupDialog()"
            flat
            color="primary"
            label="新建分组"
            icon="ion-add-circle-outline"
          />
        </div>
        <div class="col-9 text-right q-gutter-sm q-pr-md">
          <q-btn
            @click="handleCancelAll"
            unelevated
            color="grey"
            class="text-dark q-px-lg"
            label="取消已选"
            ><q-badge
              v-if="parseInt(selectedImgNum) > 0"
              color="red"
              floating
              >{{ selectedImgNum }}</q-badge
            ></q-btn
          >
          <q-btn
            unelevated
            color="red"
            @click="updataImageData('del')"
            class="q-px-lg"
            label="确定删除"
          >
            <q-badge v-if="parseInt(selectedImgNum) > 0" color="red" floating>{{
              selectedImgNum
            }}</q-badge></q-btn
          >
          <q-btn
            unelevated
            color="amber-7"
            @click="openChangeSearchData"
            class="q-px-lg"
            label="更换分组"
            ><q-badge
              v-if="parseInt(selectedImgNum) > 0"
              color="red"
              floating
              >{{ selectedImgNum }}</q-badge
            ></q-btn
          >
          <q-btn
            unelevated
            color="primary"
            @click="getImageData"
            class="q-px-lg"
            label="确定"
            ><q-badge
              v-if="parseInt(selectedImgNum) > 0"
              color="red"
              floating
              >{{ selectedImgNum }}</q-badge
            ></q-btn
          >
        </div>
      </div>
    </q-card>

    <q-dialog v-model="groupPopupStatus" @hide="closeUploadGroup" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">分组管理</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-select
            outlined
            v-model="newGroupId"
            :options="groupList"
            option-value="id"
            option-label="name"
            option-disable="inactive"
            emit-value
            map-options
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat @click="updataImageData" v-close-popup label="保存" />
          <q-btn flat label="关闭" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-dialog>
</template>

<script>
import fileGroup from "./fileGroup.vue";
import imgUpload from "./imgUpload.vue";
export default {
  name: "PageIndex",
  props: ["multiple"],
  components: {
    fileGroup,
    imgUpload
  },
  data() {
    return {
      groupPopupStatus: false,
      drawerLeft: true,
      imgPopupStatus: true,
      search_data: {
        type: "timeDesc",
        name: "",
        time: ""
      },
      statusList: [
        {
          code: "timeAsc",
          name: "上传时间正序"
        },
        {
          code: "timeDesc",
          name: "上传时间倒序"
        },
        {
          code: "nameAsc",
          name: "名称正序"
        },
        {
          code: "nameDesc",
          name: "名称倒序"
        }
      ],
      imgRes: {
        pageIndex: 1,
        pSize: 15,
        pageTotal: 0
      },
      list: [],
      selectedImgs: [],
      selectedImgUrl: [],
      showOperateIndex: "all",
      groupList: [],
      newGroupId: "",
      search_time: "",
      dialogWidth: "600px",
      dialogHeight: "500px"
    };
  },
  watch: {
    showOperateIndex(c) {
      if (c != "upload") {
        this.getImageList();
      }
    }
  },
  computed: {
    selectedImgNum() {
      return this.selectedImgs.length;
    }
  },
  created() {
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.6) + "px";
    }
    if (this.$q.screen.height) {
      this.dialogHeight = parseInt(this.$q.screen.height * 0.6) + "px";
    }
  },
  beforeMount() {},
  mounted() {
    this.getImageList();
  },
  methods: {
    changeDate() {
      this.search_data.time = this.$q_date.formatDate(this.search_time, "X");
    },
    openGroupDialog() {
      this.$refs.groupRef.openGroupName();
    },
    openChangeSearchData() {
      this.getFileGroupList();
      this.$nextTick(() => {
        this.groupPopupStatus = true;
      });
    },
    getFileGroupList() {
      let payload = {};
      this.$store
        .dispatch("group/getGroupList", payload)
        .then(res => {
          this.groupList = res.data.list;
        })
        .catch(error => {});
    },
    handleSelectImage(img) {
      let index = this.selectedImgUrl.indexOf(img.base_url);
      if (this.multiple) {
        if (index === -1) {
          this.selectedImgUrl.push(img.base_url);
          this.selectedImgs.push(img);
          img.selected = true;
        } else {
          this.selectedImgs.splice(index, 1);
          this.selectedImgUrl.splice(index, 1);
          img.selected = false;
        }
      } else {
        // 单选时，取消已选
        this.handleCancelAll();
        this.selectedImgs.push(img);

        img.selected = true;
      }
    },
    updataImageData(model = "updata") {
      if (this.selectedImgs.length > 0) {
        let updataIds = this.selectedImgs.map(i => {
          return i.id;
        });

        let payload = {
          updataIds,
          newGroupId: this.newGroupId,
          model
        };
        this.$store
          .dispatch("image/setImageData", payload)
          .then(res => {
            if (res.code == 200) {
              this.newGroupId = "";

              this.$q.notify({
                message: `成功${(model == "updata" ? "修改" : "删除") +
                  res.data.sCount}、失败${res.data.eCount}`,
                color: "green",
                position: "top"
              });
              this.selectedImgs = [];
              this.getImageList();
            } else {
              this.$q.notify({
                message: `${model == "updata" ? "修改" : "删除"}失败，${
                  model == "updata" ? "修改" : "删除"
                }图片信息失败`,
                color: "red",
                position: "top"
              });
              this.selectedImgs = [];
            }
          })
          .catch(error => {});
      } else {
        this.$q.notify({
          message: "请选择需要更改的图片",
          color: "red",
          position: "top"
        });
      }
    },
    /**
     *  取消已选
     */
    handleCancelAll() {
      this.selectedImgs = [];
      for (const i in this.list) {
        this.list[i].selected = false;
      }
    },

    getImageList() {
      let payload = {
        ...this.imgRes,
        ...this.search_data,
        gid: parseInt(this.showOperateIndex)
      };
      this.$store
        .dispatch("image/getImageList", payload)
        .then(res => {
          if (res.code == 200) {
            let imgs = [];

            for (const i in res.data.list) {
              let img = res.data.list[i];
              img.selected = false;
              imgs.push(img);
            }
            this.list = imgs;

            this.imgRes.pageTotal = parseInt(res.data.page.totalCount);
          } else {
            this.$q.notify({
              message: "图片加载失败！",
              color: "red",
              position: "top"
            });
          }
        })
        .catch(error => {});
    },

    /**
     * 多选时同步已选图片数量
     */
    syncSelectedImgCount() {
      this.selectedImgCount = this.selectedImgs.length;
    },

    // 当前页
    currentChangeHandle(pageIndex) {
      this.imgRes.pageIndex = pageIndex;
      this.getImageList(pageIndex);
    },
    getImageData() {
      let selectedImgs = this.selectedImgs;

      this.$emit("imageData", selectedImgs);
    },
    closeUpload() {
      this.$emit("closeUpload", false);
    },
    closeUploadGroup() {
      this.newGroupId = "";
    }
  }
};
</script>
<style>
.selected_img_border {
  border-style: solid;
  border-width: 2px;

  border-color: red;
}
</style>
