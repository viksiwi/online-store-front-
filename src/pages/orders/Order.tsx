import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axios.config';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LazyImage } from '../../components/lazyImage/LazyImage';
import { baseURL } from '../../const/baseUrl';
interface Order {
  id: string;
  userId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  OrderItems: OrderItem[];
}

interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: string;
  createdAt: string;
  updatedAt: string;
  Product: Product;
}

interface Product {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
}

export const Orders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
  
    useEffect(() => {
      const fetchOrders = async () => {
        try {
          const response = await axiosInstance.get('/api/order');
          setOrders(response.data);
        } catch (error) {
          console.error('Error fetching orders:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchOrders();
    }, []);
  
    const calculateTotalPrice = (orderItems: OrderItem[]): string => {
      return orderItems
        .reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0)
        .toFixed(2);
    };
  
    return (
      <div className="order-list-container">
        <h2>Мои заказы</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          orders.length === 0 ? (
            <p>У вас пока нет заказов</p>
          ) : (
            orders.map((order) => (
              <Accordion key={order.id} className="order-accordion">
                <AccordionSummary expandIcon={<ExpandMoreIcon />} className="order-summary">
                  <div className="order-summary-content">
                    <Typography className="order-date">
                      Дата заказа: {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography className="order-status">
                      Статус заказа: {order.status}
                    </Typography>
                    <Typography className="order-total">
                      Общая стоимость: {calculateTotalPrice(order.OrderItems)} Р
                    </Typography>
                  </div>
                </AccordionSummary>
                <AccordionDetails className="order-details">
                  <div className="order-items">
                    {order.OrderItems.map((item) => (
                      <div key={item.id} className="order-item">
                        <LazyImage src={`${baseURL}${item.Product.imageUrl}`} alt={item.Product.name} />
                        <div className="order-item-details">
                          <Typography variant="h6">{item.Product.name}</Typography>
                          <Typography>{item.Product.description}</Typography>
                          <Typography>Цена: {item.price} Р</Typography>
                          <Typography>Количество: {item.quantity}</Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionDetails>
              </Accordion>
            ))
          )
        )}
      </div>
    );
  };
