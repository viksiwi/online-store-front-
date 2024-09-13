import axios from 'axios';
import { baseURL } from './const/baseUrl';

console.log(`Running in ${process.env.NODE_ENV} mode. Using baseURL: ${baseURL}`);

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export default axiosInstance;
