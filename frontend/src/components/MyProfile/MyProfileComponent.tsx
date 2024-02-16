import { useEffect, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks/hooks"
import { toast } from "react-toastify"
import Avatar from '@mui/material/Avatar';
import { useUpdateMeMutation } from "../../services/carApi";
import { logout } from "../../slices/authSlice";
import { useNavigate } from "react-router-dom";
import { Button, Popconfirm } from 'antd';

export const MyProfileComponent = () => {

  const nameRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)
  const currentPasswordRef = useRef<HTMLInputElement | null>(null)
  const newPasswordRef = useRef<HTMLInputElement | null>(null)
  const confirmPasswordRef = useRef<HTMLInputElement | null>(null)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const loginUser = useAppSelector(state => state.user.users)
  const [name, setName] = useState<string | undefined>("");
  const [email, setEmail] = useState<string | undefined>("");

  const userProfile = useAppSelector(state => state.auth.user)
  // console.log(userProfile)
  // const name = userProfile?.name
  // const email = userProfile?.email
  const userImg = userProfile?.image

  const [updateMe, { data, isError, error, isLoading, isSuccess }] = useUpdateMeMutation()

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const nameInput = nameRef.current?.value || ''
    const emailInput = emailRef.current?.value || ''
    const currentPasswordInput = currentPasswordRef.current?.value || ''
    const newPasswordInput = newPasswordRef.current?.value || ''
    const confirmPasswordInput = confirmPasswordRef.current?.value || ''

    console.log(nameInput, emailInput, currentPasswordInput, newPasswordInput, confirmPasswordInput)

    // if (newPasswordInput === currentPasswordInput) {
    //   toast.error('New Password must be different form Current Password!', {
    //     autoClose: 2000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //   })
    // } else 
    if (newPasswordInput !== confirmPasswordInput) {
      toast.error('New Password & Confirm Password must be same!', {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
    try {
      if (nameInput || emailInput || (currentPasswordInput && newPasswordInput && confirmPasswordInput)) {
        await updateMe({
          name: nameInput,
          email: emailInput,
          currentPassword: currentPasswordInput,
          password: newPasswordInput,
          confirmPassword: confirmPasswordInput
        }).unwrap();
      }
    } catch (error: any) {
      toast.error(error.data.message, {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }

  }

  useEffect(() => {
    if (isSuccess) {
      console.log(data)
      const newToken = data?.token;
      if (newToken && newToken !== JSON.parse(localStorage.getItem("user")!).token) {
        // Token has changed, trigger logout
        dispatch(logout());
        navigate('/login');
      }
      toast.success('Profile Updated Successfully!', {
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }, [isSuccess, data])

  useEffect(() => {
    // Update local state with the initial name and email from the user profile
    setName(userProfile?.name);
    setEmail(userProfile?.email);
  }, [userProfile]);
  return (
    <div className="myprofile-component">
      <div className="myprofile-form-container">
        <form className="myprofile-form">
          <div className="input-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ marginBottom: 15 }}>My Profile</h2>
            <Avatar src={loginUser!.image}
              sx={{ width: 60, height: 60 }} />
          </div>
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" placeholder="Name" value={loginUser!.name} ref={nameRef} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="input-group">
            <label htmlFor="emailAddress">Email Address</label>
            <input type="email" id="email" name="email" placeholder="Email" value={loginUser!.email} ref={emailRef} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="input-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input type="password" id="currentPassword" name="currentPassword" placeholder="Current Password" ref={currentPasswordRef} />
          </div>
          <div className="input-group">
            <label htmlFor="newPassword">New Password</label>
            <input type="password" id="newPassword" name="newPassword" placeholder="New Password" ref={newPasswordRef} />
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" ref={confirmPasswordRef} />
          </div>
          <Popconfirm
            title="Update the Profile"
            description="Are you sure to update this profile?"
            okText="Yes"
            cancelText="No"
            onConfirm={handleSubmit}
          >
            <Button style={{ background: 'black', color: 'white' }}>Update</Button>
          </Popconfirm>
          {/* <button type="submit">Update</button> */}
        </form>
      </div>
    </div >
  )
}
