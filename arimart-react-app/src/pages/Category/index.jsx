import React from 'react'
import CategoryCard from '../../components/category/CategoryCard'
import Header from '../../components/Header/Header'
import CategoryLayout from '../../components/category/CategoryLayout'
import { Outlet } from 'react-router-dom'

function Categoryindex() {
  return (
    <div className='mb-20'>
       <Header title={"Category"} setbaricon={false}  setcarticon={false}/>
        <CategoryLayout/>
        <Outlet/>
    </div>
  )
}

export default Categoryindex