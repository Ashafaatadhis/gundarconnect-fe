<template>
  <div class="app-layout">
    <TopBar />
    <div class="main-container">
      <sidebar />
      <div class="profile-container">
        <!-- Header Section -->
        <div class="profile-header">
          <div class="cover-image">
            <div class="cover-gradient"></div>
          </div>

          <div class="profile-info-section">
            <div class="profile-avatar-container">
              <div class="profile-avatar">
                <img
                  :src="avatarUrl"
                  @error="handleAvatarError"
                  :alt="user?.fullName || 'Avatar'"
                  style="width: 150px; height: 150px; border-radius: 50%"
                />
              </div>
            </div>

            <div class="profile-details">
              <template v-if="user">
                <h1 class="profile-name">{{ user.fullName || '-' }}</h1>
                <p class="profile-username">@{{ user.username || '-' }}</p>
                <p class="profile-bio">{{ user.bio || '-' }}</p>
              </template>
              <template v-else>
                <h1 class="profile-name">-</h1>
                <p class="profile-username">-</p>
                <p class="profile-bio">-</p>
              </template>
            </div>

            <div class="profile-actions">
              <template v-if="isOwnProfile">
                <button class="btn-primary" @click="showEditModal = true">Edit Profile</button>
                <!-- Logout Button -->
                <button class="btn-logout" @click="showLogoutConfirm = true" title="Logout">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
                    />
                  </svg>
                  Logout
                </button>
              </template>
              <template v-else>
                <!-- Follow/Unfollow Button -->
                <button
                  :class="['btn-follow', { following: followState.isFollowing }]"
                  @click="toggleFollow"
                  :disabled="followState.loading"
                >
                  <svg
                    v-if="followState.loading"
                    width="18"
                    height="18"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    class="loading-icon"
                  >
                    <path
                      d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z"
                      opacity=".5"
                    />
                    <path d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z" />
                  </svg>
                  <svg
                    v-else-if="followState.isFollowing"
                    width="18"
                    height="18"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <svg v-else width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    <path d="M12 8V6m0 4v2m-2-2h2m0 0h2" stroke="currentColor" stroke-width="2" />
                  </svg>
                  {{
                    followState.loading
                      ? 'Loading...'
                      : followState.isFollowing
                        ? 'Unfollow'
                        : 'Follow'
                  }}
                </button>
              </template>
              <button class="btn-secondary" @click="showShareModal = true">Share</button>
            </div>
          </div>
        </div>

        <!-- Stats Section -->
        <div class="profile-stats">
          <div class="stat-item">
            <span class="stat-number">{{ posts.length }}</span>
            <span class="stat-label">Posts</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ followStats.followers || 0 }}</span>
            <span class="stat-label">Followers</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ followStats.following || 0 }}</span>
            <span class="stat-label">Following</span>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="profile-tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="['tab-btn', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            <component :is="tab.icon" class="tab-icon" />
            {{ tab.label }}
          </button>
        </div>

        <!-- Content Section -->
        <div class="profile-content">
          <div v-if="activeTab === 'posts'" class="content-grid">
            <PostCard v-for="post in posts" :key="post.id" :post="post" @deleted="onPostDeleted" />
          </div>

          <div v-else-if="activeTab === 'about'" class="about-section">
            <AboutInfo />
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click="showEditModal = false">
      <div class="modal-container edit-modal" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">Edit Profile</h2>
          <button class="modal-close" @click="showEditModal = false">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              ></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleUpdateProfile">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Profile Picture </label>
              <div class="avatar-upload">
                <div class="avatar-preview">
                  <!-- {{ avatarPreview }} -->

                  <img
                    v-if="avatarPreview"
                    :src="avatarPreview"
                    alt="Preview"
                    style="width: 40px; height: 40px; border-radius: 50%"
                  />
                  <img
                    v-else-if="user && user.avatar"
                    :src="getAvatarUrl(user.avatar)"
                    alt="Avatar"
                    style="width: 40px; height: 40px; border-radius: 50%"
                  />
                  <svg v-else width="40" height="40" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                    ></path>
                  </svg>
                </div>
                <button type="button" class="upload-btn" @click="$refs.fileInput.click()">
                  Change Photo
                </button>
                <input
                  type="file"
                  ref="fileInput"
                  style="display: none"
                  accept="image/*"
                  @change="handleFileChange"
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input
                type="text"
                class="form-input"
                v-model="editForm.name"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Bio</label>
              <textarea
                class="form-textarea"
                v-model="editForm.bio"
                placeholder="Tell us about yourself..."
                rows="4"
              ></textarea>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-cancel" @click="showEditModal = false">Cancel</button>
            <button type="submit" class="btn-save">Save Changes</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Share Modal -->
    <div v-if="showShareModal" class="modal-overlay" @click="showShareModal = false">
      <div class="modal-container share-modal" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">Share Profile</h2>
          <button class="modal-close" @click="showShareModal = false">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              />
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="share-options">
            <button class="share-option" @click="shareToSocial('twitter')">
              <div class="share-icon twitter">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
                  />
                </svg>
              </div>
              <span>Twitter</span>
            </button>

            <button class="share-option" @click="shareToSocial('linkedin')">
              <div class="share-icon linkedin">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
                  />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </div>
              <span>LinkedIn</span>
            </button>

            <button class="share-option" @click="shareToSocial('facebook')">
              <div class="share-icon facebook">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </div>
              <span>Facebook</span>
            </button>

            <button class="share-option" @click="copyProfileLink">
              <div class="share-icon copy">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                </svg>
              </div>
              <span>Copy Link</span>
            </button>
          </div>

          <div class="profile-preview">
            <div class="preview-card">
              <div class="preview-avatar">
                <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  />
                </svg>
              </div>
              <div class="preview-info">
                <h3 class="profile-name">{{ user?.fullName || '-' }}</h3>
                <p>Frontend Developer • Vue.js Enthusiast</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Logout Confirmation Modal -->
    <div v-if="showLogoutConfirm" class="modal-overlay" @click="showLogoutConfirm = false">
      <div class="modal-container logout-modal" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">Confirm Logout</h2>
          <button class="modal-close" @click="showLogoutConfirm = false">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              />
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="logout-content">
            <div class="logout-icon">
              <svg width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
                />
              </svg>
            </div>
            <h3>Are you sure you want to logout?</h3>
            <p>
              You will be redirected to the login page and need to sign in again to access your
              account.
            </p>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" @click="showLogoutConfirm = false">Cancel</button>
          <button class="btn-logout-confirm" @click="handleLogout">Yes, Logout</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Avatar display section -->
  <img
    v-if="user && user.avatar"
    :src="getAvatarUrl(user.avatar)"
    alt="Avatar"
    style="width: 40px; height: 40px; border-radius: 50%"
    @error="handleImageError"
  />

  <!-- Fallback jika tidak ada avatar -->
  <div v-else style="width: 40px; height: 40px; border-radius: 50%; background: #ccc"></div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed, nextTick, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TopBar from './TopBar.vue'
import sidebar from './sidebar.vue'
import PostCard from './profile/PostCard.vue'
import AboutInfo from './profile/AboutInfo.vue'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
import UserAvatar from '@/components/UserAvatar.vue'

import { getAvatarUrl } from '@/utils/avatar' // jika kamu punya helper ini

const props = defineProps({
  user: Object,
})

// Inisialisasi awal
const loadAvatar = () => {
  if (props.user?.avatar) {
    avatarUrl.value = getAvatarUrl(props.user.avatar)
  } else {
    avatarUrl.value = '/profile.png'
  }
}

const defaultAvatar = '/profile.png'
const avatarUrl = ref(defaultAvatar)

function handleAvatarError() {
  avatarUrl.value = defaultAvatar
}

// Reaktif saat `user` berubah
watch(() => props.user, loadAvatar, { immediate: true })

const route = useRoute()
const router = useRouter()
const user = ref(null)
const posts = ref([])
const activeTab = ref('posts')
const showEditModal = ref(false)
const showShareModal = ref(false)
const showLogoutConfirm = ref(false)
const avatarPreview = ref(null)
const isFollowing = ref(false)
const editForm = ref({
  name: '',
  username: '',
  bio: '',
})

watchEffect(() => {
  if (user.value?.avatar) {
    avatarUrl.value = getAvatarUrl(user.value.avatar)
  } else {
    avatarUrl.value = defaultAvatar
  }
})

// Follow/Unfollow state menggunakan reactive object untuk memastikan reactivity
const followState = reactive({
  isFollowing: false,
  loading: false,
})

const followStats = reactive({
  followers: 0,
  following: 0,
})

const tabs = [
  {
    id: 'posts',
    label: 'Posts',
    icon: 'div',
  },
  {
    id: 'about',
    label: 'About',
    icon: 'div',
  },
]

// Get current user from token
const getCurrentUser = () => {
  const token = localStorage.getItem('token')
  if (!token) return null

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    console.log('Token payload:', payload)
    return payload
  } catch (e) {
    console.error('Error parsing token:', e)
    return null
  }
}

