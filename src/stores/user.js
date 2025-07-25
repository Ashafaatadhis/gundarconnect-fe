import { defineStore } from 'pinia'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const useUserStore = defineStore('user', {
  state: () => {
    const savedUser = localStorage.getItem('user')
    return {
      user: savedUser ? JSON.parse(savedUser) : null,
    }
  },

  actions: {
    setUser(userData) {
      this.user = userData
      localStorage.setItem('user', JSON.stringify(userData))
    },

    async getUser() {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Gagal fetch user profile')
        }

        const data = await response.json()
        this.setUser(data.user)
      } catch (error) {
        console.error('Gagal mengambil data user:', error.message)
        this.user = null
        localStorage.removeItem('user')
      }
    },

    logout() {
      this.user = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },
  },
})
