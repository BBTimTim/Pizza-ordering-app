import React from 'react'
import { useDispatch } from 'react-redux';
import { logOut } from '../redux/auth/authSlice';

export default function Profile() {
    const dispatch = useDispatch();
   
    const handleLogout = () => {
    dispatch(logOut());
  };

  return (
    <div>
      <h1>Szep napot</h1>
    </div>
  )
}
