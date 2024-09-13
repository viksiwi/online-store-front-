import { FC, useEffect, ReactElement } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { RxCross2 } from 'react-icons/rx';

interface ModalType {
  closeModal: () => void;
  template?: ReactElement | null;
  show: boolean;
}

const animationStyles = {
  open: {
    background: "rgba(0, 0, 0, 0.2)",
    opacity: 1,
  },
  close: {
    background: "rgba(0, 0, 0, 0)",
    opacity: 0,
  },
};

const transition = {
  type: 'tween',
  ease: [0.45, 0, 0.55, 1],
  duration: 0.25,
};

export const Modal: FC<ModalType> = ({ closeModal, template, show }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeModal]);

  const effect = {
    initial: show ? 'close' : 'open',
    animate: 'open',
    exit: 'close',
    variants: animationStyles,
    transition: transition,
  };

  return createPortal(
    <motion.div {...effect} className="modal">
      <div className="modal-wrapper">
        <div className="modal-content">
          <button className="modal-close-button" onClick={closeModal}>
            <RxCross2 />
          </button>
          {template}
        </div>
      </div>
      <div className="big-close-button" onClick={closeModal}>
        <RxCross2 />
      </div>
    </motion.div>,
    document.getElementById('modal') as HTMLElement
  );
};