// Check if user is following the profile
const checkFollowStatus = async (targetUserId) => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return

    const response = await fetch(`${API_BASE_URL}/api/follow/status/${targetUserId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      const data = await response.json()
      followState.isFollowing = data.isFollowing
      console.log('Follow status checked:', data.isFollowing)
    }
  } catch (error) {
    console.error('Error checking follow status:', error)
  }
}

// Get follow stats
const getFollowStats = async (targetUserId) => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return

    const response = await fetch(`${API_BASE_URL}/api/follow/stats/${targetUserId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      const data = await response.json()
      followStats.followers = Number(data.followers) || 0
      followStats.following = Number(data.following) || 0

      console.log('✅ Follow stats fetched:', followStats)
    } else {
      console.error('❌ Failed to fetch follow stats:', await response.text())
    }
  } catch (error) {
    console.error('Error getting follow stats:', error)
  }
}

// Toggle follow/unfollow - perbaikan utama ada di sini
const toggleFollow = async () => {
  if (!user.value || followState.loading) return

  // Set loading state
  followState.loading = true

  try {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('No token found')
      return
    }

    // Simpan state SEBELUM diubah
    const wasFollowing = followState.isFollowing
    const endpoint = wasFollowing ? 'unfollow' : 'follow'

    console.log('Attempting to', endpoint, 'user. Current state:', wasFollowing)

    const response = await fetch(`${API_BASE_URL}/api/follow/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        followingId: user.value.id,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      console.log('Server response:', data)

      // Update state langsung setelah response berhasil
      followState.isFollowing = !wasFollowing

      // Update followers count berdasarkan aksi yang dilakukan
      if (wasFollowing) {
        // Jika sebelumnya following (sekarang unfollow), kurangi followers
        followStats.followers = Math.max(0, followStats.followers - 1)
      } else {
        // Jika sebelumnya tidak following (sekarang follow), tambah followers
        followStats.followers += 1
      }

      console.log('State updated successfully:', {
        action: endpoint,
        newFollowState: followState.isFollowing,
        newFollowersCount: followStats.followers,
      })

      // Force Vue to re-render dengan nextTick
      await nextTick()
    } else {
      const errorData = await response.json()
      console.error('Follow action failed:', errorData.message)
    }
  } catch (error) {
    console.error('Error in toggleFollow:', error)
  } finally {
    followState.loading = false
  }
}

// Fetch profile data
const fetchProfile = async () => {
  try {
    const currentUser = getCurrentUser()
    console.log('Current user from token:', currentUser)

    if (!currentUser) {
      console.log('No user token found, redirecting to login')
      router.push('/login')
      return
    }

    // Get username from route
    let targetUsername = route.params.username
    if (targetUsername?.startsWith('@')) {
      targetUsername = targetUsername.substring(1)
    }

    // If no username in route, use current user's ID to fetch profile
    if (!targetUsername) {
      console.log('No target username, fetching current user profile')
      try {
        const response = await fetch(`${API_BASE_URL}/api/profile/${currentUser.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

        const data = await response.json()
        console.log('Current user profile data:', data)

        if (data.user?.username) {
          router.push(`/@${data.user.username}`)
          return
        }
      } catch (error) {
        console.error('Error fetching current user profile:', error)
        throw error
      }
    }

    // Fetch profile by username
    console.log('Fetching profile for username:', targetUsername)
    const response = await fetch(`${API_BASE_URL}/api/profile/username/${targetUsername}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    console.log('Profile response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Profile fetch error:', errorText)

      // If username not found and it's meant to be current user, try ID
      if (response.status === 404 && currentUser) {
        console.log('Username not found, trying with user ID:', currentUser.id)
        const idResponse = await fetch(`${API_BASE_URL}/api/profile/${currentUser.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })

        if (!idResponse.ok) {
          throw new Error(`Failed to fetch profile by ID: ${idResponse.status}`)
        }

        const idData = await idResponse.json()
        console.log('Profile data from ID:', idData)

        if (idData.user) {
          user.value = idData.user
          posts.value = idData.posts || []
          router.push(`/@${idData.user.username}`)
          return
        }
      }

      throw new Error(`Failed to fetch profile: ${response.status}`)
    }

    const data = await response.json()
    console.log('Profile data:', data)

    if (!data.user) {
      throw new Error('No user data in response')
    }

    // ⛔ Penting: Reset isFollowing dulu
    isFollowing.value = false

    user.value = data.user
    posts.value = data.posts || []

    // Get follow stats and status if not own profile
    if (currentUser && data.user.id !== currentUser.id) {
      await checkFollowStatus(data.user.id) // ✅ Perbarui status follow
      await getFollowStats(data.user.id)
      console.log('Stats fetched:', {
        followersFromBackend: data.followers,
        followingFromBackend: data.following,
        updatedState: followStats,
      })
    } else if (currentUser && data.user.id === currentUser.id) {
      await getFollowStats(data.user.id)
    }

    // Update edit form if it's the current user's profile
    if (currentUser && data.user.id === currentUser.id) {
      editForm.value = {
        name: data.user.fullName || '',
        username: data.user.username || '',
        bio: data.user.bio || '',
      }
    }

    // 🔍 Debugging
    console.log('✅ isFollowing after fetchProfile:', isFollowing.value)
  } catch (error) {
    console.error('Error in fetchProfile:', error)
    user.value = null
    posts.value = []
    isFollowing.value = false
  }
}

