import { useState, ChangeEvent, FormEvent, useContext } from "react";
import { Button } from "../../ui/Button/Button";
import { Input } from "../../ui/Input/Input";
import { AuthService } from "../../api/AuthService";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../const/toastConfig";
import { AuthContext, login } from "../../context/AuthContext";
import { Loader } from "../../components/loader/Loader";
import { Products } from "../../api/Products";
import { ProductsContext } from "../../context/ProductContext";

interface LoginProps {
  onSwitch: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitch }) => {
  const [formData, setFormData] = useState({ login: '', password: '' });
  const [isLoading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate();
  const {dispatch} = useContext(AuthContext)
  const {dispatch: dispatchProducts} = useContext(ProductsContext)

  const clearInput = (name: string) => {
    setFormData(prevState => ({ ...prevState, [name]: '' }));
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true)
      const res = await AuthService.login(formData.login, formData.password, navigate);
      dispatch(login(res.user));
      showToast('success', 'Login successful!');
      const productsByRecommendations = await Products.fetchProductsByRecommendations() 
      if (productsByRecommendations.length) {
        console.log(productsByRecommendations, 'productBuRec')
        dispatchProducts({ type: 'SET_PRODUCTS', payload: productsByRecommendations })
        showToast("success", "Подобрали вам продукты по вашим рекомендациям!")
      }
    } catch (error) {
      showToast('error', 'Error during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="container">
        <h1>Войти</h1>
        <form onSubmit={handleSubmit} className="container-inputs">
          <div>
            <Input
              name="login"
              placeholder="Login"
              value={formData.login}
              onChange={handleInputChange}
              onClick={clearInput}
              isCloseIcon={true}
            />
          </div>
          <div>
            <Input
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              onClick={clearInput}
              isCloseIcon={true}
            />
          </div>
          <Button
            size="large"
            background="base"
            color="basic"
            disabled={formData.login.length === 0 || formData.password.length === 0 || isLoading}
          >
            Войти
          </Button>
        </form>
        <div className="switch">
          <span onClick={onSwitch}>Нет аккаунта? Регистрация</span>
        </div>
      </div>
      {isLoading && <Loader/>}
    </div>
  );
};



interface RegisterProps {
  onSwitch: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSwitch }) => {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    email: '',
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  const clearInput = (name: string) => {
    setFormData(prevState => ({ ...prevState, [name]: '' }));
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleProfilePictureChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setProfilePicture(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await AuthService.register(formData.login, formData.password, formData.email, profilePicture);
      showToast('success', 'Регистрация прошло успешно, теперь вы можете зайти в свой аккаунт');
      onSwitch()
    } catch (error) {
      showToast('error', 'Error during registration. Please try again.');
    }
  };

  return (
    <div className="auth">
      <div className="container">
        <h1>Создать профиль</h1>
        <form onSubmit={handleSubmit} className="container-inputs">
          <div>
            <Input
              name="login"
              placeholder="Login"
              value={formData.login}
              onChange={handleInputChange}
              onClick={clearInput}
              isCloseIcon={true}
            />
          </div>
          <div>
            <Input
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              onClick={clearInput}
              isCloseIcon={true}
            />
          </div>
          <div>
            <Input
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              onClick={clearInput}
              isCloseIcon={true}
            />
          </div>
          <div>
            <input
              type="file"
              onChange={handleProfilePictureChange}
            />
          </div>
          <Button
            size="large"
            background="base"
            color="basic"
            disabled={formData.login.length === 0 || formData.password.length === 0 || formData.email.length === 0}
          >
            Зарегистрироваться
          </Button>
        </form>
        <div className="switch">
          <span onClick={onSwitch}>Уже есть аккаунт? Войти</span>
        </div>
      </div>
    </div>
  );
};

export const AuthPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState<boolean>(false);

  const handleSwitch = () => {
    setIsRegister(!isRegister);
  };

  return (
    <>
      {isRegister ? (
        <Register onSwitch={handleSwitch} />
      ) : (
        <Login onSwitch={handleSwitch} />
      )}
    </>
  );
};