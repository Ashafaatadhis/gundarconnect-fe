<template>
  <div class="login-container">
    <!-- Animated Background -->
    <div class="background-animation">
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>
      <div class="floating-shape shape-4"></div>
      <div class="floating-shape shape-5"></div>
    </div>

    <!-- Left Side - Brand -->
    <div class="brand-side">
      <div class="brand-content" :class="{ 'animate-in': isLoaded }">
        <div class="logo-container">
          <div class="logo-circle">
            <div class="logo-inner">
              <img src="/src/assets/gundar.png" alt="Gunadarma Logo" class="logo" />
            </div>
            <div class="logo-pulse"></div>
          </div>
        </div>
        <h1 class="brand-title">
          <span
            class="letter"
            v-for="(letter, index) in platformLetters"
            :key="index"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            {{ letter }}
          </span>
        </h1>
        <p class="brand-subtitle">{{ settings.general.description }}</p>
      </div>
    </div>

    <!-- Right Side - Login Form -->
    <div class="form-side">
      <div class="form-container glass-morphism" :class="{ 'slide-in': isLoaded }">
        <div class="form-header">
          <h2 class="form-title">Selamat Datang!</h2>
          <div class="login-instruction">
            <div class="instruction-icon">🎓</div>
            <p>Login menggunakan kredensial Student Gunadarma</p>
          </div>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group" :class="{ focused: focusedField === 'username' }">
            <label for="username">USERNAME</label>
            <div class="input-container">
              <div class="input-icon">👤</div>
              <input
                type="text"
                id="username"
                v-model="form.username"
                :class="{ error: errors.username, valid: form.username && !errors.username }"
                placeholder="Username studentsite"
                @input="clearError('username')"
                @focus="focusedField = 'username'"
                @blur="focusedField = ''"
              />
              <div class="input-border"></div>
            </div>
            <transition name="error-slide">
              <span v-if="errors.username" class="error-message">
                <span class="error-icon">⚠️</span>
                {{ errors.username }}
              </span>
            </transition>
          </div>

          <div class="form-group" :class="{ focused: focusedField === 'password' }">
            <label for="password">PASSWORD</label>
            <div class="input-container">
              <div class="input-icon">🔒</div>
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="form.password"
                :class="{ error: errors.password, valid: form.password && !errors.password }"
                placeholder="Masukkan password Anda"
                @input="clearError('password')"
                @focus="focusedField = 'password'"
                @blur="focusedField = ''"
              />
              <button type="button" class="password-toggle" @click="togglePassword">
                <transition name="icon-flip" mode="out-in">
                  <span v-if="showPassword" key="hide">🙈</span>
                  <span v-else key="show">👁️</span>
                </transition>
              </button>
              <div class="input-border"></div>
            </div>
            <transition name="error-slide">
              <span v-if="errors.password" class="error-message">
                <span class="error-icon">⚠️</span>
                {{ errors.password }}
              </span>
            </transition>
          </div>

          <button
            type="submit"
            class="login-btn"
            :disabled="isLoading"
            :class="{ loading: isLoading }"
          >
            <span class="btn-content">
              <transition name="loading-fade" mode="out-in">
                <div v-if="isLoading" key="loading" class="loading-content">
                  <div class="loading-spinner"></div>
                  <span>Memproses...</span>
                </div>
                <div v-else key="login" class="login-content">
                  <span class="btn-icon">🚀</span>
                  <span>LOGIN</span>
                </div>
              </transition>
            </span>
            <div class="btn-ripple"></div>
          </button>
        </form>
      </div>
    </div>

    <!-- Enhanced Message Modal -->
    <transition name="modal-fade">
      <div v-if="message" class="message-overlay" @click="closeMessage">
        <transition name="modal-bounce">
          <div class="message-modal glass-morphism" @click.stop>
            <div class="message-header">
              <div class="message-icon" :class="messageType">
                <transition name="icon-bounce" appear>
                  <span v-if="messageType === 'success'">✅</span>
                  <span v-else-if="messageType === 'error'">❌</span>
                  <span v-else>ℹ️</span>
                </transition>
              </div>
              <h3>
                {{
                  messageType === 'success'
                    ? 'Berhasil!'
                    : messageType === 'error'
                      ? 'Oops!'
                      : 'Info'
                }}
              </h3>
            </div>
            <p class="message-text">{{ message }}</p>
            <button @click="closeMessage" class="close-btn">
              <span>OK</span>
              <div class="btn-ripple-small"></div>
            </button>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user' // ⬅️ Import user store
