import PersonIcon from '@mui/icons-material/Person';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import Hamburger from 'hamburger-react';
import { useState, ChangeEvent, useContext, forwardRef } from 'react';
import logo from '../../assets/logo.png';
import { Sidebar } from '../sidebar/Sidebar.tsx';
import { Input } from '../../ui/Input/Input.tsx';
import './index.scss';
import {Link, useNavigate} from "react-router-dom";
import {Button} from "../../ui/Button/Button.tsx";
import { AuthContext, logoutAction } from '../../context/AuthContext.tsx';
import { AuthService } from '../../api/AuthService.ts';
import { showToast } from '../../const/toastConfig.ts';
import debounce from 'lodash/debounce';
import { useUrlParams } from '../../context/UrlParamContext.tsx';
import { useCart } from '../../context/CartContext.tsx';

interface HeaderType {
  handleLoading: () => void;
  handleOpenSidebar: () => void;
  isSidebarOpen: boolean;
}

const debouncedUpdateUrl = debounce((updateParams: (newParams: Record<string, string | boolean>) => void, query: string, value: string) => {
  updateParams({ [query]: value });
}, 1000);

export const Header = forwardRef<HTMLDivElement, HeaderType>(({ handleOpenSidebar, isSidebarOpen }) => {
    const [value, setValue] = useState<string>('');
    const { state: authContext, dispatch: dispatchAuth } = useContext(AuthContext);
    const { updateParam } = useUrlParams();
    const navigate = useNavigate();
    const { basketRef } = useCart();
  
    const logout = async () => {
      await AuthService.logout();
      dispatchAuth(logoutAction());
      navigate('/wb-front/login');
      showToast("success", "Вы вышли из аккаунта");
    };
  
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setValue(value);
      debouncedUpdateUrl(updateParam, 'query', value)
    };
  
    const clearInput = () => {
      setValue('');
      updateParam({'query': ''});
    };

    return (
      <header className="header" onClick={(e) => e.stopPropagation()}>
        <div className="container">
          <Sidebar isOpen={isSidebarOpen} />
          <Link className="header__logo" to="./wb-front">
            <img src={logo} alt="logo" />
          </Link>
          <div className="header__hamburger">
            <Hamburger
              toggled={isSidebarOpen}
              toggle={() => handleOpenSidebar()}
              size={25}
              color="white"
            />
          </div>
          <div className="header__input__container">
            <Input
              placeholder="Найти на Everyday"
              value={value}
              name="value"
              onChange={onChange}
              onClick={clearInput}
              isCloseIcon
              isSearchIcon
            />
          </div>
          <div className="header__icon__container">
            <Link className="header__icon login" to={!authContext.isAuth ? "./wb-front/login" : "./wb-front/profile"}>
              <PersonIcon />
              <div className="header__container__login">
                <div className="header__icon__text">
                  {!authContext.isAuth ? <span>Войти</span> : <span>Профиль</span>}
                </div>
                <div className="header__modal__login">
                  {!authContext.isAuth ?
                    <Button size='large' color='basic' background='base'>
                      <Link className="header__icon login" to="./wb-front/login">
                        Войти или создать профиль
                      </Link>
                    </Button>
                    :
                    <div className='header__modal__profile'>
                      <Button size='medium' color='basic' background='base'>
                        <Link className="header__icon login" to="./wb-front/profile">
                          Открыть профиль
                        </Link>
                      </Button>
                      <Button size='medium' color='basic' background='base' onClick={logout}>
                        <span>Выйти</span>
                      </Button>
                    </div>
                  }
                </div>
              </div>
            </Link>
            <Link to="./wb-front/cart">
            <div
             className="header__icon shopping-basket-test"
              ref={basketRef} 
              onClick={() =>{
                if (!authContext.isAuth) {
                  showToast("error", "Необходимо авторизоваться")
                  return;
                }
              }}>
              <ShoppingBasketIcon />
              <div className="header__icon__text">
                  Корзина
              </div>
            </div>
            </Link>
          </div>
        </div>
      </header>
   );
  }
);