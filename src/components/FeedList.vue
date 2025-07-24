<template>
  <div class="feed-list">
    <div class="post-input">
      <input
        type="text"
        placeholder="Apa yang ingin anda tanya?"
        @click="openNewThreadModal"
        readonly
      />
    </div>

    <!-- Feed Items -->
    <div v-for="post in posts" :key="post.id" class="feed-item-wrapper">
      <FeedItem :post="post" @show-menu="showPostMenu" />
    </div>

    <!-- Post Menu Dropdown -->
    <div v-if="showMenu" class="menu-overlay" @click="closeMenu">
      <div class="dropdown-menu" :style="menuPosition" @click.stop>
        <div class="menu-item" @click="reportPost">
          <i class="fa fa-flag"></i>
          <span>Laporkan Postingan</span>
        </div>
        <div class="menu-item" @click="savePost">
          <i class="fa fa-bookmark"></i>
          <span>Simpan Postingan</span>
        </div>
        <div class="menu-item" @click="copyLink">
          <i class="fa fa-link"></i>
          <span>Salin Link</span>
        </div>
        <div class="menu-item danger" @click="blockUser">
          <i class="fa fa-user-slash"></i>
          <span>Blokir Pengguna</span>
        </div>
      </div>
    </div>

    <!-- Report Modal -->
    <div v-if="showReportModal" class="modal-overlay" @click="closeReportModal">
      <div class="modal-content report-modal" @click.stop>
        <div class="modal-header">
          <button class="cancel-btn" @click="closeReportModal">Batal</button>
          <h3>Laporkan Postingan</h3>
          <button class="submit-btn" @click="submitReport" :disabled="!selectedReason">Kirim</button>
        </div>

        <div class="modal-body">
          <p class="report-description">
            Mengapa Anda melaporkan postingan ini?
          </p>

          <div class="report-reasons">
            <div
              v-for="reason in reportReasons"
              :key="reason.id"
              class="reason-item"
              :class="{ selected: selectedReason === reason.id }"
              @click="selectReason(reason.id)"
            >
              <div class="reason-icon">
                <i :class="reason.icon"></i>
              </div>
              <div class="reason-content">
                <h4>{{ reason.title }}</h4>
                <p>{{ reason.description }}</p>
              </div>
              <div class="reason-check">
                <i class="fa fa-check" v-if="selectedReason === reason.id"></i>
              </div>
            </div>
          </div>

          <div class="additional-info" v-if="selectedReason">
            <label for="report-details">Detail tambahan (opsional)</label>
            <textarea
              id="report-details"
              v-model="reportDetails"
              placeholder="Jelaskan lebih detail mengenai laporan Anda..."
              rows="3"
            ></textarea>
          </div>
        </div>
      </div>
    </div>

    <!-- New Post Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <button class="cancel-btn" @click="closeModal">Cancel</button>
          <h3>New Post</h3>
          <button class="post-btn" @click="submitPost" :disabled="!newPost.trim()">Post</button>
        </div>

        <div class="modal-body">
          <div class="user-info">
            <div class="user-avatar">
  <img v-if="currentUserAvatar" :src="currentUserAvatar" alt="User Avatar" />
  <div v-else class="avatar-placeholder">
    {{ (currentUserName || 'U').charAt(0).toUpperCase() }}
  </div>
</div>
            <div class="user-details">
              <span class="username">{{ currentUserName }}</span>
            </div>
          </div>

          <div class="post-content">
            <textarea
              v-model="newPost"
              placeholder="What's new?"
              rows="4"
              class="post-textarea"
              @input="adjustTextareaHeight"
              ref="postTextarea"
            ></textarea>

            <div class="post-actions">
              <div class="action-buttons">
                <button class="action-btn" title="Add Image">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21,15 16,10 5,21"/>
                  </svg>
                </button>
                <button class="action-btn" title="Add Poll">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="20" x2="12" y2="10"/>
                    <line x1="18" y1="20" x2="18" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="16"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="privacy-setting">
            <span class="privacy-text">Anyone can reply</span>
            <button class="privacy-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick, computed } from 'vue'
import FeedItem from './FeedItem.vue'
import { getAvatarUrl } from '@/utils/avatar'