import axios from 'axios'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter()
    const userStore = useUserStore() // ⬅️ Inisialisasi store

    const form = reactive({
      username: '',
      password: '',
    })

    const errors = reactive({
      username: '',
      password: '',
    })

    const settings = reactive({
      general: {
        platformName: '',
        description: '',
      },
    })

    const showPassword = ref(false)
    const isLoading = ref(false)
    const message = ref('')
    const messageType = ref('info')
    const focusedField = ref('')
    const isLoaded = ref(false)

    const loadSettings = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/platform-settings`)
        settings.general.platformName = data.name
        settings.general.description = data.description
      } catch (err) {
        console.error('Gagal load pengaturan platform', err)
      }
    }

    onMounted(async () => {
      await loadSettings()
    })

    const platformLetters = computed(() => {
      return settings.general.platformName.split('')
    })

    onMounted(() => {
      setTimeout(() => {
        isLoaded.value = true
      }, 100)
    })

    const validateForm = () => {
      let isValid = true
      errors.username = ''
      errors.password = ''

      if (!form.username.trim()) {
        errors.username = 'Username harus diisi'
        isValid = false
      } else {
        const isValidNPM = /^\d{8}$/.test(form.username)
        const isValidEmail = form.username.includes('@student.gunadarma.ac.id')
      }

      if (!form.password.trim()) {
        errors.password = 'Password harus diisi'
        isValid = false
      } else if (form.password.length < 6) {
        errors.password = 'Password minimal 6 karakter'
        isValid = false
      }

      return isValid
    }

    const handleLogin = async () => {
      if (!validateForm()) return
      isLoading.value = true

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: form.username,
            password: form.password,
          }),
        })

        const data = await response.json()

        if (response.ok) {
          // Simpan ke localStorage

          localStorage.setItem('token', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
          localStorage.setItem('userId', data.user.id)

          // Simpan ke Pinia Store
          userStore.setUser(data.user)

          showMessage('Login berhasil! Selamat datang di GundarConnect! 🎉', 'success')

          setTimeout(() => {
            router.push('/home')
          }, 1000)
        } else {
          showMessage(data.message || 'Login gagal', 'error')
        }
      } catch (error) {
        showMessage('Terjadi kesalahan saat login. Silakan coba lagi.', 'error')
      } finally {
        isLoading.value = false
      }
    }

    const togglePassword = () => {
      showPassword.value = !showPassword.value
    }

    const clearError = (field) => {
      errors[field] = ''
    }

    const showMessage = (msg, type = 'info') => {
      message.value = msg
      messageType.value = type
    }

    const closeMessage = () => {
      message.value = ''
    }

    return {
      form,
      errors,
      showPassword,
      isLoading,
      message,
      messageType,
      focusedField,
      isLoaded,
      settings,
      handleLogin,
      platformLetters,
      togglePassword,
      clearError,
      showMessage,
      closeMessage,
    }
  },
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.login-container {
  display: flex;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
}

/* Animated Background */
.background-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.08;
  animation: float 20s infinite ease-in-out;
}

.shape-1 {
  width: 100px;
  height: 100px;
  background: linear-gradient(45deg, #6b73ff, #9b59b6);
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 150px;
  height: 150px;
  background: linear-gradient(45deg, #ff6b9d, #ff8e8e);
  top: 60%;
  right: 15%;
  animation-delay: -5s;
}

.shape-3 {
  width: 80px;
  height: 80px;
  background: linear-gradient(45deg, #4facfe, #00f2fe);
  bottom: 20%;
  left: 20%;
  animation-delay: -10s;
}

.shape-4 {
  width: 120px;
  height: 120px;
  background: linear-gradient(45deg, #43e97b, #38f9d7);
  top: 30%;
  right: 30%;
  animation-delay: -15s;
}

.shape-5 {
  width: 200px;
  height: 200px;
  background: linear-gradient(45deg, #fa709a, #fee140);
  bottom: 10%;
  right: 10%;
  animation-delay: -8s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(90deg);
  }
  50% {
    transform: translateY(-40px) rotate(180deg);
  }
  75% {
    transform: translateY(-20px) rotate(270deg);
  }
}

/* Glass Morphism Effect */
.glass-morphism {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Brand Side - Updated with new color scheme */
.brand-side {
  flex: 1;
  background: linear-gradient(
    135deg,
    #0e061a 0%,
    #1a0b2e 20%,
    #2e1065 40%,
    #4c1d95 60%,
    #6b21a8 80%,
    #7c3aed 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  z-index: 1;
}

.brand-content {
  text-align: center;
  color: white;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.brand-content.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.logo-container {
  margin-bottom: 2rem;
  position: relative;
}

.logo-circle {
  width: 180px;
  height: 180px;
  position: relative;
  margin: 0 auto;
}

.logo-inner {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(20px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.25);
  position: relative;
  z-index: 2;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.logo-pulse {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.1);
    opacity: 0;
  }
}

.logo {
  width: 90px;
  height: 90px;
  object-fit: contain;
  filter: brightness(1.3) contrast(1.1);
}

.brand-title {
  font-size: 3.2rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  letter-spacing: 2px;
  overflow: hidden;
}

.letter {
  display: inline-block;
  opacity: 0;
  transform: translateY(20px);
  animation: letterDrop 0.6s forwards;
}

@keyframes letterDrop {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.brand-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  font-weight: 300;
  letter-spacing: 1px;
  margin: 0;
}

/* Form Side */
.form-side {
  flex: 1;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  z-index: 1;
}

.form-container {
  width: 100%;
  max-width: 420px;
  padding: 3rem;
  border-radius: 24px;
  transform: translateX(30px);
  opacity: 0;
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s;
}

.form-container.slide-in {
  transform: translateX(0);
  opacity: 1;
}

.form-header {
  margin-bottom: 2.5rem;
  text-align: center;
}

.form-title {
  font-size: 2.2rem;
  color: #2d3748;
  margin: 0 0 1.5rem 0;
  font-weight: 700;
  background: linear-gradient(135deg, #0e061a, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-instruction {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  padding: 1rem 1.5rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.instruction-icon {
  font-size: 1.5rem;
}

.login-instruction p {
  margin: 0;
  color: #4a5568;
  font-size: 0.95rem;
  font-weight: 500;
}

/* Form Styling */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-group {
  position: relative;
}

.form-group label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.75rem;
  display: block;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: color 0.3s ease;
}

.form-group.focused label {
  color: #7c3aed;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  font-size: 1.2rem;
  z-index: 2;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.form-group.focused .input-icon {
  opacity: 1;
  transform: scale(1.1);
}

.form-group input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid transparent;
  border-radius: 16px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  color: #2d3748;
  outline: none;
}

.form-group input::placeholder {
  color: rgba(77, 81, 86, 0.6);
}

.form-group input:focus {
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(124, 58, 237, 0.15);
}

.input-border {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #0e061a, #7c3aed);
  transition: all 0.4s ease;
  transform: translateX(-50%);
  border-radius: 1px;
}

.form-group.focused .input-border {
  width: 100%;
}

.form-group input.error {
  border-color: #f56565;
  background: rgba(254, 226, 226, 0.8);
}

.form-group input.valid {
  border-color: #48bb78;
  background: rgba(240, 253, 244, 0.8);
}

.password-toggle {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  z-index: 2;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.password-toggle:hover {
  background: rgba(124, 58, 237, 0.1);
  transform: scale(1.1);
}

/* Error Messages */
.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #f56565;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  font-weight: 500;
}

.error-icon {
  font-size: 1rem;
}

/* Login Button */
.login-btn {
  background: linear-gradient(135deg, #0e061a 0%, #7c3aed 100%);
  color: white;
  border: none;
  padding: 1.2rem;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-top: 1rem;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(124, 58, 237, 0.4);
  background: linear-gradient(135deg, #1a0b2e 0%, #8b5cf6 100%);
}

.login-btn:active:not(:disabled) {
  transform: translateY(-1px);
}

.login-btn:disabled {
  opacity: 0.8;
  cursor: not-allowed;
  transform: none;
}

.btn-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.loading-content,
.login-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.btn-icon {
  font-size: 1.2rem;
}

.btn-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition:
    width 0.6s,
    height 0.6s;
}

.login-btn:active .btn-ripple {
  width: 300px;
  height: 300px;
}

/* Message Modal */
.message-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.message-modal {
  padding: 2.5rem;
  border-radius: 24px;
  text-align: center;
  min-width: 320px;
  max-width: 400px;
  margin: 1rem;
}

.message-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.message-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.message-icon.success {
  background: linear-gradient(135deg, #48bb78, #38a169);
}

.message-icon.error {
  background: linear-gradient(135deg, #f56565, #e53e3e);
}

.message-icon.info {
  background: linear-gradient(135deg, #4299e1, #3182ce);
}

.message-header h3 {
  margin: 0;
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 700;
}

.message-text {
  color: #4a5568;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 2rem 0;
}

.close-btn {
  background: linear-gradient(135deg, #0e061a, #7c3aed);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.close-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(124, 58, 237, 0.3);
}

.btn-ripple-small {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition:
    width 0.4s,
    height 0.4s;
}

.close-btn:active .btn-ripple-small {
  width: 100px;
  height: 100px;
}

/* Animations */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Transitions */
.error-slide-enter-active,
.error-slide-leave-active {
  transition: all 0.3s ease;
}

.error-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.error-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.icon-flip-enter-active,
.icon-flip-leave-active {
  transition: all 0.3s ease;
}

.icon-flip-enter-from,
.icon-flip-leave-to {
  opacity: 0;
  transform: rotateY(90deg);
}

.loading-fade-enter-active,
.loading-fade-leave-active {
  transition: all 0.3s ease;
}

.loading-fade-enter-from,
.loading-fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-bounce-enter-active {
  animation: modalBounce 0.5s ease-out;
}

.modal-bounce-leave-active {
  animation: modalBounce 0.3s ease-in reverse;
}

@keyframes modalBounce {
  0% {
    opacity: 0;
    transform: scale(0.7) translateY(30px);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05) translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.icon-bounce-enter-active {
  animation: iconBounce 0.6s ease-out;
}

@keyframes iconBounce {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }

  .brand-side {
    min-height: 40vh;
    padding: 1.5rem;
  }

  .logo-circle {
    width: 140px;
    height: 140px;
  }

  .logo {
    width: 70px;
    height: 70px;
  }

  .brand-title {
    font-size: 2.5rem;
  }

  .brand-subtitle {
    font-size: 1rem;
  }

  .form-side {
    padding: 1rem;
  }

  .form-container {
    padding: 2rem;
    margin: 1rem;
  }

  .form-title {
    font-size: 1.8rem;
  }

  .login-instruction {
    padding: 0.75rem 1rem;
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }

  .form-group input {
    padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  }

  .input-icon {
    left: 0.75rem;
    font-size: 1rem;
  }

  .password-toggle {
    right: 0.75rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .brand-title {
    font-size: 2rem;
  }

  .form-container {
    padding: 1.5rem;
  }

  .form-title {
    font-size: 1.6rem;
  }

  .login-btn {
    padding: 1rem;
    font-size: 1rem;
  }
}
</style>
