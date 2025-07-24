<template>
  <div class="about-container">
    <div class="about-grid">
      <!-- Bio Section -->
      <div class="about-section">
        <div class="section-header">
          <h3 class="section-title">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
              />
            </svg>
            About Me
          </h3>
          <button class="edit-btn" @click="editSection('about')">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
              />
            </svg>
          </button>
        </div>
        <p class="bio-text">
          {{ formData.about.bio1 }}
        </p>

        <p class="bio-text">
          {{ formData.about.bio2 }}
        </p>
      </div>

      <!-- Skills Section -->
      <div class="about-section">
        <div class="section-header">
          <h3 class="section-title">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2.5-5H18V4l-1-1h-2v2h-4V3H9l-1 1v2H6.5C5.67 6 5 6.67 5 7.5S5.67 9 6.5 9H8v10c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V9h1.5c.83 0 1.5-.67 1.5-1.5S18.33 6 17.5 6z"
              />
            </svg>
            Skills
          </h3>
          <button class="edit-btn" @click="editSection('skills')">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
              />
            </svg>
          </button>
        </div>

        <div class="skills-categories">
          <div class="skill-category">
            <h4 class="category-title">Technical Skills</h4>
            <div class="skills-list">
              <span
                v-for="skill in formData.skills.technical"
                :key="skill"
                class="skill-tag technical"
              >
                {{ skill }}
              </span>
            </div>
          </div>

          <div class="skill-category">
            <h4 class="category-title">Soft Skills</h4>
            <div class="skills-list">
              <span
                v-for="skill in formData.skills.soft"
                :key="skill"
                class="skill-tag soft"
              >
                {{ skill }}
              </span>
            </div>
          </div>

          <div class="skill-category">
            <h4 class="category-title">Languages</h4>
            <div class="skills-list">
              <span
                v-for="skill in formData.skills.languages"
                :key="skill"
                class="skill-tag language"
              >
                {{ skill }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Experience Section -->
      <div class="about-section">
        <div class="section-header">
          <h3 class="section-title">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M20 6h-2.5l-1.5-1.5h-5L9.5 6H7c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h13c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H7V8h2.5l1.5-1.5h5L17.5 8H20v10z"
              />
            </svg>
            Experience
          </h3>
          <button class="edit-btn" @click="editSection('experience')">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
              />
            </svg>
          </button>
        </div>

        <div class="experience-list">
          <div
            v-for="(exp, index) in formData.experience"
            :key="index"
            class="experience-item"
          >
            <div class="exp-header">
              <h4 class="exp-title">{{ exp.title }}</h4>
              <span class="exp-period">{{ exp.period }}</span>
            </div>
            <p class="exp-company">{{ exp.company }}</p>
            <p class="exp-description">{{ exp.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">{{ modalTitle }}</h2>
          <button class="close-btn" @click="closeModal">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <!-- About Me Form -->
          <div v-if="currentSection === 'about'" class="form-section">
            <div class="form-group">
              <label class="form-label">Bio Paragraph 1</label>
              <textarea
                v-model="formData.about.bio1"
                class="form-textarea"
                rows="4"
                placeholder="Write about yourself..."
              ></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Bio Paragraph 2</label>
              <textarea
                v-model="formData.about.bio2"
                class="form-textarea"
                rows="4"
                placeholder="Write more about yourself..."
              ></textarea>
            </div>
          </div>

          <!-- Skills Form -->
          <div v-if="currentSection === 'skills'" class="form-section">
            <div class="form-group">
              <div class="skills-category-header">
                <label class="form-label">Technical Skills</label>
                <button @click="addSkill('technical')" class="add-btn">+ Add</button>
              </div>
              <div class="skills-edit-list">
                <div
                  v-for="(skill, index) in formData.skills.technical"
                  :key="index"
                  class="skill-edit-item"
                >
                  <input v-model="formData.skills.technical[index]" class="skill-input" />
                  <button @click="removeSkill('technical', index)" class="remove-btn">×</button>
                </div>
              </div>
            </div>

            <div class="form-group">
              <div class="skills-category-header">
                <label class="form-label">Soft Skills</label>
                <button @click="addSkill('soft')" class="add-btn">+ Add</button>
              </div>
              <div class="skills-edit-list">
                <div
                  v-for="(skill, index) in formData.skills.soft"
                  :key="index"
                  class="skill-edit-item"
                >
                  <input v-model="formData.skills.soft[index]" class="skill-input" />
                  <button @click="removeSkill('soft', index)" class="remove-btn">×</button>
                </div>
              </div>
            </div>

            <div class="form-group">
              <div class="skills-category-header">
                <label class="form-label">Languages</label>
                <button @click="addSkill('languages')" class="add-btn">+ Add</button>
              </div>
              <div class="skills-edit-list">
                <div
                  v-for="(skill, index) in formData.skills.languages"
                  :key="index"
                  class="skill-edit-item"
                >
                  <input v-model="formData.skills.languages[index]" class="skill-input" />
                  <button @click="removeSkill('languages', index)" class="remove-btn">×</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Experience Form -->
          <div v-if="currentSection === 'experience'" class="form-section">
            <div class="form-group">
              <button @click="addExperience" class="add-experience-btn">+ Add New Experience</button>
            </div>

            <div
              v-for="(exp, index) in formData.experience"
              :key="index"
              class="experience-form-item"
            >
              <div class="experience-form-header">
                <h4>Experience {{ index + 1 }}</h4>
                <button @click="removeExperience(index)" class="remove-btn">Delete</button>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Job Title</label>
                  <input v-model="exp.title" class="form-input" placeholder="e.g. Senior Frontend Developer" />
                </div>
                <div class="form-group">
                  <label class="form-label">Period</label>
                  <input v-model="exp.period" class="form-input" placeholder="e.g. 2022 - Present" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Company</label>
                <input v-model="exp.company" class="form-input" placeholder="e.g. TechCorp Indonesia" />
              </div>

              <div class="form-group">
                <label class="form-label">Description</label>
                <textarea
                  v-model="exp.description"
                  class="form-textarea"
                  rows="3"
                  placeholder="Describe your role and achievements..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeModal" class="btn-cancel">Cancel</button>
          <button @click="saveChanges" class="btn-save">Save Changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Helper: ambil userId dari token JWT
function getCurrentUserId() {
  const token = localStorage.getItem('token')
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.id || payload.userId || payload.sub
  } catch (e) {
    return null
  }
}

const showModal = ref(false)
const currentSection = ref('')
const modalTitle = ref('')
const loading = ref(false)

// Form data for each section
const formData = ref({
  about: {
    bio1: '',
    bio2: ''
  },
  skills: {
    technical: [],
    soft: [],
    languages: []
  },
  experience: []
})
// Fetch About data from backend
async function fetchAbout() {
  const userId = getCurrentUserId()
  if (!userId) return
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`/api/about/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!res.ok) throw new Error('Failed to fetch about')
    const about = await res.json()
    formData.value.about.bio1 = about.bio1 || ''
    formData.value.about.bio2 = about.bio2 || ''
    formData.value.skills.technical = about.skillsTechnical || []
    formData.value.skills.soft = about.skillsSoft || []
    formData.value.skills.languages = about.skillsLanguages || []
    formData.value.experience = about.experience || []
  } catch (e) {
    // Kosongkan jika belum ada
    formData.value = {
      about: { bio1: '', bio2: '' },
      skills: { technical: [], soft: [], languages: [] },
      experience: []
    }
  } finally {
    loading.value = false
  }
}

onMounted(fetchAbout)

const editSection = (section) => {
  currentSection.value = section
  showModal.value = true

  switch(section) {
    case 'about':
      modalTitle.value = 'Edit About Me'
      break
    case 'skills':
      modalTitle.value = 'Edit Skills'
      break
    case 'experience':
      modalTitle.value = 'Edit Experience'
      break
  }
}

const closeModal = () => {
  showModal.value = false
  currentSection.value = ''
}

// Save About data to backend
const saveChanges = async () => {
  const userId = getCurrentUserId()
  if (!userId) return
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    // Compose payload
    const payload = {
      bio1: formData.value.about.bio1,
      bio2: formData.value.about.bio2,
      skillsTechnical: formData.value.skills.technical,
      skillsSoft: formData.value.skills.soft,
      skillsLanguages: formData.value.skills.languages,
      experience: formData.value.experience
    }
    const res = await fetch(`/api/about/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error('Failed to save about')
    // Success
    closeModal()
    alert('Changes saved successfully!')
    await fetchAbout()
  } catch (e) {
    alert('Failed to save changes!')
  } finally {
    loading.value = false
  }
}

const addSkill = (category) => {
  const newSkill = prompt(`Add new ${category} skill:`)
  if (newSkill && newSkill.trim()) {
    formData.value.skills[category].push(newSkill.trim())
  }
}

const removeSkill = (category, index) => {
  formData.value.skills[category].splice(index, 1)
}

const addExperience = () => {
  formData.value.experience.unshift({
    title: '',
    company: '',
    period: '',
    description: ''
  })
}

const removeExperience = (index) => {
  if (confirm('Are you sure you want to remove this experience?')) {
    formData.value.experience.splice(index, 1)
  }
}
</script>

<style scoped>
.about-container {
  color: #ffffff;
}

.about-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.about-section {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
}

.about-section:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: #667eea;
}