export default {
  name: 'FeedList',
  components: {
    FeedItem,
  },
  setup() {
    const posts = ref([])
    const showModal = ref(false)
    const newPost = ref('')
    const postTextarea = ref(null)

    // Menu states
    const showMenu = ref(false)
    const currentPostId = ref(null)
    const menuPosition = ref({ top: '0px', left: '0px' })

    // Report states
    const showReportModal = ref(false)
    const selectedReason = ref(null)
    const reportDetails = ref('')

    const reportReasons = ref([
      {
        id: 'spam',
        title: 'Spam',
        description: 'Postingan yang tidak relevan atau mengganggu',
        icon: 'fa fa-ban'
      },
      {
        id: 'harassment',
        title: 'Pelecehan atau Bullying',
        description: 'Konten yang menyerang atau melecehkan seseorang',
        icon: 'fa fa-exclamation-triangle'
      },
      {
        id: 'hate-speech',
        title: 'Ujaran Kebencian',
        description: 'Konten yang mengandung diskriminasi atau kebencian',
        icon: 'fa fa-angry'
      },
      {
        id: 'violence',
        title: 'Kekerasan',
        description: 'Konten yang mengandung kekerasan atau ancaman',
        icon: 'fa fa-fist-raised'
      },
      {
        id: 'inappropriate',
        title: 'Konten Tidak Pantas',
        description: 'Konten dewasa atau tidak sesuai komunitas',
        icon: 'fa fa-eye-slash'
      },
      {
        id: 'misinformation',
        title: 'Informasi Palsu',
        description: 'Menyebarkan berita atau informasi yang salah',
        icon: 'fa fa-times-circle'
      },
      {
        id: 'other',
        title: 'Lainnya',
        description: 'Alasan lain yang tidak tercantum di atas',
        icon: 'fa fa-ellipsis-h'
      }
    ])

    // Current user data - TAMBAH INI SAJA
const currentUser = ref(null)

// Get current user info - TAMBAH INI SAJA
const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user')
    if (user) {
      return JSON.parse(user)
    }

    const token = localStorage.getItem('token')
    if (!token) return null

    return JSON.parse(atob(token.split('.')[1]))
  } catch (e) {
    console.error('Error getting user:', e)
    return null
  }
}

// Computed for avatar - TAMBAH INI SAJA
const currentUserAvatar = computed(() => {
  const user = currentUser.value || getCurrentUser()
  if (!user?.avatar) return null
  return getAvatarUrl(user.avatar)
})

    // Existing functions
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token')
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {}
        const res = await fetch('http://localhost:5000/api/posts', {
          headers
        })
        if (!res.ok) throw new Error('Gagal memuat feed')
        const data = await res.json()
        console.log('FEED DATA:', data)
        posts.value = Array.isArray(data) ? data : []
      } catch (err) {
        posts.value = []
        console.error('Feed fetch error:', err)
      }
    }

    onMounted(() => {
      fetchPosts()
      // Get current user data
      currentUser.value = getCurrentUser()
    })

    const openNewThreadModal = () => {
      showModal.value = true
      nextTick(() => {
        if (postTextarea.value) {
          postTextarea.value.focus()
        }
      })
    }

    const closeModal = () => {
      showModal.value = false
      newPost.value = ''
    }

    const submitPost = async () => {
      if (newPost.value.trim()) {
        try {
          const token = localStorage.getItem('token')
          const res = await fetch('http://localhost:5000/api/posts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              content: newPost.value,
              image: ''
            })
          })
          if (!res.ok) throw new Error('Gagal membuat postingan')
          await fetchPosts()
          closeModal()
        } catch (err) {
          alert(err.message || 'Gagal membuat postingan')
        }
      }
    }

    const adjustTextareaHeight = () => {
      if (postTextarea.value) {
        postTextarea.value.style.height = 'auto'
        postTextarea.value.style.height = postTextarea.value.scrollHeight + 'px'
      }
    }

    // Menu functions
    const showPostMenu = ({ postId, event }) => {
      currentPostId.value = postId
      const rect = event.target.getBoundingClientRect()
      menuPosition.value = {
        top: `${rect.bottom + window.scrollY + 5}px`,
        left: `${rect.left + window.scrollX - 150}px`
      }
      showMenu.value = true
    }

    const closeMenu = () => {
      showMenu.value = false
      currentPostId.value = null
    }

    // Menu actions
    const reportPost = () => {
      showReportModal.value = true
      closeMenu()
    }

    const savePost = () => {
      // Implement save post functionality
      alert('Postingan disimpan!')
      closeMenu()
    }

    const copyLink = () => {
      // Implement copy link functionality
      navigator.clipboard.writeText(`${window.location.origin}/post/${currentPostId.value}`)
      alert('Link disalin!')
      closeMenu()
    }

    const blockUser = () => {
      if (confirm('Apakah Anda yakin ingin memblokir pengguna ini?')) {
        // Implement block user functionality
        alert('Pengguna diblokir!')
        closeMenu()
      }
    }

    // Report functions
    const closeReportModal = () => {
      showReportModal.value = false
      selectedReason.value = null
      reportDetails.value = ''
    }

    const selectReason = (reasonId) => {
      selectedReason.value = reasonId
    }

    const submitReport = async () => {
      if (!selectedReason.value) return

      try {
        const token = localStorage.getItem('token')
        const res = await fetch('http://localhost:5000/api/reports', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            postId: currentPostId.value,
            reason: selectedReason.value,
            details: reportDetails.value
          })
        })

        if (!res.ok) throw new Error('Gagal mengirim laporan')

        alert('Laporan berhasil dikirim. Terima kasih!')
        closeReportModal()
      } catch (err) {
        alert(err.message || 'Gagal mengirim laporan')
      }
    }

    // Ambil nama user dari localStorage
    let currentUserName = 'User';
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      currentUserName = user?.fullName || user?.username || 'User';
    } catch (e) {}

    return {
      posts,
      showModal,
      newPost,
      postTextarea,
      showMenu,
      menuPosition,
      showReportModal,
      selectedReason,
      reportDetails,
      reportReasons,
      openNewThreadModal,
      closeModal,
      submitPost,
      adjustTextareaHeight,
      showPostMenu,
      closeMenu,
      reportPost,
      savePost,
      copyLink,
      blockUser,
      closeReportModal,
      selectReason,
      submitReport,
      currentUserName,
      currentUserAvatar,
      getAvatarUrl
    }
  },
}
</script>

