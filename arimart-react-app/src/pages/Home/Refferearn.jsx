import React from 'react'
import Header from '../../components/Header'
import ReferAndEarn from '../../components/Widgets/ReferAndEarn'

function Refferearn() {
  return (
    <div>
        <Header title={"Refer and Earn"} setbaricon={false} setcarticon={false} />
        <ReferAndEarn/>
    </div>
  )
}

export default Refferearn