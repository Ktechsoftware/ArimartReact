import React from 'react'
import Header from '../../components/Header/Header'
import ForYouPage from '../../components/Foryou/ForYouPage'

const Foryoupagescreeen = () => {
  return (
    <div className='mb-20'>
       <Header title={"For you"} setbaricon={false} />
        <ForYouPage/>
    </div>
  )
}

export default Foryoupagescreeen