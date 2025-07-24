<template>
  <div class="activity-container">
    <div class="activity-header">
      <h3 class="activity-title">Recent Activity</h3>
      <div class="activity-filters">
        <button
          v-for="filter in filters"
          :key="filter.id"
          :class="['filter-btn', { active: activeFilter === filter.id }]"
          @click="activeFilter = filter.id"
        >
          <component :is="filter.icon" class="filter-icon" />
          {{ filter.label }}
        </button>
      </div>
    </div>

    <div class="activity-timeline">
      <div
        v-for="activity in filteredActivities"
        :key="activity.id"
        class="activity-item"
        :class="activity.type"
      >
        <div class="activity-icon">
          <component :is="getActivityIcon(activity.type)" />
        </div>

        <div class="activity-content">
          <div class="activity-main">
            <p class="activity-text" v-html="activity.text"></p>
            <span class="activity-time">{{ activity.time }}</span>
          </div>

          <div v-if="activity.details" class="activity-details">
            <!-- Project Activity -->
            <div v-if="activity.type === 'project'" class="project-preview">
              <div class="preview-image-placeholder">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M22 9V7h-2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2v-2h-2V9h2z"
                  />
                </svg>
              </div>
              <div class="preview-content">
                <h4 class="preview-title">{{ activity.details.title }}</h4>
                <p class="preview-description">{{ activity.details.description }}</p>
                <div class="preview-stats">
                  <span class="stat">
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                      />
                    </svg>
                    {{ activity.details.stars }} stars
                  </span>
                  <span class="stat">
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"
                      />
                    </svg>
                    {{ activity.details.commits }} commits
                  </span>
                </div>
              </div>
            </div>

            <!-- Post Activity -->
            <div v-else-if="activity.type === 'post'" class="post-preview">
              <div class="post-content">
                <p class="post-text">{{ activity.details.content }}</p>
                <div v-if="activity.details.image" class="post-image-placeholder">
                  <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
                    />
                  </svg>
                  <span>Image</span>
                </div>
              </div>
              <div class="post-stats">
                <span class="stat">
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    />
                  </svg>
                  {{ activity.details.likes }}
                </span>
                <span class="stat">
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M21.99 4c0-1.1-.89-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.89 2 2 2h14l4 4-.01-18z"
                    />
                  </svg>
                  {{ activity.details.comments }}
                </span>
              </div>
            </div>

            <!-- Achievement Activity -->
            <div v-else-if="activity.type === 'achievement'" class="achievement-preview">
              <div class="achievement-badge">
                <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  />
                </svg>
              </div>
              <div class="achievement-info">
                <h4 class="achievement-name">{{ activity.details.name }}</h4>
                <p class="achievement-description">{{ activity.details.description }}</p>
              </div>
            </div>

            <!-- Follow Activity -->
            <div v-else-if="activity.type === 'follow'" class="follow-preview">
              <div class="follow-users">
                <div v-for="user in activity.details.users" :key="user.id" class="follow-user">
                  <div class="user-avatar-placeholder">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                      />
                    </svg>
                  </div>
                  <span class="user-name">{{ user.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Load More Button -->
    <div class="load-more-section">
      <button class="load-more-btn" @click="loadMore" :disabled="isLoading">
        <svg
          v-if="isLoading"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 24 24"
          class="loading-icon"
        >
          <path
            d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6z"
          />
        </svg>
        <span v-else>Load More Activities</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Icons
const AllIcon = {
  template: `<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>`,
}

const ProjectIcon = {
  template: `<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M22 9V7h-2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2v-2h-2V9h2z"/></svg>`,
}

const PostIcon = {
  template: `<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>`,
}

const AchievementIcon = {
  template: `<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
}

const FollowIcon = {
  template: `<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.996 2.996 0 0 0 17.06 7H16c-.8 0-1.54.37-2.01.99L12 10.5 10.01 7.99A2.99 2.99 0 0 0 8 7H6.94c-1.39 0-2.59.95-2.9 2.37L1.5 17H4v5h2v-5h.5L8 14.5l1.5 2.5H10v5h2v-5h2v5h2z"/></svg>`,
}

const CodeIcon = {
  template: `<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>`,
}

const activeFilter = ref('all')
const isLoading = ref(false)

const filters = [
  { id: 'all', label: 'All', icon: AllIcon },
  { id: 'project', label: 'Projects', icon: ProjectIcon },
  { id: 'post', label: 'Posts', icon: PostIcon },
  { id: 'achievement', label: 'Achievements', icon: AchievementIcon },
  { id: 'follow', label: 'Social', icon: FollowIcon },
]

const activities = ref([
  {
    id: 1,
    type: 'project',
    text: 'Created a new project <strong>Vue Task Manager</strong>',
    time: '2 hours ago',
    details: {
      title: 'Vue Task Manager',
      description: 'A modern task management app built with Vue 3',
      stars: 24,
      commits: 12,
    },
  },
  {
    id: 2,
    type: 'achievement',
    text: 'Earned <strong>100 Stars</strong> achievement',
    time: '5 hours ago',
    details: {
      name: '100 Stars',
      description: 'Received 100 stars across all repositories',
    },
  },
  {
    id: 3,
    type: 'post',
    text: 'Published a new post about Vue 3 Composition API',
    time: '1 day ago',
    details: {
      content: 'Just finished building a new Vue 3 component library! 🚀',
      image: true,
      likes: 42,
      comments: 8,
    },
  },
  {
    id: 4,
    type: 'follow',
    text: 'Started following <strong>3 new developers</strong>',
    time: '2 days ago',
    details: {
      users: [
        { id: 1, name: 'Sarah Chen' },
        { id: 2, name: 'Alex Kumar' },
        { id: 3, name: 'Maria Santos' },
      ],
    },
  },
  {
    id: 5,
    type: 'project',
    text: 'Updated <strong>Weather Dashboard</strong> with new features',
    time: '3 days ago',
    details: {
      title: 'Weather Dashboard',
      description: 'Added real-time notifications and improved UI',
      stars: 18,
      commits: 8,
    },
  },
  {
    id: 6,
    type: 'achievement',
    text: 'Completed <strong>30-Day Coding Streak</strong>',
    time: '1 week ago',
    details: {
      name: '30-Day Streak',
      description: 'Made commits for 30 consecutive days',
    },
  },
])

const filteredActivities = computed(() => {
  if (activeFilter.value === 'all') {
    return activities.value
  }
  return activities.value.filter((activity) => activity.type === activeFilter.value)
})

const getActivityIcon = (type) => {
  const iconMap = {
    project: CodeIcon,
    post: PostIcon,
    achievement: AchievementIcon,
    follow: FollowIcon,
  }
  return iconMap[type] || AllIcon
}

const loadMore = () => {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
}
</script>

<style scoped>
.activity-container {
  color: #ffffff;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.activity-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: #ffffff;
}

.activity-filters {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  color: #a0a0b8;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

.filter-btn.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #ffffff;
  border-color: transparent;
}

.filter-icon {
  width: 16px;
  height: 16px;
}

.activity-timeline {
  position: relative;
}

.activity-timeline::before {
  content: '';
  position: absolute;
  left: 24px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, #667eea, transparent);
}

.activity-item {
  position: relative;
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-left: 0;
}

.activity-icon {
  position: relative;
  z-index: 2;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 3px solid #0e061a;
}

.activity-icon svg {
  width: 20px;
  height: 20px;
  color: #ffffff;
}

.activity-content {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
}

.activity-content:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

.activity-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.activity-text {
  color: #e0e0e0;
  margin: 0;
  line-height: 1.6;
  flex: 1;
}

.activity-time {
  color: #a0a0b8;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.activity-details {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.project-preview {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.preview-image-placeholder {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a0a0b8;
  flex-shrink: 0;
}

.preview-content {
  flex: 1;
}

.preview-title {
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 0.25rem 0;
}

.preview-description {
  color: #a0a0b8;
  font-size: 0.85rem;
  margin: 0 0 0.5rem 0;
}

.preview-stats {
  display: flex;
  gap: 1rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #a0a0b8;
  font-size: 0.8rem;
}

.stat svg {
  color: #667eea;
}

.post-preview {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 1rem;
}

.post-content {
  margin-bottom: 1rem;
}

.post-text {
  color: #e0e0e0;
  margin: 0 0 0.75rem 0;
  line-height: 1.5;
}

.post-image-placeholder {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #a0a0b8;
  font-size: 0.85rem;
}

.post-stats {
  display: flex;
  gap: 1rem;
}

.achievement-preview {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.achievement-badge {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #ffd700, #ffa500);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.achievement-badge svg {
  color: #ffffff;
}

.achievement-info {
  flex: 1;
}

.achievement-name {
  font-size: 1rem;
  font-weight: 600;
  color: #ffd700;
  margin: 0 0 0.25rem 0;
}

.achievement-description {
  color: #a0a0b8;
  font-size: 0.85rem;
  margin: 0;
}

.follow-preview {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 1rem;
}

.follow-users {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.follow-user {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-avatar-placeholder {
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

.user-name {
  color: #e0e0e0;
  font-size: 0.85rem;
  font-weight: 500;
}

.load-more-section {
  text-align: center;
  margin-top: 2rem;
}

.load-more-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  padding: 0.75rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto;
}

.load-more-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.load-more-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

@media (max-width: 768px) {
  .activity-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .activity-filters {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  .project-preview {
    flex-direction: column;
    align-items: flex-start;
  }

  .activity-main {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
