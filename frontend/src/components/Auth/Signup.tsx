import './auth.css'
import { Link } from 'react-router-dom'

const Signup = () => {

    return (
        <div className="login">
            <div className="login-container">
                <form className="login-form">
                    <h1>Sign up</h1>
                    {/* <p>create your account</p> */}
                    <div className="input-group">
                        <input type="text" id="username" name="username" placeholder="Username" required />
                    </div>
                    <div className="input-group">
                        <input type="email" id="email" name="Email" placeholder="Email" required />
                    </div>
                    <div className="input-group">
                        <input type="password" id="password" name="password" placeholder="Password" required />
                    </div>
                    <div className="input-group">
                        <input type="password" id="confirm-password" name="confirm-password" placeholder="Confirm Password" required />
                    </div>
                    <button type="submit">Sign up</button>
                    <div className="bottom-text">
                        <p>Already have an account? <Link to="/login">Log in</Link></p>
                        <p><Link to="/forgot-password">Forgot password?</Link></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup   