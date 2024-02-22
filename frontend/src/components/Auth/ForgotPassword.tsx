import { useEffect, useRef } from 'react';
import './auth.css'
import { Link } from 'react-router-dom'
import { useForgotPasswordMutation } from '../../services/authApi';
import { toast } from 'react-toastify';
import Loader from '../Loader/Loader';

const ForgotPassword = () => {

    const emailRef = useRef<HTMLInputElement | null>(null)
    const [forgotPassword, { data, isSuccess, isError, isLoading, error }] = useForgotPasswordMutation()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const email = emailRef.current?.value || ''

        try {
            if (email) {
                await forgotPassword({ email }).unwrap();
            }
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
            toast.success('Token sent to the email!', {
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
        }
    }, [isSuccess])

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, []);

    return (
        isLoading ? (<Loader />) : (
            <div className="login">
                <div className="login-container">
                    <form className="login-form" onSubmit={handleSubmit}>
                        <h1>Forgot Your Password</h1>
                        <div className="input-group">
                            <input type="email" id="email" name="email" placeholder="Email" ref={emailRef} required />
                        </div>
                        <button type="submit">Submit</button>
                        <div className="bottom-text">
                            <p>Already have an account? <Link to="/login">Log in</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        )
    )
}

export default ForgotPassword
