import './auth.css'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../hooks/hooks'
import { useLoginMutation } from '../../services/authApi'
import { toast } from 'react-toastify'
import { setUserLogin } from '../../slices/authSlice'
import { AiOutlineLoading3Quarters, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

import { validateEmail, validatePassword } from '../../utils/validation'

import { isV2Enabled } from '../../utils/featureFlags'

const Login = () => {
    const v2Active = isV2Enabled();
    const emailRef = useRef<HTMLInputElement | null>(null)
    const passwordRef = useRef<HTMLInputElement | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [login, { data: LoginData, isSuccess, isLoading }] = useLoginMutation()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const email = emailRef.current?.value || ''
        const password = passwordRef.current?.value || ''

        const emailVal = validateEmail(email);
        if (!emailVal.isValid) {
            toast.error(emailVal.message, { autoClose: 2000 });
            return;
        }

        const pwdVal = validatePassword(password);
        if (!pwdVal.isValid) {
            toast.error(pwdVal.message, { autoClose: 2000 });
            return;
        }

        try {
            await login({ email, password }).unwrap();
        }
        catch (error: any) {
            const errorMessage = error?.data?.message || 'Something went wrong. Please try again.';
            toast.error(errorMessage, {
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
            dispatch(setUserLogin({ name: LoginData.data.user.name, token: LoginData.token, role: LoginData.data.user.role, userId: LoginData.data.user._id, user: LoginData.data.user }))
            navigate('/')
        }

    }, [isSuccess])


    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, []);

    return (
        <div className={`login ${v2Active ? 'v2-auth-page' : ''}`}>
            <div className="login-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h1>Log in to DriveEasy</h1>
                    <p>Please login to your account</p>
                    <div className="input-group">
                        <input type="email" id="email" name="email" placeholder="Email" ref={emailRef} required disabled={isLoading} />
                    </div>
                    <div className="input-group">
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder="Password"
                                ref={passwordRef}
                                required
                                disabled={isLoading}
                            />
                            <span
                                className="password-toggle-icon"
                                onClick={() => setShowPassword(!showPassword)}
                                title={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                            </span>
                        </div>
                    </div>
                    <button type="submit" disabled={isLoading} className={isLoading ? 'loading' : ''}>
                        {isLoading ? (
                            <>
                                <AiOutlineLoading3Quarters className="spinner" />
                                Logging in...
                            </>
                        ) : (
                            'Login'
                        )}
                    </button>
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
