import React from 'react'
import { Header } from '../../components/common/Header'
import { AccountPage } from '../../components/Home/AccountPage'
import { Footer } from '../../components/common/Footer'

const Account = () => {
  return (
    <div>
          <Header title="Account" />
            <AccountPage/>
            <Footer/>
        </div>
  )
}

export default Account