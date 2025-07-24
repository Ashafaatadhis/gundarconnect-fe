import { defineStore } from 'pinia'

export const useSavedStore = defineStore('saved', {
  state: () => ({
    savedPosts: [],
  }),
  actions: {
    async fetchSavedPosts() {
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('Token tidak ditemukan')
        const res = await fetch('http://localhost:5000/api/saved/my', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        console.log('[DEBUG] fetchSavedPosts status:', res.status)
        if (!res.ok) throw new Error('Gagal memuat postingan tersimpan')
        const data = await res.json()
        console.log('[DEBUG] fetchSavedPosts data:', data)
        this.savedPosts = data.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt))
      } catch (err) {
        console.error('[DEBUG] fetchSavedPosts error:', err)
        this.savedPosts = []
      }
    },
    async savePost(postId) {
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('Token tidak ditemukan')
        const res = await fetch(`http://localhost:5000/api/saved/${postId}/save`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('Gagal menyimpan postingan')
        await this.fetchSavedPosts()
      } catch (err) {}
    },
    async unsavePost(postId) {
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('Token tidak ditemukan')
        const res = await fetch(`http://localhost:5000/api/saved/${postId}/save`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('Gagal menghapus postingan dari tersimpan')
        await this.fetchSavedPosts()
      } catch (err) {}
    }
  }
})
