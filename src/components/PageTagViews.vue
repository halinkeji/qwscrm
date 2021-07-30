<template>
  <q-toolbar style="min-height: auto">
    <q-tabs
      v-model="currentTab"
      dense
      shrink 
      stretch
      align="left"
      class="full-width"
      content-class="custom-table-bg"
      :breakpoint="0"
      :inline-label="true"
      outside-arrows
      :mobile-arrows="true"
      :switch-indicator="switchIndicator"
    >
      <q-tab
        class="rounded-tab-borders"
        v-for="(tab,index) in visitedViews"
        ref="tag"
        no-caps
        :key="index"
        :name="tab.path"
        @click.middle.native="!isAffix(tab)?closeTab(tab):''"
      >
        <div class="row items-center no-wrap">
          <span class="q-mr-xs">{{tab.title}}</span>
          <q-btn v-if="!isAffix(tab)" @click.stop="closeTab(tab)" icon="close" flat size="8px" round/>
        </div>
      </q-tab>
    </q-tabs>
    <q-btn-dropdown color="primary" label="关闭" split outline size="md" flat disable-main-btn v-show="btn_dropdown">
      <q-list>
        <!-- <q-item clickable v-close-popup @click="onItemClick" class="q-pa-none">
          <q-item-section avatar  style="min-width: auto" class="q-pl-sm q-pr-xs">
            <q-icon color="primary" name="arrow_back_ios"  size="xs"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>关闭左侧</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="onItemClick" class="q-pa-none">
          <q-item-section avatar style="min-width: auto" class="q-pl-sm q-pr-xs">
            <q-icon color="primary" name="arrow_forward_ios"  size="xs"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>关闭右侧</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="onItemClick" class="q-pa-none">
          <q-item-section avatar style="min-width: auto" class="q-pl-sm q-pr-xs">
            <q-icon color="primary" name="close"  size="xs"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>关闭其它</q-item-label>
          </q-item-section>
        </q-item> -->

        <q-item clickable v-close-popup @click="onItemClick" class="q-pa-none">
          <q-item-section avatar style="min-width: auto" class="q-pl-sm q-pr-xs">
            <q-icon color="primary" name="cancel"  size="xs"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>全部关闭</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </q-toolbar>
</template>

<script>
import path from 'path'
import routes from '@/router/routes'

export default {
  name: 'PageTagViews',
  props: {
    switchIndicator: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      currentTab: 'index',
      btn_dropdown: true
    }
  },
  mounted () {
    this.initTags()
    this.addTags()
    this.moveToCurrentTag()
  },
  watch: {
    $route () {
      this.addTags()
      this.moveToCurrentTag()
    },
    currentTab (value) {
      if (!value) {
        return
      }
      if (this.$route.path !== value) {
        this.$router.push({ path: value })
      }
    }
  },
  computed: {
    visitedViews () {
      return this.$store.state.tagviews.visitedViews
    },
    routes () {
      return routes
    }
  },
  methods: {
    initTags () {
      const affixTags = this.affixTags = this.filterAffixTags(this.routes)
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          this.$store.dispatch('tagviews/addVisitedView', tag)
        }
      }
    },
    addTags () {
      const { name } = this.$route
      if (name) {
        this.$store.dispatch('tagviews/addView', this.$route)
      }
      return false
    },
    moveToCurrentTag () {
      this.currentTab = this.$route.path
    },
    closeTab (tab) {
      console.log('tab',tab)
      let newPath = ''
      if (this.$route.path === tab.path) {
        const tabs = this.visitedViews
        tabs.forEach((item, index) => {
          if (this.$route.path === item.path) {
            if (index + 1 < tabs.length) {
              newPath = tabs[index + 1].path
            } else if (index - 1 >= 0) {
              newPath = tabs[index - 1].path
            } else {
              // nothing
            }
          }
        })
      }
      this.$store.dispatch('tagviews/delView', tab)
      if (newPath) {
        this.$router.push({ path: newPath })
      }
    },
    onItemClick (){
      var visitedViews = this.$store.state.tagviews.visitedViews
      console.log('visitedViews',visitedViews)
      for (var i=0;i<visitedViews.length;i++)
      { 
        if(visitedViews[i].name !== 'Index'){
          this.closeTab (visitedViews[i])
        }
      }
      //this.moveToCurrentTag()
    },
    isActive (tab) {
      return tab.path === this.$route.path
    },
    isAffix (tab) {
      return tab.affix
    },
    filterAffixTags (routes, basePath = '/') {
      let tags = []
      routes.forEach(route => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            // fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          })
        }
        if (route.children && route.children.length >= 1) {
          const tempTags = this.filterAffixTags(route.children, path.resolve(basePath, route.path))
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })
      return tags
    }
  }
}
</script>

<style lang="scss" scoped>
.rounded-tab-borders {
  border-radius: 10px 10px 0 0;
}
</style>