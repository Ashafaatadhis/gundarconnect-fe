<template>
  <div class="post-detail-container">
    <!-- Header with back button -->
    <div class="header">
      <button @click="goBack" class="back-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Kembali
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>Loading post...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="fetchPost" class="retry-btn">Coba Lagi</button>
    </div>

    <!-- Post content -->
    <div v-else-if="post" class="post-container">
      <div class="post-card">
        <!-- Post header -->
        <div class="post-header">
          <div class="user-info">
            <div class="avatar">
              <img v-if="post.author?.avatar" :src="getAvatarUrl(post.author.avatar)" :alt="post.author?.username">
              <div v-else class="avatar-placeholder">
                {{ (post.author?.username || post.author?.fullName || 'U').charAt(0).toUpperCase() }}
              </div>
            </div>
            <div class="user-details">
              <h3 class="username">{{ post.author?.fullName || post.author?.username || 'Unknown User' }}</h3>
              <p class="timestamp">{{ formatTimestamp(post.createdAt) }}</p>
            </div>
          </div>
          <button class="menu-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="1" fill="currentColor"/>
              <circle cx="19" cy="12" r="1" fill="currentColor"/>
              <circle cx="5" cy="12" r="1" fill="currentColor"/>
            </svg>
          </button>
        </div>

        <!-- Post content -->
        <div class="post-content">
          <p class="post-text">{{ post.content }}</p>

          <!-- Post image if exists -->
          <div v-if="post.image" class="post-image">
            <img :src="post.image" :alt="'Post by ' + (post.author?.username || 'user')">
          </div>
        </div>

        <!-- Post stats and actions -->
        <div class="post-actions">
          <div class="action-buttons">
            <!-- Like button -->
            <div class="action-item">
              <button class="btn" @click="toggleLike" data-label="like">
                <svg
                  class="icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 17.503 15.625"
                >
                  <path
                    id="Fill"
                    d="M8.752,15.625h0L1.383,8.162a4.824,4.824,0,0,1,0-6.762,4.679,4.679,0,0,1,6.674,0l.694.7.694-.7a4.678,4.678,0,0,1,6.675,0,4.825,4.825,0,0,1,0,6.762L8.752,15.624ZM4.72,1.25A3.442,3.442,0,0,0,2.277,2.275a3.562,3.562,0,0,0,0,5l6.475,6.556,6.475-6.556a3.563,3.563,0,0,0,0-5A3.443,3.443,0,0,0,12.786,1.25h-.01a3.415,3.415,0,0,0-2.443,1.038L8.752,3.9,7.164,2.275A3.442,3.442,0,0,0,4.72,1.25Z"
                    transform="translate(0 0)"
                    :class="{ liked: isLiked }"
                  ></path>
                </svg>
              </button>
              <span v-if="likeCount > 0" class="counter">{{ likeCount }}</span>
            </div>

            <!-- Comment button -->
            <div class="action-item">
              <button class="btn" @click="toggleComment" data-label="comment">
                <svg
                  class="icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M20 2H4a2 2 0 0 0-2 2v14l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"
                  ></path>
                </svg>
              </button>
              <span v-if="commentCount > 0" class="counter">{{ commentCount }}</span>
            </div>

            <!-- Share button -->
            <div class="action-item">
              <button class="btn" @click="sharePost" data-label="share">
                <svg
                  class="icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="18" cy="5" r="3" data-path="circle-top"></circle>
                  <circle cx="6" cy="12" r="3" data-path="circle-left"></circle>
                  <circle cx="18" cy="19" r="3" data-path="circle-bottom"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" data-path="line-bottom"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" data-path="line-top"></line>
                </svg>
              </button>
            </div>

            <!-- Save button -->
            <div class="action-item">
              <button class="btn save-btn" @click="toggleSaved" data-label="save">
                <svg
                  class="save-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  stroke="white"
                  fill="none"
                  :class="{ saved: isSaved }"
                >
                  <path
                    d="m19,21H5c-1.1,0-2-.9-2-2V5c0-1.1.9-2,2-2h11l5,5v11c0,1.1-.9,2-2,2Z"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    data-path="box"
                  ></path>
                  <path
                    d="M7 3L7 8L15 8"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    data-path="line-top"
                  ></path>
                  <path
                    d="M17 20L17 13L7 13L7 20"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    data-path="line-bottom"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Comments section -->
      <div class="comments-section" v-if="showComments">
        <h3 class="comments-title">Komentar</h3>

        <!-- Add comment -->
        <div class="add-comment">
          <div class="avatar">
            <img v-if="currentUserAvatar" :src="getAvatarUrl(currentUserAvatar)" :alt="currentUserName">
            <div v-else class="avatar-placeholder">
              {{ (currentUserName || 'A').charAt(0).toUpperCase() }}
            </div>
          </div>
          <div class="comment-input-container">
            <textarea
              v-model="newComment"
              placeholder="Tulis komentar..."
              class="comment-input"
              rows="2"
              @keyup.enter="submitComment"
            ></textarea>
            <button
              @click="submitComment"
              class="comment-submit"
              :disabled="!newComment.trim()"
            >
              Kirim
            </button>
          </div>
        </div>

        <!-- Comments list -->
        <div v-if="post.comments && post.comments.length > 0" class="comments-list">
          <div v-for="(comment, index) in post.comments" :key="comment.id || index" class="comment">
            <div class="avatar">
              <img v-if="comment.author?.avatar" :src="getAvatarUrl(comment.author.avatar)" :alt="comment.author?.username">
              <div v-else class="avatar-placeholder">
                {{ (comment.author?.username || comment.author?.fullName || 'U').charAt(0).toUpperCase() }}
              </div>
            </div>
            <div class="comment-content">
              <div class="comment-header">
                <span class="comment-username">{{ comment.author?.fullName || comment.author?.username || 'Unknown' }}</span>
                <span class="comment-time">{{ formatTimestamp(comment.createdAt) }}</span>
              </div>
              <p class="comment-text">{{ comment.content }}</p>
            </div>
          </div>
        </div>

        <!-- No comments state -->
        <div v-else class="no-comments">
          <p>Belum ada komentar. Jadilah yang pertama!</p>
        </div>
      </div>
    </div>

    <!-- Post not found -->
    <div v-else class="not-found">
      <h2>Post tidak ditemukan</h2>
      <p>Post yang Anda cari mungkin telah dihapus atau tidak ada.</p>
      <button @click="goBack" class="back-btn">Kembali ke Feed</button>
    </div>

    <!-- Share Modal -->
    <div v-if="showShareModal" class="share-modal-overlay" @click.self="closeShareModal">
      <div class="share-modal">
        <div class="share-modal-header">
          <h2>Bagikan Post</h2>
          <button class="close-btn" @click="closeShareModal">&times;</button>
        </div>

        <div class="share-modal-body">
          <div class="share-link-container">
            <label class="share-label">Salin tautan:</label>
            <div class="share-input-group">
              <input
                type="text"
                :value="shareLink"
                readonly
                class="share-input"
                ref="shareLinkInput"
              />
              <button @click="copyToClipboard" class="copy-btn" :class="{ copied: isCopied }">
                <span v-if="!isCopied">Salin</span>
                <span v-else>Tersalin!</span>
              </button>
            </div>
          </div>

          <div class="share-options">
            <div class="share-option-label">Atau bagikan ke:</div>
            <div class="share-buttons">
              <button @click="shareToWhatsApp" class="share-option-btn whatsapp">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                  />
                </svg>
                WhatsApp
              </button>
              <button @click="shareToTwitter" class="share-option-btn twitter">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                  />
                </svg>
                Twitter
              </button>
              <button @click="shareToFacebook" class="share-option-btn facebook">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  />
                </svg>
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAvatarUrl } from '@/utils/avatar'

