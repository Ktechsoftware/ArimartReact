import React from 'react'
import AccountSettings from '../../components/Account/AccountSettings'
import Header from '../../components/Header'

function AccountIndex() {
  return (
    <div className='mb-20'>
        <Header title="Profile" />
        <AccountSettings/>
    </div>
  )
}

export default AccountIndex