import { getDailyChallengeSlotInfo } from '../assets/challenges/dailyChallenges'

const STORAGE_PREFIX = 'stemlearn:dailyChallengeSlots'

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

export const getDailyChallengeUserId = (user) =>
  user?._id || user?.id || 'anonymous'

export const getDailyChallengeStorageKey = (user, dateKey) =>
  `${STORAGE_PREFIX}:${getDailyChallengeUserId(user)}:${dateKey}`

export const getLocalDailyChallengeSlots = (user, dateKey = getDailyChallengeSlotInfo().dateKey) => {
  if (typeof window === 'undefined') return []
  return safeParse(localStorage.getItem(getDailyChallengeStorageKey(user, dateKey)), [])
}

export const saveLocalDailyChallengeSlot = (user, slotInfo = getDailyChallengeSlotInfo()) => {
  if (typeof window === 'undefined') return []
  const slots = new Set(getLocalDailyChallengeSlots(user, slotInfo.dateKey))
  slots.add(slotInfo.slotId)
  const nextSlots = Array.from(slots)
  localStorage.setItem(getDailyChallengeStorageKey(user, slotInfo.dateKey), JSON.stringify(nextSlots))
  return nextSlots
}

export const mergeLocalDailyChallengeSlots = (user, dateKey, slots = []) => {
  if (typeof window === 'undefined') return slots
  const merged = Array.from(new Set([...getLocalDailyChallengeSlots(user, dateKey), ...slots]))
  localStorage.setItem(getDailyChallengeStorageKey(user, dateKey), JSON.stringify(merged))
  return merged
}

export const isDailyChallengeSlotCompleted = (slots, slotInfo = getDailyChallengeSlotInfo()) =>
  slots.includes(slotInfo.slotId)

export const formatDailyChallengeTime = (ms) => {
  const safeMs = Math.max(0, ms)
  const h = Math.floor(safeMs / 3600000)
  const m = Math.floor((safeMs % 3600000) / 60000)
  const s = Math.floor((safeMs % 60000) / 1000)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
