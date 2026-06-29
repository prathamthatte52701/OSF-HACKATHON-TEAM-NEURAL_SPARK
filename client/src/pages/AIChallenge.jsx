import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Brain, Send, ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Navbar from '../components/shared/Navbar';
import SpeakButton from '../components/shared/SpeakButton';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Confetti from '../components/shared/Confetti';
import { TOPICS } from '../utils/constants';

const MAX_QUESTIONS  = 10;
const PASS_THRESHOLD = 6;

export default function AIChallenge() {
  const { topicId } = useParams();
  const { colors }  = useTheme();
  const { user, updateUser } = useAuth();
  const navigate    = useNavigate();

  const [phase, setPhase]         = useState('intro');
  const [currentQ, setCurrentQ]   = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [qNum, setQNum]           = useState(1);
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [accessChecked, setAccessChecked] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  // Use a ref for counts so we never have stale-closure problems
  const prevQRef   = useRef([]);
  const prevARef   = useRef([]);
  const countRef   = useRef(0); // satisfactory count
  const qNumRef    = useRef(1);

  const isHindi  = user?.language === 'hindi';
  const topicObj = TOPICS.find(t => t.id === topicId);
  const topicName = topicObj ? (isHindi ? topicObj.nameHindi : topicObj.name) : topicId;

  useEffect(() => {
    const verifyAccess = async () => {
      if (!user) return;
      if (user.isGuest) {
        setAccessDenied(true);
        setAccessChecked(true);
        return;
      }
      if (user.isDeveloper) {
        setAccessDenied(false);
        setAccessChecked(true);
        return;
      }
      if ((user.streak || 0) >= 7) {
        setAccessDenied(false);
        setAccessChecked(true);
        return;
      }

      try {
        const uid = user._id || user.id;
        const res = await api.get(`/progress/${uid}`);
        const topicProgress = (res.data || []).find(p => p.topicId === topicId);
        setAccessDenied(!(topicProgress?.aiChallengeUnlocked && topicProgress?.topicCompleted));
      } catch {
        setAccessDenied(true);
      } finally {
        setAccessChecked(true);
      }
    };

    verifyAccess();
  }, [topicId, user?._id, user?.id, user?.streak]);

  const addMessage = (type, content) =>
    setConversation(prev => [...prev, { type, content }]);

  const fetchNextQuestion = async (prevQ, prevA, currentQNum) => {
    setLoading(true);
    try {
      const res = await api.post('/groq/challenge-question', {
        topicId,           // ✅ correct field
        questionNum: currentQNum,  // ✅ correct field
        language: user?.language,
        previousQuestions: prevQ,
        previousAnswers: prevA,
      });

      const text       = (res.data.question || '').trim();
      const isComplete = res.data.isComplete;

      if (isComplete) {
        // AI said GREAT — count it
        countRef.current += 1;
        addMessage('ai', isHindi ? '✅ Bahut badhiya jawab! Agle sawaal ki taraf...' : '✅ Great answer! Moving on...');

        if (currentQNum >= MAX_QUESTIONS) {
          await finishChallenge();
        } else {
          // Ask next question without incrementing qNum externally
          await fetchNextQuestion(prevQ, prevA, currentQNum + 1);
        }
      } else {
        setCurrentQ(text);
        addMessage('ai', text);
      }
    } catch {
      const fallback = `What is one important use of ${topicName} in Python?`;
      setCurrentQ(fallback);
      addMessage('ai', fallback);
    } finally {
      setLoading(false);
    }
  };

  const startChallenge = async () => {
    prevQRef.current = [];
    prevARef.current = [];
    countRef.current = 0;
    qNumRef.current  = 1;
    setPhase('challenge');
    setQNum(1);
    setConversation([]);
    await fetchNextQuestion([], [], 1);
  };

  const handleSubmit = async () => {
    const answer = userAnswer.trim();
    if (!answer || loading) return;
    setUserAnswer('');

    addMessage('user', answer);

    const newQ = [...prevQRef.current, currentQ];
    const newA = [...prevARef.current, answer];
    prevQRef.current = newQ;
    prevARef.current = newA;

    const nextQNum = qNumRef.current + 1;
    qNumRef.current = nextQNum;
    setQNum(nextQNum);

    if (nextQNum > MAX_QUESTIONS) {
      await finishChallenge();
      return;
    }

    await fetchNextQuestion(newQ, newA, nextQNum);
  };

  const finishChallenge = async () => {
    const finalCount = countRef.current;
    const passed     = finalCount >= PASS_THRESHOLD;

    if (passed) setShowConfetti(true);
    setPhase('done');

    if (passed) {
      try {
        const bonusPoints = finalCount * 20;
        await api.post('/challenge/complete', { topicId, score: bonusPoints });
        updateUser({ totalPoints: (user.totalPoints || 0) + bonusPoints });
        setResultData({ passed: true, count: finalCount, bonusPoints });
      } catch {
        setResultData({ passed: true, count: finalCount, bonusPoints: 0 });
      }
    } else {
      setResultData({ passed: false, count: finalCount, bonusPoints: 0 });
    }
  };

  // Visible qNum is capped at MAX_QUESTIONS
  const displayQNum = Math.min(qNum, MAX_QUESTIONS);

  if (!accessChecked) {
    return (
      <div style={{ background: colors.bg, minHeight: '100vh', fontFamily: 'Poppins, sans-serif' }}>
        <Navbar />
        <LoadingSpinner text={isHindi ? 'Challenge check ho raha hai...' : 'Checking challenge access...'} />
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div style={{ background: colors.bg, minHeight: '100vh', fontFamily: 'Poppins, sans-serif' }}>
        <Navbar />
        <div style={{ maxWidth: 620, margin: '0 auto', padding: '64px 16px', textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🔒</div>
          <h1 style={{ color: colors.text, margin: '0 0 10px', fontSize: 24 }}>AI Challenge Locked</h1>
          <p style={{ color: colors.textMuted, margin: '0 0 24px', lineHeight: 1.7 }}>
            Build a 7-day streak and complete this topic to unlock the interview challenge.
          </p>
          <button
            onClick={() => navigate(`/topic/${topicId}`)}
            style={{
              background: colors.accent, color: '#fff', border: 'none',
              borderRadius: 12, padding: '12px 24px', cursor: 'pointer',
              fontSize: 15, fontWeight: 600, fontFamily: 'Poppins, sans-serif',
            }}
          >
            Back to Topic
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: colors.bg, minHeight: '100vh', fontFamily: 'Poppins, sans-serif' }}>
      <Navbar />
      <Confetti active={showConfetti} onDone={() => setShowConfetti(false)} />

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '24px 16px' }}>

        {/* ── INTRO ── */}
        {phase === 'intro' && (
          <div style={{ textAlign: 'center', paddingTop: 60 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🧠</div>
            <h1 style={{ color: colors.text, fontSize: 28, margin: '0 0 8px', fontWeight: 700 }}>AI Challenge</h1>
            <h2 style={{ color: colors.accent, margin: '0 0 28px', fontWeight: 600 }}>{topicName}</h2>

            <div style={{
              background: colors.surface, border: `1px solid ${colors.border}`,
              borderRadius: 16, padding: 24, marginBottom: 32, textAlign: 'left',
            }}>
              <p style={{ color: colors.text, lineHeight: 1.85, margin: 0, fontSize: 14 }}>
                🤖 <strong>AI will ask you {MAX_QUESTIONS} questions</strong> — it won't stop until it's truly satisfied with your understanding.<br /><br />
                📌 Each question builds on your previous answer.<br />
                ✅ {PASS_THRESHOLD}+ satisfactory answers → Challenge Complete!<br />
                ❌ Less than {PASS_THRESHOLD} → Re-read the topic and try again.
              </p>
            </div>

            <button
              onClick={startChallenge}
              style={{
                background: `linear-gradient(135deg, ${colors.accent}, #f59e0b)`,
                color: '#fff', border: 'none', borderRadius: 14,
                padding: '16px 52px', fontSize: 18, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              {isHindi ? 'Challenge Shuru Karo 🚀' : 'Start Challenge 🚀'}
            </button>
          </div>
        )}

        {/* ── CHALLENGE ── */}
        {phase === 'challenge' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <button
                onClick={() => navigate(`/topic/${topicId}`)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textMuted, display: 'flex', gap: 4, alignItems: 'center', fontFamily: 'Poppins, sans-serif' }}
              >
                <ArrowLeft size={16} /> Back
              </button>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <span style={{ color: colors.accent, fontWeight: 600, fontSize: 14 }}>
                  Q {displayQNum}/{MAX_QUESTIONS}
                </span>
                <span style={{ background: '#052e16', border: '1px solid #10B981', color: '#10B981', borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>
                  ✅ {countRef.current}
                </span>
              </div>
            </div>

            {/* Progress */}
            <div style={{ background: colors.border, borderRadius: 4, height: 4, marginBottom: 20, overflow: 'hidden' }}>
              <div style={{
                width: `${(displayQNum / MAX_QUESTIONS) * 100}%`,
                background: `linear-gradient(90deg, ${colors.accent}, #f59e0b)`,
                height: '100%', borderRadius: 4, transition: 'width 0.4s ease',
              }} />
            </div>

            {/* Conversation */}
            <div style={{
              maxHeight: '52vh', overflowY: 'auto', marginBottom: 16,
              display: 'flex', flexDirection: 'column', gap: 12,
              scrollBehavior: 'smooth',
            }}>
              {conversation.map((msg, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '82%',
                    background: msg.type === 'user' ? colors.accent : colors.surface,
                    border: msg.type === 'ai' ? `1px solid ${colors.border}` : 'none',
                    borderRadius: msg.type === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    padding: '12px 16px',
                    color: msg.type === 'user' ? '#fff' : colors.text,
                    fontSize: 14, lineHeight: 1.65,
                  }}>
                    {msg.type === 'ai' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                        <Brain size={13} color={colors.accent} />
                        <span style={{ color: colors.accent, fontSize: 11, fontWeight: 600 }}>AI Interviewer</span>
                        <SpeakButton text={msg.content} language={user?.language} style={{ padding: '2px 8px', fontSize: 10 }} />
                      </div>
                    )}
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '18px 18px 18px 4px', padding: '12px 20px' }}>
                    <LoadingSpinner text={isHindi ? 'AI soch raha hai...' : 'AI thinking...'} />
                  </div>
                </div>
              )}
            </div>

            {/* Answer Input */}
            <div style={{ display: 'flex', gap: 10 }}>
              <textarea
                value={userAnswer}
                onChange={e => setUserAnswer(e.target.value)}
                placeholder={isHindi ? 'Apna jawab yahan likhо...' : 'Type your answer here...'}
                disabled={loading}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey && !loading && userAnswer.trim()) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                rows={3}
                style={{
                  flex: 1, padding: '12px 16px',
                  background: colors.surface, border: `1px solid ${colors.border}`,
                  borderRadius: 12, color: colors.text, fontSize: 14,
                  resize: 'none', outline: 'none', fontFamily: 'Poppins, sans-serif',
                  opacity: loading ? 0.6 : 1,
                }}
              />
              <button
                onClick={handleSubmit}
                disabled={loading || !userAnswer.trim()}
                style={{
                  background: colors.accent, color: '#fff', border: 'none',
                  borderRadius: 12, padding: '12px 18px', cursor: 'pointer',
                  opacity: loading || !userAnswer.trim() ? 0.4 : 1,
                  transition: 'opacity 0.2s', alignSelf: 'flex-end',
                }}
              >
                <Send size={18} />
              </button>
            </div>
            <p style={{ color: colors.textMuted, fontSize: 11, margin: '8px 0 0' }}>
              {isHindi ? 'Enter dababao submit karne ke liye' : 'Press Enter to submit • Shift+Enter for newline'}
            </p>
          </>
        )}

        {/* ── DONE ── */}
        {phase === 'done' && resultData && (
          <div style={{ textAlign: 'center', paddingTop: 60 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>
              {resultData.passed ? '🏆' : '😔'}
            </div>
            <h1 style={{
              color: resultData.passed ? colors.success : colors.error,
              fontSize: 26, marginBottom: 12, fontWeight: 700,
            }}>
              {resultData.passed
                ? (isHindi ? 'Challenge Complete! 🎉' : 'Challenge Complete! 🎉')
                : (isHindi ? 'Aur practice karo!' : 'Keep Practicing!')}
            </h1>
            <p style={{ color: colors.textMuted, marginBottom: 8, fontSize: 15 }}>
              {resultData.passed
                ? (isHindi
                    ? `Tumne ${resultData.count}/${MAX_QUESTIONS} satisfactory answers diye!`
                    : `You got ${resultData.count}/${MAX_QUESTIONS} satisfactory answers!`)
                : (isHindi
                    ? `Sirf ${resultData.count}/${MAX_QUESTIONS} satisfactory answers. Topic phirse padho.`
                    : `Only ${resultData.count}/${MAX_QUESTIONS} satisfactory answers. Re-read the topic.`)}
            </p>
            {resultData.passed && resultData.bonusPoints > 0 && (
              <p style={{ color: '#fbbf24', fontWeight: 700, fontSize: 18, marginBottom: 24 }}>
                +{resultData.bonusPoints} bonus points! ⭐
              </p>
            )}

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32 }}>
              <button
                onClick={() => navigate(`/topic/${topicId}`)}
                style={{
                  background: colors.surface, border: `1px solid ${colors.border}`,
                  color: colors.text, borderRadius: 12, padding: '12px 24px',
                  cursor: 'pointer', fontSize: 15, fontFamily: 'Poppins, sans-serif',
                }}
              >
                {resultData.passed
                  ? (isHindi ? '← Topic Pe Vapas' : '← Back to Topic')
                  : (isHindi ? '📖 Topic Dobara Padho' : '📖 Re-read Topic')}
              </button>
              <button
                onClick={() => navigate('/home')}
                style={{
                  background: colors.accent, color: '#fff', border: 'none',
                  borderRadius: 12, padding: '12px 24px',
                  cursor: 'pointer', fontSize: 15, fontWeight: 600,
                  fontFamily: 'Poppins, sans-serif',
                }}
              >
                🏠 {isHindi ? 'Home' : 'Home'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
