import { useState } from 'react';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';

export default function CodingDuel({ topicId, onExecute }) {
  const [code, setCode] = useState('# Initialize final sequence override\n\ndef final_strike():\n    # TODO: Write the logic to break the boss shield\n    pass\n');

  const challengeText = "CRITICAL: The boss core is exposed but shielded by an encrypted loop. Write a Python function `break_shield(power)` that returns the power multiplied by 100 to shatter it.";

  const handleExecute = () => {
    if (code.includes('return power * 100') || code.includes('return 100 * power')) {
      onExecute(true);
    } else {
      onExecute(false);
    }
  };

  return (
    <motion.div
      initial={{ y: '100vh', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        background: 'rgba(2, 6, 23, 0.95)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <motion.div
          animate={{
            scale: [1, 1.02, 1],
            filter: [
              'drop-shadow(0 0 10px #ef4444)',
              'drop-shadow(0 0 30px #ef4444)',
              'drop-shadow(0 0 10px #ef4444)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ textAlign: 'center', color: '#ef4444', fontWeight: 900, fontSize: '32px', letterSpacing: '4px' }}
        >
          EXECUTION PROTOCOL INITIATED
        </motion.div>

        <div style={{
          background: 'rgba(0,0,0,0.6)',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #34d399',
          color: '#fff',
          fontSize: '18px',
          lineHeight: 1.6,
        }}>
          {challengeText}
        </div>

        <div style={{ height: '400px', borderRadius: '12px', overflow: 'hidden', border: '2px solid rgba(217, 70, 239, 0.4)' }}>
          <Editor
            height="100%"
            defaultLanguage="python"
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val)}
            options={{
              minimap: { enabled: false },
              fontSize: 16,
              padding: { top: 20 },
              fontFamily: 'monospace',
            }}
          />
        </div>

        <button
          onClick={handleExecute}
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#fff',
            border: 'none',
            padding: '20px',
            fontSize: '20px',
            fontWeight: 900,
            borderRadius: '12px',
            cursor: 'pointer',
            letterSpacing: '2px',
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)',
            transition: 'all 0.2s',
            marginTop: '20px',
            fontFamily: 'Poppins, sans-serif',
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          EXECUTE FINAL STRIKE
        </button>
      </div>
    </motion.div>
  );
}
