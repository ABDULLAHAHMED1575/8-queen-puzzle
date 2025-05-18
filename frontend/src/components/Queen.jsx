import React from 'react'
import pic from "../assets/queen-image.png"

export const Queen = () => {
  return (
    <div className='flex items-center justify-center w-full h-full'>
        <img 
        src={pic} 
        alt="Chess Queen" 
        className='w-9 h-9'
        />

    </div>
  )
}
