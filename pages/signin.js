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
    <div className="d-flex justify-content-center p-2 w-100"
      style={{ height: "calc(100vh - 150px)" }}
    >
      <Head>
        <title>Log in</title>
      </Head>

      <form
        className="mx-auto"
        style={{ maxWidth: "350px" }}
        onSubmit={handleSubmit}
      >
        <h4 className="mb-3">Sign in</h4>
        <div className="form-group mb-3">
          <label htmlFor="exampleInputEmail1">Email address</label>
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
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            name="password"
            value={password}
            onChange={handleChangeInput}
          />
        </div>

        <button type="submit" className="btn btn-info w-100 my-3">
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
  );
};

export default Login;
