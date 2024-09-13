
import axiosInstance from '../axios.config';

export const Categories = {
    fetchCategories: async () => {
        try {
            const response = await axiosInstance.get('/api/category');
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    }
};