.edit-btn {
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 8px;
  padding: 0.5rem;
  color: #667eea;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-btn:hover {
  background: rgba(102, 126, 234, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

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
  backdrop-filter: blur(4px);
}

.modal-content {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-title {
  color: #667eea;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #a0a0b8;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.modal-body {
  padding: 2rem;
  max-height: 50vh;
  overflow-y: auto;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  color: #e0e0e0;
  font-weight: 600;
  font-size: 0.9rem;
}

.form-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem;
  color: #ffffff;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.form-textarea {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem;
  color: #ffffff;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  resize: vertical;
  min-height: 80px;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.skills-category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.skills-edit-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skill-edit-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.skill-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 0.5rem;
  color: #ffffff;
  font-size: 0.85rem;
}

.skill-input:focus {
  outline: none;
  border-color: #667eea;
}

.remove-btn {
  background: #ef4444;
  border: none;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  background: #dc2626;
  transform: scale(1.1);
}

.add-experience-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-experience-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.experience-form-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.experience-form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.experience-form-header h4 {
  color: #667eea;
  margin: 0;
  font-size: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #e0e0e0;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.15);
}

.btn-save {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-save:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.bio-text {
  color: #e0e0e0;
  line-height: 1.7;
  margin-bottom: 1rem;
}

.skills-categories {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.skill-category {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.category-title {
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 1rem 0;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #ffffff;
  background: rgba(102, 126, 234, 0.8);
  transition: all 0.2s ease;
}

.skill-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.skill-tag.technical {
  background: #667eea;
}
.skill-tag.soft {
  background: #10b981;
}
.skill-tag.language {
  background: #f59e0b;
}

.experience-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.experience-item {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
}

.experience-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(102, 126, 234, 0.3);
}

.exp-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.exp-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.exp-period {
  color: #667eea;
  font-size: 0.9rem;
  font-weight: 500;
}

.exp-company {
  color: #a0a0b8;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
}

.exp-description {
  color: #e0e0e0;
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .about-grid {
    grid-template-columns: 1fr;
  }

  .exp-header {
    flex-direction: column;
    gap: 0.25rem;
  }

  .section-header {
    flex-direction: row;
    gap: 1rem;
  }

  .modal-content {
    width: 95%;
    margin: 1rem;
  }

  .modal-header {
    padding: 1rem;
  }

  .modal-body {
    padding: 1rem;
  }

  .modal-footer {
    padding: 1rem;
    flex-direction: column;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .btn-cancel {
    width: 100%;
  }

  .btn-save {
    width: 100%;
  }
}
</style>
