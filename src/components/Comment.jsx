import React, { useContext, useState, useRef, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import CommentReply from "./CommentReply";
import IconDelete from "./IconDelete";
import IconEdit from "./IconEdit";
import IconMinus from "./IconMinus";
import IconPlus from "./IconPlus";
import IconReply from "./IconReply";
import Modal from "./Modal";

// --------------------------------------

const Comment = ({
  id,
  content,
  createdAt,
  score,
  user,
  replies,
  currentUser,
}) => {
  const textareaRef = useRef(null);
  const { updateScore, updateComment, addReply } = useContext(AppContext);
  const [edit, setEdit] = useState(false);
  const [isReply, setIsReply] = useState(false);
  const [commentReplies, setCommentReplies] = useState(replies);
  const [commentScore, setCommentScore] = useState(score);
  const [inputTextReply, setInputTextReply] = useState("");
  const [commentShowModal, setCommentShowModal] = useState(false);

  const isYou = user.username === "juliusomo" ? true : false;
  // const isYou = true;

  useEffect(() => {
    setCommentReplies(replies);
  }, [replies]);

  const handleUpdateScore = (operation) => {
    if (commentScore === 0 && operation === "minus") return;
    setCommentScore(operation === "plus" ? commentScore + 1 : commentScore - 1);
    updateScore(operation, id, commentScore, false);
  };

  const handleUpdateComment = () => {
    const content = textareaRef.current.value;
    updateComment(id, content, false);
    setEdit(false);
  };

  const handleChangeInputReply = (e) => {
    const text = e.target.value;
    setInputTextReply(text);
  };

  const handleClickInputReply = () => {
    addReply(id, inputTextReply, false);
    setIsReply(false);
    setInputTextReply("");
  };

  const handleDeleteComment = () => {
    console.log("asdasd");
    setCommentShowModal(true);
  };

  return (
    <section className="max-w-2xl mx-auto">
      {commentShowModal && (
        <div>
          <div className="absolute bg-gray-500 top-0 left-0 h-full w-full opacity-50 z-50"></div>
          <Modal
            commentShowModal={commentShowModal}
            setCommentShowModal={setCommentShowModal}
            id={id}
          />
        </div>
      )}
      <div className="md:relative">
        <div
          className={`w-full flex flex-col p-4 bg-white m-4 mx-auto rounded-md md:grid md:grid-cols-[1fr_10fr] md:gap-4 z-10`}
        >
          <div className="order-1 md:order-2">
            {/* User Info -----------*/}
            <div className="flex items-center gap-4">
              <img src={user?.image.png} alt="" className="w-8" />
              <span className="text-sm text-blue-900 font-bold">
                {user?.username}
              </span>
              <span className="text-sm text-gray-400">{createdAt}</span>
            </div>
            {/* User Info -----------*/}

            {/* Content -----------*/}
            <div className="py-3">
              {edit ? (
                <div>
                  <textarea
                    ref={textareaRef}
                    className="w-full border border-gray-200 rounded-md text-sm text-gray-500 h-24 overflow-y-hidden resize-none"
                    defaultValue={content}
                  ></textarea>
                  <div className="flex justify-end gap-4">
                    <button
                      className="bg-blue-800 text-white font-bold px-4 py-2 rounded-md"
                      onClick={handleUpdateComment}
                    >
                      Update
                    </button>
                    <button
                      className="bg-red-400 text-white font-bold px-4 py-2 rounded-md"
                      onClick={() => setEdit(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">{content}</p>
              )}
            </div>
            {/* Content -----------*/}
          </div>

          {/* Score and ReplyIcon -----------*/}

          <div className="flex justify-between order-2 md:order-1 md:w-full">
            <div className="inline-flex items-center gap-4 bg-gray-100 px-2 py-1 rounded-md md:flex-col md:justify-center md:w-5/6">
              <span
                className="cursor-pointer p-2"
                onClick={() => handleUpdateScore("plus")}
              >
                <IconPlus />
              </span>
              <span className="text-blue-700 font-bold">{commentScore}</span>
              <span
                className="cursor-pointer p-2"
                onClick={() => handleUpdateScore("minus")}
              >
                <IconMinus />
              </span>
            </div>
            {isYou ? (
              <div className="flex gap-4 md:absolute md:top-5 md:right-5">
                <div
                  className="flex items-center gap-2 cursor-pointer hover:opacity-50 transition duration-300 ease-in-out"
                  onClick={handleDeleteComment}
                >
                  <IconDelete />
                  <span className="text-red-400 font-bold">Delete</span>
                </div>
                <div
                  className="flex items-center gap-2 cursor-pointer hover:opacity-50 transition duration-300 ease-in-out"
                  onClick={() => console.log("edit")}
                >
                  <IconEdit />
                  <span
                    className="text-blue-800 font-bold"
                    onClick={() => setEdit(true)}
                  >
                    Edit
                  </span>
                </div>
              </div>
            ) : (
              <div
                className="flex items-center gap-2 cursor-pointer md:absolute md:top-5 md:right-5 hover:opacity-50 transition duration-300 ease-in-out"
                onClick={() => setIsReply(true)}
              >
                <IconReply />
                <span className="font-bold text-blue-800">Reply</span>
              </div>
            )}
          </div>

          {/* Score and ReplyIcon -----------*/}
        </div>
      </div>
      {/* Reply -----------*/}
      {isReply && (
        <div className="w-full flex flex-col p-4 bg-white m-4 mx-auto rounded-md">
          <div className="flex items-center gap-3">
            <img src={currentUser.image.png} alt="" className="w-8 h-8" />
            <textarea
              autoFocus
              className="w-full border border-gray-400 rounded-md px-4 py-2 text-gray-500 resize-none"
              onChange={(e) => handleChangeInputReply(e)}
              value={inputTextReply}
            ></textarea>
          </div>
          <div className="flex gap-4 justify-center mt-4">
            <button
              className="bg-blue-800 text-white font-bold px-4 py-2 rounded-md"
              onClick={handleClickInputReply}
            >
              <span>Reply</span>
            </button>
            <button
              className="bg-red-400 text-white font-bold px-4 py-2 rounded-md"
              onClick={() => {
                setInputTextReply(""), setIsReply(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {/* Reply -----------*/}
      <div className="pl-5 border border-l-2 border-r-0 border-t-0 border-b-0 md:ml-5">
        {commentReplies?.length > 0 &&
          commentReplies.map((reply, index) => (
            <CommentReply
              content={reply.content}
              createdAt={reply.createdAt}
              id={reply.id}
              replyingTo={reply.replyingTo}
              key={reply.id}
              user={reply.user}
              score={reply.score}
              currentUser={currentUser}
            />
          ))}
      </div>
    </section>
  );
};

export default Comment;
