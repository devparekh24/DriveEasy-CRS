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
  const contactNumberRef = useRef<HTMLInputElement | null>(null)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [name, setName] = useState<string | undefined>("");
  const [email, setEmail] = useState<string | undefined>("");
  const [image, setImage] = useState<string | undefined>("");
  const [contactNumber, setContactNumber] = useState<number | undefined>();

  const userId = JSON.parse(localStorage.getItem('user')!).userId;

  const [updateMe, { data, isLoading, isSuccess }] = useUpdateMeMutation()

  const handleValidation = () => {

    if (name! || contactNumber!) {
      const nameRegex = /^[A-Za-z][A-Za-z]+$/;
      if (!name!.trim()) {
        toast.error('Name is not Empty!', {
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
        return false
      } else if (!nameRegex.test(name!)) {
        toast.error('Invalid characters in Name!', {
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
        return false
      }

      // Phone number validation
      const phoneRegex = /^\d{10}$/;
      if (!contactNumber?.toString().trim()) {
        toast.error('Phone Number is not Empty!', {
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
        return false
      } else if (!phoneRegex.test(contactNumber.toString())) {
        toast.error('phone number must be 10 digit long only', {
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
        return false
      }
      return true
    }

  }

  const handleSubmit = async (event: any) => {

    event.preventDefault();
    const validationSuccess = handleValidation();

    if (validationSuccess) {
      const nameInput = nameRef.current?.value || ''
      const emailInput = emailRef.current?.value || ''
      const currentPasswordInput = currentPasswordRef.current?.value || ''
      const newPasswordInput = newPasswordRef.current?.value || ''
      const confirmPasswordInput = confirmPasswordRef.current?.value || ''
      const contactNumberInput = contactNumberRef.current?.value || ''

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
        if (nameInput || emailInput || contactNumberInput || (currentPasswordInput && newPasswordInput && confirmPasswordInput)) {
          await updateMe({
            name: nameInput,
            email: emailInput,
            currentPassword: currentPasswordInput,
            password: newPasswordInput,
            confirmPassword: confirmPasswordInput,
            contactNumber: +contactNumberInput
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

  }

  useEffect(() => {
    if (isSuccess) {
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
      if (isSuccessOnGetUser && userData && (userData as any).data) {
        dispatch(setUsers([(userData as any).data]))
      }
    }, 100)

  }, [dispatch, isSuccessOnGetUser, userData])

  const loginUser = useAppSelector(state => state.user.users)

  useEffect(() => {
    // Update local state with the initial name email contactNumber from the user profile
    const currentUser = loginUser[0];
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setContactNumber((currentUser as any).contactNumber);
    }
  }, [loginUser]);

  return (
    <div className="myprofile-component">
      <div className="myprofile-form-container">
        <form className="myprofile-form">
          <div className="input-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ marginBottom: 15 }}>My Profile</h2>
            <Avatar src={loginUser[0]?.image}
              sx={{ width: 100, height: 100 }} style={{ marginBottom: 20 }} />
            <MyProfileImgUploader onUpload={(imgUrl) => setImage(imgUrl)} url={`${import.meta.env.VITE_API_URL}/users/${userId}/user-img-upload`} />
          </div>
          <div className="myprofile-form-content">
            <div className="myprofile-form-content-left">
              <div className="input-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" placeholder="Name" value={name} ref={nameRef} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="input-group">
                <label htmlFor="emailAddress">Email Address</label>
                <input type="email" id="email" name="email" placeholder="Email" value={email} ref={emailRef} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="input-group">
                <label htmlFor="contactNumber">Contact Number</label>
                <input type="number" id="cono" name="contactNumber" placeholder="Contact Number" ref={contactNumberRef} value={contactNumber} onChange={(e) => setContactNumber(+e.target.value)} />
              </div>
            </div>
            <div className="myprofile-form-content-right">
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
            </div>
          </div>
          <div className="myprofile-update-btn">
            <Popconfirm
              title="Update the Profile"
              description="Are you sure to update this profile?"
              okText="Yes"
              cancelText="No"
              onConfirm={handleSubmit}
            >
              <Button style={{ background: 'black', color: 'white' }}>Update</Button>
            </Popconfirm>
          </div>
        </form>
      </div>
    </div >
  )
}
