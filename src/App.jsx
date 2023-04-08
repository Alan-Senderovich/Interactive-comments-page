import React, { useContext } from "react";

import CommentList from "./components/CommentList";
import Modal from "./components/Modal";
import { AppProvider } from "./context/AppContext";

const App = () => {
  return (
    <div className="relative">
      <AppProvider>
        <CommentList />
      </AppProvider>
    </div>
  );
};

export default App;
