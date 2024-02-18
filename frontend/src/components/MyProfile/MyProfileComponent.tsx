import { useEffect, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks/hooks"
import { toast } from "react-toastify"
import Avatar from '@mui/material/Avatar';
import { useUpdateMeMutation } from "../../services/userApi";
import { logout } from "../../slices/authSlice";
import { useNavigate } from "react-router-dom";
import { Button, Popconfirm, message } from 'antd';
import MyProfileImgUploader from "../ImageUploader/MyProfileImgUploader";
import { useGetUserMutation } from "../../services/userApi";
import { setUsers } from "../../slices/userSlice";

export const MyProfileComponent = () => {

  const nameRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)
  const currentPasswordRef = useRef<HTMLInputElement | null>(null)
  const newPasswordRef = useRef<HTMLInputElement | null>(null)
  const confirmPasswordRef = useRef<HTMLInputElement | null>(null)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [name, setName] = useState<string | undefined>("");
  const [email, setEmail] = useState<string | undefined>("");
  const [image, setImage] = useState<string | undefined>("");

  const userId = JSON.parse(localStorage.getItem('user')!).userId;

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
  }, [isSuccess, data, isLoading])

  const [getUser, { data: userData, isError: isErrorOnGetUser, error: errorOnGetUser, isSuccess: isSuccessOnGetUser }] = useGetUserMutation()

  const getCurrentUser = async () => {
    try {
      if (userId) {
        await getUser(userId).unwrap()
      }
      if (isErrorOnGetUser) throw errorOnGetUser
    }
    catch (error: any) {
      message.error(error.data.message)
    }
  }

  useEffect(() => {
    getCurrentUser()
  }, [image])

  useEffect(() => {
    setTimeout(() => {
      if (isSuccessOnGetUser) {
        dispatch(setUsers(userData!.data))
      }
    }, 100)

  }, [dispatch, isSuccessOnGetUser, userData])

  const loginUser = useAppSelector(state => state.user.users)
  console.log(loginUser)

  useEffect(() => {
    // Update local state with the initial name and email from the user profile
    setName(loginUser.data?.name);
    setEmail(loginUser.data?.email);
  }, [loginUser]);

  return (
    <div className="myprofile-component">
      <div className="myprofile-form-container">
        <form className="myprofile-form">
          <div className="input-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ marginBottom: 15 }}>My Profile</h2>
            <Avatar src={loginUser.data?.image}
              sx={{ width: 100, height: 100 }} style={{ marginBottom: 20 }} />
            <MyProfileImgUploader onUpload={(imgUrl) => setImage(imgUrl)} url={`http://localhost:8000/users/${userId}/user-img-upload`} />
          </div>
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" placeholder="Name" value={name} ref={nameRef} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="input-group">
            <label htmlFor="emailAddress">Email Address</label>
            <input type="email" id="email" name="email" placeholder="Email" value={email} ref={emailRef} onChange={(e) => setEmail(e.target.value)} />
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
