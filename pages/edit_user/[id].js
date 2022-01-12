import Head from 'next/head'
import { useContext, useState, useEffect } from 'react'
import { DataContext } from '../../store/GlobalState'
import { updateItem } from '../../store/Actions'

import { useRouter } from 'next/router'
import { patchData } from '../../utils/fetchData'

import { toast } from 'react-toastify'

const EditUser = () => {
  const router = useRouter()
  const { id } = router.query

  const { state, dispatch } = useContext(DataContext)
  const { auth, users } = state

  const [editUser, setEditUser] = useState([])
  const [checkAdmin, setCheckAdmin] = useState(false)
  const [num, setNum] = useState(0)

  useEffect(() => {
    users.forEach(user => {
      if (user._id === id) {
        setEditUser(user)
        setCheckAdmin(user.role === 'admin' ? true : false)
      }
    })
  }, [users])

  const handleCheck = () => {
    setCheckAdmin(!checkAdmin)
    setNum(num + 1)
  }

  const handleSubmit = () => {
    let role = checkAdmin ? 'admin' : 'user'
    if (num % 2 !== 0) {
      dispatch({ type: 'NOTIFY', payload: { loading: true } })
      patchData(`user/${editUser._id}`, { role }, auth.token)
        .then(res => {

          if (res.err) return toast.error(res.err)
          dispatch(updateItem(
            users,
            editUser._id,
            { ...editUser, role },
            'ADD_USERS',
          ))
          dispatch({ type: 'NOTIFY', payload: { loading: false } })
          return toast.success(res.msg)
        })
    }

  }

  return (
    <div className="container my-3">
      <Head>
        <title>Edit User</title>
      </Head>

      <button className="btn btn-dark" onClick={() => router.back()}>
        <i className="fas fa-long-arrow-alt-left" aria-hidden></i> Go Back
      </button>

      <div className="col-md-4 mx-auto my-4">

        <h3 className="text-uppercase text-secondary">Edit User</h3>

        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input className='form-control' type="text" id="name" defaultValue={editUser.name} disabled />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input className='form-control' type="text" id="email" defaultValue={editUser.email} disabled />
        </div>

        <div className="form-check mb-3">
          <input
            className='form-check-input'
            type="checkbox"
            id="isAdmin"
            checked={checkAdmin}
            onChange={handleCheck}
          />

          <label
            className="form-check-label"
            htmlFor="isAdmin"
          >
            isAdmin
          </label>
        </div>

        <button className="btn btn-info" onClick={handleSubmit}>
          Update
        </button>

      </div>

    </div>
  )
}

export default EditUser