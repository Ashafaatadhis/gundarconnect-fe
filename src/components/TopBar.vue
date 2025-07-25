<template>
  <div class="top-bar">
    <div class="top-bar-left">
      <img :src="logoImage" alt="Logo" class="logo" />
    </div>
    <div class="top-bar-right">
      <a href="#" class="profile-link" @click.prevent="handleProfileClick">
        <img
          v-if="avatarExists"
          :src="userAvatar"
          alt="User"
          class="avatar"
          @error="handleAvatarError"
        />
        <img v-else src="/profile.png" alt="Default Avatar" class="avatar" />
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import connectLogo from '@/assets/connect.png'
import defaultAvatar from '@/assets/profile.png'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const router = useRouter()
const userData = ref(null)
const showPlaceholder = ref(false)

const logoImage = connectLogo

const fetchUserData = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return

    const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (response.ok) {
      const user = await response.json()
      userData.value = user
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
  }
}

const avatarExists = computed(() => {
  return userData.value?.avatar && !showPlaceholder.value
})

const userAvatar = computed(() => {
  const user = userData.value
  if (!user || !user.avatar || showPlaceholder.value) {
    return defaultAvatar
  }

  // Jika avatar sudah berupa path lengkap (sudah ada 'http' atau '/uploads/')
  if (user.avatar.startsWith('http') || user.avatar.startsWith('/uploads/')) {
    return `${API_BASE_URL}${user.avatar}`
  }

  // Kalau cuma filename doang
  return `${API_BASE_URL}/uploads/${user.avatar}`
})

const handleAvatarError = () => {
  showPlaceholder.value = true
}

const handleProfileClick = () => {
  if (!userData.value?.username) {
    router.push('/login')
  } else {
    router.push(`/@${userData.value.username}`)
  }
}

onMounted(() => {
  fetchUserData()
})
</script>

<style scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #0e061a;
  color: #fff;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  height: 100px;
}

.top-bar-left {
  display: flex;
  align-items: center;
}

.logo {
  padding-left: 350px;
  margin-left: 350px;
  width: 165px;
  height: 100px;
}

.top-bar-right .avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  margin-right: 20px;
  margin-bottom: 10px;
  object-fit: cover;
}

.avatar-placeholder {
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, #64b5f6, #42a5f5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 18px;
  margin-right: 20px;
  margin-bottom: 10px;
}
</style>
