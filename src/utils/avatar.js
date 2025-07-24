// src/utils/avatar.js
export function getAvatarUrl(avatar) {
  if (!avatar) return '/src/assets/profile.png';
  if (avatar.startsWith('http://') || avatar.startsWith('https://')) return avatar;
  // Jika sudah diawali /uploads/ atau uploads/, jangan tambah uploads lagi
  if (avatar.startsWith('/uploads/')) return `http://localhost:5000${avatar}`;
  if (avatar.startsWith('uploads/')) return `http://localhost:5000/${avatar}`;
  return `http://localhost:5000/uploads/${avatar}`;
}