<style scoped>
.feed-list {
  width: 50%;
  align-items: center;
  margin: auto;
  margin-top: 100px;
  padding: 16px;
}

.post-input {
  background-color: #101238;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 16px;
}

.post-input input {
  width: 100%;
  background-color: #2a3e6a;
  border: none;
  border-radius: 20px;
  padding: 12px 16px;
  color: white;
  font-size: 14px;
  box-sizing: border-box;
  cursor: pointer;
}

.post-input input::placeholder {
  color: #8f8f9d;
}

.feed-item-wrapper {
  position: relative;
}

/* Menu Dropdown Styles */
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
}

.dropdown-menu {
  position: absolute;
  background-color: #1a1a2e;
  border: 1px solid #2a3e6a;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  min-width: 200px;
  z-index: 1000;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 14px;
}

.menu-item:hover {
  background-color: #2a3e6a;
}

.menu-item.danger {
  color: #ff6b6b;
}

.menu-item.danger:hover {
  background-color: rgba(255, 107, 107, 0.1);
}

.menu-item i {
  width: 16px;
  text-align: center;
}

/* Report Modal Styles */
.report-modal {
  max-width: 600px;
  width: 90%;
}

.report-description {
  color: #b0b0c0;
  margin-bottom: 20px;
  font-size: 16px;
}

.report-reasons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.reason-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 2px solid #2a3e6a;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.reason-item:hover {
  border-color: #4a5e8a;
  background-color: rgba(74, 94, 138, 0.1);
}

.reason-item.selected {
  border-color: #007bff;
  background-color: rgba(0, 123, 255, 0.1);
}

.reason-icon {
  width: 40px;
  height: 40px;
  background-color: #2a3e6a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8f8f9d;
  font-size: 16px;
}

.reason-item.selected .reason-icon {
  background-color: #007bff;
  color: white;
}

.reason-content {
  flex: 1;
}

.reason-content h4 {
  color: white;
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
}

.reason-content p {
  color: #8f8f9d;
  margin: 0;
  font-size: 12px;
  line-height: 1.4;
}

.reason-check {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #007bff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.2s;
}

.reason-item.selected .reason-check {
  opacity: 1;
}

.additional-info {
  margin-top: 20px;
}

.additional-info label {
  display: block;
  color: white;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 14px;
}

.additional-info textarea {
  width: 100%;
  background-color: #2a3e6a;
  border: 1px solid #4a5e8a;
  border-radius: 8px;
  padding: 12px;
  color: white;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  box-sizing: border-box;
}

.additional-info textarea::placeholder {
  color: #8f8f9d;
}

.additional-info textarea:focus {
  outline: none;
  border-color: #007bff;
}

.submit-btn {
  background-color: #007bff;
  color: white;
}

.submit-btn:disabled {
  background-color: #2a3e6a;
  color: #8f8f9d;
  cursor: not-allowed;
}

/* Existing Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #1a1a2e;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #2a3e6a;
}

.modal-header h3 {
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.cancel-btn, .post-btn {
  background: none;
  border: none;
  color: #8f8f9d;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.post-btn {
  background-color: #007bff;
  color: white;
}

.post-btn:disabled {
  background-color: #2a3e6a;
  color: #8f8f9d;
  cursor: not-allowed;
}

.cancel-btn:hover {
  background-color: #2a3e6a;
}

.post-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.modal-body {
  padding: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 12px;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.user-subtitle {
  color: #8f8f9d;
  font-size: 12px;
}

.post-content {
  margin-bottom: 16px;
}

.post-textarea {
  width: 100%;
  background: transparent;
  border: none;
  color: white;
  font-size: 16px;
  font-family: inherit;
  resize: none;
  outline: none;
  min-height: 60px;
  max-height: 200px;
  overflow-y: auto;
  box-sizing: border-box;
}

.post-textarea::placeholder {
  color: #8f8f9d;
}

.post-actions {
  margin-top: 16px;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.action-btn {
  background: none;
  border: none;
  color: #8f8f9d;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background-color: #2a3e6a;
  color: white;
}

.privacy-setting {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-top: 1px solid #2a3e6a;
}

.privacy-text {
  color: #8f8f9d;
  font-size: 14px;
}

.privacy-btn {
  background: none;
  border: none;
  color: #8f8f9d;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.privacy-btn:hover {
  background-color: #2a3e6a;
}

.avatar-placeholder {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #64b5f6, #42a5f5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 16px;
}

/* Responsive */
@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: 20px;
  }

  .feed-list {
    width: 90%;
  }

  .dropdown-menu {
    min-width: 180px;
  }
}
</style>
