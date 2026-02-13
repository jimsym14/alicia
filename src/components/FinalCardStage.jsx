import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Heart } from 'lucide-react';
import foreverAndAlwaysImage from '../../media/others/506ae3ac-7038-4ff1-9257-f08f9c7573be.jpg';

const photoModules = import.meta.glob(
  '../../media/carousel/*.{jpg,jpeg,png,webp,avif,heic,heif,JPG,JPEG,PNG,WEBP,AVIF,HEIC,HEIF}',
  {
    eager: true,
    import: 'default',
  }
);

const videoModules = import.meta.glob(
  '../../media/videos/*.{mov,MOV,mp4,MP4}',
  {
    eager: true,
    import: 'default',
  }
);

// Stage 3: section-based memories page
export default function FinalCardStage() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth <= 768
  );
  const [carouselAngle, setCarouselAngle] = useState(0);
  const [isDraggingCarousel, setIsDraggingCarousel] = useState(false);
  const [failedPhotoSources, setFailedPhotoSources] = useState(() => new Set());
  const dragStateRef = useRef({ startX: 0, startAngle: 0 });

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

  const visiblePhotos = useMemo(
    () => photos.filter((photo) => !failedPhotoSources.has(photo.src)),
    [photos, failedPhotoSources]
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let frameId;
    let lastTime = performance.now();

    const animate = (currentTime) => {
      const deltaMs = currentTime - lastTime;
      lastTime = currentTime;

      if (!isDraggingCarousel) {
        setCarouselAngle((prev) => (prev - deltaMs * 0.0035) % 360);
      }

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [isDraggingCarousel]);

  const handleCarouselPointerDown = (event) => {
    event.preventDefault();
    setIsDraggingCarousel(true);
    dragStateRef.current = {
      startX: event.clientX,
      startAngle: carouselAngle,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleCarouselPointerMove = (event) => {
    if (!isDraggingCarousel) return;

    const deltaX = event.clientX - dragStateRef.current.startX;
    const nextAngle = dragStateRef.current.startAngle + deltaX * 0.35;
    setCarouselAngle(nextAngle);
  };

  const handleCarouselPointerUp = (event) => {
    setIsDraggingCarousel(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handlePhotoLoadError = (source) => {
    setFailedPhotoSources((previous) => {
      if (previous.has(source)) return previous;
      const next = new Set(previous);
      next.add(source);
      return next;
    });
  };

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
        paddingTop: 0,
      }}
    >
      <style>{`
        .polaroid-scene {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          height: 460px;
          touch-action: none;
          user-select: none;
          cursor: grab;
          position: relative;
        }

        .polaroid-scene:active {
          cursor: grabbing;
        }

        .polaroid-disk {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: min(86vw, 720px);
          height: min(34vw, 220px);
          border-radius: 999px;
          background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.35) 58%, rgba(255, 255, 255, 0) 100%);
          pointer-events: none;
        }

        .polaroid-card-3d {
          position: absolute;
          top: 50%;
          left: 50%;
          width: var(--card-w);
          transform: translate(-50%, -50%) translate(var(--x), var(--y)) scale(var(--scale)) rotate(var(--tilt));
          opacity: var(--opacity);
          z-index: var(--z);
          transition: opacity 0.2s linear;
        }

        .polaroid-frame {
          background: #fff;
          border-radius: 8px;
          padding: 8px 8px 10px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 18px 30px rgba(0, 0, 0, 0.24);
        }

        .golden-love-frame {
          position: relative;
          overflow: hidden;
          border-radius: 18px;
          border: 3px solid rgba(255, 217, 122, 0.95);
          background: linear-gradient(160deg, rgba(255, 248, 217, 0.95), rgba(255, 221, 150, 0.85));
          box-shadow: 0 0 0 2px rgba(255, 247, 209, 0.55) inset, 0 12px 28px rgba(85, 40, 0, 0.25), 0 0 28px rgba(255, 215, 90, 0.45);
        }

        .golden-love-frame::after {
          content: '';
          position: absolute;
          top: -40%;
          left: -65%;
          width: 42%;
          height: 180%;
          transform: rotate(18deg);
          background: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0));
          animation: goldenShine 3.2s linear infinite;
          pointer-events: none;
        }

        .polaroid-image-shell {
          width: 100%;
          height: var(--img-h);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-radius: 4px;
          background: #fff;
        }

        .polaroid-image-shell img {
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
          object-fit: contain;
          display: block;
          pointer-events: none;
          user-select: none;
          -webkit-user-drag: none;
        }

        .polaroid-bottom-strip {
          height: calc(var(--img-h) * 0.2);
          min-height: 20px;
          width: 100%;
        }

        @media (max-width: 768px) {
          .polaroid-scene {
            height: 330px;
          }

          .polaroid-disk {
            width: min(94vw, 360px);
            height: 130px;
          }
        }

        @keyframes goldenShine {
          0% {
            left: -70%;
          }
          100% {
            left: 135%;
          }
        }
      `}</style>

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
        Licidimi
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

          {visiblePhotos.length > 0 ? (
            <div
              className="polaroid-scene"
              style={{ padding: '8px 0', marginBottom: isMobile ? '26px' : '40px' }}
              onPointerDown={handleCarouselPointerDown}
              onPointerMove={handleCarouselPointerMove}
              onPointerUp={handleCarouselPointerUp}
              onPointerCancel={handleCarouselPointerUp}
            >
              <div className="polaroid-disk" />
              {visiblePhotos.map((photo, index) => {
                const count = Math.max(visiblePhotos.length, 1);
                const angleDeg = (360 / count) * index + carouselAngle;
                const angleRad = (angleDeg * Math.PI) / 180;
                const radius = isMobile ? 205 : 380;
                const x = Math.sin(angleRad) * radius;
                const y = Math.cos(angleRad) * (isMobile ? 26 : 44);
                const centerFactor = (Math.cos(angleRad) + 1) / 2;
                const centerPeak = Math.pow(centerFactor, 3.1);
                const scale = 0.38 + centerPeak * 1.52;
                const opacity = 0.32 + centerPeak * 0.68;
                const z = Math.round(80 + centerPeak * 220);
                const tilt = `${((index % 7) - 3) * 0.8 + Math.sin(angleRad) * 5}deg`;

                return (
                  <div
                    key={`${photo.src}-${index}`}
                    className="polaroid-card-3d"
                    style={{
                      '--x': `${x}px`,
                      '--y': `${y}px`,
                      '--scale': scale,
                      '--opacity': opacity,
                      '--z': z,
                      '--card-w': isMobile ? '136px' : '190px',
                      '--img-h': isMobile ? '148px' : '208px',
                      '--tilt': tilt,
                    }}
                  >
                    <div className="polaroid-frame">
                      <div className="polaroid-image-shell">
                        <img
                          src={photo.src}
                          alt=""
                          draggable={false}
                          onError={() => handlePhotoLoadError(photo.src)}
                        />
                      </div>
                      <div className="polaroid-bottom-strip" />
                    </div>
                  </div>
                );
              })}
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
        <div
          className="golden-love-frame"
          style={{
            width: isMobile ? '230px' : '320px',
            margin: '0 auto 14px',
            padding: isMobile ? '8px' : '10px',
          }}
        >
          <img
            src={foreverAndAlwaysImage}
            alt="Te amo forever and always"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '12px',
              display: 'block',
              border: '2px solid rgba(255, 236, 176, 0.9)',
            }}
          />
          <p
            style={{
              margin: isMobile ? '10px 6px 4px' : '12px 8px 6px',
              color: '#7a2900',
              fontFamily: "'LoveBuble', 'Playfair Display', serif",
              fontSize: isMobile ? '1.04rem' : '1.28rem',
              letterSpacing: '0.03em',
              textTransform: 'lowercase',
            }}
          >
            te amo
          </p>
        </div>
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
