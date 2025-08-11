import React from 'react'
import Header from '../../components/Header/Header'
import ContactUs from '../../components/About/ContactUs'
import HeaderAbout from '../../components/Header/HeaderAbout'
import DesktopFooter from '../../components/Footer/DesktopFooter'

const Contactusscreen = () => {
  return (
    <div>
       {/* <Header title={"Contact us"} setbaricon={false}  setcarticon={false}/> */}
       <HeaderAbout/>
        <ContactUs/>
        <DesktopFooter/>
    </div>
  )
}

export default Contactusscreen