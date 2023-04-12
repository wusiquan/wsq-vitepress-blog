<script setup lang="ts">
import { inject, ref } from 'vue'
import { useRoute, useData } from 'vitepress'
// import { useData } from '../composables/data'
// import IZMHome from './IZMHome.vue'

const route = useRoute()
const data = useData()
const frontmatter = data.frontmatter
// watch(() => route.path, closeSidebar)

const NotFound = inject('NotFound')
</script>

<template>
  <div
    :class="{
      'is-home': frontmatter.layout === 'home'
    }"
  >
    <NotFound v-if="route.component === NotFound" />
    <IZMHome v-else-if="frontmatter.layout === 'home'" />
  </div>
</template>
