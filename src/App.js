import React from "react";
import Routes from "./Routes/routes";
import { useSelector } from "react-redux";
import { initialAuth } from "./Store/AuthSlice/authSlice";
function App() {
  const token = useSelector((state) => state?.auth?.accessToken);

  const role_id = useSelector(initialAuth);
  return (
    <>
      {role_id ? (
        <Routes
          token={token}
          role_id={role_id?.user?.role}
          userData={role_id}
        />
      ) : (
        <Routes token={token} />
      )}
    </>
  );
}

export default App;
