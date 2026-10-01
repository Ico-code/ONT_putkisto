import React from 'react'
import { Link } from 'react-router'
import './NotFoundView.css'

const NotFoundView: React.FC = () => {
	return (
		<main className="notfound">
			<h1 className="notfound__title">404 — Page Not Found</h1>
			<p className="notfound__message">Sorry, the page you're looking for does not exist.</p>
			<Link className="notfound__link" to="/">Go back home</Link>
		</main>
	)
}

export const NotFoundViewPage = NotFoundView
export default NotFoundView

