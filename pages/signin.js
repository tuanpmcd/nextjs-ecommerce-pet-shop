import Head from "next/head";
import Link from "next/link";
import { useState, useContext, useEffect } from "react";
import { DataContext } from "../store/GlobalState";
import { postData } from "../utils/fetchData";
import Cookie from "js-cookie";
import { useRouter } from "next/router";
import { toast } from 'react-toastify'

const Login = () => {
  const [userData, setUserData] = useState({ email: "", password: "" });
  const { email, password } = userData;

  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;

  const router = useRouter();

  const handleChangeInput = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    const res = await postData("auth/login", userData);

    if (res.err) {
      dispatch({ type: "NOTIFY", payload: { loading: false } });
      return toast.info(res.err)
    }

    dispatch({ type: "NOTIFY", payload: { loading: false } });
    dispatch({
      type: "AUTH",
      payload: {
        token: res.access_token,
        user: res.user,
      },
    });

    Cookie.set("refreshtoken", res.refresh_token, {
      path: "api/auth/accessToken",
      expires: 7,
    });

    localStorage.setItem("firstLogin", true);
  };

  useEffect(() => {
    if (Object.keys(auth).length !== 0) router.push("/");
  }, [auth]);

  return (
    <div className="container"
      style={{ height: "calc(100vh - 150px)" }}
    >
      <Head>
        <title>Log in</title>
      </Head>

      <div className="row">
        <div className="col-lg-4 mx-auto">
          <form
            onSubmit={handleSubmit}
          >
            <h3 className="mb-3">Sign in</h3>

            <div className="form-group mb-3">
              <label className="form-label" htmlFor="exampleInputEmail1">Email address</label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                name="email"
                value={email}
                onChange={handleChangeInput}
              />
            </div>

            <div className="form-group mb-3">
              <label className="form-label" htmlFor="exampleInputPassword1">Password</label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                name="password"
                value={password}
                onChange={handleChangeInput}
              />
            </div>

            <button type="submit" className="btn btn-info w-100">
              Login
            </button>

            <p className="my-2">
              You don't have an account?{" "}
              <Link href="/register">
                <a style={{ color: "crimson" }}>Register Now</a>
              </Link>
            </p>
          </form>
        </div>
      </div>

    </div>
  );
};

export default Login;
