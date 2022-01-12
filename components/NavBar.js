import React, { useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { DataContext } from "../store/GlobalState";
import Cookie from "js-cookie";

function NavBar() {
  const router = useRouter();
  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;

  const isActive = (r) => {
    if (r === router.pathname) {
      return " active";
    } else {
      return "";
    }
  };

  const handleLogout = () => {
    Cookie.remove("refreshtoken", { path: "api/auth/accessToken" });
    localStorage.removeItem("firstLogin");
    dispatch({ type: "AUTH", payload: {} });
    dispatch({ type: "ADD_CART", payload: [] });
    return router.push("/");
  };

  const adminRouter = () => {
    return (
      <>
        <Link href="/users">
          <a className="dropdown-item">Users</a>
        </Link>
        <Link href="/create">
          <a className="dropdown-item">Products</a>
        </Link>
        <Link href="/categories">
          <a className="dropdown-item">Categories</a>
        </Link>
      </>
    );
  };

  const loggedRouter = () => {
    return (
      <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          <img
            src={auth.user.avatar}
            alt=""
            style={{
              borderRadius: "50%",
              width: "25px",
              height: "25px",
              // transform: "translateY(-6px)",
              marginRight: "3px",
            }}
          />
          {auth.user.name}
        </a>
        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
          <li>
            <Link href="/profile">
              <a className="dropdown-item">Profile</a>
            </Link>
          </li>
          {auth.user.role === "admin" && adminRouter()}
          <li className="dropdown-divider"></li>
          <li>
            <button className="dropdown-item" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </li>
    )
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-0 py-1 m-0">
      <div className="container d-flex justify-content-between align-items-center">
        <Link href="/">
          <a className="navbar-brand">Shop</a>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" style={{ flexGrow: "0 !important" }} id="navbarSupportedContent">

          <ul className="navbar-nav">
            <li className="nav-item d-flex align-items-center">
              <Link href="/cart">
                <a className={"nav-link" + isActive("/cart")}>
                  <i className="fas fa-shopping-cart mx-1" aria-hidden="true"></i>
                  Cart
                </a>
              </Link>
            </li>
            {Object.keys(auth).length === 0 ? (
              <li className="nav-item">
                <Link href="/signin">
                  <a className={"nav-link" + isActive("/login")}>
                    <i className="fas fa-user" aria-hidden="true"></i> Sign in
                  </a>
                </Link>
              </li>
            ) : (
              loggedRouter()
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
