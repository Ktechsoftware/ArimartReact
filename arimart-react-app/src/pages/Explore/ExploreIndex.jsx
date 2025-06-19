import React from 'react'
import Header from '../../components/Header'
import DailyFoods from '../../components/Explore/DailyFoods'

function ExploreIndex() {
  return (
    <div className='mb-20'>
        <Header title="Explore" setbaricon={"false"}/>
        <DailyFoods/>
    </div>
  )
}

export default ExploreIndex