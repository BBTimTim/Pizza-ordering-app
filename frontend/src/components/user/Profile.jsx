import React from 'react'
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../redux/auth/authSlice';
export default function Profile() {

   const  user = useSelector(selectCurrentUser);
   
  return (
    <div>
     <h1>Üdv, {user?.name}!</h1>

    </div>
  )
}
