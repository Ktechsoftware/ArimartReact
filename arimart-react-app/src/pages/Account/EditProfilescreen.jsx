import React from 'react'
import Header from '../../components/Header'
import UserProfileSettings from '../../components/Account/UserProfileSettings'

function EditProfilescreen() {
  return (
    <div>
        <Header title="Profile" setbaricon={false} setcarticon={false} />
        <UserProfileSettings/>
    </div>
  )
}

export default EditProfilescreen