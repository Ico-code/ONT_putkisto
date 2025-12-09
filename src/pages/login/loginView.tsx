import React, { useState } from 'react'
import './loginView.css'

type Props = {
	onLogin?: (email: string) => void
}

const LoginView: React.FC<Props> = ({ onLogin }) => {
	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		// Placeholder - replace with real auth logic
		onLogin?.(email)
	}

	return (
		<main className="login">
			<h1 className="login__title">Sign in</h1>
			<form className="login__form" onSubmit={handleSubmit}>
				<label className="login__label">
					Email
					<input
						className="login__input"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</label>
				<label className="login__label">
					Password
					<input
						className="login__input"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</label>
				<button type="submit" className="login__button">Log in</button>
			</form>
		</main>
	)
}

export const LoginViewPage = LoginView
export default LoginView

