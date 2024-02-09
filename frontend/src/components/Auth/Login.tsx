import './auth.css'
import React, { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../hooks/hooks'
import { useLoginMutation } from '../../services/authApi'
import { toast } from 'react-toastify'
import { setUserLogin } from '../../slices/authSlice'

const Login = () => {

    const emailRef = useRef<HTMLInputElement | null>(null)
    const passwordRef = useRef<HTMLInputElement | null>(null)
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [login, { data: LoginData, isSuccess }] = useLoginMutation()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const email = emailRef.current?.value || ''
        const password = passwordRef.current?.value || ''

        try {
            if (email && password) {
                await login({ email, password }).unwrap();
            }
        }
        catch (error: any) {
            // console.log(error)
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
            toast.success('Login Successful!', {
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
            console.log(LoginData)
            dispatch(setUserLogin({ name: LoginData.data.user.name, token: LoginData.token, role: LoginData.data.user.role, userId: LoginData.data.user._id, user: LoginData.data.user }))
            navigate('/')
        }

    }, [isSuccess])

    return (
        <div className="login">
            <div className="login-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    {/* <h1>Welcome Back</h1> */}
                    <h1>Log in to DriveEasy</h1>
                    <p>Please login to your account</p>
                    <div className="input-group">
                        <input type="email" id="email" name="email" placeholder="Email" ref={emailRef} required />
                    </div>
                    <div className="input-group">
                        <input type="password" id="password" name="password" placeholder="Password" ref={passwordRef} required />
                    </div>
                    <button type="submit">Login</button>
                    <div className="bottom-text">
                        <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
                        <p><Link to="/forgot-password">Forgot password?</Link></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login