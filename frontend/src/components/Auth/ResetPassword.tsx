import { useEffect, useRef, useState } from 'react'
import { useResetPasswordMutation } from '../../services/authApi'
import './auth.css'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

import { validatePassword, validateConfirmPassword } from '../../utils/validation'
import { isV2Enabled } from '../../utils/featureFlags'

const ResetPassword = () => {
    const v2Active = isV2Enabled();
    const navigate = useNavigate()
    const params = useParams<{ token: string }>();
    const passwordRef = useRef<HTMLInputElement | null>(null)
    const confirmPasswordRef = useRef<HTMLInputElement | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [resetPassword, { data, isSuccess, isError, error }] = useResetPasswordMutation()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const password = passwordRef.current?.value || ''
        const confirmPassword = confirmPasswordRef.current?.value || ''

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
            await resetPassword({ token: params.token, password, confirmPassword }).unwrap();
            if (isError) throw error;
        }
        catch (error: any) {
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
            toast.success('Password Reset Successful!', {
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
            navigate('/login')
        }
    }, [isSuccess])


    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, []);

    return (
        <div className={`login ${v2Active ? 'v2-auth-page' : ''}`}>
            <div className="login-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h1>Reset Your Password</h1>
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
                    <button type="submit">Submit</button>
                    <div className="bottom-text">
                        <p>Already have an account? <Link to="/login">Log in</Link></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword   