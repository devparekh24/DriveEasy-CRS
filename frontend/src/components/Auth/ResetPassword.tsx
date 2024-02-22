import { useEffect, useRef } from 'react'
import { useResetPasswordMutation } from '../../services/authApi'
import './auth.css'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const ResetPassword = () => {

    const navigate = useNavigate()
    const params = useParams<{ token: string }>();
    const passwordRef = useRef<HTMLInputElement | null>(null)
    const confirmPasswordRef = useRef<HTMLInputElement | null>(null)
    const [resetPassword, { data, isSuccess, isError, error }] = useResetPasswordMutation()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const password = passwordRef.current?.value || ''
        const confirmPassword = confirmPasswordRef.current?.value || ''
        try {
            if (password !== confirmPassword) {
                toast.error('Password & Confirm Password must be same', {
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                })
            }
            if (password === confirmPassword) {
                await resetPassword({ token: params.token, password, confirmPassword }).unwrap();
            }
            if (isError) throw error
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
        <div className="login">
            <div className="login-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h1>Reset Your Password</h1>
                    <div className="input-group">
                        <input type="password" id="password" name="password" placeholder="Password" ref={passwordRef} minLength={8} required />
                    </div>
                    <div className="input-group">
                        <input type="password" id="confirm-password" name="confirm-password" placeholder="Confirm Password" ref={confirmPasswordRef} required />
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