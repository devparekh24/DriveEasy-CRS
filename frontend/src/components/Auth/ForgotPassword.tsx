import './auth.css'
import { Link } from 'react-router-dom'

const ForgotPassword = () => {
    return (
        <div className="login">
            <div className="login-container">
                <form className="login-form">
                    <h1>Forgot Your Password</h1>
                    <div className="input-group">
                        <input type="email" id="email" name="email" placeholder="Email" required />
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

export default ForgotPassword