// Check if current profile is user's own profile
const isOwnProfile = computed(() => {
  const currentUser = getCurrentUser()
  return currentUser && user.value && currentUser.id === user.value.id
})

// Watch route changes
watch(
  () => route.params.username,
  async () => {
    await fetchProfile()
  },
)

// Initialize
onMounted(() => {
  console.log('Component mounted, fetching profile...')
  fetchProfile()
})

// Handle logout
const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

// Handle file change for avatar
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    avatarPreview.value = URL.createObjectURL(file)
    editForm.value.avatarFile = file
  }
}

// Handle post deletion
const onPostDeleted = (postId) => {
  posts.value = posts.value.filter((post) => post.id !== postId)
}

// Handle profile update
const handleUpdateProfile = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('No token found')
      return
    }

    console.log('Updating profile with data:', editForm.value)

    // Gunakan FormData agar bisa upload file avatar
    const formData = new FormData()
    formData.append('fullName', editForm.value.name)
    formData.append('bio', editForm.value.bio)
    // Jika ada file avatar baru, tambahkan ke FormData
    if (editForm.value.avatarFile) {
      formData.append('avatar', editForm.value.avatarFile)
    }

    const response = await fetch(`${API_BASE_URL}/api/profile/update`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        // Jangan set Content-Type, biarkan browser yang set (agar boundary FormData benar)
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Error updating profile:', errorData)
      throw new Error(errorData.message || 'Failed to update profile')
    }

    const data = await response.json()
    console.log('Profile updated successfully:', data)

    // Update local user data
    user.value = data.user

    // Close modal
    showEditModal.value = false

    // Refresh profile data
    await fetchProfile()

    // Update URL if username changed
    if (data.user.username !== route.params.username) {
      router.push(`/@${data.user.username}`)
    }
  } catch (error) {
    console.error('Error in handleUpdateProfile:', error)
    // You might want to show an error message to the user here
  }
}
</script>

