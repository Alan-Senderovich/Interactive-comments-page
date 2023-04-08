import { createContext, useCallback, useState } from "react";
import data from "../../data.json";
import moment from "moment";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [comments, setComments] = useState(() => {
    try {
      const commentsFromLocalStorage = localStorage.getItem("comments");
      if (
        commentsFromLocalStorage !== null &&
        commentsFromLocalStorage !== undefined
      ) {
        return JSON.parse(commentsFromLocalStorage);
      }
    } catch (err) {
      console.error("Error parsing comments from local storage", err);
    }
    return data.comments;
  });
  const [currentUser, setCurrentUser] = useState(data.currentUser);
  const [showModal, setShowModal] = useState(false);

  // ---------------------------------------------------
  const currentDate = moment();
  const commentDate = moment(new Date());

  const mins = currentDate.diff(commentDate, "minutes");

  const formatedDate = moment.duration(mins, "minutes").humanize(true);

  // ---------------------------------------------------
  const findCommentById = (comments, commentId) => {
    for (let comment of comments) {
      if (comment.id === commentId) {
        return comment;
      }
      if (comment.replies && comment.replies.length > 0) {
        const foundComment = findCommentById(comment.replies, commentId);
        if (foundComment) {
          return foundComment;
        }
      }
    }
    return null;
  };

  // ---------------------------------------------------
  const countComments = () => {
    let count = 0;

    const countRecursive = (comments) => {
      comments.forEach((comment) => {
        count++;
        if (comment.replies && comment.replies.length > 0) {
          countRecursive(comment.replies);
        }
      });
    };

    countRecursive(comments);
    return count;
  };

  const totalCount = countComments();

  // -----------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------
  const deleteComment = (id) => {
    const commentToDelete = findCommentById(comments, id);

    const updatedComments = comments.reduce((acc, comment) => {
      if (comment.id === commentToDelete.id) {
        return acc; // Si el comentario coincide con el id a eliminar, se excluye del nuevo array
      } else {
        const updatedReplies = comment.replies.filter(
          (reply) => reply.id !== commentToDelete.id
        );
        // Filtra las respuestas que no coinciden con el id a eliminar
        const updatedComment = { ...comment, replies: updatedReplies };
        // Crea un nuevo comentario con las respuestas actualizadas
        return [...acc, updatedComment];
        // Agrega el comentario actualizado al nuevo array
      }
    }, []);
    localStorage.setItem("comments", JSON.stringify(updatedComments));
    setComments(updatedComments);
  };
  // -----------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------

  const addComment = (content) => {
    const newComment = {
      id: totalCount + 1,
      content,
      createdAt: formatedDate,
      score: 0,
      user: currentUser,
      replies: [],
    };
    const updatedComments = [...comments, newComment];

    localStorage.setItem("comments", JSON.stringify(updatedComments));
    setComments([...comments, newComment]);
  };

  // -----------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------

  const addReply = (id, content, isReply) => {
    if (!isReply) {
      const commentToBeReplied = comments.find((comment) => {
        if (comment.id === id) {
          return true;
        }
        return false;
      });

      console.log(currentUser);

      const newReply = {
        id: totalCount + 1,
        content,
        createdAt: formatedDate,
        score: 0,
        user: currentUser,
        replies: [],
        replyingTo: commentToBeReplied.user.username,
      };

      commentToBeReplied.replies.push(newReply);
      console.log(commentToBeReplied.replies);

      const updatedComments = comments.map((comment) => {
        if (comment === commentToBeReplied) {
          return commentToBeReplied;
        }
        return comment;
      });

      localStorage.setItem("comments", JSON.stringify(updatedComments));
      setComments(updatedComments);
    } else {
      const rootComment = comments.find((comment) => {
        return comment.replies.find((reply) => {
          if (reply.id === id) {
            return true;
          }
          return false;
        });
      });

      const newReply = {
        id: totalCount + 1,
        content,
        createdAt: formatedDate,
        score: 0,
        user: currentUser,
        replies: [],
      };

      rootComment.replies.push(newReply);

      const updatedComments = comments.map((comment) => {
        if (comment.id === rootComment.id) {
          return rootComment;
        }
        return comment;
      });

      localStorage.setItem("comments", JSON.stringify(updatedComments));
      setComments(updatedComments);
    }
  };

  // -----------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------
  const updateComment = (id, content, isReply) => {
    if (!isReply) {
      const commentsUpdated = comments.map((comment) => {
        if (comment.id === id) {
          return {
            ...comment,
            content: content,
          };
        }
        return comment;
      });

      localStorage.setItem("comments", JSON.stringify(updatedComments));
      setComments(commentsUpdated);
    } else {
      const rootComment = comments.find((comment) => {
        return comment.replies.find((reply) => {
          if (reply.id === id) {
            return true;
          }
          return false;
        });
      });

      const updatedReplies = rootComment.replies.map((reply) => {
        if (reply.id === id) {
          return {
            ...reply,
            content: content,
          };
        }
        return reply;
      });

      const updatedComments = comments.map((comment) => {
        if (comment === rootComment) {
          return {
            ...comment,
            replies: updatedReplies,
          };
        }
        return comment;
      });

      localStorage.setItem("comments", JSON.stringify(updatedComments));
      setComments(updatedComments);
    }
  };

  // ---------------------------------------------------
  // ---------------------------------------------------
  const updateScore = useCallback(
    (operation, commentId, commentScore, isReply) => {
      if (commentScore === 0 && operation === "minus") return;

      if (!isReply) {
        const updatedComments = comments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              score:
                operation === "plus" ? comment.score + 1 : comment.score - 1,
            };
          } else {
            return comment;
          }
        });
        localStorage.setItem("comments", JSON.stringify(updatedComments));
        setComments(updatedComments);
      }

      if (isReply) {
        const rootComment = comments.find((comment) => {
          if (comment.replies.length > 0) {
            return comment.replies.find((reply) => {
              if (reply.id === commentId) {
                return true;
              }
              return false;
            });
          }
          return false;
        });

        const updatedReplies = rootComment.replies.map((reply) => {
          if (reply.id === commentId) {
            return {
              ...reply,
              score: operation === "plus" ? reply.score + 1 : reply.score - 1,
            };
          } else {
            return reply;
          }
        });

        const updatedComments = comments.map((comment) => {
          if (comment === rootComment) {
            return {
              ...comment,
              replies: updatedReplies,
            };
          }
          return comment;
        });

        localStorage.setItem("comments", JSON.stringify(updatedComments));
        setComments(updatedComments);
      }
    },
    [comments]
  );
  // ---------------------------------------------------
  // ---------------------------------------------------

  const contextValue = {
    currentUser,
    comments,
    addComment,
    addReply,
    updateScore,
    updateComment,
    deleteComment,
    setShowModal,
    showModal,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
