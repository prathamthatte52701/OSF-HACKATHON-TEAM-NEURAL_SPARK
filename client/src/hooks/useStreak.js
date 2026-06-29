import { useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export const useStreak = () => {
  const { user, updateUser } = useAuth();

  useEffect(() => {
    if (!user) return;
    api.post('/user/streak')
      .then(res => updateUser({ streak: res.data.streak, streakFreeze: res.data.streakFreeze }))
      .catch(() => {});
  }, []);
};
