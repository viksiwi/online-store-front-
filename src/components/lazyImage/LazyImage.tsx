import { useState, useEffect, forwardRef } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface LazyImageProps {
  src: string;
  alt: string;
}

const animationStyles = {
  open: {
    opacity: 1,
    scale: 1,
  },
  close: {
    opacity: 0,
    scale: 0.8,
  },
};

const transition = {
  type: 'tween',
  ease: [0.45, 0, 0.55, 1],
  duration: 0.25,
};

export const LazyImage = forwardRef<HTMLImageElement, LazyImageProps>(
  ({ src, alt, ...rest }, ref) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

    const handleImageLoad = () => {
      setIsLoading(false);
    };

    const openFullscreen = () => {
      setIsFullscreen(true);
    };

    const closeFullscreen = () => {
      setIsFullscreen(false);
    };

    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          closeFullscreen();
        }
      };

      if (isFullscreen) {
        window.addEventListener('keydown', handleKeyDown);
      } else {
        window.removeEventListener('keydown', handleKeyDown);
      }

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [isFullscreen]);

    return (
      <>
        <div className="lazy-image-container">
          {isLoading && (
            <div className="loader-overlay">
            </div>
          )}
          <img
            src={src || ""}
            alt={alt}
            onLoad={handleImageLoad}
            className={isLoading ? 'hidden' : 'visible'}
            onClick={openFullscreen}
            ref={ref}
            {...rest}
          />
        </div>

        {isFullscreen &&
          ReactDOM.createPortal(
            <AnimatePresence>
              <motion.div
                initial="close"
                animate="open"
                exit="close"
                variants={animationStyles}
                transition={transition}
                className="fullscreen-overlay"
                onClick={closeFullscreen}
              >
                <img src={src} alt={alt} className="fullscreen-image" />
              </motion.div>
            </AnimatePresence>,
            document.body
          )}
      </>
    );
  }
);
