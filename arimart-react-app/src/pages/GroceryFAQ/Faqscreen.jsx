import React from 'react'
import Header from '../../components/Header'
import GroceryFAQ from '../../components/Widgets/GroceryFAQ'

const Faqscreen = () => {
  return (
    <div>
        <Header title={"FAQ"} setbaricon={false} setcarticon={false}/>
        <GroceryFAQ/>
    </div>
  )
}

export default Faqscreen