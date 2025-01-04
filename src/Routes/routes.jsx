import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./protectedRoute";
import Login from "../Authentication/Login/login";
import AnimateRoute from "./animateRoute";
import Dashboard from "../Views/Dashboard/dashboard";
import { SUPERADMIN, ADMIN } from "../Utils/client_config";
import { logout } from "../Store/AuthSlice/authSlice";
import { useDispatch } from "react-redux";
import Navbar from "../Components/Navbar";
import Header from "../Components/Header";
import UsersList from "../Views/UsersList/UsersList";
import CreateAdmin from "../Views/CreateAdmin/CreateAdmin";
import AdminsList from "../Views/AdminsList/adminsList";
import CircleStatus from "../Views/CirclesStatuses/circleStatuses";
import UserDetail from "../Views/UserDetail/userDetail";
import ManageCircles from "../Views/ManageCircles/manageCircles";
import CreateCircle from "../Views/CreateCircle/createCircle";
import Ledger from "../Views/Ledger/ledger";
import CircleDetail from "../Views/CircleDetail/circleDetail";
import UserStatus from "../Views/UserStatus/userStatus";
import Profile from "../Views/Profile/profile";
import ProfileData from "../Views/Profile/profile";
import PermissionsPage from "../Views/Rights&Permissions/error404";
import UnCompleteRights from "../Views/UnCompleteRights/unCompleteRights";
import ForgetPassword from "../Authentication/ForgetPassword/forgetPassword";
import ResetPassword from "../Authentication/ResetPassword/resetPassword";
import AccountDeactivate from "../Views/AccountDeactivate/accountDeactivate";
import OrganisePeople from "../Views/OrganisePeople/organisePeople";
import OrganiseCirclePayments from "../Views/OrganiseCirclePayment/organiseCirclePayment";

