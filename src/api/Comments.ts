
import axiosInstance from '../axios.config';
import { CommentType } from '../types/CommentType';

export const CommentsService = {
    fetchCommentsByProductId: async (productId: string) => {
        try {
            const response = await axiosInstance<CommentType[]>(`/api/comments/product/${productId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching comments:', error);
            throw error;
        }
    },

    addComment: async (newComment: string, productId: string) => {
        try {
            const response = await axiosInstance.post('/api/comments/add', {
                content: newComment,
                productId,
              });
            return response.data;
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error;
        }
    },

    deleteCommentById: async (commentId: string) => {
        try {
            await axiosInstance.delete<CommentType[]>(`/api/comments/${commentId}`);
        } catch (error) {
            console.error('Error fetching comments:', error);
            throw error;
        }
    },
};