<style scoped>
/* Layout Styles */
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #0e061a;
}

.main-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Profile Container - Adjusted untuk layout dengan sidebar */
.profile-container {
  flex: 1;
  overflow-y: auto;
  background: #0e061a;
  color: #ffffff;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  padding-top: 2rem; /* Mengurangi padding-top karena sudah ada TopBar */
}

.profile-header {
  position: relative;
  margin-bottom: 2rem;
}

.cover-image {
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  border-radius: 0 0 24px 24px;
  margin-left: 100px;
}

.cover-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(14, 6, 26, 0.8) 100%);
  border-radius: 0 0 24px 24px;
}

.profile-info-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 2rem;
  align-items: end;
  margin-top: -60px;
  position: relative;
  z-index: 10;
}

.profile-avatar-container {
  position: relative;
}

.profile-avatar {
  position: relative;
  width: 150px;
  height: 155px;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid #0e061a;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.edit-avatar-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #667eea;
  border: 2px solid #0e061a;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-avatar-btn:hover {
  background: #5a6fd8;
  transform: scale(1.1);
}

.profile-details {
  padding-top: 1rem;
}

.profile-name {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.profile-username {
  color: #a0a0b8;
  margin: 0.25rem 0 1rem 0;
  font-size: 1rem;
}

.profile-bio {
  color: #e0e0e0;
  line-height: 1.6;
  margin: 0 0 1rem 0;
  max-width: 500px;
}

.profile-meta {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #a0a0b8;
  font-size: 0.9rem;
}

.meta-item svg {
  opacity: 0.7;
}

.profile-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding-top: 1rem;
  flex-wrap: wrap;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

/* Follow/Unfollow Button Styles - perbaikan styling */
.btn-follow {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  min-width: 120px;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.btn-follow:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
}

.btn-follow.following {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  animation: followSuccess 0.3s ease;
}

.btn-follow.following:hover:not(:disabled) {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
}

.btn-follow:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  pointer-events: none;
}

