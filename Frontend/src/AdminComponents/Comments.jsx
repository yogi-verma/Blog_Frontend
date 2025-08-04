import PendingComments from "./PendingComments";
import { useEffect, useState } from "react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Comments = () => {
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  return (
    <div>
        <ToastContainer
            position="top-right"
            autoClose={3000} // 3 seconds
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light" // or "dark"
          />
    
        <PendingComments token={token} />
      
    </div>
  );
};

export default Comments;
