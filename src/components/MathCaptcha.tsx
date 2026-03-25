import { useState, useCallback } from 'react';

interface MathCaptchaProps {
  onVerified: (verified: boolean) => void;
}

const MathCaptcha = ({ onVerified }: MathCaptchaProps) => {
  const [challenge, setChallenge] = useState(() => generateChallenge());
  const [answer, setAnswer] = useState('');
  const [verified, setVerified] = useState(false);

  function generateChallenge() {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    return { a, b, answer: a + b };
  }

  const handleChange = useCallback((value: string) => {
    setAnswer(value);
    const num = parseInt(value, 10);
    if (!isNaN(num) && num === challenge.answer) {
      setVerified(true);
      onVerified(true);
    } else {
      setVerified(false);
      onVerified(false);
    }
  }, [challenge.answer, onVerified]);

  const refresh = useCallback(() => {
    const newChallenge = generateChallenge();
    setChallenge(newChallenge);
    setAnswer('');
    setVerified(false);
    onVerified(false);
  }, [onVerified]);

  if (verified) {
    return (
      <div className="flex items-center gap-2 text-sm text-primary">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Verified
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground whitespace-nowrap">
        {challenge.a} + {challenge.b} = ?
      </span>
      <input
        type="number"
        value={answer}
        onChange={(e) => handleChange(e.target.value)}
        className="w-20 px-3 py-2 text-sm bg-secondary border border-border focus:border-primary focus:outline-none rounded-sm"
        placeholder="?"
      />
      <button
        type="button"
        onClick={refresh}
        className="text-xs text-muted-foreground hover:text-primary transition-colors"
        title="New question"
      >
        ↻
      </button>
    </div>
  );
};

export default MathCaptcha;
