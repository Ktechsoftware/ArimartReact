import React from 'react'
import Header from '../../components/Header'
import BottomNav from '../../components/BottomNav'
import MainPage from '../../components/MainPage'
import RotatingCategoryCarousel from '../../components/category/RotatingCategoryCarousel'
import GroceryHome from '../../components/Home/GroceryHome'

function Home() {
  return (
    <div className='mb-20'>
    <Header/>
    {/* <RotatingCategoryCarousel/> */}
    {/* <MainPage/> */}
    <GroceryHome/>
    </div>
  )
}

export default Home