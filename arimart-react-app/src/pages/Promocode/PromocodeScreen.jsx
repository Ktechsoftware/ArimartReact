import React from 'react'
import Header from '../../components/Header/Header'
import PromoCodes from '../../components/Widgets/PromoCodes'

const PromocodeScreen = () => {
  return (
    <div className='mb-20'>
        {/* <Header title={"Promocodes & Gifts"} setbaricon={false} setcarticon={false} /> */}
        <PromoCodes/>
    </div>
  )
}

export default PromocodeScreen