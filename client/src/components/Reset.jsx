import React from 'react'
import '../CSS/Username.css'
import { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { resetPasswordValidate } from '../helper/validate'

const Reset = () => {

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: ''
        },
        validate: resetPasswordValidate,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values => {
            console.log(values)
        }
    })

    return (
        <>
            <div className="container mx-auto">

                <Toaster position='top-center' reverseOrder={false}></Toaster>

                <div className="flex justify-center items-center py-10">
                    <div className='glass'>

                        <div className="title flex flex-col items-center">
                            <h4 className='text-5xl font-bold'>Reset</h4>
                            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
                                Enter new password
                            </span>
                        </div>

                        <form className="py-20" onSubmit={formik.handleSubmit}>

                            <div className="texbox flex flex-col items-center gap-6">
                                <input {...formik.getFieldProps('password')} type="password" placeholder='New Password' className='textbox' />
                                <input {...formik.getFieldProps('consfirmPassword')} type="password" placeholder='Confirm Password' className='textbox' />
                                <button type='submit' className='btn'>Reset</button>
                            </div>

                        </form>
                    </div>


                </div>
            </div>
        </>
    )
}

export default Reset