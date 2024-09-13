import axiosInstance from '../axios.config';

export const Products = {
    fetchProducts: async () => {
        try {
            const response = await axiosInstance.get('/api/product');
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    fetchProductsByRecommendations: async () => {
        try {
            const response = await axiosInstance.get('/api/product/products-recommendation');
            return response.data;
        } catch (error) {
            console.error('Error fetching products-recommendation:', error);
            throw error;
        }
    },

    async searchProducts(params: { query?: string; group?: string }) {
        const queryString = new URLSearchParams(params).toString();
        const response = await axiosInstance.get(`/api/product/search?${queryString}`);
        return response.data;
    }
};