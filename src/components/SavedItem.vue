<template>
  <div class="saved-item">
    <div class="item-header">
      <div class="user-info">
        <div class="user-avatar">
          <img :src="post.author.avatar || '../assets/default-avatar.png'" alt="Avatar pengguna" />
        </div>
        <div class="user-details">
          <div class="username">{{ post.author.username }}</div>
          <div class="post-time">{{ formatTime(post.createdAt) }}</div>
        </div>
      </div>
      <div class="item-actions">
        <button class="action-button more-options">
          <i class="fa fa-ellipsis-v"></i>
        </button>
        <div class="dropdown-menu">
          <div class="dropdown-item" @click="moveToFolder">Pindahkan ke Folder</div>
          <div class="dropdown-item" @click="$emit('remove-saved', post.id)">
            Hapus dari Tersimpan
          </div>
        </div>
      </div>
    </div>

    <div class="item-preview" @click="viewFullPost">
      <!-- Preview gambar jika ada -->
      <div v-if="post.image" class="item-image">
        <img :src="post.image" alt="Gambar postingan" />
      </div>

      <!-- Preview teks -->
      <div class="item-content">
        <h3 class="item-title">{{ post.title || truncateContent(post.content, 50) }}</h3>
        <p class="item-excerpt">{{ truncateContent(post.content, 100) }}</p>

        <!-- Tag jika ada -->
        <div v-if="post.tags && post.tags.length" class="item-tags">
          <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
    </div>

    <div class="item-footer">
      <div class="engagement-stats">
        <span class="stat"> <i class="fa fa-heart"></i> {{ post.likes || 0 }} </span>
        <span class="stat"> <i class="fa fa-comment"></i> {{ post.comments || 0 }} </span>
      </div>
      <div class="saved-info">
        <span class="saved-at">Disimpan {{ formatSavedTime(post.savedAt) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SavedItem',
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formatTime(timestamp) {
      // Implementasi format waktu (bisa menggunakan library seperti date-fns)
      if (!timestamp) return ''

      const date = new Date(timestamp)
      const now = new Date()
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

      if (diffInHours < 24) {
        return diffInHours === 0 ? 'Baru saja' : `${diffInHours} jam yang lalu`
      } else {
        const diffInDays = Math.floor(diffInHours / 24)
        if (diffInDays < 30) {
          return `${diffInDays} hari yang lalu`
        } else {
          return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        }
      }
    },

    formatSavedTime(timestamp) {
      // Format waktu untuk kapan postingan disimpan
      if (!timestamp) return ''
      return this.formatTime(timestamp)
    },

    truncateContent(content, maxLength) {
      if (!content) return ''
      if (content.length <= maxLength) return content
      return content.substring(0, maxLength) + '...'
    },

    viewFullPost() {
      // Navigasi ke halaman postingan lengkap
      this.$router.push({
        name: 'post-detail',
        params: { id: this.post.id },
      })
    },

    moveToFolder() {
      // Implementasi untuk memindahkan postingan ke folder
      // Bisa menampilkan modal untuk memilih folder
      this.$emit('move-to-folder', this.post.id)
    },
  },
}
</script>

<style scoped>
.saved-item {
  background-color: #2a2a36;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.saved-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.item-header {
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #333;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.username {
  font-weight: 500;
  color: #e0e0e0;
}

.post-time {
  font-size: 12px;
  color: #888;
}

.item-actions {
  position: relative;
}

.action-button {
  background: transparent;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 5px;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  background-color: #333;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  z-index: 10;
  display: none;
}

.item-actions:hover .dropdown-menu {
  display: block;
}

.dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
  white-space: nowrap;
}

.dropdown-item:hover {
  background-color: #444;
}

.item-preview {
  flex: 1;
  cursor: pointer;
}

.item-image {
  width: 100%;
  height: 150px;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-content {
  padding: 15px;
}

.item-title {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 16px;
  color: #e0e0e0;
}

.item-excerpt {
  font-size: 14px;
  color: #bbb;
  margin-bottom: 10px;
  line-height: 1.4;
}

.item-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 8px;
}

.tag {
  background-color: #3a3a46;
  border-radius: 4px;
  padding: 3px 8px;
  font-size: 12px;
  color: #aaa;
}

.item-footer {
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #333;
}

.engagement-stats {
  display: flex;
  gap: 15px;
}

.stat {
  font-size: 13px;
  color: #999;
}

.stat i {
  margin-right: 4px;
}

.saved-info {
  font-size: 12px;
  color: #777;
}
</style>
