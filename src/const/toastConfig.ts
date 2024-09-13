import { toast, ToastOptions, Slide, ToastPosition, ToastTransitionProps } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ToastType {
  position: ToastPosition | undefined;
  autoClose: number;
  hideProgressBar: boolean;
  newestOnTop: boolean;
  closeOnClick: boolean;
  rtl: boolean;
  pauseOnFocusLoss: boolean;
  draggable: boolean;
  pauseOnHover: boolean;
  theme: string;
  transition: ({
    children,
    position,
    preventExitTransition,
    done,
    nodeRef,
    isIn,
    playToast,
  }: ToastTransitionProps) => React.JSX.Element;
}

export const toastConfig: ToastType = {
  position: 'bottom-right',
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: false,
  newestOnTop: false,
  rtl: false,
  theme: 'light',
  transition: Slide,
};

export const showToast = (type: 'success' | 'error', message: string) => {
  const options: ToastOptions = {
    ...toastConfig,
  };

  if (type === 'success') {
    toast.success(message, options);
  } else {
    toast.error(message, options);
  }
};