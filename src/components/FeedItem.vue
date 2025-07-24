<template>
  <div
    class="feed-item"
    :class="{ clickable: post.comments && post.comments.length > 0 && !post.isReply }"
  >
    <div class="feed-header">
      <div class="user-info">
        <img :src="getAvatarUrl(post.author?.avatar)" alt="User Avatar" class="avatar" />
        <div>
          <router-link
            class="username"
            :to="{ name: 'UserProfile', params: { username: post.author?.username } }"
            style="color:inherit;text-decoration:none;cursor:pointer"
          >
            {{ post.author?.fullName || post.author?.username || '-' }}
          </router-link>
          <div class="timestamp">{{ formatTimestamp(post.createdAt) }}</div>
        </div>
      </div>
      <div class="more-options">
        <span v-if="post.isReply">Balas</span>
        <div v-else class="menu-container">
          <button class="menu-btn" @click="toggleMenu" ref="menuButton">
            •••
          </button>

          <!-- Dropdown Menu -->
          <div v-if="showMenu" class="dropdown-menu">
            <div class="menu-item" @click="reportPost">
              <i class="fa fa-flag"></i>
              <span>Laporkan Postingan</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Menu Overlay to close menu when clicking outside -->
    <div v-if="showMenu" class="menu-overlay" @click="closeMenu"></div>

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

    <div class="feed-content">
      <p>{{ post.content }}</p>

      <!-- Gambar jika ada -->
      <img v-if="post.image" :src="post.image" alt="Post Image" class="post-image" />
    </div>

    <div class="feed-actions">
      <div class="action-group">
        <!-- Tombol Like -->
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
          <span v-if="likeCount" class="counter">{{ likeCount }}</span>
        </div>

        <!-- Tombol Comment -->
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
          <span v-if="commentCount" class="counter">{{ commentCount }}</span>
        </div>

        <!-- Tombol Share -->
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

        <!-- Tombol Saved -->
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

    <!-- Modal Komentar -->
    <div v-if="showCommentModal" class="comment-modal-overlay" @click.self="closeModal">
      <div class="comment-modal">
        <div class="comment-modal-header">
          <h2>KOMENTAR</h2>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>

        <div class="comment-modal-body">
          <!-- Daftar komentar -->
          <div v-if="post.comments && post.comments.length > 0" class="comments-list">
            <!-- Komentar item -->
            <div v-for="(comment, index) in post.comments" :key="index" class="comment-item">
              <div class="comment-avatar">
                <img :src="getAvatarUrl(comment.author?.avatar)" alt="User Avatar" />
              </div>
              <div class="comment-content">
                <div class="comment-header">
                  <div class="comment-username">{{ comment.author?.fullName || comment.author?.username || '-' }}</div>
                  <div class="comment-timestamp">{{ comment.createdAt ? new Date(comment.createdAt).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short', year: 'numeric' }) : (comment.time || '-') }}</div>
                </div>
                <div class="comment-text">{{ comment.content || comment.text || comment.comment || '-' }}</div>

                <!-- Action buttons untuk setiap komentar -->
                <div class="comment-actions">
                  <!-- Tombol Like untuk komentar -->
                  <div class="action-item">
                    <button class="btn" @click="toggleCommentLike(index)" data-label="like">
                      <svg
                        class="icon"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 17.503 15.625"
                      >
                        <path
                          d="M8.752,15.625h0L1.383,8.162a4.824,4.824,0,0,1,0-6.762,4.679,4.679,0,0,1,6.674,0l.694.7.694-.7a4.678,4.678,0,0,1,6.675,0,4.825,4.825,0,0,1,0,6.762L8.752,15.624ZM4.72,1.25A3.442,3.442,0,0,0,2.277,2.275a3.562,3.562,0,0,0,0,5l6.475,6.556,6.475-6.556a3.563,3.563,0,0,0,0-5A3.443,3.443,0,0,0,12.786,1.25h-.01a3.415,3.415,0,0,0-2.443,1.038L8.752,3.9,7.164,2.275A3.442,3.442,0,0,0,4.72,1.25Z"
                          transform="translate(0 0)"
                          :class="{ liked: likedComments[index] }"
                        ></path>
                      </svg>
                    </button>
                    <span v-if="commentLikes[index] > 0" class="counter">{{
                      commentLikes[index]
                    }}</span>
                  </div>

                  <!-- Tombol Reply untuk komentar -->
                  <div class="action-item">
                    <button class="btn" @click="toggleReply(index)" data-label="reply">
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
                    <span v-if="commentReplies[index] > 0" class="counter">{{
                      commentReplies[index]
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="no-comments">
            Belum ada komentar. Jadilah yang pertama berkomentar!
          </div>
        </div>

        <div class="comment-modal-footer">
          <div class="comment-input-container">
            <img v-if="currentUserAvatar" :src="currentUserAvatar" alt="User Avatar" class="comment-avatar-input" />
<div v-else class="comment-avatar-placeholder">
  {{ (currentUserName || 'U').charAt(0).toUpperCase() }}
</div>
            <div class="comment-form">
              <input
                type="text"
                v-model="newComment"
                placeholder="Komentari sebagai David Radot"
                class="comment-input"
                @keyup.enter="submitComment"
              />
              <button @click="submitComment" class="submit-comment" :disabled="!newComment.trim()">
                Kirim
              </button>
            </div>
          </div>
          <div class="action-buttons">
            <button class="cancel-btn" @click="closeModal">Batalkan</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Share -->
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
  name: 'FeedItem',
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isLiked: false,
      isSaved: false,
      likeCount: this.post.likes ? this.post.likes.length : 0,
      commentCount: this.post.comments ? this.post.comments.length : 0,
      showComments: false,
      showCommentModal: false,
      showShareModal: false,
      newComment: '',
      shareLink: '',
      isCopied: false,
      commentLikes: {},
      commentReplies: {},
      likedComments: {},

      currentUserName: '',
    currentUserAvatar: null,

      // Menu and Report states
      showMenu: false,
      showReportModal: false,
      selectedReason: null,
      reportDetails: '',

      reportReasons: [
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
      ]
    }
  },
  methods: {
    // Existing methods
    setCurrentUser() {
    try {
      const user = JSON.parse(localStorage.getItem('user'))
      this.currentUserName = user?.fullName || user?.username || 'User'
      this.currentUserAvatar = user?.avatar ? getAvatarUrl(user.avatar) : null
    } catch (e) {
      this.currentUserName = 'User'
      this.currentUserAvatar = null
    }
  },

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
        this.isLiked = updatedPost.likes.some(like => like.id === this.$root.currentUserId)
      } catch (err) {
        alert(err.message || 'Gagal menyimpan like')
      }
    },
    toggleCommentLike(commentIndex) {
      this.likedComments[commentIndex] = !this.likedComments[commentIndex]
      if (this.likedComments[commentIndex]) {
        this.commentLikes[commentIndex]++
      } else if (this.commentLikes[commentIndex] > 0) {
        this.commentLikes[commentIndex]--
      }
    },
    toggleComment() {
      this.showCommentModal = !this.showCommentModal
    },
    toggleReply(commentIndex) {
      console.log(`Toggle reply for comment ${commentIndex}`)
    },
    closeModal() {
      this.showCommentModal = false
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
    sharePost() {
      this.showShareModal = true
    },
    closeShareModal() {
      this.showShareModal = false
      this.isCopied = false
    },
    generateShareLink() {
      const postId = this.post.id || Math.random().toString(36).substr(2, 9)
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
    formatTimestamp(ts) {
      if (!ts) return ''
      const d = new Date(ts)
      return d.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
    },

    // New menu and report methods
    getAvatarUrl,
    toggleMenu() {
      this.showMenu = !this.showMenu
    },
    closeMenu() {
      this.showMenu = false
    },
    reportPost() {
      this.showReportModal = true
      this.closeMenu()
    },
    closeReportModal() {
      this.showReportModal = false
      this.selectedReason = null
      this.reportDetails = ''
    },
    selectReason(reasonId) {
      this.selectedReason = reasonId
    },
    async submitReport() {
      if (!this.selectedReason) return

      try {
        const token = localStorage.getItem('token')
        const res = await fetch('http://localhost:5000/api/reports', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            postId: this.post.id,
            reason: this.selectedReason,
            details: this.reportDetails
          })
        })

        if (!res.ok) throw new Error('Gagal mengirim laporan')

        alert('Laporan berhasil dikirim. Terima kasih!')
        this.closeReportModal()
      } catch (err) {
        alert(err.message || 'Gagal mengirim laporan')
      }
    },

    handleKeydown(e) {
      if (e.key === 'Escape') {
        if (this.showCommentModal) {
          this.closeModal()
        }
        if (this.showShareModal) {
          this.closeShareModal()
        }
        if (this.showReportModal) {
          this.closeReportModal()
        }
        if (this.showMenu) {
          this.closeMenu()
        }
      }
    },
  },
  created() {
    window.addEventListener('keydown', this.handleKeydown)
    this.generateShareLink()

    if (this.post.comments) {
      this.post.comments.forEach((comment, index) => {
        this.commentLikes[index] = comment.likes || 0
        this.commentReplies[index] = comment.replies ? comment.replies.length : 0
        this.likedComments[index] = false
      })
    }

    this.setCurrentUser()

    this.likeCount = this.post.likes ? this.post.likes.length : 0
    this.commentCount = this.post.comments ? this.post.comments.length : 0
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeydown)
  },
}
</script>

