import React from 'react'
import NavBar from './NavBar'
import Notify from './Notify'
import Modal from './Modal'

function Layout({ children }) {
  return (
    <>
      <NavBar />
      <div className='layout'>
        <Notify />
        <Modal />
        {children}
      </div>
    </>
  )
}

export default Layout
