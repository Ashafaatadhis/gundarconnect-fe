<template>
  <div class="saved-posts-container">
    <!-- Header -->
    <div class="saved-header">
      <h1 class="saved-title">
        <span class="title-icon">📚</span>
        Postingan Tersimpan
      </h1>
      <div class="subtitle">
        {{ posts.length }} postingan telah disimpan
      </div>
    </div>

    <!-- Grid View -->
    <div class="posts-grid">
      <div
        v-for="(post, index) in posts"
        :key="post.id"
        class="post-card"
        :style="{ animationDelay: `${index * 0.1}s` }"
        @mouseenter="hoveredPost = post.id"
        @mouseleave="hoveredPost = null"
        @click="viewFullPost(post.id)"
      >
        <!-- Image Section -->
        <div class="post-image-container">
          <img :src="post.image" :alt="post.title" class="post-image" @error="handleImageError" />
          <div class="image-overlay"></div>

          <!-- Saved Badge -->
          <div class="saved-badge">
            <i class="fa fa-bookmark"></i> 
            <span>Tersimpan</span>
          </div>

          <!-- Time -->
          <div class="post-time">
            <i class="fa fa-clock"></i>
            {{ formatTime(post.savedAt) }}
          </div>
        </div>

        <!-- Content Section -->
        <div class="post-content">
          <!-- Author -->
          <div class="post-author">
            <img
              :src="post.author.avatar || getDefaultAvatar(post.author.username)"
              :alt="post.author.username"
              class="author-avatar"
            />
            <span class="author-name">@{{ post.author.username }}</span>
          </div>

          <!-- Title & Excerpt -->
          <h3 class="post-title">{{ post.title }}</h3>
          <p class="post-excerpt">{{ truncateContent(post.content, 100) }}</p>

          <!-- Tags -->
          <div class="post-tags">
            <span
              v-for="tag in (post.tags || []).slice(0, 3)"
              :key="tag"
              class="tag"
              @click.stop="filterByTag(tag)"
            >
              #{{ tag }}
            </span>
            <span v-if="(post.tags && post.tags.length > 3)" class="tag tag-more">
              +{{ post.tags.length - 3 }}
            </span>
          </div>

          <!-- Stats & Actions -->
          <div class="post-footer">
            <div class="post-stats">
              <div class="stat">
                <i class="fa fa-heart"></i>
                <span>{{ post.likes }}</span>
              </div>
              <div class="stat">
                <i class="fa fa-comment"></i>
                <span>{{ post.comments }}</span>
              </div>
            </div>

            <div :class="['post-actions', { show: hoveredPost === post.id }]">
              <button class="action-btn" @click.stop="viewPost(post.id)" title="Lihat">
                <i class="fa fa-eye"></i>
              </button>
              <button class="action-btn" @click.stop="sharePost(post.id)" title="Bagikan">
                <i class="fa fa-share"></i>
              </button>
              <button class="action-btn remove-btn" @click.stop="removeSavedPost(post.id)" title="Hapus">
                <i class="fa fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!posts.length" class="empty-state">
      <div class="empty-animation">
        <i class="fa fa-bookmark empty-icon"></i>
        <div class="floating-bookmarks">
          <i class="fa fa-bookmark bookmark-float bookmark-1"></i>
          <i class="fa fa-bookmark bookmark-float bookmark-2"></i>
          <i class="fa fa-bookmark bookmark-float bookmark-3"></i>
        </div>
      </div>
      <h3>Belum ada postingan tersimpan</h3>
      <p>Simpan postingan favoritmu untuk melihatnya di sini</p>
      <button class="explore-btn" @click="goToHome">
        <i class="fa fa-compass"></i>
        Jelajahi Postingan
      </button>
    </div>

    <!-- Floating Action Button -->
    <div class="fab-container">
      <button class="fab" @click="showQuickActions = !showQuickActions" title="Quick Actions">
        <i class="fa fa-magic"></i>
      </button>
      <div :class="['fab-menu', { show: showQuickActions }]">
        <button class="fab-item" @click="sortByNewest" title="Urutkan Terbaru">
          <i class="fa fa-sort-amount-down"></i>
        </button>
        <button class="fab-item" @click="sortByPopular" title="Urutkan Populer">
          <i class="fa fa-fire"></i>
        </button>
        <button class="fab-item" @click="clearAll" title="Hapus Semua">
          <i class="fa fa-trash-alt"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSavedStore } from '@/stores/saved'