<style scoped>
@import url('@/assets/styles/FeedItem.css');

/* Additional styles for menu and report modal */
.menu-container {
  position: relative;
}

.menu-btn {
  background: none;
  border: none;
  color: #8f8f9d;
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-btn:hover {
  background-color: #2a3e6a;
  color: white;
}

/* Menu Overlay */
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 998;
  background: transparent;
}

/* Menu Dropdown Styles */
.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #1a1a2e;
  border: 1px solid #2a3e6a;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  min-width: 200px;
  z-index: 999;
  overflow: hidden;
  margin-top: 4px;
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

/* Modal Overlay */
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

/* Report Modal Styles */
.report-modal {
  background-color: #1a1a2e;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
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

.cancel-btn, .submit-btn {
  background: none;
  border: none;
  color: #8f8f9d;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background-color 0.2s;
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

.cancel-btn:hover {
  background-color: #2a3e6a;
}

.submit-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.modal-body {
  padding: 20px;
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

/* Responsive */
@media (max-width: 768px) {
  .report-modal {
    width: 95%;
    margin: 20px;
  }

  .dropdown-menu {
    min-width: 180px;
  }

  .reason-item {
    padding: 12px;
  }

  .reason-icon {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }
}

/* Avatar placeholder untuk comment input */
.comment-avatar-placeholder {
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
</style>
