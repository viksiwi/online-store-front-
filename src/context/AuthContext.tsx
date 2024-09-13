import { useEffect, useReducer, useState, createContext, FC, ReactNode, Dispatch } from 'react';
import { Loader } from '../components/loader/Loader';
import { AuthService } from '../api/AuthService';
import { User } from '../types/UserType';

type State = {
  isAuth: boolean;
  user: User | null;
};

type Action =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

const initialState: State = {
  isAuth: false,
  user: null,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isAuth: true, user: action.payload };
    case 'LOGOUT':
      return { ...state, isAuth: false, user: null };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : state.user,
      };
    default:
      return state;
  }
};

export const AuthContext = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await AuthService.fetchProfile();
        if (data.user) {
          dispatch({ type: 'LOGIN', payload: data.user });
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching user profile:', error.message);
        } else {
          console.error('Unexpected error:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

// Экшен-креаторы
export const login = (user: User): Action => ({
  type: 'LOGIN',
  payload: user,
});

export const logoutAction = (): Action => ({
  type: 'LOGOUT',
});

export const updateUser = (user: Partial<User>): Action => ({
  type: 'UPDATE_USER',
  payload: user,
});

export default AuthProvider;
