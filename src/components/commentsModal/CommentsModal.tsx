import { useState, useEffect, FC, useContext } from 'react';
import { AxiosError } from 'axios';
import { CommentType } from '../../types/CommentType';
import { baseURL } from '../../const/baseUrl';
import { Loader } from '../loader/Loader';
import profilePhoto from '../../assets/profile-photo.png'
import { AuthContext } from '../../context/AuthContext';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { CommentsService } from '../../api/Comments';
import { showToast } from '../../const/toastConfig';

interface CommentModalType {
    productId: string;
    closeModal: () => void;
}

export const CommentsModal: FC<CommentModalType> = ({ productId, closeModal }) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const {state: authState} = useContext(AuthContext)

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const response = await CommentsService.fetchCommentsByProductId(productId)
        setComments(response);
      } catch (error) {
        showToast("error", "Ошибка при загрузке комментариев!")
        const err = error as AxiosError;
        if (err.response) {
          console.error('Error fetching comments:', err.response.data);
        } else if (err.request) {
          console.error('Error fetching comments: No response received');
        } else {
          console.error('Error fetching comments:', err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [productId]);

  const handleAddComment = async () => {
    if (newComment.trim() === '') return;

    try {
      const response = await CommentsService.addComment(newComment, productId)
      setComments([...comments, response]);
      setNewComment('');
      showToast("success", "Комментарий успешно добавлен!")

    } catch (error) {
      console.error(error);
      showToast("error", "Ошибка при добавлении комментария!")
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      await CommentsService.deleteCommentById(commentId)
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      setNewComment('');
      showToast("success", "Комментарий успешно удалён!")
    } catch (error) {
      showToast("error", "Ошибка при удалении комментария!")
      console.error(error);
    }
  };


  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>
          &times;
        </span>
        <h2>Comments</h2>
        {loading ? (
            <Loader/>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} deleteComment={deleteComment}/>
          ))
        )}
        <div className="add-comment">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
          />
          <button disabled={!authState.isAuth} style={{color: "black"}} onClick={handleAddComment}>Submit</button>
        </div>
      </div>
    </div>
  );
};

const CommentItem: FC<{comment: CommentType, deleteComment: (commentId: string) => void;}> = ({comment, deleteComment}) => {
  const {state} = useContext(AuthContext)
  const userPhoto = comment?.User?.profilePicture ? `${baseURL}${comment?.User?.profilePicture}` : profilePhoto
  
  return (
    <div className="comment-item">
      <div className="comment-content">
        <img src={userPhoto} alt={comment?.User?.username} className="avatar" />
        <div>
          <p className="username">{comment?.User?.username}</p>
          <p>{comment?.content}</p>
        </div>
      </div>
      {state.user?.id === comment?.User?.id && <div onClick={() => deleteComment(comment.id)}>
        <span className="delete-comment">
           <DeleteOutlineIcon/>
        </span>
      </div>}
    </div>
  );
};