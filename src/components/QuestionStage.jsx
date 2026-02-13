import React, { useState, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import cupid1Img from '../../cupid1.png';

export default function QuestionStage({
  languages,
  currentLanguage,
  yesButtonSize,
  noClickCount,
  noButtonPosition,
  noButtonScale,
  noButtonRotation,
  onYesClick,
  onNoHover,
  onNoClick,
  onBack,
  onSparkle,
  onCycleLanguage,
}) {
  const [randomLetters] = useState(
    Array(100).fill('').map(() => {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUV'; // Excluded X, W, Z, Y
      return letters[Math.floor(Math.random() * letters.length)];
    })
  );
  
  const [showMeet, setShowMeet] = useState(0);
  const [cupidClickCount, setCupidClickCount] = useState(0);
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const words = ['meet', 'fuck', 'piss on', 'cum on', 'lick'];

  // Responsive sizing for mobile
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth <= 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const carouselFontSize = isMobile ? '1.3rem' : '4rem';
  const carouselHeight = isMobile ? '64px' : '120px';
  const carouselMinWidth = isMobile ? '36px' : '80px';
  const cardPadding = isMobile ? '26px 14px' : '80px 60px';
  const cardMaxWidth = isMobile ? '340px' : '450px';
  const messageFontSize = isMobile ? '0.95rem' : '2.2rem';
  const meetFontSize = isMobile ? '1.2rem' : '2.8rem';
  const letterSpacing = isMobile ? '1px' : '5px';
  const babyDollSize = isMobile ? '0.9rem' : '2rem';

  useEffect(() => {
    const meetInterval = setInterval(() => {
      setShowMeet(prev => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(meetInterval);
  }, []);

  const handleFloatingCupidClick = () => {
    if (secretUnlocked) return;

    setCupidClickCount((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        setSecretUnlocked(true);
      }
      return next;
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: isMobile ? '0' : '20px',
        animation: 'fadeIn 0.8s ease-out',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      <style>{`
        @keyframes cupidWander {
          0% { transform: translate(6vw, 12vh) rotate(0deg); }
          20% { transform: translate(72vw, 16vh) rotate(6deg); }
          40% { transform: translate(56vw, 58vh) rotate(-8deg); }
          60% { transform: translate(14vw, 72vh) rotate(5deg); }
          80% { transform: translate(78vw, 36vh) rotate(-5deg); }
          100% { transform: translate(22vw, 8vh) rotate(2deg); }
        }
      `}</style>

      {!secretUnlocked && (
        <button
          onClick={handleFloatingCupidClick}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: isMobile ? '68px' : '92px',
            height: isMobile ? '68px' : '92px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            padding: 0,
            zIndex: 1200,
            animation: 'cupidWander 18s ease-in-out infinite alternate',
            filter: 'drop-shadow(0 6px 16px rgba(220, 53, 69, 0.3))',
          }}
          aria-label="Catch cupid"
        >
          <img
            src={cupid1Img}
            alt="Floating Cupid"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              pointerEvents: 'none',
            }}
          />
        </button>
      )}

      <div
        className="paper-texture question-card"
        style={{
          background: 'rgba(255, 255, 255, 0.98)',
          padding: isMobile ? '24px 14px' : 'clamp(40px, 8vw, 80px)',
          borderRadius: '20px',
          maxWidth: isMobile ? '340px' : '600px',
          width: isMobile ? '92%' : '100%',
          boxShadow:
            '0 20px 60px rgba(156, 39, 76, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
          border: '4px solid rgba(156, 39, 76, 0.2)',
          position: 'relative',
          animation: 'scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          marginTop: 0,
        }}
      >

        {/* Sparkles decoration */}
        {[1, 2, 3, 4].map((i) => (
          <Sparkles
            key={i}
            size={20}
            style={{
              position: 'absolute',
              top: `${20 + i * 15}%`,
              left: i % 2 === 0 ? '5%' : '95%',
              color: '#ff6b9d',
              opacity: 0.6,
              animation: `sparkle ${2 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}

        <Heart
          size={60}
          style={{
            color: '#dc3545',
            fill: '#dc3545',
            margin: '0 auto 30px',
            display: 'block',
            animation: 'heartBeat 1.5s ease-in-out infinite',
            filter: 'drop-shadow(0 2px 5px rgba(220, 53, 69, 0.2))',
          }}
        />

        <h2
          className="title-question-name"
          style={{
            fontFamily: "'AishaValentine', 'Faith', cursive",
            fontSize: 'clamp(2rem, 6vw, 3.5rem)',
            color: '#9c274c',
            textAlign: 'center',
            marginBottom: '20px',
            lineHeight: 1.3,
            textShadow: '1px 1px 2px rgba(156, 39, 76, 0.1)',
            animation: 'gentleBounce 2s ease-in-out infinite',
          }}
        >
          Alicia Palomichi
        </h2>

        <div className="ornate-divider" style={{ margin: '30px auto' }} />

        {/* Multilingual question with fade effect */}
        <div
          onClick={onCycleLanguage}
          style={{
            position: 'relative',
            minHeight: isMobile ? '66px' : '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: isMobile ? '36px' : '50px',
            cursor: 'pointer',
          }}
        >
          {languages.map((lang, index) => (
            <p
              key={index}
              style={{
                position: 'absolute',
                fontFamily: lang.fontFamily || "'MyHeart', 'Crimson Text', serif",
                fontSize: isMobile ? '1.22rem' : 'clamp(1.8rem, 4.2vw, 2.4rem)',
                color: '#5a1a2e',
                textAlign: 'center',
                fontWeight: 600,
                opacity: currentLanguage === index ? 1 : 0,
                transition: 'opacity 0.8s ease-in-out',
                width: '100%',
                margin: 0,
              }}
            >
              {lang.text}
            </p>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            gap: isMobile ? '12px' : '30px',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            position: 'relative',
            minHeight: isMobile ? '76px' : '100px',
          }}
        >
          <button
            onClick={onYesClick}
            style={{
              fontFamily: "'LoveBuble', 'Crimson Text', serif",
              fontSize: `${(isMobile ? 0.95 : 1.2) * yesButtonSize}rem`,
              padding: `${(isMobile ? 10 : 15) * yesButtonSize}px ${(isMobile ? 24 : 40) * yesButtonSize}px`,
              background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              fontWeight: 700,
              boxShadow: '0 8px 20px rgba(220, 53, 69, 0.4)',
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: `scale(${yesButtonSize})`,
              zIndex: 10,
              letterSpacing: '1px',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = `scale(${yesButtonSize * 1.1}) rotate(5deg)`;
              e.target.style.boxShadow = '0 15px 35px rgba(220, 53, 69, 0.6)';
              onSparkle(8);
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = `scale(${yesButtonSize})`;
              e.target.style.boxShadow = '0 8px 20px rgba(220, 53, 69, 0.4)';
            }}
          >
            Yes! 💕
          </button>

          {noClickCount < 3 && (
            <button
              onMouseEnter={onNoHover}
              onClick={onNoClick}
              style={{
                fontFamily: "'BabyDoll', 'Crimson Text', serif",
                fontSize: isMobile ? '0.9rem' : '1.2rem',
                padding: isMobile ? '10px 24px' : '15px 40px',
                background: 'linear-gradient(135deg, #6c757d 0%, #5a6268 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                fontWeight: 700,
                boxShadow: '0 8px 20px rgba(108, 117, 125, 0.3)',
                transition: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                transform: `translate(${noButtonPosition.x}px, ${noButtonPosition.y}px) rotate(${noButtonRotation}deg) scale(${noButtonScale})`,
                letterSpacing: '1px',
              }}
              onMouseOver={(e) => {
                e.target.style.boxShadow =
                  '0 12px 30px rgba(108, 117, 125, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.boxShadow =
                  '0 8px 20px rgba(108, 117, 125, 0.3)';
              }}
            >
              No
            </button>
          )}
        </div>
      </div>

      

      {secretUnlocked && (
        <div
          style={{
            marginTop: isMobile ? '120px' : '200px',
            minHeight: isMobile ? '72vh' : '100vh',
            height: isMobile ? '72vh' : '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: 0,
            background: 'linear-gradient(135deg, #3d1f2e 0%, #2a1420 50%, #3d1f2e 100%)',
            width: '100%',
            marginLeft: 0,
            overflow: 'hidden',
          }}
        >
          {/* Top Carousel - Right to Left */}
          <div
            style={{
              width: '100%',
              overflow: 'hidden',
              position: 'absolute',
              top: 0,
              left: 0,
              height: carouselHeight,
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0, 0, 0, 0.4)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '20px',
                animation: 'scrollRight 60s linear infinite',
                whiteSpace: 'nowrap',
                minWidth: 'max-content',
              }}
            >
              {randomLetters.map((letter, i) => (
                <span
                  key={`first-${i}`}
                  style={{
                    fontFamily: "'FortyEightWays', 'Arial', sans-serif",
                    fontSize: carouselFontSize,
                    color: '#ffc0cb',
                    minWidth: carouselMinWidth,
                    textAlign: 'center',
                    textShadow: '0 4px 12px rgba(255, 192, 203, 0.4)',
                    letterSpacing: letterSpacing,
                  }}
                >
                  {letter}
                </span>
              ))}
              {randomLetters.map((letter, i) => (
                <span
                  key={`second-${i}`}
                  style={{
                    fontFamily: "'FortyEightWays', 'Arial', sans-serif",
                    fontSize: carouselFontSize,
                    color: '#ffc0cb',
                    minWidth: carouselMinWidth,
                    textAlign: 'center',
                    textShadow: '0 4px 12px rgba(255, 192, 203, 0.4)',
                    letterSpacing: letterSpacing,
                  }}
                >
                  {letter}
                </span>
              ))}
            </div>
          </div>

          {/* Central Secret Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.99) 0%, rgba(255, 250, 252, 0.99) 100%)',
              padding: cardPadding,
              borderRadius: '30px',
              maxWidth: cardMaxWidth,
              width: isMobile ? '92%' : '100%',
              boxShadow:
                '0 50px 120px rgba(220, 53, 69, 0.35), 0 20px 60px rgba(156, 39, 76, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
              border: '4px solid rgba(156, 39, 76, 0.25)',
              position: 'relative',
              zIndex: 10,
              textAlign: 'center',
              animation: 'scaleIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <div style={{ minHeight: isMobile ? '84px' : '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div
                style={{
                  fontSize: messageFontSize,
                  lineHeight: 1.8,
                  letterSpacing: '-0.3px',
                }}
              >
                <span
                  style={{
                    fontFamily: "'BabyDoll', sans-serif",
                    color: '#9c274c',
                    fontWeight: 600,
                    fontSize: babyDollSize,
                    display: 'block',
                    marginBottom: '15px',
                  }}
                >
                  i can't wait to
                </span>
                <span
                  style={{
                    fontFamily: "'LoveBuble', 'Arial', sans-serif",
                    color: '#dc3545',
                    fontSize: meetFontSize,
                    fontWeight: 700,
                    textShadow: '0 4px 8px rgba(220, 53, 69, 0.25)',
                  }}
                >
                  {words[showMeet]} you
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Carousel - Left to Right */}
          <div
            style={{
              width: '100%',
              overflow: 'hidden',
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: carouselHeight,
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0, 0, 0, 0.4)',
              boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '20px',
                animation: 'scrollRight 60s linear infinite',
                whiteSpace: 'nowrap',
                minWidth: 'max-content',
              }}
            >
              {randomLetters.map((letter, i) => (
                <span
                  key={`first-${i}`}
                  style={{
                    fontFamily: "'FortyEightWays', 'Arial', sans-serif",
                    fontSize: carouselFontSize,
                    color: '#ffc0cb',
                    minWidth: carouselMinWidth,
                    textAlign: 'center',
                    textShadow: '0 4px 12px rgba(255, 192, 203, 0.4)',
                    letterSpacing: letterSpacing,
                  }}
                >
                  {letter}
                </span>
              ))}
              {randomLetters.map((letter, i) => (
                <span
                  key={`second-${i}`}
                  style={{
                    fontFamily: "'FortyEightWays', 'Arial', sans-serif",
                    fontSize: carouselFontSize,
                    color: '#ffc0cb',
                    minWidth: carouselMinWidth,
                    textAlign: 'center',
                    textShadow: '0 4px 12px rgba(255, 192, 203, 0.4)',
                    letterSpacing: letterSpacing,
                  }}
                >
                  {letter}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