.loading-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes followSuccess {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* Logout Button Styles */
.btn-logout {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #dc3545, #c82333);
  color: white;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.btn-logout:hover {
  background: linear-gradient(135deg, #c82333, #a71e2a);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(220, 53, 69, 0.3);
}

.btn-logout svg {
  width: 18px;
  height: 18px;
}

.profile-stats {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem 1rem;
  border-radius: 16px;
  text-align: center;
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
}

.stat-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

.stat-number {
  display: block;
  font-size: 1.75rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 0.25rem;
}

.stat-label {
  color: #a0a0b8;
  font-size: 0.9rem;
  font-weight: 500;
}

.profile-tabs {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  color: #a0a0b8;
  font-weight: 500;
  cursor: pointer;
  border-radius: 12px 12px 0 0;
  transition: all 0.2s ease;
  position: relative;
}

.tab-btn:hover {
  color: #e0e0e0;
  background: rgba(255, 255, 255, 0.05);
}

.tab-btn.active {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 2px;
}

.tab-icon {
  width: 20px;
  height: 20px;
}

.profile-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem 2rem;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.about-section {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(10px);
}

@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
  }

  .profile-info-section {
    grid-template-columns: 1fr;
    gap: 1rem;
    text-align: center;
  }

  .profile-actions {
    justify-content: center;
  }

  .profile-tabs {
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease;
}

.modal-container {
  background: #1a0f2e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  backdrop-filter: blur(20px);
  animation: slideUp 0.3s ease;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.modal-close {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a0a0b8;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  justify-content: flex-end;
}

/* Edit Modal Specific Styles */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  color: #e0e0e0;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.form-input,
.form-textarea {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  color: #ffffff;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  background: rgba(255, 255, 255, 0.08);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.avatar-upload {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar-preview {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.upload-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.15);
}

.btn-save {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

/* Share Modal Specific Styles */
.share-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.share-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.share-option:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.share-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.share-icon.twitter {
  background: #1da1f2;
}

.share-icon.linkedin {
  background: #0077b5;
}

.share-icon.facebook {
  background: #1877f2;
}

.share-icon.copy {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.profile-preview {
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.preview-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
}

.preview-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.preview-info h3 {
  margin: 0 0 0.25rem 0;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
}

.preview-info p {
  margin: 0;
  color: #a0a0b8;
  font-size: 0.85rem;
}

/* Logout Modal Specific Styles */
.logout-modal {
  max-width: 420px;
}

.logout-content {
  text-align: center;
  padding: 1rem 0;
}

.logout-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #dc3545, #c82333);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.logout-content h3 {
  color: #ffffff;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.logout-content p {
  color: #a0a0b8;
  line-height: 1.6;
  margin: 0;
  font-size: 0.95rem;
}

.btn-logout-confirm {
  background: linear-gradient(135deg, #dc3545, #c82333);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-logout-confirm:hover {
  background: linear-gradient(135deg, #c82333, #a71e2a);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(220, 53, 69, 0.3);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 768px) {
  .modal-container {
    width: 95%;
    margin: 1rem;
  }

  .share-options {
    grid-template-columns: 1fr;
  }

  .profile-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-logout {
    justify-content: center;
  }

  .btn-follow {
    justify-content: center;
  }
}
</style>
