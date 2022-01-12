import Head from 'next/head'
import { useContext, useState } from 'react'
import { DataContext } from '../store/GlobalState'
import { updateItem } from '../store/Actions'
import { postData, putData } from "../utils/fetchData";

import { toast } from 'react-toastify';

const Categories = () => {
  const [name, setName] = useState('')

  const { state, dispatch } = useContext(DataContext)
  const { categories, auth } = state

  const [id, setId] = useState('')

  const createCategory = async () => {
    if (auth.user.role !== 'admin') return toast.error("Authentication is not vaild")
    if (!name) return toast.error("Name can not be left blank")

    dispatch({ type: 'NOTIFY', payload: { loading: true } })

    let res;
    if (id) {
      res = await putData(`categories/${id}`, { name }, auth.token)
      if (res.err) return toast.error(res.err)
      dispatch(updateItem(categories, id, res.category, 'ADD_CATEGORIES'))
    } else {
      res = await postData('categories', { name }, auth.token)
      if (res.err) return toast.error(res.err)
      dispatch({ type: "ADD_CATEGORIES", payload: [...categories, res.newCategory] })
    }
    setName('')
    setId('')
    dispatch({ type: 'NOTIFY', payload: { loading: false } })
    return toast.success(res.msg)
  }

  const handleEditCategory = (catogory) => {
    setId(catogory._id)
    setName(catogory.name)
  }

  return (
    <div className="container my-4">
      <Head>
        <title>Categories</title>
      </Head>
      <div className='col-lg-4 mx-auto'>
        <div className="input-group mb-3">
          <input type="text" className="form-control"
            placeholder="Add a new category" value={name}
            onChange={e => setName(e.target.value)} />

          <button className="btn btn-info"
            onClick={createCategory}>
            {id ? "Update" : "Create"}
          </button>
        </div>
        {
          categories.map(catogory => (
            <div key={catogory._id} className="card my-3">
              <div className="card-body d-flex justify-content-between">

                {catogory.name}

                <div style={{ cursor: 'pointer' }}>
                  <i
                    className="fas fa-edit me-3 text-info"
                    onClick={() => handleEditCategory(catogory)}>
                  </i>

                  <i
                    className="fas fa-trash-alt text-danger"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={() => dispatch({
                      type: 'ADD_MODAL',
                      payload: [{
                        data: categories,
                        id: catogory._id,
                        title: catogory.name,
                        type: 'ADD_CATEGORIES'
                      }]
                    })} >
                  </i>

                </div>

              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Categories