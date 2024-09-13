
import axiosInstance from '../axios.config';

export const RecommendationsService = {
    fetchRecommendations: async (): Promise<{ [key: string]: string[] }> => {
      try {
        const response = await axiosInstance.get('/api/recommendation');
        return response.data;
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        throw error;
      }
    },
  
    saveRecommendations: async (selectedGroups: { [key: string]: string[] }) => {
      try {
        await axiosInstance.post('/api/recommendation', selectedGroups);
      } catch (error) {
        console.error('Error saving recommendations:', error);
        throw error;
      }
    },
  };
  