import React, { useContext } from "react";

import { AppContext } from "../context/AppContext";
import Comment from "./Comment";
import CurrentUser from "./CurrentUser";
import Modal from "./Modal";
const CommentList = () => {
  const { comments, currentUser, showModal, setShowModal } =
    useContext(AppContext);
  // console.log("comments list:", comments);
  // console.log("currentUser:", currentUser);
  return (
    <div className="bg-gray-100 pt-8 pb-12">
      {comments.map((comment, index) => (
        <Comment
          key={index}
          content={comment.content}
          createdAt={comment.createdAt}
          id={comment.id}
          replies={comment.replies}
          score={comment.score}
          user={comment.user}
          currentUser={currentUser}
        />
      ))}
      <CurrentUser currentUser={currentUser} />
    </div>
  );
};

export default CommentList;
