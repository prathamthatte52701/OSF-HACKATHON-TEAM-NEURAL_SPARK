import { useState, useCallback } from 'react'
import api from '../utils/api'

const useProgress = (userId) => {
  const [progress, setProgress]   = useState([])
  const [loading, setLoading]     = useState(false)

  const fetchProgress = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const { data } = await api.get(`/progress/${userId}`)
      setProgress(data)
    } catch (err) {
      console.error('Failed to fetch progress:', err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  const updateProgress = useCallback(async (payload) => {
    try {
      const { data } = await api.post('/progress/update', payload)
      return data
    } catch (err) {
      console.error('Failed to update progress:', err)
      throw err
    }
  }, [])

  const getTopicProgress = useCallback((topicId) => {
    return progress.find(p => p.topicId === topicId) || null
  }, [progress])

  return { progress, loading, fetchProgress, updateProgress, getTopicProgress }
}

export default useProgress
