<template>
  <div class="login-view">
    <LoginPage />
  </div>
</template>

<script>
import LoginPage from '@/components/LoginPage.vue'

export default {
  name: 'LoginView',
  components: {
    LoginPage
  }
}
</script>

<style scoped>
.login-view {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
