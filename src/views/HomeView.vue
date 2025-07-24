<script setup>
// import TheWelcome from '../components/TheWelcome.vue'
// import Feed from '@/components/FeedItem.vue'

import TopBar from '../components/TopBar.vue'
import sidebar from '../components/sidebar.vue'
import FeedList from '@/components/FeedList.vue'
</script>

<template>
  <div>
    <!-- <TheWelcome /> -->
    <div class="zindex">
      <p>HALLOO</p>
    </div>
    <TopBar />
    <sidebar />
    <FeedList />
  </div>
</template>

<style scoped>
div.zindex {
  z-index: 100000000;
}
</style>
