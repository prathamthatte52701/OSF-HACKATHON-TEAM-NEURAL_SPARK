export default function AuthRobot({ alt = 'ZenithLearn robot' }) {
  return (
    <img
      src="/logo.png"
      alt={alt}
      style={{
        width: 80,
        height: 80,
        objectFit: 'contain',
        display: 'block',
        margin: '0 auto 12px',
      }}
    />
  )
}
