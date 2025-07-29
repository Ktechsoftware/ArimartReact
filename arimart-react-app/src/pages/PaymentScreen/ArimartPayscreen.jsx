import React from 'react'
import ArimartPay from '../../components/Widgets/ArimartPay'
import Header from '../../components/Header/Header'

const ArimartPayscreen = () => {
  return (
    <div className=''>
        <Header title="Payment" setbaricon={false} setcarticon={false} />
        <ArimartPay/>
    </div>
  )
}

export default ArimartPayscreen