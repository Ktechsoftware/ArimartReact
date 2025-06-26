import React from 'react'
import { GroupBuyPage } from '../../components/GroupBuying/GroupBuyPage'
import Header from '../../components/Header/Header'

const GroupDealScreen = () => {
  return (
    <div>
       <Header title={"Group buy deals"} setbaricon={false}  setcarticon={false}/>
        <GroupBuyPage/>
    </div>
  )
}

export default GroupDealScreen