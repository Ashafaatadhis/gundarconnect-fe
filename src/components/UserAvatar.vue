<template>
  <img
    :src="src || '/default-avatar.png'"
    alt="Avatar"
    class="rounded-full object-cover w-32 h-32 border border-gray-300"
  />
</template>

<script setup>
defineProps({
  src: String
})
</script>