import { useRouter } from 'vue-router'

const router = useRouter()
const savedStore = useSavedStore()
const posts = computed(() => savedStore.savedPosts)
const hoveredPost = ref(null)
const showQuickActions = ref(false)

onMounted(() => {
  savedStore.fetchSavedPosts()
})

// Methods
const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000)

  if (diff < 60) return 'Baru saja'
  if (diff < 3600) return `${Math.floor(diff / 60)} menit yang lalu`
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam yang lalu`
  if (diff < 604800) return `${Math.floor(diff / 86400)} hari yang lalu`

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const truncateContent = (content, max) => {
  if (!content) return ''
  return content.length <= max ? content : content.slice(0, max) + '...'
}

const getDefaultAvatar = (username) => {
  return `https://ui-avatars.com/api/?name=${username}&background=4a5568&color=fff`
}

const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/400x300/1a1a2e/4a5568?text=No+Image'
}

const viewFullPost = (id) => {
  router.push({ name: 'post-detail', params: { id } })
}

const viewPost = (id) => {
  viewFullPost(id)
}

const sharePost = (id) => {
  console.log('Share post:', id)
  // Implement share functionality
}

const removeSavedPost = (id) => {
  if (confirm('Hapus postingan dari tersimpan?')) {
    const index = posts.value.findIndex(post => post.id === id)
    if (index > -1) {
      posts.value.splice(index, 1)
    }
  }
}

const filterByTag = (tag) => {
  console.log('Filter by tag:', tag)
  // Implement tag filtering
}

const goToHome = () => {
  router.push('/')
}

const sortByNewest = () => {
  posts.value.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt))
  showQuickActions.value = false
}

const sortByPopular = () => {
  posts.value.sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments))
  showQuickActions.value = false
}

const clearAll = () => {
  if (confirm('Hapus semua postingan tersimpan?')) {
    posts.value = []
    showQuickActions.value = false
  }
}
</script>

<style scoped>
/* Container */
.saved-posts-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%);
  padding: 6rem 2rem 2rem;
  position: relative;
}

/* Header */
.saved-header {
  max-width: 1400px;
  margin: 0 auto 3rem;
  text-align: center;
  animation: slideInDown 0.8s ease-out;
}

