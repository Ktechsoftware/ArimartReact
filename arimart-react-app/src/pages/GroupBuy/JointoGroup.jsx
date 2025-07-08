import React from 'react'
import { GroupBuyPage } from '../../components/GroupBuying/GroupBuyPage'
import Header from '../../components/Header/Header'
import JoinGroupOrder from '../../components/GroupBuying/JoinGroupOrder'

const JointoGroup = () => {
  return (
    <div>
       <Header title={"Group buy deals"} setbaricon={false}/>
        <JoinGroupOrder/>
    </div>
  )
}

export default JointoGroup