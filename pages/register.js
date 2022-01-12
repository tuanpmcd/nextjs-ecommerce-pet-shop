import Head from 'next/head'
import Link from 'next/link'
import { useState, useContext, useEffect } from 'react'
import valid from '../utils/valid'
import Cookie from "js-cookie";
import { DataContext } from '../store/GlobalState'
import { postData } from '../utils/fetchData'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'


const Register = () => {
  const [userData, setUserData] = useState({ name: '', email: '', password: '', cf_password: '' })
  const { name, email, password, cf_password } = userData

  const { state, dispatch } = useContext(DataContext)
  const { auth } = state

  const router = useRouter()

  const handleChangeInput = e => {
    setUserData({ ...userData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    dispatch({ type: 'NOTIFY', payload: { loading: true } })

    const errMsg = valid(name, email, password, cf_password)
    if (errMsg) {
      dispatch({ type: 'NOTIFY', payload: { loading: false } })
      return toast.info(errMsg)
    }

    const res = await postData('auth/register', userData)

    if (res.err) {
      dispatch({ type: 'NOTIFY', payload: { loading: false } })
      return toast.info(res.err)
    }
    
    dispatch({ type: 'NOTIFY', payload: { loading: false } })
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

    return toast.success(res.msg)
  }

  useEffect(() => {
    if (Object.keys(auth).length !== 0) router.push("/")
  }, [auth])

  return (
    <div className="d-flex justify-content-center p-2 w-100"
      style={{ height: "calc(100vh - 150px)" }}>
      <Head>
        <title>Register Page</title>
      </Head>

      <form className="mx-auto my-4" style={{ maxWidth: '500px' }} onSubmit={handleSubmit}>
        <h4 className="mb-3">Register</h4>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" className="form-control" id="name"
            name="name" value={name} onChange={handleChangeInput} />
        </div>

        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
            name="email" value={email} onChange={handleChangeInput} />
          <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>

        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input type="password" className="form-control" id="exampleInputPassword1"
            name="password" value={password} onChange={handleChangeInput} />
        </div>

        <div className="form-group">
          <label htmlFor="exampleInputPassword2">Confirm Password</label>
          <input type="password" className="form-control" id="exampleInputPassword2"
            name="cf_password" value={cf_password} onChange={handleChangeInput} />
        </div>

        <button type="submit" className="btn btn-info w-100 my-3">Register</button>

        <p className="my-2">
          Already have an account? <Link href="/signin"><a style={{ color: 'crimson' }}>Login Now</a></Link>
        </p>
      </form>
    </div>
  )
}

export default Register