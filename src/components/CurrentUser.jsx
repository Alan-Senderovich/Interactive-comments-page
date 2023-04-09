import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

const CurrentUser = ({ currentUser }) => {
  const { addComment } = useContext(AppContext);
  const [commentToAdd, setCommentToAdd] = useState("");

  const handleChangeText = (e) => {
    const text = e.target.value;
    setCommentToAdd(text);
  };

  const handleClickText = () => {
    if (commentToAdd.length > 0) {
      addComment(commentToAdd);
      setCommentToAdd("");
    }
  };
  return (
    <section className="p-4 w-full bg-white rounded-md max-w-2xl mx-auto">
      <div className="flex items-center gap-4 flex-col md:hidden">
        <textarea
          onChange={(e) => handleChangeText(e)}
          className="w-full border border-gray-200 p-2 text-sm rounded-md text-gray-500 resize-none"
          placeholder="Add a comment..."
          value={commentToAdd}
        ></textarea>
        <div className="flex justify-between w-full items-center">
          <div>
            <img src={currentUser.image.png} alt="" className="w-8" />
          </div>
          <button
            className="bg-blue-800 text-white px-5 py-2 rounded-md font-bold hover:opacity-50 transition duration-300 ease-in-out"
            onClick={handleClickText}
          >
            SEND
          </button>
        </div>
      </div>

      {/* desktop */}
      {/* --------------------------------------------------------- */}
      <div className="hidden items-center gap-4 flex-col md:grid md:grid-cols-[1fr_6fr_1fr] md:items-start md:pt-3">
        <div>
          <img src={currentUser.image.png} alt="" className="w-10 mx-auto" />
        </div>

        <div>
          <textarea
            onChange={(e) => handleChangeText(e)}
            className="w-full h-24 border border-gray-200 p-2 text-sm rounded-md text-gray-500 resize-none "
            placeholder="Add a comment..."
            value={commentToAdd}
          ></textarea>
        </div>
        <div>
          <button
            className="bg-blue-800 text-white px-5 py-2 rounded-md font-bold hover:opacity-50 transition duration-300 ease-in-out"
            onClick={handleClickText}
          >
            SEND
          </button>
        </div>
      </div>
    </section>
  );
};

export default CurrentUser;
