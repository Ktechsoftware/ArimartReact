import React from 'react'
import Header from '../../components/Header/Header'
import UserProfileSettings from '../../components/Account/UserProfileSettings'

function EditProfilescreen() {
  return (
    <div>
       <Header title={"Edit Profile"} setbaricon={false}  setcarticon={false}/>
        <UserProfileSettings/>
    </div>
  )
}

export default EditProfilescreen