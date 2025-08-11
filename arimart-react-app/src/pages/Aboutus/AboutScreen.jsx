import React from 'react'
import AboutUs from '../../components/About/AboutUs'
import Header from '../../components/Header/Header'
import HeaderAbout from '../../components/Header/HeaderAbout'
import DesktopFooter from '../../components/Footer/DesktopFooter'

function AboutScreen() {
  return (
    <div className='mb-20'>
       {/* <Header title={"About us"} setbaricon={false}  setcarticon={false}/> */}
       <HeaderAbout/>
        <AboutUs/>
        <DesktopFooter/>
    </div>
  )
}

export default AboutScreen