import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Modal = ({ commentShowModal, setCommentShowModal, id }) => {
  const { deleteComment } = useContext(AppContext);
  return (
    <div
      className={`${
        commentShowModal ? "block " : "hidden"
      } fixed inset-0 z-50 flex items-center justify-center`}
    >
      <div className="bg-white w-full mx-4 z-20 px-6 py-6 rounded-md flex flex-col gap-3 max-w-sm">
        <span className="font-bold text-lg text-blue-900">Delete comment</span>
        <p className="text-sm text-gray-500">
          Are you sure you want to delete this comment? This will remove the
          comment and can't be undone.
        </p>
        <div className="flex justify-between">
          <button
            className="uppercase bg-gray-400 text-white text-md px-4 py-3 rounded-md font-semibold"
            onClick={() => setCommentShowModal(false)}
          >
            No, cancel
          </button>
          <button
            className="uppercase bg-red-400 text-white text-md px-4 py-3 rounded-md font-semibold"
            onClick={() => {
              setCommentShowModal(false),
              deleteComment(id)
            }}
          >
            Yes, delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
