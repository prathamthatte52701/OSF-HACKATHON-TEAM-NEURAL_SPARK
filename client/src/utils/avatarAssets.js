export const PROFILE_AVATARS = [
  { id: 'avatar-1', src: '/avatar-1.png', label: 'Avatar 1' },
  { id: 'avatar-2', src: '/avatar-2.png', label: 'Avatar 2' },
  { id: 'avatar-3', src: '/avatar-3.png', label: 'Avatar 3' },
  { id: 'avatar-4', src: '/avatar-4.png', label: 'Avatar 4' },
  { id: 'avatar-5', src: '/avatar-5.png', label: 'Avatar 5' },
]

export const getAvatarStorageKey = (user) => {
  const id = user?._id || user?.id || user?.email || 'guest'
  return `stemlearn:profileAvatar:${id}`
}
