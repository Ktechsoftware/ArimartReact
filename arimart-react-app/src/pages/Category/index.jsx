import React from 'react'
import CategoryCard from '../../components/category/CategoryCard'
import Header from '../../components/Header/Header'
import { Outlet } from 'react-router-dom'
import MobileCategoryLayout from '../../components/category/CategoryLayout'

function Categoryindex() {
  return (
    <div className='mb-20'>
       {/* <Header title={"Category"} setbaricon={false}/> */}
        <MobileCategoryLayout/>
        <Outlet/>
    </div>
  )
}

export default Categoryindex