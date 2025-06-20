import React from 'react'
import AboutUs from '../../components/About/AboutUs'
import Header from '../../components/Header'

function AboutScreen() {
  return (
    <div className='mb-20'>
         <Header title="About Arimart" setbaricon={false} setcarticon={false} />
        <AboutUs/>
    </div>
  )
}

export default AboutScreen