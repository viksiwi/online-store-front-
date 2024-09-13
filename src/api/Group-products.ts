
import axiosInstance from '../axios.config';

export const GroupProducts = {
    fetchGroupProducts: async () => {
        try {
            const response = await axiosInstance.get('/api/group-product');
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    }
};