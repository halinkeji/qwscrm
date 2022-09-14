<template>
  <q-page>
    <q-header class="bg-white">
      <q-toolbar class="text-grey-8">
        <q-btn flat round dense icon="las la-angle-left" :to="{ name: 'allApply' }" />
        <q-toolbar-title class="text-subtitle1 text-center q-pt-xs"> 记录 </q-toolbar-title>
      </q-toolbar>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey-7 bg-white q-mx-sm"
        align="justify"
        active-color="blue"
        indicator-color="blue"
        :breakpoint="0"
        narrow-indicator
      >
        <q-tab name="1" label="会员" />
        <q-tab name="2" label="记录" />
      </q-tabs>
    </q-header>
    <q-card flat>
      <q-tab-panels v-model="tab" animated class="q-mx-sm">
        <q-tab-panel name="1" class="q-pa-none">
          <member-list></member-list>
        </q-tab-panel>
        <q-tab-panel name="2" class="q-pa-none">
          <tracking></tracking>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>
<script>
import tracking from './tracking'
import MemberList from './MemberList'
export default {
  name: 'erpClient',
  components: { tracking, MemberList },
  data () {
    return {
      tab: '1'
    }
  },
  mounted () {
    if (this.$route.query && this.$route.params.tab) {
      this.tab = this.$route.params.tab
    }
  },
  created () {},
  computed: {},
  methods: {}
}
</script>
