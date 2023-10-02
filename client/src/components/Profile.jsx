import React from 'react'
import { useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png'
import '../CSS/Username.css'
import toast, { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { profileValidation } from '../helper/validate'
import { useState } from 'react'
import convertToBase64 from '../helper/convert'
import useFetch from '../hooks/hooks'
import { updateUser } from '../helper/helper'

const Profile = () => {

  const [file, setFile] = useState();
  const [{ isLoading, apiData, serverError }] = useFetch();
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      firstName: apiData?.firstName || '',
      lastName: apiData?.lastName || '',
      email: apiData?.email || '',
      mobile: apiData?.mobile || '',
      address: apiData?.address || ''
    },
    enableReinitialize: true,
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      values = await Object.assign(values, { profile: file || apiData?.profile || '' })
      console.log(values)
      let updatePromise = updateUser(values);

      toast.promise(updatePromise, {
        loading: 'Updating...',
        success: <b>Update Successfully...!</b>,
        error: <b>Could not Update!</b>
      });

    }
  })

  // formik doesnt support file upload so we need to create this handler

  const upload = async e => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }

  // logout handler function
  function userLogout() {
    localStorage.removeItem('token');
    navigate('/')
  }

  if (isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
  if (serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

  return (
    <>
      <div className="container mx-auto">

        <Toaster position='top-center' reverseOrder={false}></Toaster>

        <div className="flex justify-center items-center py-5">
          <div className='glass -mb-10'>

            <div className="title flex flex-col items-center -m-8">
              <h4 className='text-5xl font-bold'>Register</h4>
              <span className="py-4 text-xl w-2/3 text-center text-gray-500">
                Happy to join you
              </span>
            </div>

            <form className="py-1" onSubmit={formik.handleSubmit}>
              <div className="profile flex justify-center py-4">
                <label htmlFor="profile">
                  <img src={apiData?.profile || file || avatar} className='profile_img' alt="avatar" />
                </label>

                <input onChange={upload} type="file" id='profile' name='profile' />
              </div>

              <div className="texbox flex flex-col items-center gap-6">

                <div className="name flex w-3/4 gap-10">
                  <input {...formik.getFieldProps('firstName')} type="text" placeholder='FirstName' className='textbox' />
                  <input {...formik.getFieldProps('lastName')} type="text" placeholder='LastName' className='textbox' />
                </div>

                <div className="name flex w-3/4 gap-10">
                  <input {...formik.getFieldProps('mobile')} type="text" placeholder='Mobile No.' className='textbox' />
                  <input {...formik.getFieldProps('email')} type="text" placeholder='Email' className='textbox' />
                </div>

                <input {...formik.getFieldProps('address')} type="text" placeholder='Address' className='textbox' />
                <button type='submit' className='btn'>Register</button>

              </div>

              <div className="text-center py-4">
                <span className='text-gray-500'>Come Back Later? <button onClick={userLogout}>Log Out</button></span>
              </div>
            </form>
          </div>


        </div>
      </div>
    </>
  )
}

export default Profile

