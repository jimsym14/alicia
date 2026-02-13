import React, { useEffect, useRef, useState } from 'react';
import { Heart } from 'lucide-react';
import InitialStage from './InitialStage.jsx';
import QuestionStage from './QuestionStage.jsx';
import FinalCardStage from './FinalCardStage.jsx';
import obsesionTrack from '../../media/Aventura - Obsesion.mp3';
import samGellaitryTrack from '../../media/Sam Gellaitry - Assumptions (Slowed).mp3';

export default function ValentineCard() {
  const [stage, setStage] = useState('initial'); // initial, question, finalCard
  const [cupidClicked, setCupidClicked] = useState(false);
  const [showEnvelope, setShowEnvelope] = useState(false);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [noClickCount, setNoClickCount] = useState(0);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [yesButtonSize, setYesButtonSize] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [particles, setParticles] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState(0);
  const [noButtonScale, setNoButtonScale] = useState(1);
  const [noButtonRotation, setNoButtonRotation] = useState(0);
  const [letterVisible, setLetterVisible] = useState(false);
  const obsesionAudioRef = useRef(null);
  const samAudioRef = useRef(null);
  const FADE_DURATION_MS = 2000;
  const [hoverHearts] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 20 + Math.random() * 40,
      rotation: Math.random() * 360,
      duration: 4 + Math.random() * 4,
      delay: Math.random() * 2,
    }))
  );

  const languages = [
    {
      text: 'Will you be my Valentine?',
      lang: 'English',
    },
    {
      text: 'Veux-tu être ma Valentine?',
      lang: 'Français',
    },
    {
      text: '¿Quieres ser mi San Valentin?',
      lang: 'Español',
      // Special spicy Mexican vibe
      fontFamily: "'MexicanTequila', 'MyHeart', 'Crimson Text', serif",
    },
    {
      text: 'Ще бъдеш ли моя Валентинка?',
      lang: 'Български',
    },
    {
      text: 'Θα είσαι η Βαλεντίνα μου?',
      lang: 'Ελληνικά',
    },
  ];

  useEffect(() => {
    if (stage !== 'question') {
      return;
    }

    const interval = setInterval(() => {
      setCurrentLanguage((prev) => (prev + 1) % languages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [stage, languages.length]);

  useEffect(() => {
    const obsesionAudio = new Audio(obsesionTrack);
    const samAudio = new Audio(samGellaitryTrack);

    obsesionAudio.loop = true;
    samAudio.loop = true;
    obsesionAudio.volume = 0.7;
    samAudio.volume = 0.7;

    obsesionAudioRef.current = obsesionAudio;
    samAudioRef.current = samAudio;

    return () => {
      obsesionAudio.pause();
      samAudio.pause();
      obsesionAudio.currentTime = 0;
      samAudio.currentTime = 0;
      obsesionAudioRef.current = null;
      samAudioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const obsesionAudio = obsesionAudioRef.current;
    const samAudio = samAudioRef.current;

    if (!obsesionAudio || !samAudio) {
      return;
    }

    const syncAudioToStage = () => {
      if (stage === 'finalCard') {
        obsesionAudio.pause();
        obsesionAudio.currentTime = 0;
        samAudio.play().catch(() => {});
        return;
      }

      samAudio.pause();
      samAudio.currentTime = 0;
      obsesionAudio.play().catch(() => {});
    };

    syncAudioToStage();

    const retryAfterInteraction = () => {
      syncAudioToStage();
    };

    window.addEventListener('pointerdown', retryAfterInteraction, { once: true });
    window.addEventListener('keydown', retryAfterInteraction, { once: true });

    return () => {
      window.removeEventListener('pointerdown', retryAfterInteraction);
      window.removeEventListener('keydown', retryAfterInteraction);
    };
  }, [stage]);

  const handleCycleLanguage = () => {
    setCurrentLanguage((prev) => (prev + 1) % languages.length);
  };

  // Generate heart particles
  const generateParticles = (count) => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      rotation: Math.random() * 360,
      scale: Math.random() * 0.5 + 0.5,
      duration: Math.random() * 2 + 2,
    }));
    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 4000);
  };

  const handleCupidClick = () => {
    setCupidClicked(true);

    // let cupid/heart crossfade finish before envelope starts
    const startEnvelopeDelay = FADE_DURATION_MS + 400;

    setTimeout(() => {
      setShowEnvelope(true);
      generateParticles(15);

      // Envelope opening sequence relative to envelope appearance
      setTimeout(() => {
        setEnvelopeOpened(true);
      }, 800);

      setTimeout(() => {
        setStage('question');
        setShowEnvelope(false);
        setEnvelopeOpened(false);
      }, 2200);
    }, startEnvelopeDelay);
  };

  const handleNoHover = () => {
    // Much more extreme teleportation
    const newX = Math.random() * 120 - 60; // Wider range
    const newY = Math.random() * 120 - 60;
    const newRotation = Math.random() * 720 - 360; // Wild rotation
    const newScale = Math.random() * 0.5 + 0.7; // Random scaling

    setNoButtonPosition({ x: newX, y: newY });
    setNoButtonRotation(newRotation);
    setNoButtonScale(newScale);
    generateParticles(8);
  };

  const handleNoClick = () => {
    setNoClickCount((prev) => prev + 1);

    // Even crazier teleportation on click
    const newX = Math.random() * 200 - 100;
    const newY = Math.random() * 200 - 100;
    const newRotation = Math.random() * 1080 - 540;
    const newScale = Math.random() * 0.7 + 0.5;

    setNoButtonPosition({ x: newX, y: newY });
    setNoButtonRotation(newRotation);
    setNoButtonScale(newScale);
    generateParticles(12);

    if (noClickCount >= 2) {
      if (Math.random() < 0.5) {
        // Replace with yes button
        setYesButtonSize((prev) => prev * 1.5);
      } else {
        // Make yes button larger
        setYesButtonSize((prev) => prev * 1.3);
      }
    }
  };

  const handleYesClick = () => {
    setShowConfetti(true);
    generateParticles(30);
    setTimeout(() => {
      setStage('finalCard');
    }, 1500);
  };

  const handleBackToInitialFromQuestion = () => {
    setStage('initial');
    setNoClickCount(0);
    setNoButtonPosition({ x: 0, y: 0 });
    setYesButtonSize(1);
    setNoButtonScale(1);
    setNoButtonRotation(0);
    setCupidClicked(false);
    setShowEnvelope(false);
    setEnvelopeOpened(false);
    setLetterVisible(false);
  };

  const handleBackToQuestionFromFinal = () => {
    setStage('question');
    setShowConfetti(false);
  };

  const handleRestartFromFinal = () => {
    setStage('initial');
    setCupidClicked(false);
    setNoClickCount(0);
    setNoButtonPosition({ x: 0, y: 0 });
    setYesButtonSize(1);
    setShowConfetti(false);
    setNoButtonScale(1);
    setNoButtonRotation(0);
    setShowEnvelope(false);
    setEnvelopeOpened(false);
    setLetterVisible(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          stage === 'finalCard'
            ? 'transparent'
            : 'linear-gradient(135deg, #fff5f7 0%, #ffe4e9 25%, #ffd4dc 50%, #ffc0cb 75%, #ffb3c1 100%)',
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Sacramento&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&display=swap');
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(5deg); }
          66% { transform: translateY(-10px) rotate(-3deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0) rotate(-180deg); opacity: 0; }
          to { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        
        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          10% { transform: scale(1.1); }
          20% { transform: scale(1); }
          30% { transform: scale(1.15); }
          40% { transform: scale(1); }
        }
        
        @keyframes confettiFall {
          0% { 
            transform: translateY(-100%) rotate(0deg); 
            opacity: 1; 
          }
          100% { 
            transform: translateY(100vh) rotate(720deg); 
            opacity: 0.3; 
          }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes slideInFromTop {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes languageFade {
          0% { opacity: 0; transform: translateY(20px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-20px); }
        }
        
        @keyframes floatHeartMonogram {
          0% { 
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 0.15;
          }
          25% { 
            transform: translate(30px, -40px) rotate(90deg) scale(1.1);
            opacity: 0.25;
          }
          50% { 
            transform: translate(-20px, -80px) rotate(180deg) scale(0.9);
            opacity: 0.2;
          }
          75% { 
            transform: translate(40px, -120px) rotate(270deg) scale(1.05);
            opacity: 0.15;
          }
          100% { 
            transform: translate(0, -160px) rotate(360deg) scale(1);
            opacity: 0;
          }
        }
        
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(220, 53, 69, 0.4); }
          50% { box-shadow: 0 0 40px rgba(220, 53, 69, 0.7); }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
        
        @keyframes gentleBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes envelopeOpen {
          0% { transform: rotateX(0deg); transform-origin: top; }
          100% { transform: rotateX(-180deg); transform-origin: top; }
        }
        
        @keyframes letterSlideOut {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          100% { transform: translateY(-150px) scale(1); opacity: 1; }
        }
        
        @keyframes envelopeFadeOut {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.8); }
        }
        
        @keyframes letterUnfold {
          0% { transform: scaleY(0.3) translateY(-150px); }
          50% { transform: scaleY(0.7) translateY(-150px); }
          100% { transform: scaleY(1) translateY(-150px); }
        }
        
        .vintage-border {
          border: 3px solid rgba(156, 39, 76, 0.3);
          border-image: repeating-linear-gradient(
            45deg,
            rgba(156, 39, 76, 0.3),
            rgba(156, 39, 76, 0.3) 10px,
            transparent 10px,
            transparent 20px
          ) 1;
        }
        
        .paper-texture {
          background-image: 
            repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.01) 0px,
              transparent 1px,
              transparent 2px,
              rgba(0, 0, 0, 0.01) 3px
            ),
            repeating-linear-gradient(
              90deg,
              rgba(0, 0, 0, 0.01) 0px,
              transparent 1px,
              transparent 2px,
              rgba(0, 0, 0, 0.01) 3px
            );
        }
        
        .checkered-cloth {
          background-image:
            repeating-linear-gradient(
              0deg,
              rgba(220, 53, 69, 0.12),
              rgba(220, 53, 69, 0.12) 40px,
              transparent 40px,
              transparent 80px
            ),
            repeating-linear-gradient(
              90deg,
              rgba(220, 53, 69, 0.12),
              rgba(220, 53, 69, 0.12) 40px,
              transparent 40px,
              transparent 80px
            ),
            linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 250, 250, 0.95));
        }
        
        .ornate-divider {
          width: 150px;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(156, 39, 76, 0.5) 20%,
            rgba(156, 39, 76, 0.8) 50%,
            rgba(156, 39, 76, 0.5) 80%,
            transparent
          );
          position: relative;
        }
        
        .ornate-divider::before,
        .ornate-divider::after {
          content: '❦';
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(156, 39, 76, 0.6);
          font-size: 16px;
        }
        
        .ornate-divider::before { left: -20px; }
        .ornate-divider::after { right: -20px; }
        
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 40px rgba(156, 39, 76, 0.2);
        }
        
        .image-hover {
          transition: all 0.4s ease-out;
          position: relative;
          overflow: hidden;
        }
        
        .image-hover::after {
          content: '';
          position: 'absolute';
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(220, 53, 69, 0.1), rgba(156, 39, 76, 0.1));
          opacity: 0;
          transition: opacity 0.4s ease-out;
        }
        
        .image-hover:hover {
          transform: scale(1.05) rotate(1deg);
          box-shadow: 0 15px 35px rgba(156, 39, 76, 0.25);
        }
        
        .image-hover:hover::after {
          opacity: 1;
        }
        
        .heart-monogram {
          position: absolute;
          font-size: 40px;
          opacity: 0.15;
          pointer-events: none;
          animation: floatHeartMonogram 15s ease-in-out infinite;
        }

        /* Mobile tweaks */
        @media (max-width: 600px) {
          .title-main {
            font-size: clamp(1.6rem, 6.5vw, 2.5rem);
          }

          .title-question-name {
            font-size: clamp(1.4rem, 6vw, 2rem);
          }

          .title-final-main {
            font-size: clamp(1.6rem, 6.5vw, 2.5rem);
          }

          .title-footer-line {
            font-size: clamp(1rem, 3.6vw, 1.5rem);
          }

          .title-footer-signature {
            font-size: clamp(1.1rem, 4vw, 1.8rem);
          }

          .question-card {
            width: min(92vw, 340px);
            padding: 24px 14px;
            margin: 0 auto;
          }

          .final-wrapper {
            padding: 16px 10px;
          }

          .final-inner {
            width: min(92vw, 560px);
            border-radius: 18px;
            margin: 0 auto;
          }

          body {
            background: none;
          }
        }
      `}</style>

      {/* Floating heart particles (Lucide hearts) */}
      {particles.map((particle) => (
        <Heart
          key={particle.id}
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            color: 'rgba(220, 53, 69, 0.6)',
            fill: 'rgba(220, 53, 69, 0.4)',
            animation: `confettiFall ${particle.duration}s ease-out forwards`,
            transform: `rotate(${particle.rotation}deg) scale(${particle.scale})`,
            pointerEvents: 'none',
            zIndex: 1000,
          }}
          size={24}
        />
      ))}

      {/* Heart Monogram Background */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={`monogram-${i}`}
          className="heart-monogram"
          style={{
            left: `${(i * 13) % 100}%`,
            top: `${(i * 37) % 100}%`,
            animationDelay: `${i * 0.8}s`,
            color: [
              'rgba(220, 53, 69, 0.08)',
              'rgba(255, 192, 203, 0.1)',
              'rgba(156, 39, 76, 0.06)',
            ][i % 3],
          }}
        >
          ❤
        </div>
      ))}

      {/* Confetti for yes button */}
      {showConfetti &&
        Array.from({ length: 50 }).map((_, i) => (
          <div
            key={`confetti-${i}`}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: -20,
              width: Math.random() * 10 + 5,
              height: Math.random() * 10 + 5,
              background: ['#dc3545', '#ff6b9d', '#ffc0cb', '#ff69b4'][
                Math.floor(Math.random() * 4)
              ],
              animation: `confettiFall ${Math.random() * 3 + 2}s ease-out forwards`,
              animationDelay: `${Math.random() * 0.5}s`,
              borderRadius: Math.random() > 0.5 ? '50%' : '0',
              pointerEvents: 'none',
              zIndex: 1000,
            }}
          />
        ))}

      {/* Stage 1: Initial Cupid */}
      {stage === 'initial' && (
        <InitialStage
          hoverHearts={hoverHearts}
          cupidClicked={cupidClicked}
          showEnvelope={showEnvelope}
          envelopeOpened={envelopeOpened}
          FADE_DURATION_MS={FADE_DURATION_MS}
          onCupidClick={handleCupidClick}
          onCupidHover={generateParticles}
        />
      )}

      {/* Stage 2: Question */}
      {stage === 'question' && (
        <QuestionStage
          languages={languages}
          currentLanguage={currentLanguage}
          yesButtonSize={yesButtonSize}
          noClickCount={noClickCount}
          noButtonPosition={noButtonPosition}
          noButtonScale={noButtonScale}
          noButtonRotation={noButtonRotation}
          onYesClick={handleYesClick}
          onNoHover={handleNoHover}
          onNoClick={handleNoClick}
          onBack={handleBackToInitialFromQuestion}
          onSparkle={generateParticles}
          onCycleLanguage={handleCycleLanguage}
        />
      )}

      {/* Stage 3: Final Card */}
      {stage === 'finalCard' && (
        <FinalCardStage
          onBackToQuestion={handleBackToQuestionFromFinal}
          onRestart={handleRestartFromFinal}
          onSparkle={generateParticles}
        />
      )}
    </div>
  );
}

