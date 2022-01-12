import Head from 'next/head'
import Link from 'next/link'
import { useState, useContext, useEffect } from 'react'
import { DataContext } from '../store/GlobalState'

import { getData } from '../utils/fetchData'
import ProductItem from '../components/ProductItem'
import filterSearch from '../utils/filterSearch'
import { useRouter } from 'next/router'
import Filter from '../components/Filter'


const Home = (props) => {
  const [products, setProducts] = useState(props.products)
  const [isCheck, setIsCheck] = useState(false)
  const [page, setPage] = useState(1)
  const router = useRouter()
  const { state, dispatch } = useContext(DataContext)
  const { auth } = state

  useEffect(() => {
    setProducts(props.products)
  }, [props.products])

  useEffect(() => {
    if (Object.keys(router.query).length === 0) setPage(1)
  }, [router.query])

  const handleCheck = (id) => {
    products.forEach(product => {
      if (product._id === id) product.checked = !product.checked
    })
    setProducts([...products])
  }

  const handleCheckALL = () => {
    products.forEach(product => product.checked = !isCheck)
    setProducts([...products])
    setIsCheck(!isCheck)
  }

  const handleDeleteAll = () => {
    let deleteArr = [];
    products.forEach(product => {
      if (product.checked) {
        deleteArr.push({
          data: '',
          id: product._id,
          title: 'Delete all selected products?',
          type: 'DELETE_PRODUCT'
        })
      }
    })

    dispatch({ type: 'ADD_MODAL', payload: deleteArr })
  }

  const handleLoadmore = () => {
    setPage(page + 1)
    filterSearch({ router, page: page + 1 })
  }

  return (
    <>
      <Head>
        <title>Home Page</title>
      </Head>
      <div className="home container row p-0 mx-auto">
        <div className="home-left col-lg-3 p-2">
          <Filter state={state} />
        </div>
        <div className="col-lg-9 p-1 ps-lg-5">
          {
            auth.user && auth.user.role === 'admin' &&
            <div className="d-flex align-items-center mb-4">
              <input type="checkbox" checked={isCheck} onChange={handleCheckALL}
                style={{ width: '25px', height: '25px' }} />

              <button className="btn btn-info btn-sm mx-2"
                data-toggle="modal" data-target="#exampleModal"
                onClick={handleDeleteAll}>
                Delete All
              </button>
            </div>
          }

          <div className="products">
            {
              products.length === 0
                ? <h4>No Products</h4>
                : products.map(product => (
                  <ProductItem key={product._id} product={product} handleCheck={handleCheck} />
                ))
            }
          </div>

          {
            props.result < page * 9 ? ""
              : <button className="btn btn-outline-dark btn-sm my-4 m-auto d-block"
                onClick={handleLoadmore}>
                Load more
              </button>
          }

        </div>
      </div>
    </>
  )
}

export async function getServerSideProps({ query }) {
  const page = query.page || 1
  const category = query.category || 'all'
  const sort = query.sort || ''
  const search = query.search || 'all'

  const res = await getData(
    `product?limit=${page * 9}&category=${category}&sort=${sort}&title=${search}`
  )
  return {
    props: {
      products: res.products,
      result: res.result
    },
  }
}

export default Home