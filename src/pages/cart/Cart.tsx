import { useEffect, useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { baseURL } from '../../const/baseUrl';
import { Checkbox } from '../../ui/Checkbox/Checkbox';
import { Loader } from '../../components/loader/Loader';
import { toast } from 'react-toastify';
import tick from '../../assets/tick.jpg'
import axiosInstance from '../../axios.config';

export const Cart: React.FC = () => {
    const { items, removeItem, updateItemQuantity, fetchCartItems , clearCart} = useCart();
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [isOrderCreated, setOrderCreated] = useState<boolean>(false)
  
    useEffect(() => {
      (async () => {
        setLoading(true);
        await fetchCartItems();
        setLoading(false);
      })();
    }, []);
  
    useEffect(() => {
      setSelectAll(items.length > 0 && selectedItems.length === items.length);
    }, [items, selectedItems]);
  
    const handleRemoveItem = (itemId: string) => {
      removeItem(itemId);
      setSelectedItems(prevSelected => prevSelected.filter(id => id !== itemId));
    };
  
    const handleQuantityChange = (itemId: string, quantity: number) => {
      updateItemQuantity(itemId, quantity);
    };
  
    const handleSelectItem = (itemId: string) => {
      setSelectedItems(prevSelected =>
        prevSelected.includes(itemId)
          ? prevSelected.filter(id => id !== itemId)
          : [...prevSelected, itemId]
      );
    };
  
    const handleSelectAll = () => {
      if (selectAll) {
        setSelectedItems([]);
      } else {
        setSelectedItems(items.map(item => item.id));
      }
      setSelectAll(!selectAll);
    };
  
    const handleRemoveSelectedItems = async () => {
      await Promise.all(selectedItems.map(itemId => removeItem(itemId)));
      setSelectedItems([]);
    };
  
    const calculateTotalPrice = () => {
      return items.reduce((total, item) => total + item.price * item.quantity, 0);
    };
  
    const handleOrder = async () => {
      try {
        await axiosInstance.post('/api/order/create');
        setOrderCreated(true)
        await clearCart()
        toast.success('Order created successfully');
      } catch (error) {
        toast.error('Failed to create order');
      }
    };

    if (isOrderCreated) {
      return (
        <div className="order-success">
          <h2>Ваш заказ успешно оформлен!</h2>
          <p>Спасибо за покупку! Мы свяжемся с вами для подтверждения заказа.</p>
          <img src={tick} alt="Order Success" />
        </div>
      );
    }
    return (
      !loading ? (
        <motion.div className="cart">
          <h2>Корзина</h2>
          {items.length === 0 ? (
            <p className="empty-cart">Ваша корзина пуста</p>
          ) : (
            <>
              <div className="cart-header">
                <Checkbox
                  checked={selectAll}
                  onChange={handleSelectAll}
                  color="base"
                  size="small"
                />
                <span>Выбрать все</span>
              </div>
              <ul className="cart-items">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.li
                      key={item?.id}
                      className="cart-item"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 50 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                        color="base"
                        size="small"
                      />
                      <img
                        src={`${baseURL}${item?.Product?.imageUrl}`}
                        alt={item?.Product?.name}
                        className="cart-item-image"
                      />
                      <div className="cart-item-details">
                        <span className="cart-item-name">{item?.Product?.name}</span>
                        <span className="cart-item-price">{item?.price * item.quantity} Р</span>
                      </div>
                      <input
                        type="number"
                        value={item?.quantity}
                        min="1"
                        onChange={e => handleQuantityChange(item?.id, parseInt(e.target.value, 10))}
                        className="cart-item-quantity"
                      />
                      <button onClick={() => handleRemoveItem(item?.id)} className="cart-item-remove">
                        <FiTrash2 />
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
              <AnimatePresence>
                <motion.div 
                 initial={{ opacity: 0}}
                 animate={{ opacity: 1}}
                 exit={{ opacity: 0}}
                className="cart-footer"
                > 
                    <div>
                    {selectedItems.length > 0 && (
                        <motion.button
                        onClick={handleRemoveSelectedItems}
                        className="remove-selected-button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        Удалить выбранные
                    </motion.button>)}
                    </div>
                    <div className="cart-total">
                    <span>Общая сумма: {calculateTotalPrice()} Р</span>
                    <motion.button
                        onClick={handleOrder}
                        className="order-button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        Оформить заказ
                    </motion.button>
                    </div>
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </motion.div>
      ) : (
        <Loader />
      )
    );
  };