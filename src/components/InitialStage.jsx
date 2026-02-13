import React from 'react';
import { Heart } from 'lucide-react';
import cupid1Img from '../../cupid1.png';
import cupid2Img from '../../cupid2.png';
import heart1Img from '../../heart1.PNG';
import heart2Img from '../../heart2.png';

// Initial stage: cupid + envelope intro
export default function InitialStage({
  hoverHearts,
  cupidClicked,
  showEnvelope,
  envelopeOpened,
  FADE_DURATION_MS,
  onCupidClick,
  onCupidHover,
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        animation: 'fadeIn 1s ease-out',
        position: 'relative',
      }}
    >
      {/* Decorative floating heart images (heart1 → heart2 after cupid click) */}
      {hoverHearts.map((heart) => (
        <React.Fragment key={heart.id}>
          {/* heart1 fades out */}
          <img
            src={heart1Img}
            alt="Floating heart"
            style={{
              position: 'absolute',
              top: `${heart.y}%`,
              left: `${heart.x}%`,
              width: `${heart.size}px`,
              height: 'auto',
              transform: `rotate(${heart.rotation}deg)`,
              opacity: cupidClicked ? 0 : 0.9,
              animation: `float ${heart.duration}s ease-in-out ${heart.delay}s infinite`,
              pointerEvents: 'none',
              transition: `opacity ${FADE_DURATION_MS}ms ease-in-out`,
            }}
          />
          {/* heart2 fades in on top */}
          <img
            src={heart2Img}
            alt="Floating heart"
            style={{
              position: 'absolute',
              top: `${heart.y}%`,
              left: `${heart.x}%`,
              width: `${heart.size}px`,
              height: 'auto',
              transform: `rotate(${heart.rotation}deg) scale(1.6)`,
              opacity: cupidClicked ? 0.9 : 0,
              animation: `float ${heart.duration}s ease-in-out ${heart.delay}s infinite`,
              pointerEvents: 'none',
              transition: `opacity ${FADE_DURATION_MS}ms ease-in-out`,
            }}
          />
        </React.Fragment>
      ))}

      <h1
        className="title-main"
        style={{
          fontFamily: "'Faith', 'Sacramento', cursive",
          fontSize: 'clamp(2.5rem, 8vw, 5rem)',
          color: '#9c274c',
          textAlign: 'center',
          marginBottom: '40px',
          animation: 'slideInFromTop 0.8s ease-out, gentleBounce 3s ease-in-out 1s infinite',
          textShadow: '3px 3px 6px rgba(156, 39, 76, 0.15)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        A Special Message...
      </h1>

      <div
        className="ornate-divider"
        style={{ marginBottom: '30px auto', animation: 'fadeIn 1.2s ease-out 0.5s backwards' }}
      />

      {/* Envelope Animation Container */}
      <div
        style={{
          position: 'relative',
          width: '400px',
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: '1000px',
          zIndex: 2,
        }}
      >
        {/* Cupid Image (fades out when clicked) */}
        <div
          onClick={onCupidClick}
          onMouseEnter={() => !cupidClicked && onCupidHover(5)}
          style={{
            cursor: cupidClicked ? 'default' : 'pointer',
            opacity: showEnvelope ? 0 : 1,
            transform: cupidClicked ? 'scale(0.8)' : 'scale(1)',
            transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
            animation: cupidClicked ? 'none' : 'float 3s ease-in-out infinite',
            filter: 'drop-shadow(0 10px 25px rgba(156, 39, 76, 0.2))',
            position: 'absolute',
            zIndex: cupidClicked ? 0 : 2,
          }}
          onMouseOver={(e) => {
            if (!cupidClicked) {
              e.currentTarget.style.filter =
                'drop-shadow(0 15px 35px rgba(220, 53, 69, 0.4)) brightness(1.1)';
              e.currentTarget.style.transform = 'scale(1.05) rotate(2deg)';
            }
          }}
          onMouseOut={(e) => {
            if (!cupidClicked) {
              e.currentTarget.style.filter =
                'drop-shadow(0 10px 25px rgba(156, 39, 76, 0.2))';
              e.currentTarget.style.transform = 'scale(1)';
            }
          }}
        >
          <img
            src={cupidClicked ? cupid2Img : cupid1Img}
            alt="Cupid"
            style={{
              width: '300px',
              height: 'auto',
              position: 'relative',
              zIndex: 1,
              opacity: 1,
              transition:
                'transform 800ms cubic-bezier(0.34, 1.56, 0.64, 1), filter 800ms ease-out',
            }}
          />
        </div>

        {/* Envelope Animation */}
        {showEnvelope && (
          <div
            style={{
              position: 'absolute',
              width: 'min(340px, 90vw)',
              height: 'min(240px, 60vh)',
              animation: 'scaleIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
              zIndex: 3,
            }}
          >
            {/* Envelope Body with written message */}
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #fff5f7 0%, #ffe4e9 100%)',
                border: '4px solid rgba(156, 39, 76, 0.3)',
                borderRadius: '8px',
                boxShadow: '0 15px 40px rgba(156, 39, 76, 0.2)',
                overflow: 'hidden',
                opacity: envelopeOpened ? 0 : 1,
                transition: 'opacity 0.5s ease-out 1.5s',
              }}
            >
              {/* Envelope decorative pattern */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage:
                    'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(156, 39, 76, 0.03) 10px, rgba(156, 39, 76, 0.03) 20px)',
                  pointerEvents: 'none',
                }}
              />

              {/* Wax seal */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '18px',
                  right: '18px',
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #dc3545 0%, #9c274c 100%)',
                  border: '3px solid rgba(156, 39, 76, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow:
                    '0 4px 12px rgba(220, 53, 69, 0.4), inset 0 2px 4px rgba(0, 0, 0, 0.2)',
                }}
              >
                <Heart size={24} style={{ color: 'white', fill: 'white' }} />
              </div>

              {/* Handwritten envelope text */}
              <div
                style={{
                  position: 'absolute',
                  top: '32%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '82%',
                  textAlign: 'center',
                  color: '#5a1a2e',
                  fontFamily: "'Faith', cursive",
                  fontSize: '1.3rem',
                  lineHeight: 1.5,
                }}
              >
                <div style={{ marginBottom: 6 }}>For Alicia 💌</div>
                <div
                  style={{
                    fontFamily: "'MyHeart', 'Crimson Text', serif",
                    fontSize: '1.12rem',
                  }}
                >
                  I have a question for you...
                </div>
              </div>
            </div>

            {/* Envelope Flap (opens) */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '50%',
                background: 'linear-gradient(135deg, #ffc0cb 0%, #ffb3c1 100%)',
                border: '4px solid rgba(156, 39, 76, 0.3)',
                borderBottom: 'none',
                borderRadius: '8px 8px 0 0',
                transformOrigin: 'bottom center',
                animation: envelopeOpened
                  ? 'envelopeOpen 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
                  : 'none',
                boxShadow: '0 -5px 15px rgba(156, 39, 76, 0.15)',
                zIndex: 5,
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              }}
            >
              {/* Flap inner decoration */}
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80%',
                  height: '2px',
                  background:
                    'linear-gradient(90deg, transparent, rgba(156, 39, 76, 0.2) 50%, transparent)',
                }}
              />
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

