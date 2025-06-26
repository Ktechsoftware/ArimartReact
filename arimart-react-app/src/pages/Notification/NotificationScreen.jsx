import React from 'react'
import Header from '../../components/Header/Header'
import NotificationCenter from '../../components/Notificaiton/NotificationCenter'

const NotificationScreen = () => {
  return (
    <div>
       <Header title={"Notifications"} setbaricon={false}  setcarticon={false}/>
        <NotificationCenter/>
    </div>
  )
}

export default NotificationScreen