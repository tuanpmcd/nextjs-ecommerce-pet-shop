import Head from 'next/head'
import { useState, useContext, useEffect } from 'react'
import { DataContext } from '../store/GlobalState'
import Link from 'next/link'
import valid from '../utils/valid'
import { patchData } from '../utils/fetchData'
import { imageUpload } from '../utils/imageUpload'
import { toast } from 'react-toastify'

const Profile = () => {
  const [data, setData] = useState({ avatar: '', name: '', password: '', cf_password: '' })
  const { avatar, name, password, cf_password } = data

  const { state, dispatch } = useContext(DataContext)
  const { auth, notify, orders } = state

  useEffect(() => {
    if (auth.user) setData({ ...data, name: auth.user.name })
  }, [auth.user])

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const handleUpdateProfile = e => {
    e.preventDefault()
    if (password) {
      const errMsg = valid(name, auth.user.email, password, cf_password)
      if (errMsg) return toast.info(errMsg)
      updatePassword()
    }

    if (name !== auth.user.name || avatar) updateInfor()
  }

  const updatePassword = () => {
    dispatch({ type: 'NOTIFY', payload: { loading: true } })
    patchData('user/resetPassword', { password }, auth.token)
      .then(res => {
        if (res.err) return toast.info(res.err)
        dispatch({ type: 'NOTIFY', payload: { loading: false } })
        return toast.success(res.msg)
      })
  }

  const changeAvatar = (e) => {
    const file = e.target.files[0]
    if (!file) return toast.error('File does not exist')
    if (file.size > 1024 * 1024) return toast.error('The largest image size is 1mb') //1mb 
    if (file.type !== "image/jpeg" && file.type !== "image/png") return toast.error('Image format is incorrect')

    setData({ ...data, avatar: file })
  }

  const updateInfor = async () => {
    let media;
    dispatch({ type: 'NOTIFY', payload: { loading: true } })

    if (avatar) media = await imageUpload([avatar])

    patchData(
      'user',
      { name, avatar: avatar ? media[0].url : auth.user.avatar },
      auth.token)
      .then(res => {
        if (res.err) return toast.info(res.err)
        dispatch({
          type: 'AUTH', payload: {
            token: auth.token,
            user: res.user
          }
        })
        return dispatch({ type: 'NOTIFY', payload: { loading: false } })
      })
  }

  if (!auth.user) return null;
  return (
    <div className="profile_page">
      <Head>
        <title>Profile</title>
      </Head>

      <div className="container row text-secondary mx-auto">
        <div className="col-md-4 mb-4">
          <h3 className="text-uppercase">
            {auth.user.role === 'user' ? 'User Profile' : 'Admin Profile'}
          </h3>

          <div className="avatar">
            <img src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar}
              alt="" />
            <span>
              <i className="fas fa-camera"></i>
              <p>Change</p>
              <input type="file" name="file" id="file_up"
                accept="image/*" onChange={changeAvatar} />
            </span>
          </div>

          <div className="form-group my-2">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" name="name" value={name} className="form-control"
              placeholder="Your name" onChange={handleChange} />
          </div>

          <div className="form-group my-2">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="text" name="email" defaultValue={auth.user.email}
              className="form-control" disabled={true} />
          </div>

          <div className="form-group my-2">
            <label htmlFor="password" className="form-label">New Password</label>
            <input type="password" name="password" value={password} className="form-control"
              placeholder="" onChange={handleChange} />
          </div>

          <div className="form-group my-2">
            <label htmlFor="cf_password" className="form-label">Confirm New Password</label>
            <input type="password" name="cf_password" value={cf_password} className="form-control"
              placeholder="" onChange={handleChange} />
          </div>

          <button className="btn btn-info my-2" disabled={notify.loading}
            onClick={handleUpdateProfile}>
            Update
          </button>
        </div>

        <div className="col-md-8">
          <h3 className="text-uppercase">Orders</h3>

          <div className="my-3 table-responsive">
            <table className="table table-bordered table-striped table-hover w-100 text-uppercase"
              style={{ minWidth: '600px', cursor: 'pointer' }}>
              <thead className="bg-light font-weight-bold">
                <tr>
                  <td className="p-2">id</td>
                  <td className="p-2">date</td>
                  <td className="p-2">total</td>
                  <td className="p-2">delivered</td>
                  <td className="p-2">paid</td>
                </tr>
              </thead>

              <tbody>
                {
                  orders.map(order => (
                    <tr key={order._id}>

                      <td className="p-2">
                        <Link href={`/order/${order._id}`}>
                          <a className='text-decoration-underline'>{order._id}</a>
                        </Link>
                      </td>

                      <td className="p-2">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>

                      <td className="p-2">${order.total}</td>

                      <td className="p-2">
                        {
                          order.delivered
                            ? <i className="fas fa-check text-success"></i>
                            : <i className="fas fa-times text-danger"></i>
                        }
                      </td>

                      <td className="p-2">
                        {
                          order.paid
                            ? <i className="fas fa-check text-success"></i>
                            : <i className="fas fa-times text-danger"></i>
                        }
                      </td>
                    </tr>
                  ))
                }
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile