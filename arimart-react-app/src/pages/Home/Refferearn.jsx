import React from 'react'
import Header from '../../components/Header/Header'
import ReferAndEarn from '../../components/Widgets/ReferAndEarn'

function Refferearn() {
  return (
    <div>
       <Header title={"Refer & Earn"} setbaricon={false}  setcarticon={false}/>
        <ReferAndEarn/>
    </div>
  )
}

export default Refferearn