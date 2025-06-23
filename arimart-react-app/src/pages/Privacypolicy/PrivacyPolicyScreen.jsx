import React from 'react'
import Header from '../../components/Header'
import PrivacyPolicy from '../../components/Privacy/PrivacyPolicy'

const PrivacyPolicyScreen = () => {
  return (
    <div className='mb-20'>
          <Header title={"Our Privacy Policies"} setbaricon={false} setcarticon={false} />
          <PrivacyPolicy/>
    </div>
  )
}

export default PrivacyPolicyScreen