export default {
  name: 'PostDetail',
  data() {
    return {
      post: null,
      loading: true,
      error: null,

      // Current user info
      currentUserName: '',
      currentUserAvatar: null,

      // Action states - sama seperti FeedItem.vue
      isLiked: false,
      isSaved: false,
      likeCount: 0,
      commentCount: 0,
      showComments: false,
      newComment: '',

      // Share modal states
      showShareModal: false,
      shareLink: '',
      isCopied: false
    }
  },
  mounted() {
    console.log('PostDetail component mounted')
    console.log('Post ID:', this.$route.params.id)
    this.fetchPost()
    this.generateShareLink()
    this.setCurrentUser()
  },
  methods: {
    // Copy method getAvatarUrl dari FeedItem
    getAvatarUrl,

    async fetchPost() {
      try {
        this.loading = true
        this.error = null

        const token = localStorage.getItem('token')
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {}

        // Gunakan endpoint backend Anda
        const response = await fetch(`http://localhost:5000/api/posts/${this.$route.params.id}`, {
          headers
        })

        console.log('Response status:', response.status) // Debug
        console.log('Response ok:', response.ok) // Debug

        if (!response.ok) {
          const errorText = await response.text()
          console.log('Error response:', errorText) // Debug
          throw new Error(`Post tidak ditemukan (${response.status})`)
        }

        const data = await response.json()
        console.log('Received data:', data) // Debug log
        console.log('Data type:', typeof data, 'Is array:', Array.isArray(data)) // Debug
        this.post = data

        // Set initial states
        this.likeCount = this.post.likes ? this.post.likes.length : 0
        this.commentCount = this.post.comments ? this.post.comments.length : 0
        // Check if current user liked this post
        // this.isLiked = this.post.likes?.some(like => like.userId === currentUserId)

      } catch (error) {
        console.error('Error fetching post:', error)
        this.error = error.message || 'Gagal memuat post'
      } finally {
        this.loading = false
        console.log('Final states:', { // Debug log
          loading: this.loading,
          error: this.error,
          post: this.post,
          hasPost: !!this.post
        })
      }
    },

    // Copy exact methods dari FeedItem.vue
    async toggleLike() {
      const postId = this.post.id
      const token = localStorage.getItem('token')
      try {
        const res = await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        if (!res.ok) throw new Error('Gagal menyimpan like')
        const updatedPost = await res.json()
        this.likeCount = updatedPost.likes ? updatedPost.likes.length : 0
        // this.isLiked = updatedPost.likes.some(like => like.id === this.$root.currentUserId)
      } catch (err) {
        console.error('Error toggle like:', err)
      }
    },

    toggleComment() {
      this.showComments = !this.showComments
    },

    async submitComment() {
      if (this.newComment.trim() === '') return
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('Token tidak ditemukan')
        const res = await fetch(`http://localhost:5000/api/posts/${this.post.id}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ content: this.newComment })
        })
        if (!res.ok) throw new Error('Gagal mengirim komentar')
        const updatedPost = await res.json()
        // Update komentar di UI
        this.post.comments = updatedPost.comments
        this.commentCount = this.post.comments.length
        this.newComment = ''
      } catch (err) {
        console.error('Gagal submit komentar:', err)
      }
    },

    async toggleSaved() {
      try {
        const { useSavedStore } = await import('@/stores/saved')
        const savedStore = useSavedStore()
        if (!this.isSaved) {
          await savedStore.savePost(this.post.id)
          this.isSaved = true
        } else {
          await savedStore.unsavePost(this.post.id)
          this.isSaved = false
        }
      } catch (err) {
        console.error('Gagal toggle saved:', err)
      }
    },

    // Share methods - copy dari FeedItem.vue
    sharePost() {
      this.showShareModal = true
    },

    closeShareModal() {
      this.showShareModal = false
      this.isCopied = false
    },

    generateShareLink() {
      const postId = this.$route.params.id
      const baseUrl = window.location.origin
      this.shareLink = `${baseUrl}/post/${postId}`
    },

    async copyToClipboard() {
      try {
        await navigator.clipboard.writeText(this.shareLink)
        this.isCopied = true
        setTimeout(() => {
          this.isCopied = false
        }, 2000)
      } catch {
        this.$refs.shareLinkInput.select()
        document.execCommand('copy')
        this.isCopied = true
        setTimeout(() => {
          this.isCopied = false
        }, 2000)
      }
    },

    shareToWhatsApp() {
      const text = encodeURIComponent(`Check out this post: ${this.shareLink}`)
      window.open(`https://wa.me/?text=${text}`, '_blank')
    },

    shareToTwitter() {
      const text = encodeURIComponent('Check out this post!')
      const url = encodeURIComponent(this.shareLink)
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
    },

    shareToFacebook() {
      const url = encodeURIComponent(this.shareLink)
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
    },

    // Copy formatTimestamp dari FeedItem.vue
    formatTimestamp(ts) {
      if (!ts) return ''
      const d = new Date(ts)
      return d.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
    },

    // Set current user info untuk avatar di comment input
    setCurrentUser() {
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        this.currentUserName = user?.fullName || user?.username || 'User'
        this.currentUserAvatar = user?.avatar || null
      } catch (e) {
        this.currentUserName = 'User'
        this.currentUserAvatar = null
      }
    },

    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.post-detail-container {
  min-height: 100vh;
  background: #0e061a;
  color: #ffffff;
  padding: 0;
}

.header {
  position: sticky;
  top: 0;
  background: rgba(14, 6, 26, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #2a3441;
  padding: 16px 20px;
  z-index: 100;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  color: #64b5f6;
  font-size: 16px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: rgba(100, 181, 246, 0.1);
  color: #90caf9;
}

.loading, .error, .not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #2a3441;
  border-top: 3px solid #64b5f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  color: #f48fb1;
}

.retry-btn {
  margin-top: 16px;
  padding: 10px 20px;
  background: #64b5f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.retry-btn:hover {
  background: #42a5f5;
}

.post-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.post-card {
  background: rgba(42, 52, 65, 0.3);
  border: 1px solid #2a3441;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
}

.post-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #2a3441;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #64b5f6, #42a5f5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 18px;
}

.user-details .username {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.user-details .timestamp {
  font-size: 14px;
  color: #8892b0;
  margin: 2px 0 0 0;
}

.menu-btn {
  background: transparent;
  border: none;
  color: #8892b0;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.menu-btn:hover {
  color: #64b5f6;
  background: rgba(100, 181, 246, 0.1);
}

.post-content {
  margin-bottom: 16px;
}

.post-text {
  font-size: 16px;
  line-height: 1.6;
  color: #ccd6f6;
  margin: 0 0 16px 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.post-image {
  border-radius: 8px;
  overflow: hidden;
  margin-top: 12px;
}

.post-image img {
  width: 100%;
  height: auto;
  display: block;
}

.post-actions {
  border-top: 1px solid #2a3441;
  padding-top: 16px;
}

/* Copy styles dari FeedItem.vue */
.action-buttons {
  display: flex;
  align-items: center;
  gap: 24px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn {
  background: transparent;
  border: none;
  color: #8892b0;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.btn:hover {
  color: #64b5f6;
  background: rgba(100, 181, 246, 0.1);
}

.icon {
  fill: currentColor;
}

.counter {
  font-size: 14px;
  color: #8892b0;
}

/* Like button state */
.liked {
  fill: #f48fb1 !important;
  color: #f48fb1 !important;
}

/* Save button state */
.saved {
  fill: #64b5f6 !important;
  color: #64b5f6 !important;
}

.comments-section {
  background: rgba(42, 52, 65, 0.3);
  border: 1px solid #2a3441;
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.comments-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: #ffffff;
}

.add-comment {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.add-comment .avatar {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.add-comment .avatar-placeholder {
  font-size: 16px;
}

.comment-input-container {
  flex: 1;
}

.comment-input {
  width: 100%;
  background: rgba(42, 52, 65, 0.5);
  border: 1px solid #2a3441;
  border-radius: 8px;
  padding: 12px;
  color: #ccd6f6;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  margin-bottom: 8px;
  font-family: inherit;
}

.comment-input:focus {
  outline: none;
  border-color: #64b5f6;
  box-shadow: 0 0 0 2px rgba(100, 181, 246, 0.2);
}

.comment-input::placeholder {
  color: #8892b0;
}

.comment-submit {
  background: #64b5f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s ease;
}

.comment-submit:hover:not(:disabled) {
  background: #42a5f5;
}

.comment-submit:disabled {
  background: #2a3441;
  color: #8892b0;
  cursor: not-allowed;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.comment {
  display: flex;
  gap: 12px;
}

.comment .avatar {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}

.comment .avatar-placeholder {
  font-size: 14px;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.comment-username {
  font-weight: 600;
  color: #ffffff;
  font-size: 14px;
}

.comment-time {
  font-size: 12px;
  color: #8892b0;
}

.comment-text {
  font-size: 14px;
  line-height: 1.5;
  color: #ccd6f6;
  margin: 0;
  word-wrap: break-word;
}

.no-comments {
  text-align: center;
  color: #8892b0;
  padding: 40px 20px;
  font-style: italic;
}

/* Share Modal - copy dari FeedItem.vue */
.share-modal-overlay {
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

.share-modal {
  background-color: #1a1a2e;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.share-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #2a3441;
}

.share-modal-header h2 {
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #8892b0;
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
}

.close-btn:hover {
  color: #64b5f6;
}

.share-modal-body {
  padding: 20px;
}

.share-link-container {
  margin-bottom: 20px;
}

.share-label {
  display: block;
  color: white;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 14px;
}

.share-input-group {
  display: flex;
  gap: 8px;
}

.share-input {
  flex: 1;
  background: #2a3441;
  border: 1px solid #4a5e8a;
  border-radius: 6px;
  padding: 10px 12px;
  color: white;
  font-size: 14px;
}

.copy-btn {
  background: #64b5f6;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s ease;
  white-space: nowrap;
}

.copy-btn:hover:not(.copied) {
  background: #42a5f5;
}

.copy-btn.copied {
  background: #4caf50;
}

.share-options {
  border-top: 1px solid #2a3441;
  padding-top: 20px;
}

.share-option-label {
  color: #8892b0;
  font-size: 14px;
  margin-bottom: 12px;
}

.share-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.share-option-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.share-option-btn.whatsapp {
  background: #25d366;
  color: white;
}

.share-option-btn.twitter {
  background: #1da1f2;
  color: white;
}

.share-option-btn.facebook {
  background: #1877f2;
  color: white;
}

.share-option-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .post-container {
    padding: 16px;
  }

  .post-card, .comments-section {
    padding: 16px;
  }

  .header {
    padding: 12px 16px;
  }

  .share-modal {
    width: 95%;
    margin: 20px;
  }

  .share-buttons {
    flex-direction: column;
  }
}
</style>
