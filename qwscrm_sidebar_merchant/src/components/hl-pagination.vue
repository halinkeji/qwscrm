<template>
  <div class="q-mt-sm">
    <div class="justify-center row items-center ">
      <div class="self-center col-auto " tabindex="0">共 {{ total }} 条</div>

      <div class="col-auto">
        <q-pagination
          v-model="current"
          @input="changePaginationHandle"
          :max="maxPage"
          dense
          :max-pages="1"
          :boundary-numbers="false"
          :direction-links="true"
        >
        </q-pagination>
      </div>
      <div class="col-auto">
        <q-select
          outlined
          dense
          class="full-width"
          @input="sizeChangeHandle"
          v-model="currentPageSize"
          :options="pageSizes"
        >
          <template v-slot:selected-item="scope">
            {{ scope.opt }} 条/页
          </template>

          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
              <q-item-section>
                <q-item-label>{{ scope.opt }} 条/页</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <!-- <div class="col-auto ">
        <q-input
          class=" q-pl-sm"
          outlined
          v-model="inputPage"
          @change="currentChangeHandle"
          style="width:50%;"
          dense
        >
          <template v-slot:before>
            <div class="text-overline text-dark">
              前往
            </div>
          </template>
          <template v-slot:after>
            <div class="text-overline text-dark">
              页
            </div>
          </template>
        </q-input>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "hlPagination",
  props: {
    currentPage: {
      type: Number,
      required: false,
      default: 1
    },
    max: {
      type: Number,
      required: false,
      default: 10
    },
    pageSize: {
      type: Number,
      required: false,
      default: 10
    },
    pageSizes: {
      type: Array,
      required: false,
      default: [10, 20, 50, 100, 200, 300, 500, 1000]
    },
    total: {
      type: Number,
      required: false,
      default: 6
    }
  },
  data() {
    return {
      current: 1,
      inputPage: 1,
      currentPageSize: 10
    };
  },
  watch: {
    pageSize(newValue, oldValue) {
      this.currentPageSize = newValue;
    },
    currentPage(newValue, oldValue) {
      this.current = parseInt(newValue);
    }
  },
  created() {
    this.currentPageSize = this.pageSize;
  },
  methods: {
    sizeChangeHandle() {
      this.$emit("size-change", this.currentPageSize);
    },
    currentChangeHandle() {
      if (parseInt(this.inputPage) > this.maxPage) {
        this.inputPage = this.maxPage;
      }
      this.current = parseInt(this.inputPage);

      this.$emit("current-change", this.current);
    },
    changePaginationHandle() {
      this.inputPage = this.current;
      this.$emit("current-change", this.current);
    }
  },
  computed: {
    maxPage() {
      return Math.ceil(this.total / this.pageSize) &&
        Math.ceil(this.total / this.pageSize) != "Infinity"
        ? Math.ceil(this.total / this.pageSize)
        : 1;
    }
  }
};
</script>
