import React from 'react'
// import { Link } from 'react-router-dom'
import '../CSS/Username.css'
import { Toaster } from 'react-hot-toast'

const Recovery = () => {

    return (
        <>
            <div className="container mx-auto">

                <Toaster position='top-center' reverseOrder={false}></Toaster>

                <div className="flex justify-center items-center py-20 h-max">
                    <div className='glass'>

                        <div className="title flex flex-col items-center">
                            <h4 className='text-5xl font-bold'>Recovery</h4>
                            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
                                Enter OTP to recover password
                            </span>
                        </div>

                        <form className="pt-20">

                            <div className="texbox flex flex-col items-center gap-6">

                                <div className="input text-center">
                                    <span className="py-4 text-sm text-field text-gray-500">
                                        Enter 6 digit OTP send to your email address
                                    </span>
                                    <input type="password" placeholder='OTP' className='textbox' />
                                </div>
                                <button type='submit' className='btn'>Sign In</button>
                            </div>

                            <div className="text-center py-4">
                                <span className='text-gray-500'>Did not receive OTP? <button className='text-red-500' to="/recovery">Resend</button></span>
                            </div>
                        </form>
                    </div>


                </div>
            </div>
        </>
    )
}

export default Recovery