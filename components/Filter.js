import React, { useState, useEffect } from 'react'
import filterSearch from '../utils/filterSearch'
import { getData } from '../utils/fetchData'
import { useRouter } from 'next/router'

const Filter = ({ state }) => {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('')
  const [category, setCategory] = useState('')

  const { categories } = state

  const router = useRouter()


  const handleCategory = (e) => {
    setCategory(e.target.value)
    filterSearch({ router, category: e.target.value })
  }

  const handleSort = (e) => {
    setSort(e.target.value)
    filterSearch({ router, sort: e.target.value })
  }

  useEffect(() => {
    filterSearch({ router, search: search ? search.toLowerCase() : 'all' })
  }, [search])

  return (
    <div className="d-flex flex-column">



      {/* <div className="input-group w-100">
        <select className="custom-select text-capitalize"
          value={category} onChange={handleCategory}>

          <option value="all">All</option>

          {
            categories.map(item => (
              <option key={item._id} value={item._id}>{item.name}</option>
            ))
          }
        </select>
      </div> */}

      <form autoComplete="off" className="w-100 mb-3">
        <input type="text" className="form-control" list="title_product" placeholder='Search...'
          value={search.toLowerCase()} onChange={e => setSearch(e.target.value)} />
      </form>

      <select className="form-select form-select mb-3 text-capitalize" aria-label=".form-select-sm example" value={category} onChange={handleCategory}>
        <option value="all">All</option>
        {
          categories.map(item => (
            <option key={item._id} value={item._id}>{item.name}</option>
          ))
        }
      </select>

      <select className="form-select form-select mb-3 text-capitalize" aria-label=".form-select-sm example" value={sort} onChange={handleSort}>
        <option value="-createdAt">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="-sold">Best sales</option>
        <option value="-price">Price: Hight-Low</option>
        <option value="price">Price: Low-Hight</option>
      </select>

      {/* <div className="input-group w-100">
        <select className="custom-select text-capitalize"
          value={sort} onChange={handleSort}>

          <option value="-createdAt">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="-sold">Best sales</option>
          <option value="-price">Price: Hight-Low</option>
          <option value="price">Price: Low-Hight</option>

        </select>
      </div> */}
    </div>
  )
}

export default Filter
