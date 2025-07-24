<!-- views/FeedView.vue -->
<!-- <template>
  <div class="feed-container">
    <div class="post-input">
      <div class="post-input-header">
        <img :src="currentUser.avatar" alt="User Avatar" class="avatar" />
        <input type="text" placeholder="Apa yang ingin anda tanya?" class="post-input-field" />
      </div>
    </div>

    <div class="feed-list">
      <FeedItem v-for="post in posts" :key="post.id" :post="post" />
    </div>
  </div>
</template> -->

<script>
import FeedItem from '@/components/FeedItem.vue'
import { useFeedStore } from '@/stores/feed'
import { ref, onMounted } from 'vue'

export default {
  name: 'FeedView',
  components: {
    FeedItem,
  },
  setup() {
    const feedStore = useFeedStore()
    const posts = ref([])
    const currentUser = ref({
      id: 'current-user',
      username: 'Anda',
      avatar: '/src/assets/profile.png', // Gunakan avatar dari assets Anda
    })

    onMounted(() => {
      // Load posts dari store
      posts.value = feedStore.getPosts()
    })

    return {
      posts,
      currentUser,
    }
  },
}
</script>

<style scoped>
.feed-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.post-input {
  background-color: #1e293b;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.post-input-header {
  display: flex;
  align-items: center;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
}

.post-input-field {
  flex: 1;
  background-color: #334155;
  border: none;
  border-radius: 20px;
  padding: 10px 15px;
  color: white;
  outline: none;
}

.post-input-field::placeholder {
  color: #94a3b8;
}

.feed-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