.saved-title {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 1rem;
  line-height: 1.2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.title-icon {
  font-size: 2.5rem;
  animation: bounce 2s infinite;
}

.subtitle {
  color: #9ca3af;
  font-size: 1.1rem;
  opacity: 0;
  animation: fadeInUp 1s ease-out 0.3s forwards;
}

/* Grid View */
.posts-grid {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.post-card {
  background: rgba(26, 26, 46, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  opacity: 0;
  transform: translateY(50px);
  animation: slideInUp 0.6s ease-out forwards;
}

.post-card:hover {
  border-color: rgba(102, 126, 234, 0.6);
  box-shadow: 0 25px 50px rgba(102, 126, 234, 0.25);
  transform: translateY(-8px) scale(1.02);
}

/* Image Section */
.post-image-container {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.post-card:hover .post-image {
  transform: scale(1.15);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(26, 26, 46, 0.8) 0%, transparent 60%);
  opacity: 0.7;
}

.saved-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  backdrop-filter: blur(10px);
  padding: 0.4rem 1rem;
  border-radius: 2rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
  animation: pulse 2s infinite;
}

.post-time {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: #e0e0e0;
  background: rgba(0, 0, 0, 0.6);
  padding: 0.3rem 0.8rem;
  border-radius: 1rem;
  backdrop-filter: blur(5px);
}

/* Content Section */
.post-content {
  padding: 1.5rem;
}

.post-author {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.author-avatar {
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  border: 2px solid rgba(102, 126, 234, 0.3);
  transition: border-color 0.3s ease;
}

.post-card:hover .author-avatar {
  border-color: rgba(102, 126, 234, 0.8);
}

.author-name {
  font-size: 0.9rem;
  color: #b0b0c0;
  font-weight: 500;
}

.post-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 0.8rem;
  color: #f3f4f6;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s ease;
}

.post-card:hover .post-title {
  color: #667eea;
}

.post-excerpt {
  color: #9ca3af;
  font-size: 0.9rem;
  margin: 0 0 1.2rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Tags */
.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 1.2rem;
}

.tag {
  padding: 0.3rem 0.8rem;
  background: rgba(102, 126, 234, 0.2);
  font-size: 0.75rem;
  border-radius: 1rem;
  color: #b0b0c0;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(102, 126, 234, 0.3);
}

.tag:hover {
  background: rgba(102, 126, 234, 0.4);
  color: #ffffff;
  transform: translateY(-2px);
}

.tag-more {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Footer */
.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-stats {
  display: flex;
  gap: 1.2rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #9ca3af;
  font-size: 0.85rem;
  transition: color 0.3s ease;
}

.stat:hover {
  color: #e0e0e0;
}

.post-actions {
  display: flex;
  gap: 0.4rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.post-actions.show {
  opacity: 1;
}

.action-btn {
  padding: 0.6rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #9ca3af;
  border-radius: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.action-btn:hover {
  background: rgba(102, 126, 234, 0.3);
  color: #ffffff;
  transform: translateY(-2px);
}

.remove-btn:hover {
  background: rgba(239, 68, 68, 0.3);
  color: #ff6b6b;
}

/* Empty State */
.empty-state {
  max-width: 500px;
  margin: 6rem auto;
  text-align: center;
  animation: fadeInUp 1s ease-out;
}

.empty-animation {
  position: relative;
  margin-bottom: 2rem;
}

.empty-icon {
  font-size: 5rem;
  color: #374151;
  margin-bottom: 1rem;
  animation: float 3s ease-in-out infinite;
}

.floating-bookmarks {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.bookmark-float {
  position: absolute;
  font-size: 1.5rem;
  color: rgba(102, 126, 234, 0.3);
  animation: floatBookmark 4s ease-in-out infinite;
}

.bookmark-1 {
  left: -4rem;
  animation-delay: 0s;
}

.bookmark-2 {
  left: 4rem;
  animation-delay: 1.3s;
}

.bookmark-3 {
  left: 0;
  animation-delay: 2.6s;
}

.empty-state h3 {
  color: #f3f4f6;
  font-size: 1.8rem;
  margin: 0 0 1rem;
  font-weight: 600;
}

.empty-state p {
  color: #9ca3af;
  margin: 0 0 2rem;
  font-size: 1.1rem;
}

.explore-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.explore-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
}

/* Floating Action Button */
.fab-container {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
}

.fab {
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  animation: float 3s ease-in-out infinite;
}

.fab:hover {
  transform: translateY(-3px) scale(1.1);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.6);
}

.fab-menu {
  position: absolute;
  bottom: 5rem;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
  pointer-events: none;
}

.fab-menu.show {
  opacity: 1;
  transform: translateY(0);
  pointer-events: all;
}

.fab-item {
  width: 3rem;
  height: 3rem;
  background: rgba(26, 26, 46, 0.9);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 50%;
  color: #9ca3af;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.fab-item:hover {
  background: rgba(102, 126, 234, 0.3);
  color: white;
  transform: scale(1.1);
}

/* Animations */
@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes floatBookmark {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
    opacity: 0.7;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .saved-posts-container {
    padding: 5rem 1rem 2rem;
  }

  .saved-title {
    font-size: 2.2rem;
    flex-direction: column;
    gap: 0.5rem;
  }

  .posts-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .fab-container {
    bottom: 1rem;
    right: 1rem;
  }

  .fab {
    width: 3.5rem;
    height: 3.5rem;
  }
}
</style>
