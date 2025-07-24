import { reactive } from 'vue'

export const savedPosts = reactive([
  {
    id: 1,
    title: 'Contoh Postingan',
    content: 'Ini adalah isi dari postingan...',
    image: 'https://via.placeholder.com/150',
    author: {
      username: 'radot',
      avatar: null,
    },
    createdAt: new Date().toISOString(),
    savedAt: new Date().toISOString(),
    likes: 10,
    comments: 2,
    tags: ['Vue', 'Coding', 'Tutorial'],
  },
  {
    id: 2,
    title: 'Contoh RADOT',
    content: 'Ini adalah isi dari postingan...',
    image: '@/assets/profile.png',
    author: {
      username: 'radot',
      avatar: null,
    },
    createdAt: new Date().toISOString(),
    savedAt: new Date().toISOString(),
    likes: 10,
    comments: 2,
    tags: ['Vue', 'Coding', 'Tutorial'],
  },
  // Post lainnya...
])
