import React from 'react'
import Header from '../../components/Header'
import NotificationCenter from '../../components/Notificaiton/NotificationCenter'

const NotificationScreen = () => {
  return (
    <div>
        <Header title="Notification" setbaricon={false} setcarticon={false} />
        <NotificationCenter/>
    </div>
  )
}

export default NotificationScreen