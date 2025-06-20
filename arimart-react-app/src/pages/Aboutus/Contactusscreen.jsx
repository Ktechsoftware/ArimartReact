import React from 'react'
import Header from '../../components/Header'
import ContactUs from '../../components/About/ContactUs'

const Contactusscreen = () => {
  return (
    <div>
        <Header title="Contact Us" setbaricon={false} setcarticon={false} />
        <ContactUs/>
    </div>
  )
}

export default Contactusscreen