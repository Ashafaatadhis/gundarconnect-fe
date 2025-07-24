<template>
  <div class="project-card">
    <div class="project-image">
      <div class="image-placeholder">
        <svg width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M22 9V7h-2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2v-2h-2V9h2z"
          />
        </svg>
        <span>Project Preview</span>
      </div>
      <div class="project-overlay">
        <button class="preview-btn" @click="openPreview">
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
            />
          </svg>
        </button>
        <button class="star-btn" :class="{ starred: isStarred }" @click="toggleStar">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            />
          </svg>
        </button>
      </div>
    </div>

    <div class="project-content">
      <div class="project-header">
        <h3 class="project-title">{{ project.title }}</h3>
        <div class="project-stats">
          <span class="star-count">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              />
            </svg>
            {{ project.stars }}
          </span>
        </div>
      </div>

      <p class="project-description">{{ project.description }}</p>

      <div class="project-tech">
        <span
          v-for="tech in project.tech"
          :key="tech"
          class="tech-tag"
          :style="{ backgroundColor: getTechColor(tech) }"
        >
          {{ tech }}
        </span>
      </div>

      <div class="project-actions">
        <button class="btn-primary" @click="viewProject">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"
            />
          </svg>
          View Project
        </button>
        <button class="btn-secondary" @click="viewCode">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"
            />
          </svg>
          Code
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
})

const isStarred = ref(false)

const techColors = {
  'Vue 3': '#4FC08D',
  React: '#61DAFB',
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  'Tailwind CSS': '#06B6D4',
  'Node.js': '#339933',
  Python: '#3776AB',
  HTML: '#E34F26',
  CSS: '#1572B6',
  'Chart.js': '#FF6384',
  'OpenWeather API': '#FF7F00',
  Pinia: '#FFD859',
  'Stripe API': '#635BFF',
}

const getTechColor = (tech) => {
  return techColors[tech] || '#667eea'
}

const toggleStar = () => {
  isStarred.value = !isStarred.value
}

const openPreview = () => {
  console.log('Opening preview for:', props.project.title)
}

const viewProject = () => {
  console.log('Viewing project:', props.project.title)
}

const viewCode = () => {
  console.log('Viewing code for:', props.project.title)
}
</script>

<style scoped>
.project-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
}

.project-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.project-image {
  position: relative;
  height: 160px;
  overflow: hidden;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #a0a0b8;
  transition: all 0.2s ease;
}

.project-card:hover .image-placeholder {
  background: rgba(255, 255, 255, 0.08);
}

.project-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.project-card:hover .project-overlay {
  opacity: 1;
}

.preview-btn,
.star-btn {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  color: #1a1a2e;
  padding: 0.75rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-btn:hover {
  background: #ffffff;
  transform: scale(1.1);
}

.star-btn:hover {
  background: #ffffff;
  transform: scale(1.1);
}

.star-btn.starred {
  background: #ffd700;
  color: #1a1a2e;
}

.project-content {
  padding: 1.5rem;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.project-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: 1.3;
}

.project-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.star-count {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #a0a0b8;
  font-size: 0.85rem;
}

.star-count svg {
  color: #ffd700;
}

.project-description {
  color: #e0e0e0;
  line-height: 1.6;
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tech-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.project-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-primary,
.btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  justify-content: center;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}
</style>
