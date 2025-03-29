import React, { useState } from 'react'
import axios from "axios"
import "./Login.scss"

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post("http://127.0.0.1:8080/api/login", { email, password })
            localStorage.setItem("token", response.data.access_token)
            window.location.href = "/dashboard"
        } catch (err) {
            setError("Invalid credentials")
        }
    }

  return (
    <div className="login=container">
        <form onSubmit={handleLogin}>
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={[password]} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Login</button>
        </form>
    </div>
  )
}

export default Login