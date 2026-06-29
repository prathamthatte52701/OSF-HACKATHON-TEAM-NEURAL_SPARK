import { User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function UserAvatar({ avatar, size = 40, border, style = {} }) {
  const { colors } = useTheme();

  if (avatar) {
    return (
      <img
        src={avatar}
        alt="Avatar"
        style={{
          width: size, height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          border: border || `2px solid ${colors.accent}`,
          display: 'block',
          flexShrink: 0,
          ...style,
        }}
      />
    );
  }

  return (
    <div style={{
      width: size, height: size,
      borderRadius: '50%',
      background: `${colors.accent}20`,
      border: border || `2px solid ${colors.accent}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      ...style,
    }}>
      <User size={size * 0.48} color={colors.accent} />
    </div>
  );
}
