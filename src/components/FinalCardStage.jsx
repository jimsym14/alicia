import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Heart, Home } from 'lucide-react';

const photoModules = import.meta.glob(
  '../../media/lici/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  {
    eager: true,
    import: 'default',
  }
);

const videoModules = import.meta.glob(
  '../../media/**/*.{mov,MOV,mp4,MP4}',
  {
    eager: true,
    import: 'default',
  }
);

// Stage 3: section-based memories page
export default function FinalCardStage({ onBackToQuestion, onRestart, onSparkle }) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth <= 768
  );

  const photos = useMemo(
    () => {
      const orderedPhotos = Object.entries(photoModules)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([, src]) => ({ src }));

      for (let index = orderedPhotos.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        const temp = orderedPhotos[index];
        orderedPhotos[index] = orderedPhotos[randomIndex];
        orderedPhotos[randomIndex] = temp;
      }

      return orderedPhotos;
    },
    []
  );

  const videos = useMemo(
    () =>
      Object.entries(videoModules)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([, src]) => ({ src })),
    []
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className="final-wrapper"
      style={{
        minHeight: '100vh',
        padding: 0,
        animation: 'fadeIn 1s ease-out',
        position: 'relative',
        background: 'transparent',
        overflowX: 'hidden',
        paddingTop: isMobile ? '74px' : 0,
      }}
    >
      <style>{`
        .polaroid-track {
          display: flex;
          gap: 16px;
          width: max-content;
          animation: scrollRight 45s linear infinite;
        }

        .polaroid-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div
        style={{
          position: 'fixed',
          top: isMobile ? '8px' : '20px',
          left: isMobile ? 0 : '20px',
          right: isMobile ? 0 : 'auto',
          display: 'flex',
          gap: '10px',
          justifyContent: isMobile ? 'center' : 'flex-start',
          padding: isMobile ? '0 8px' : 0,
          zIndex: 1000,
        }}
      >
        <button
          onClick={onBackToQuestion}
          className="hover-lift"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: '2px solid rgba(156, 39, 76, 0.3)',
            borderRadius: '50px',
            padding: isMobile ? '10px 16px' : '12px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '6px' : '8px',
            cursor: 'pointer',
            fontFamily: "'Crimson Text', serif",
            fontSize: isMobile ? '0.95rem' : '1rem',
            color: '#9c274c',
            fontWeight: 600,
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          }}
          onMouseEnter={() => onSparkle(3)}
        >
          <ArrowLeft size={isMobile ? 18 : 20} />
          Back
        </button>

        <button
          onClick={onRestart}
          className="hover-lift"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: '2px solid rgba(156, 39, 76, 0.3)',
            borderRadius: '50px',
            padding: isMobile ? '10px 16px' : '12px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '6px' : '8px',
            cursor: 'pointer',
            fontFamily: "'Crimson Text', serif",
            fontSize: isMobile ? '0.95rem' : '1rem',
            color: '#9c274c',
            fontWeight: 600,
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          }}
          onMouseEnter={() => onSparkle(3)}
        >
          <Home size={isMobile ? 18 : 20} />
          Start Over
        </button>
      </div>

      <section
        style={{
          background: 'linear-gradient(135deg, #9c274c 0%, #dc3545 100%)',
          padding: isMobile ? '30px 14px' : '46px 24px',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <Heart
          size={isMobile ? 56 : 74}
          style={{
            color: 'white',
            fill: 'white',
            margin: '0 auto 16px',
            display: 'block',
            animation: 'heartBeat 1.5s ease-in-out infinite',
          }}
        />
        <h1
          style={{
            fontFamily: "'Sacramento', cursive",
            fontSize: isMobile ? 'clamp(2rem, 9vw, 2.7rem)' : 'clamp(2.5rem, 6vw, 4rem)',
            color: 'white',
            margin: 0,
            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.2)',
          }}
        >
          Our Love Story
        </h1>
      </section>

      <section
        className="checkered-cloth"
        style={{
          padding: isMobile ? '20px 12px 24px' : '38px 24px',
          borderTop: '1px solid rgba(156, 39, 76, 0.08)',
        }}
      >
        <div
          style={{
            maxWidth: '920px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: isMobile ? '14px' : '20px',
          }}
        >
          <h2
            style={{
              fontFamily: "'AishaValentine', 'Sacramento', cursive",
              fontSize: isMobile ? '2.1rem' : '2.8rem',
              color: '#9c274c',
              margin: 0,
              textAlign: 'center',
            }}
          >
            Some Of Our Memories
          </h2>

          {photos.length > 0 ? (
            <div
              style={{
                width: '100%',
                overflow: 'hidden',
                padding: '8px 0',
              }}
            >
              <div className="polaroid-track">
                {[...photos, ...photos].map((photo, index) => (
                  <div
                    key={`${photo.src}-${index}`}
                    style={{
                      width: isMobile ? '176px' : '236px',
                      background: '#fff',
                      borderRadius: '6px',
                      padding: isMobile ? '8px 8px 16px' : '10px 10px 18px',
                      boxShadow: '0 14px 28px rgba(0, 0, 0, 0.18)',
                      border: '1px solid rgba(0,0,0,0.08)',
                      transform: `rotate(${((index % 6) - 3) * 0.8}deg)`,
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={photo.src}
                      alt="Memory"
                      style={{
                        width: '100%',
                        height: 'auto',
                        objectFit: 'contain',
                        borderRadius: '4px',
                        display: 'block',
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p
              style={{
                margin: 0,
                color: '#6d3146',
                fontFamily: "'Crimson Text', serif",
                fontSize: isMobile ? '1rem' : '1.1rem',
              }}
            >
              No photos found in media/lici.
            </p>
          )}
        </div>
      </section>

      <section
        className="checkered-cloth"
        style={{
          padding: isMobile ? '6px 12px 24px' : '6px 24px 36px',
          borderTop: '1px solid rgba(156, 39, 76, 0.08)',
        }}
      >
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>
          <h3
            style={{
              fontFamily: "'MexicanTequila', serif",
              fontSize: isMobile ? '1.25rem' : '1.7rem',
              color: '#9c274c',
              margin: '0 0 14px',
              textAlign: 'center',
            }}
          >
YOU WILL DEFINETELY CRINGE WITH ME PUTTING THOSE BUT ALL SIGNIFY A BIG PART OF WHY I LOVE YOU          </h3>

          {videos.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile
                  ? 'repeat(auto-fit, minmax(160px, 1fr))'
                  : 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: isMobile ? '10px' : '14px',
              }}
            >
              {videos.map((video) => (
                <div
                  key={video.src}
                  style={{
                    background: 'white',
                    borderRadius: '14px',
                    padding: '8px',
                    border: '2px solid rgba(156, 39, 76, 0.18)',
                    boxShadow: '0 8px 18px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <video
                    src={video.src}
                    controls
                    muted
                    autoPlay
                    loop
                    playsInline
                    style={{
                      width: '100%',
                      aspectRatio: '9 / 16',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      display: 'block',
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p
              style={{
                margin: 0,
                textAlign: 'center',
                color: '#6d3146',
                fontFamily: "'Crimson Text', serif",
                fontSize: isMobile ? '1rem' : '1.1rem',
              }}
            >
              No .mov or .mp4 videos found in media yet.
            </p>
          )}
        </div>
      </section>

      <section
        style={{
          background: 'linear-gradient(135deg, #fff7f9 0%, #fff0f4 100%)',
          padding: isMobile ? '30px 16px' : '46px 24px',
          borderTop: '1px solid rgba(156, 39, 76, 0.12)',
        }}
      >
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            textAlign: 'center',
            color: '#6d3146',
            fontFamily: "'PaperNotes', 'Crimson Text', serif",
            fontSize: isMobile ? '1.06rem' : '1.35rem',
            lineHeight: 1.8,
          }}
        >
          Thank you for all the memories you have given me and brightening my days you are my
          everything. (Sorry for making you wait).
        </div>
      </section>

      <section
        style={{
          background: 'linear-gradient(135deg, #9c274c 0%, #dc3545 100%)',
          padding: isMobile ? '36px 18px' : '52px 24px',
          textAlign: 'center',
          color: 'white',
        }}
      >
        <Heart
          size={isMobile ? 52 : 64}
          style={{
            fill: 'white',
            margin: '0 auto 16px',
            display: 'block',
            animation: 'heartBeat 1.5s ease-in-out infinite',
          }}
        />
        <p
          style={{
            margin: '0 0 12px',
            fontFamily: "'LoveBuble', 'Playfair Display', serif",
            fontSize: isMobile ? '1.4rem' : '2.2rem',
            letterSpacing: '0.02em',
          }}
        >
          FOREVER AND ALWAYS
        </p>
        <p
          style={{
            margin: 0,
            fontFamily: "'AndreaBellarosa', 'Sacramento', cursive",
            fontSize: isMobile ? '2rem' : '2.8rem',
          }}
        >
          Dimi
        </p>
      </section>
    </div>
  );
}