const AppRoutes = ({ token, role_id, userData }) => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };
  var allBooleanFalse = false;
  if (userData && userData.user) {
    allBooleanFalse = Object.values(userData.user)
      .filter((value) => typeof value === "boolean")
      .every((value) => value === false);
  }

  return (
    <>
      {token !== "" && <Navbar userData={userData.user} />}
      {token !== "" && <Header />}
      <Routes>
        {token === "" && (
          <>
            <Route path="/" element={<Navigate replace to="/login" />} />

            <Route
              exact
              path="/login"
              element={
                <AnimateRoute>
                  <Login />
                </AnimateRoute>
              }
            />
            <Route
              exact
              path="/forget-password"
              element={
                <AnimateRoute>
                  <ForgetPassword />
                </AnimateRoute>
              }
            />
            <Route
              exact
              path="/reset-password"
              element={
                <AnimateRoute>
                  <ResetPassword />
                </AnimateRoute>
              }
            />
          </>
        )}

        {token !== "" && (
          <>
            {SUPERADMIN === role_id && (
              <>
                <Route
                  path="/"
                  element={
                    <ProtectedRoute token={token} redirectPath={"/login"}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/users-list"
                  element={
                    <ProtectedRoute token={token} redirectPath={"/login"}>
                      <UsersList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admins-list"
                  element={
                    <ProtectedRoute token={token} redirectPath={"/login"}>
                      <AdminsList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create-new-circle"
                  element={
                    <ProtectedRoute token={token} redirectPath={"/login"}>
                      <CreateCircle />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create-admin"
                  element={
                    <ProtectedRoute token={token} redirectPath={"/login"}>
                      <CreateAdmin />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/user-pending-approval"
                  element={
                    <ProtectedRoute token={token} redirectPath={"/login"}>
                      <UserStatus />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute token={token} redirectPath={"/login"}>
                      <ProfileData />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/update-admin/:id"
                  element={
                    <ProtectedRoute token={token} redirectPath={"/login"}>
                      <CreateAdmin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/user-detail/:id"
                  element={
                    <ProtectedRoute token={token} redirectPath={"/login"}>
                      <UserDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ledger/:id"
                  element={
                    <ProtectedRoute token={token} redirectPath={"/login"}>
                      <Ledger />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/circle-dashboard/:id"
                  element={
                    <ProtectedRoute token={token} redirectPath={"/login"}>
                      <CircleDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/circle-pending-approval"
                  element={
                    <ProtectedRoute token={token} redirectPath={"/login"}>
                      <CircleStatus />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manage-circles"
                  element={
                    <ProtectedRoute token={token} redirectPath={"/login"}>
                      <ManageCircles />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organise-circle/:id"
                  element={
                    <ProtectedRoute token={token} redirectPath={"/login"}>
                      <OrganisePeople />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organise-circle-payment/:id"
                  element={
                    <ProtectedRoute token={token} redirectPath={"/login"}>
                      <OrganiseCirclePayments />
                    </ProtectedRoute>
                  }
                />
              </>
            )}

            {ADMIN === role_id &&
            (userData?.user?.statusId === 3 ||
              userData?.user?.statusId === 1) ? (
              <Route
                exact
                path="/"
                element={
                  <ProtectedRoute token={token} redirectPath={"/login"}>
                    <AccountDeactivate />
                  </ProtectedRoute>
                }
              />
            ) : (
              ""
            )}

            {ADMIN === role_id && userData?.user?.statusId === 2 && (
              <>
                {userData.user.isDashboard === true ? (
                  <Route
                    exact
                    path="/"
                    element={
                      <ProtectedRoute token={token} redirectPath={"/login"}>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                ) : (
                  ""
                )}
                {userData.user.isListofUsers === true ? (
                  <Route
                    path="/users-list"
                    element={
                      <ProtectedRoute token={token} redirectPath={"/login"}>
                        <UsersList />
                      </ProtectedRoute>
                    }
                  />
                ) : (
                  ""
                )}
                {userData.user.isListofUsers === true ? (
                  <Route
                    path="/user-detail/:id"
                    element={
                      <ProtectedRoute token={token} redirectPath={"/login"}>
                        <UserDetail />
                      </ProtectedRoute>
                    }
                  />
                ) : (
                  ""
                )}
                {userData.user.isCircleCreate === true ? (
                  <Route
                    path="/create-new-circle"
                    element={
                      <ProtectedRoute token={token} redirectPath={"/login"}>
                        <CreateCircle />
                      </ProtectedRoute>
                    }
                  />
                ) : (
                  ""
                )}
                {userData.user.isCircleCreate === true ? (
                  <Route
                    path="/manage-circles"
                    element={
                      <ProtectedRoute token={token} redirectPath={"/login"}>
                        <ManageCircles />
                      </ProtectedRoute>
                    }
                  />
                ) : (
                  ""
                )}
                {userData.user.isCircleCreate === true ? (
                  <Route
                    path="/organise-circle/:id"
                    element={
                      <ProtectedRoute token={token} redirectPath={"/login"}>
                        <OrganisePeople />
                      </ProtectedRoute>
                    }
                  />
                ) : (
                  ""
                )}
                {userData.user.isCircleCreate === true ? (
                  <Route
                    path="/organise-circle-payment/:id"
                    element={
                      <ProtectedRoute token={token} redirectPath={"/login"}>
                        <OrganiseCirclePayments />
                      </ProtectedRoute>
                    }
                  />
                ) : (
                  ""
                )}
                {userData.user.isCircleCreate === true ? (
                  <Route
                    path="/ledger/:id"
                    element={
                      <ProtectedRoute token={token} redirectPath={"/login"}>
                        <Ledger />
                      </ProtectedRoute>
                    }
                  />
                ) : (
                  ""
                )}
                {userData.user.isCircleCreate === true ? (
                  <Route
                    path="/circle-dashboard/:id"
                    element={
                      <ProtectedRoute token={token} redirectPath={"/login"}>
                        <CircleDetail />
                      </ProtectedRoute>
                    }
                  />
                ) : (
                  ""
                )}
                {userData.user.isAdminCreated === true ? (
                  <Route
                    path="/create-admin"
                    element={
                      <ProtectedRoute token={token} redirectPath={"/login"}>
                        <CreateAdmin />
                      </ProtectedRoute>
                    }
                  />
                ) : (
                  ""
                )}
                {userData.user.isAdminCreated === true ? (
                  <Route
                    path="/update-admin/:id"
                    element={
                      <ProtectedRoute token={token} redirectPath={"/login"}>
                        <CreateAdmin />
                      </ProtectedRoute>
                    }
                  />
                ) : (
                  ""
                )}
                {userData.user.isAdminCreated === true ? (
                  <Route
                    path="/admins-list"
                    element={
                      <ProtectedRoute token={token} redirectPath={"/login"}>
                        <AdminsList />
                      </ProtectedRoute>
                    }
                  />
                ) : (
                  ""
                )}
                {userData.user.isAdminCreated === true ? (
                  <Route
                    path="/update-admin/:id"
                    element={
                      <ProtectedRoute token={token} redirectPath={"/login"}>
                        <CreateAdmin />
                      </ProtectedRoute>
                    }
                  />
                ) : (
                  ""
                )}{" "}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute token={token} redirectPath={"/login"}>
                      <ProfileData />
                    </ProtectedRoute>
                  }
                />
                {allBooleanFalse === true ? (
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute token={token} redirectPath={"/login"}>
                        <PermissionsPage />
                      </ProtectedRoute>
                    }
                  />
                ) : (
                  ""
                )}
                {userData.user.isApprove ? (
                  <Route
                    path="/user-pending-approval"
                    element={
                      <ProtectedRoute token={token} redirectPath={"/login"}>
                        <UserStatus />
                      </ProtectedRoute>
                    }
                  />
                ) : (
                  ""
                )}
                {userData.user.isApprove ? (
                  <Route
                    path="/circle-pending-approval"
                    element={
                      <ProtectedRoute token={token} redirectPath={"/login"}>
                        <CircleStatus />
                      </ProtectedRoute>
                    }
                  />
                ) : (
                  ""
                )}
                {userData.user.isDashboard === false ? (
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute token={token} redirectPath={"/login"}>
                        <UnCompleteRights />
                      </ProtectedRoute>
                    }
                  />
                ) : (
                  ""
                )}
              </>
            )}

            {
              (!role_id || (role_id !== SUPERADMIN && role_id !== ADMIN)) &&
                handleLogout() // Call your logout function here
            }
          </>
        )}
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
