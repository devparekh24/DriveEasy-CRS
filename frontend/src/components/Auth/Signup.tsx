import { useEffect, useRef, useState } from 'react'
import { useAppDispatch } from '../../hooks/hooks'
import { useSignupMutation } from '../../services/authApi'
import './auth.css'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { setUserSignup } from '../../slices/authSlice'
import { AiOutlineLoading3Quarters, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

import { validateName, validateEmail, validatePhone, validatePassword, validateConfirmPassword } from '../../utils/validation'
import { isV2Enabled } from '../../utils/featureFlags'

const Signup = () => {
    const v2Active = isV2Enabled();
    const userNameRef = useRef<HTMLInputElement | null>(null)
    const emailRef = useRef<HTMLInputElement | null>(null)
    const passwordRef = useRef<HTMLInputElement | null>(null)
    const confirmPasswordRef = useRef<HTMLInputElement | null>(null)
    const contactNumberRef = useRef<HTMLInputElement | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [signup, { data: signupData, isSuccess, isError, error, isLoading }] = useSignupMutation()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const userName = userNameRef.current?.value || ''
        const email = emailRef.current?.value || ''
        const password = passwordRef.current?.value || ''
        const confirmPassword = confirmPasswordRef.current?.value || ''
        const contactNumber = contactNumberRef.current?.value || ''

        // Form Validations
        const nameVal = validateName(userName);
        if (!nameVal.isValid) {
            toast.error(nameVal.message, { autoClose: 2000 });
            return;
        }

        const emailVal = validateEmail(email);
        if (!emailVal.isValid) {
            toast.error(emailVal.message, { autoClose: 2000 });
            return;
        }

        const phoneVal = validatePhone(contactNumber);
        if (!phoneVal.isValid) {
            toast.error(phoneVal.message, { autoClose: 2000 });
            return;
        }

        const pwdVal = validatePassword(password);
        if (!pwdVal.isValid) {
            toast.error(pwdVal.message, { autoClose: 2000 });
            return;
        }

        const confirmPwdVal = validateConfirmPassword(password, confirmPassword);
        if (!confirmPwdVal.isValid) {
            toast.error(confirmPwdVal.message, { autoClose: 2000 });
            return;
        }

        try {
            await signup({ name: userName, email, password, confirmPassword, contactNumber: +contactNumber }).unwrap();
        }
        catch (error: any) {
            let errorMessage = 'Something went wrong. Please try again.';

            if (error?.data?.error?.code === 11000 || error?.data?.message?.includes('already exists') || error?.data?.message?.includes('Duplicate')) {
                errorMessage = error?.data?.message || 'User with this email or phone number already exists!';
            } else if (error?.data?.message) {
                errorMessage = error.data.message;
            }

            toast.error(errorMessage, {
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
        }
    }

    useEffect(() => {
        if (isSuccess && signupData?.data?.user) {
            toast.success('Signup Successful!', {
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
            const user = signupData.data.user;
            dispatch(setUserSignup({
                name: user.name || '',
                email: user.email || '',
                confirmPassword: '',
                password: '',
                contactNumber: user.contactNumber || 0,
                user: user
            }))
            navigate('/login')
        }

    }, [isSuccess, signupData, dispatch, navigate])


    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, []);

    return (
        <div className={`login ${v2Active ? 'v2-auth-page' : ''}`}>
            <div className="login-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h1>Sign up</h1>
                    <div className="input-group">
                        <input type="text" id="username" name="username" placeholder="Username" ref={userNameRef} required disabled={isLoading} />
                    </div>
                    <div className="input-group">
                        <input type="email" id="email" name="Email" placeholder="Email" ref={emailRef} required disabled={isLoading} />
                    </div>
                    <div className="input-group">
                        <input
                            type="tel"
                            id="cono"
                            name="contactNumber"
                            placeholder="Contact Number (10 digits)"
                            ref={contactNumberRef}
                            maxLength={10}
                            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
                            }}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="input-group">
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder="Password"
                                ref={passwordRef}
                                minLength={8}
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
                    <div className="input-group">
                        <div className="password-input-wrapper">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirm-password"
                                name="confirm-password"
                                placeholder="Confirm Password"
                                ref={confirmPasswordRef}
                                required
                                disabled={isLoading}
                            />
                            <span
                                className="password-toggle-icon"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                title={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                                {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                            </span>
                        </div>
                    </div>
                    <button type="submit" disabled={isLoading} className={isLoading ? 'loading' : ''}>
                        {isLoading ? (
                            <>
                                <AiOutlineLoading3Quarters className="spinner" />
                                Signing up...
                            </>
                        ) : (
                            'Sign up'
                        )}
                    </button>
                    <div className="bottom-text">
                        <p>Already have an account? <Link to="/login">Log in</Link></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup   
