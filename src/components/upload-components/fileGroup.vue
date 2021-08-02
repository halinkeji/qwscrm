<template>
  <div class="q-mt-sm">
    <q-item @click="changeInde('upload')" clickable v-ripple>
      <q-item-section>上传图片</q-item-section>
      <q-item-section avatar>
        <q-icon color="primary" name="ion-cloud-upload" />
      </q-item-section>
    </q-item>
    <q-item @click="changeInde('all')" clickable v-ripple>
      <q-item-section>全部图片</q-item-section>

      <q-item-section avatar>
        <q-icon color="primary" name="ion-document" />
      </q-item-section>
    </q-item>
    <q-list bordered class="q-mb-md">
      <div v-for="i in group_list">
        <q-item @click="changeInde(i.id)" clickable v-ripple>
          <q-item-section>{{ i.name }}</q-item-section>
          <q-item-section avatar class="z-top">
            <q-icon color="primary" name="ion-more">
              <q-menu>
                <q-list style="min-width: 100px">
                  <q-item
                    @click="openGroupName(i.name, i.id)"
                    clickable
                    v-close-popup
                  >
                    <q-item-section>修改 </q-item-section>
                  </q-item>
                  <q-item @click="delFileGroup(i.id)" clickable v-close-popup>
                    <q-item-section>删除</q-item-section>
                  </q-item>
                </q-list>
              </q-menu></q-icon
            >
          </q-item-section>
        </q-item>
      </div>
    </q-list>

    <q-dialog v-model="namePopupStatus" persistent @hide="clearDialogData">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">分组管理</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="group_name" autofocus />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat @click="saveGroupData(group_id)" label="保存" />
          <q-btn flat label="关闭" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      group_name: "",
      showOperateIndex: "all",
      group_list: [],
      namePopupStatus: false,
      group_id: 0
    };
  },

  components: {},
  created() {
    this.getFileGroupList();
  },
  mounted() {},
  methods: {
    clearDialogData() {
      this.group_name = "";
      this.group_id = 0;
    },
    changeInde(v) {
      this.$emit("showOperateIndex", v);
    },
    getFileGroupList() {
      let payload = {};
      this.$store
        .dispatch("group/getGroupList", payload)
        .then(res => {
          this.group_list = res.data.list;
        })
        .catch(error => {});
    },
    saveGroupData(id) {
      let payload = {
        name: this.group_name,
        id: id
      };
      this.$store
        .dispatch("group/setGroupData", payload)
        .then(res => {
          if (res.code == 200) {
            this.getFileGroupList();

            this.$q.notify({
              message: (id > 0 ? "更改" : "新增") + "文件分组成功！",
              color: "blue",
              position: "top"
            });
            this.namePopupStatus = false;
            this.group_name = "";
            this.group_id = 0;
          } else {
            this.$q.notify({
              message:
                (id > 0 ? "更改" : "新增") + "文件分组失败，请刷新重试！",
              color: "red",
              position: "top"
            });
          }
        })
        .catch(error => {});
    },
    delFileGroup(id) {
      let payload = id;
      this.$store
        .dispatch("group/delGroupData", payload)
        .then(res => {
          if (res.code == 200) {
            this.getFileGroupList();
            this.$q.notify({
              message: "删除文件分组成功！",
              color: "blue",
              position: "top"
            });
          } else {
            this.$q.notify({
              message: "删除文件分组失败，请刷新重试！",
              color: "red",
              position: "top"
            });
          }
        })
        .catch(error => {});
    },
    openGroupName(name, id) {
      this.namePopupStatus = true;
      if (name) {
        this.group_name = name;
        this.group_id = id;
      }
    }
  }
};
</script>
<style>
.updataBodayClass .vs-popup {
  width: 30%;
}
</style>
