<template>
  <div class="post-card">
    <div class="post-header">
      <div class="post-avatar">
        <template v-if="post.author && post.author.avatar">
          <img :src="getAvatarUrl(post.author.avatar)" alt="Avatar" style="width:32px;height:32px;border-radius:50%" />
        </template>
        <template v-else>
          <div class="avatar-placeholder">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              />
            </svg>
          </div>
        </template>
      </div>
      <div class="post-info">
        <span class="post-author">{{ post.author?.fullName || post.author?.username || '-' }}</span>
        <span class="post-time">{{ post.timestamp }}</span>
      </div>
      <div class="post-menu">
        <button class="menu-btn" @click="showMenu = !showMenu">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
            />
          </svg>
        </button>
        <div v-if="showMenu" class="dropdown-menu">
          <button class="dropdown-item delete" @click="deletePost">Delete</button>
        </div>
      </div>
    </div>

    <div class="post-content">
      <p class="post-text">{{ post.content }}</p>

      <div v-if="post.image" class="post-image">
        <div class="image-placeholder">
          <svg width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
            />
          </svg>
          <span>Image Preview</span>
        </div>
      </div>
    </div>

    <div class="post-actions">
      <button class="action-btn like-btn" :class="{ liked: isLiked }" @click="toggleLike">
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>
        <span>{{ likeCount }}</span>
      </button>

      <button class="action-btn comment-btn" @click="showComments = !showComments">
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M21.99 4c0-1.1-.89-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.89 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"
          />
        </svg>
        <span>{{ Array.isArray(post.comments) ? post.comments.length : 0 }}</span>
      </button>

      <button class="action-btn share-btn" @click="sharePost">
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"
          />
        </svg>
        <span>Share</span>
      </button>
    </div>

    <!-- Comments Section -->
    <div v-if="showComments" class="comments-section">
      <div class="comment-input">
        <div class="comment-avatar-small">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            />
          </svg>
        </div>
        <input
          v-model="newComment"
          placeholder="Write a comment..."
          class="comment-field"
          @keypress.enter="addComment"
        />
        <button class="send-btn" @click="addComment" :disabled="!newComment.trim()">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>

      <div class="comments-list">
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <div class="comment-avatar-small">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              />
            </svg>
          </div>
          <div class="comment-content">
            <div class="comment-header">
              <span class="comment-author">{{ comment.author }}</span>
              <span class="comment-time">{{ comment.time }}</span>
            </div>
            <p class="comment-text">{{ comment.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getAvatarUrl } from '@/utils/avatar'
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['deleted'])

const showMenu = ref(false)
const showComments = ref(false)
const isLiked = ref(false)
const likeCount = ref(props.post.likes ? props.post.likes.length : 0)
const newComment = ref('')

const comments = computed(() => {
  if (Array.isArray(props.post.comments)) {
    return props.post.comments.map(c => ({
      id: c.id || c._id || Math.random(),
      author: c.author?.fullName || c.author?.username || '-',
      text: c.content || c.text || c.comment || '-',
      time: c.createdAt ? new Date(c.createdAt).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short', year: 'numeric' }) : (c.time || '-')
    }))
  }
  return []
})

const toggleLike = async () => {
  const postId = props.post.id
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
    likeCount.value = updatedPost.likes ? updatedPost.likes.length : 0
    isLiked.value = updatedPost.likes.some(like => like.id === props.post.currentUserId)
  } catch (err) {
    alert(err.message || 'Gagal menyimpan like')
  }
}

onMounted(() => {
  const postId = props.post.id
  const userId = localStorage.getItem('userId') || 'guest'
  const likeKey = `like_${postId}_${userId}`
  isLiked.value = !!localStorage.getItem(likeKey)
})

const addComment = () => {
  if (newComment.value.trim()) {
    comments.value.push({
      id: Date.now(),
      author: 'You',
      text: newComment.value,
      time: 'now',
    })
    newComment.value = ''
  }
}

const sharePost = () => {
  console.log('Sharing post:', props.post.id)
}

const deletePost = async () => {
  if (confirm('Are you sure you want to delete this post?')) {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:5000/api/posts/${props.post.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to delete post')
      emit('deleted', props.post.id)
    } catch (err) {
      alert(err.message || 'Failed to delete post')
    }
  }
  showMenu.value = false
}
</script>

<style scoped>
.post-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
}

.post-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

.post-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.post-avatar .avatar-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.post-info {
  flex: 1;
}

.post-author {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #ffffff;
}

.post-time {
  color: #a0a0b8;
  font-size: 0.85rem;
}

.menu-btn {
  background: none;
  border: none;
  color: #a0a0b8;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.menu-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.post-content {
  margin-bottom: 1rem;
}

.post-text {
  color: #e0e0e0;
  line-height: 1.6;
  margin: 0 0 1rem 0;
}

.post-image {
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
}

.image-placeholder {
  width: 100%;
  height: 200px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #a0a0b8;
  transition: all 0.2s ease;
}

.image-placeholder:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(102, 126, 234, 0.3);
}

.post-actions {
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #a0a0b8;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.like-btn.liked {
  color: #ff6b9d;
}

.like-btn.liked svg {
  fill: #ff6b9d;
}

.comments-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.comment-input {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.comment-avatar-small {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.comment-field {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem;
  color: #ffffff;
  font-size: 0.9rem;
}

.comment-field::placeholder {
  color: #a0a0b8;
}

.comment-field:focus {
  outline: none;
  border-color: #667eea;
  background: rgba(255, 255, 255, 0.08);
}

.send-btn {
  background: #667eea;
  border: none;
  color: white;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-btn:hover:not(:disabled) {
  background: #5a6fd8;
  transform: scale(1.05);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.comment-item {
  display: flex;
  gap: 0.75rem;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.comment-author {
  font-weight: 600;
  color: #ffffff;
  font-size: 0.85rem;
}

.comment-time {
  color: #a0a0b8;
  font-size: 0.8rem;
}

.comment-text {
  color: #e0e0e0;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 30px;
  background: #22223b;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 10;
  min-width: 120px;
  padding: 0.5rem 0;
}
.dropdown-item {
  width: 100%;
  background: none;
  border: none;
  color: #fff;
  padding: 0.5rem 1rem;
  text-align: left;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background 0.2s;
}
.dropdown-item.delete {
  color: #ff6b6b;
}
.dropdown-item:hover {
  background: #2a2a40;
}
</style>
