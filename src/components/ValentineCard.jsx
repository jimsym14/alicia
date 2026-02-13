import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Heart, Pause, Play, RotateCcw, SkipBack, Volume2, VolumeX } from 'lucide-react';
import InitialStage from './InitialStage.jsx';
import QuestionStage from './QuestionStage.jsx';
import FinalCardStage from './FinalCardStage.jsx';
import obsesionTrack from '../../media/songs/Aventura - Obsesion.mp3';
import samGellaitryTrack from '../../media/songs/Sam Gellaitry - Assumptions (Slowed).mp3';

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
  const [isMuted, setIsMuted] = useState(false);
  const [isMusicPaused, setIsMusicPaused] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0.7);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);
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

  const confettiActive = showConfetti || stage === 'finalCard';

  const confettiPieces = useMemo(() => {
    if (!confettiActive) return [];

    const total = 50;
    const columns = 10;
    const rows = Math.ceil(total / columns);

    return Array.from({ length: total }, (_, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      const baseX = ((column + 0.5) / columns) * 100;
      const jitterX = (Math.random() - 0.5) * 6;
      const spawnYOffset = row * 8;

      return {
        id: `confetti-${index}-${Date.now()}`,
        left: Math.max(0, Math.min(100, baseX + jitterX)),
        top: -20 - spawnYOffset,
        size: Math.random() * 8 + 6,
        color: ['#dc3545', '#ff6b9d', '#ffc0cb', '#ff69b4'][
          Math.floor(Math.random() * 4)
        ],
        duration: Math.random() * 2.2 + 2.2,
        delay: Math.random() * 0.6,
        isRound: Math.random() > 0.5,
      };
    });
  }, [confettiActive]);

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
    obsesionAudio.preload = 'auto';
    samAudio.preload = 'auto';
    obsesionAudio.volume = volumeLevel;
    samAudio.volume = volumeLevel;
    obsesionAudio.muted = isMuted;
    samAudio.muted = isMuted;

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

    let isCancelled = false;

    const tryPlay = async (audio) => {
      try {
        await audio.play();
        return true;
      } catch {
        return false;
      }
    };

    const syncAudioToStage = async () => {
      if (isMusicPaused) {
        obsesionAudio.pause();
        samAudio.pause();
        return;
      }

      if (stage === 'finalCard') {
        obsesionAudio.pause();
        obsesionAudio.currentTime = 0;
        const played = await tryPlay(samAudio);
        if (!played && !isMuted && !isCancelled) {
          samAudio.muted = true;
          const mutedAutoplayWorked = await tryPlay(samAudio);
          if (mutedAutoplayWorked) {
            setIsMuted(true);
          }
        }
        return;
      }

      samAudio.pause();
      samAudio.currentTime = 0;
      const played = await tryPlay(obsesionAudio);
      if (!played && !isMuted && !isCancelled) {
        obsesionAudio.muted = true;
        const mutedAutoplayWorked = await tryPlay(obsesionAudio);
        if (mutedAutoplayWorked) {
          setIsMuted(true);
        }
      }
    };

    void syncAudioToStage();

    const retryAfterInteraction = () => {
      void syncAudioToStage();
    };

    const retryOnFocus = () => {
      void syncAudioToStage();
    };

    const retryOnVisibility = () => {
      if (document.visibilityState === 'visible') {
        void syncAudioToStage();
      }
    };

    window.addEventListener('pointerdown', retryAfterInteraction, { once: true });
    window.addEventListener('keydown', retryAfterInteraction, { once: true });
    window.addEventListener('focus', retryOnFocus);
    document.addEventListener('visibilitychange', retryOnVisibility);

    return () => {
      isCancelled = true;
      window.removeEventListener('pointerdown', retryAfterInteraction);
      window.removeEventListener('keydown', retryAfterInteraction);
      window.removeEventListener('focus', retryOnFocus);
      document.removeEventListener('visibilitychange', retryOnVisibility);
    };
  }, [stage, isMusicPaused, isMuted]);

  useEffect(() => {
    if (obsesionAudioRef.current) {
      obsesionAudioRef.current.muted = isMuted;
    }
    if (samAudioRef.current) {
      samAudioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    if (obsesionAudioRef.current) {
      obsesionAudioRef.current.volume = volumeLevel;
    }
    if (samAudioRef.current) {
      samAudioRef.current.volume = volumeLevel;
    }
  }, [volumeLevel]);

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const handleTogglePauseMusic = () => {
    setIsMusicPaused((prev) => !prev);
  };

  const handleVolumeChange = (event) => {
    const nextVolume = Number(event.target.value);
    setVolumeLevel(nextVolume);
    if (isMuted && nextVolume > 0) {
      setIsMuted(false);
    }
  };

  const getActiveAudio = () =>
    stage === 'finalCard' ? samAudioRef.current : obsesionAudioRef.current;

  useEffect(() => {
    const activeAudio = getActiveAudio();

    if (!activeAudio) {
      setPlaybackTime(0);
      setTrackDuration(0);
      return;
    }

    const syncProgress = () => {
      setPlaybackTime(activeAudio.currentTime || 0);
      setTrackDuration(Number.isFinite(activeAudio.duration) ? activeAudio.duration : 0);
    };

    syncProgress();

    activeAudio.addEventListener('timeupdate', syncProgress);
    activeAudio.addEventListener('loadedmetadata', syncProgress);
    activeAudio.addEventListener('durationchange', syncProgress);

    return () => {
      activeAudio.removeEventListener('timeupdate', syncProgress);
      activeAudio.removeEventListener('loadedmetadata', syncProgress);
      activeAudio.removeEventListener('durationchange', syncProgress);
    };
  }, [stage]);

  const handleSeek = (event) => {
    const nextTime = Number(event.target.value);
    const activeAudio = getActiveAudio();
    if (!activeAudio) return;
    activeAudio.currentTime = nextTime;
    setPlaybackTime(nextTime);
  };

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${secs}`;
  };

  const handleGlobalBack = () => {
    if (stage === 'finalCard') {
      handleBackToQuestionFromFinal();
      return;
    }

    if (stage === 'question') {
      handleBackToInitialFromQuestion();
    }
  };

  const handleGlobalRestart = () => {
    handleRestartFromFinal();
  };

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
        paddingTop: 'clamp(108px, 16vw, 148px)',
        boxSizing: 'border-box',
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

        .top-nav-pill {
          position: fixed;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1900;
          width: min(96vw, 920px);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 8px;
          padding: 10px 12px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.75);
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 14px 28px rgba(0, 0, 0, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.9);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .top-nav-pill:hover {
          transform: translateX(-50%) translateY(-1px);
          box-shadow: 0 18px 30px rgba(0, 0, 0, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.92);
        }

        .top-nav-btn {
          border: 1px solid rgba(156, 39, 76, 0.2);
          background: #ffffff;
          color: #9c274c;
          border-radius: 999px;
          height: 36px;
          padding: 0 14px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'Crimson Text', serif;
          font-size: 0.92rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          box-shadow: 0 4px 10px rgba(156, 39, 76, 0.1);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .nav-btn-label {
          display: inline;
        }

        .top-nav-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 7px 14px rgba(156, 39, 76, 0.16);
        }

        .top-nav-slider-wrap {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ffffff;
          border: 1px solid rgba(156, 39, 76, 0.15);
          border-radius: 999px;
          height: 36px;
          padding: 0 10px;
          box-shadow: 0 4px 10px rgba(156, 39, 76, 0.08);
        }

        .top-nav-progress {
          width: min(30vw, 220px);
          min-width: 120px;
          accent-color: #dc3545;
          cursor: pointer;
        }

        .top-nav-volume {
          width: min(16vw, 110px);
          min-width: 72px;
          accent-color: #dc3545;
          cursor: pointer;
        }

        .top-nav-time {
          font-family: 'Crimson Text', serif;
          font-size: 0.82rem;
          color: #9c274c;
          min-width: 74px;
          text-align: right;
          font-weight: 700;
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

          .top-nav-pill {
            top: 10px;
            padding: 8px 9px;
            gap: 6px;
            width: min(96vw, 430px);
          }

          .top-nav-btn {
            height: 32px;
            padding: 0 10px;
            font-size: 0.78rem;
          }

          .nav-btn-label {
            display: none;
          }

          .top-nav-slider-wrap {
            height: 32px;
            padding: 0 8px;
          }

          .top-nav-progress {
            width: min(26vw, 108px);
            min-width: 72px;
          }

          .top-nav-volume {
            width: min(20vw, 86px);
            min-width: 58px;
          }

          .top-nav-time {
            display: none;
          }

          body {
            background: none;
          }
        }
      `}</style>

      <div className="top-nav-pill" role="navigation" aria-label="Top navigation controls">
        <button className="top-nav-btn" onClick={handleGlobalBack} aria-label="Go back">
          <SkipBack size={14} />
          <span className="nav-btn-label">Back</span>
        </button>
        <button className="top-nav-btn" onClick={handleGlobalRestart} aria-label="Restart">
          <RotateCcw size={14} />
          <span className="nav-btn-label">Restart</span>
        </button>
        <button className="top-nav-btn" onClick={handleTogglePauseMusic} aria-label="Pause or play music">
          {isMusicPaused ? <Play size={14} /> : <Pause size={14} />}
          <span className="nav-btn-label">{isMusicPaused ? 'Play' : 'Pause'}</span>
        </button>
        <button className="top-nav-btn" onClick={handleToggleMute} aria-label="Toggle music mute">
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          <span className="nav-btn-label">{isMuted ? 'Muted' : 'Music'}</span>
        </button>
        <div className="top-nav-slider-wrap">
          <input
            className="top-nav-progress"
            type="range"
            min={0}
            max={trackDuration > 0 ? trackDuration : 1}
            step={0.1}
            value={Math.min(playbackTime, trackDuration || 1)}
            onChange={handleSeek}
            aria-label="Song progress"
          />
        </div>
        <div className="top-nav-slider-wrap">
          {isMuted ? <VolumeX size={14} color="#9c274c" /> : <Volume2 size={14} color="#9c274c" />}
          <input
            className="top-nav-volume"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volumeLevel}
            onChange={handleVolumeChange}
            aria-label="Volume control"
          />
        </div>
        <span className="top-nav-time">
          {formatTime(playbackTime)} / {formatTime(trackDuration)}
        </span>
      </div>

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
      {confettiActive &&
        confettiPieces.map((piece) => (
          <div
            key={piece.id}
            style={{
              position: 'absolute',
              left: `${piece.left}%`,
              top: piece.top,
              width: piece.size,
              height: piece.size,
              background: piece.color,
              animation: `confettiFall ${piece.duration}s linear infinite`,
              animationDelay: `${-piece.delay * piece.duration}s`,
              borderRadius: piece.isRound ? '50%' : '0',
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

