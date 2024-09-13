import { FC, useContext, useRef, useState } from "react";
import { ProductType } from "../../types/ProductTypes";
import { LazyImage } from "../lazyImage/LazyImage";
import { baseURL } from "../../const/baseUrl";
import { Button } from "../../ui/Button/Button";
import StarIcon from '@mui/icons-material/Star';
import { useModal } from "../../hooks/Modal/useModal";
import { AnimatePresence, motion } from "framer-motion";
import { Modal } from "../Modal/Modal";
import { CommentsModal } from "../commentsModal/CommentsModal";
import { useCart } from "../../context/CartContext";
import { showToast } from "../../const/toastConfig";
import { AuthContext } from "../../context/AuthContext";


export const Product: FC<{ product: ProductType }> = ({ product }) => {
  const { openModal, closeModal, modalState } = useModal();
  const {state: authContext} = useContext(AuthContext)
  const { basketRef } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);
  const [startPosition, setStartPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [endPosition, setEndPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const {addItem} = useCart()

  const handleAddToCart = async () => {
    if (!authContext.isAuth) {
      showToast('error', 'Необходимо авторизоваться!')
    }

    if (imageRef.current && basketRef.current) {
      const imageRect = imageRef.current.getBoundingClientRect();
      const basketRect = basketRef.current.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      setStartPosition({ x: imageRect.left + scrollLeft, y: imageRect.top + scrollTop });
      setEndPosition({ x: basketRect.left + scrollLeft, y: basketRect.top + scrollTop });
      setIsAnimating(false); // Сбросить состояние анимации
      setTimeout(() => setIsAnimating(true), 10); // Перезапустить анимацию с новыми координатами
    }

    await addItem({price: product.price, quantity: 1, productId: product.id})
  };

  return (
    <div className="product">
      <LazyImage src={`${baseURL}${product.imageUrl}`} alt="" ref={imageRef} />
      <div className="price">
        <span>{product.price} Р</span>
      </div>
      <div className="name">{product.name}</div>
      <div className="feedbacks">
        <div className="rate">
          <div className="icon-star">
            <StarIcon color="warning" />
          </div>
          <span>{product.rate}</span>
        </div>
        <div
          className="comments-number"
          onClick={() => openModal(<CommentsModal productId={product.id} closeModal={closeModal} />)}
        >
          <span>{getCommentLabel(product.commentsNumber)}</span>
        </div>
      </div>
      <Button size="medium" color="basic" background="base" onClick={handleAddToCart}>
        <span>В корзину</span>
      </Button>
      <AnimatePresence initial={false}>
        {modalState.isOpen && <Modal closeModal={closeModal} template={modalState.template} show={modalState.isOpen} />}
      </AnimatePresence>
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            key={Math.random()} // Уникальный ключ для перезапуска анимации
            className="flying-product"
            initial={{ opacity: 1, x: startPosition.x, y: startPosition.y }}
            animate={{ opacity: 1, x: endPosition.x, y: endPosition.y }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }} // Длительность анимации
            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
            onAnimationComplete={() => setIsAnimating(false)} // Скрыть картинку после анимации
          >
            <LazyImage src={`${baseURL}${product.imageUrl}`} alt="" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const getCommentLabel = (number: number) => {
    const lastDigit = number % 10;
    const lastTwoDigits = number % 100;
  
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return `${number} оценок`;
    }
  
    switch (lastDigit) {
      case 1:
        return `${number} оценка`;
      case 2:
      case 3:
      case 4:
        return `${number} оценки`;
      default:
        return `${number} оценок`;
    }
  };
  
  
