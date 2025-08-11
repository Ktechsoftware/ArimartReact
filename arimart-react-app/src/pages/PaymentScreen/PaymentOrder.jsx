import React from 'react'
import Header from '../../components/Header/Header'
import OrderTracking from '../../components/Orders/OrderTracking'
import Orderpayment from '../../components/Payment/Orderpayment'

function PaymentOrder() {
  return (
    <div className=''>
        {/* <Header title="Payment" setbaricon={false} setcarticon={false} /> */}
        <Orderpayment/>
    </div>
  )
}

export default PaymentOrder