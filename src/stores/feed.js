// stores/feed.js
import { defineStore } from 'pinia'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const API_URL = `${API_BASE_URL}/api`

export const useFeedStore = defineStore('feed', {
  state: () => ({
    posts: [],
  }),

  getters: {
    getPosts: (state) => () => {
      return state.posts
    },

    getPostById: (state) => (id) => {
      return state.posts.find((post) => post.id === id)
    },
  },

  actions: {
    async fetchPosts() {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`${API_URL}/posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await response.json()
        if (response.ok) {
          this.posts = data
        } else {
          this.posts = []
        }
      } catch (error) {
        this.posts = []
      }
    },
    async addPost(post) {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`${API_URL}/posts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(post),
        })
        const data = await response.json()
        if (response.ok) {
          this.posts.unshift(data)
        }
      } catch (error) {}
    },
    async addComment(postId, comment) {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(comment),
        })
        const data = await response.json()
        if (response.ok) {
          const idx = this.posts.findIndex((p) => p.id === postId)
          if (idx !== -1) this.posts[idx] = data
        }
      } catch (error) {}
    },
    async toggleLike(postId) {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`${API_URL}/posts/${postId}/like`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await response.json()
        if (response.ok) {
          const idx = this.posts.findIndex((p) => p.id === postId)
          if (idx !== -1) this.posts[idx] = data
        }
      } catch (error) {}
    },
  },
})
