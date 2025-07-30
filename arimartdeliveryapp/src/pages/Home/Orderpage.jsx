import React from 'react'
import { Footer } from '../../components/common/Footer'
import { Header } from '../../components/common/Header'
import { OrdersPage } from '../../components/Home/OrdersPage'

const Orderpage = () => {
  return (
    <div>
       
      <Header title="Orders" />
        <OrdersPage/>
        <Footer/>
    </div>
  )
}

export default Orderpage