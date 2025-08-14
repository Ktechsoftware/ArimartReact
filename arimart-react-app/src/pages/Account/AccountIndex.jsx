import React from 'react'
import AccountSettings from '../../components/Account/AccountSettings'
import Header from '../../components/Header/Header'

function AccountIndex() {
  return (
    <div className='mb-0'>
      {/* <Header title={"Account"} setbaricon={false} /> */}
        <AccountSettings/>
    </div>
  )
}

export default AccountIndex