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
    <form autoComplete="off" className="mb-3 d-md-flex align-items-end">

      
      <div className='flex-fill mb-3'>
        <input
          type="text"
          className="form-control"
          list="title_product"
          placeholder='Find a pet...'
          value={search.toLowerCase()} onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="flex-fill mb-3 mx-md-1">
        <label htmlFor='filters' className="form-label">Filters:</label>
        <select className="form-select form-select text-capitalize" id="filters" aria-label=".form-select example" value={category} onChange={handleCategory}>
          <option value="all">All</option>
          {
            categories.map(item => (
              <option key={item._id} value={item._id}>{item.name}</option>
            ))
          }
        </select>
      </div>
      <div className="flex-fill mb-3">
        <label htmlFor='sortBy' className="form-label">Sort By:</label>
        <select className="form-select form-select text-capitalize" id='sortBy' aria-label=".form-select-sm example" value={sort} onChange={handleSort}>
          <option value="-createdAt">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="-sold">Best sales</option>
          <option value="-price">Price: Hight-Low</option>
          <option value="price">Price: Low-Hight</option>
        </select>
      </div>
    </form>
  )
}

export default Filter
