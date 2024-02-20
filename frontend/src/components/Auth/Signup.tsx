import { useEffect, useRef } from 'react'
import { useAppDispatch } from '../../hooks/hooks'
import { useSignupMutation } from '../../services/authApi'
import './auth.css'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { setUserSignup } from '../../slices/authSlice'

const Signup = () => {
    const userNameRef = useRef<HTMLInputElement | null>(null)
    const emailRef = useRef<HTMLInputElement | null>(null)
    const passwordRef = useRef<HTMLInputElement | null>(null)
    const confirmPasswordRef = useRef<HTMLInputElement | null>(null)
    const contactNumberRef = useRef<HTMLInputElement | null>(null)
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [signup, { data: signupData, isSuccess, isError, error }] = useSignupMutation()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const userName = userNameRef.current?.value || ''
        const email = emailRef.current?.value || ''
        const password = passwordRef.current?.value || ''
        const confirmPassword = confirmPasswordRef.current?.value || ''
        const contactNumber = +contactNumberRef.current?.value!

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
            if (userName && email && contactNumber && password === confirmPassword) {
                await signup({ name: userName, email, password, confirmPassword, contactNumber }).unwrap();
            }
            else if (isError) {
                console.log(error)
                throw error
            }
        }
        catch (error: any) {
            console.log(error)
            if (error.data.error.code === 11000) {
                toast.error('User is already exist!', {
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                })
            }
            else {
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
            toast.success('Signup Successful!', {
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
            console.log(signupData)
            dispatch(setUserSignup({ name: signupData.data.user.name, email: signupData.data.user.email, confirmPassword: signupData.data.user.confirmPassword, password: signupData.data.user.passsword, contactNumber: signupData.data.user.contactNumber, user: signupData.data.user }))
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
                    <h1>Sign up</h1>
                    {/* <p>create your account</p> */}
                    <div className="input-group">
                        <input type="text" id="username" name="username" placeholder="Username" ref={userNameRef} required />
                    </div>
                    <div className="input-group">
                        <input type="email" id="email" name="Email" placeholder="Email" ref={emailRef} required />
                    </div>
                    <div className="input-group">
                        <input type="number" id="cono" name="contactNumber" placeholder="Contact Number" ref={contactNumberRef} required />
                    </div>

                    <div className="input-group">
                        <input type="password" id="password" name="password" placeholder="Password" ref={passwordRef} required />
                    </div>
                    <div className="input-group">
                        <input type="password" id="confirm-password" name="confirm-password" placeholder="Confirm Password" ref={confirmPasswordRef} required />
                    </div>
                    <button type="submit">Sign up</button>
                    <div className="bottom-text">
                        <p>Already have an account? <Link to="/login">Log in</Link></p>
                        {/* <p><Link to="/forgot-password">Forgot password?</Link></p> */}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup   