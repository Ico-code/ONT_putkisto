import React from 'react'
import './Dashboard.css'
import useProjects from '../../hooks/useProjects'
import { NavLink } from 'react-router'

type Props = {
	title?: string
}

const Dashboard: React.FC<Props> = ({ title = 'Dashboard' }) => {
	const { projects } = useProjects()

	const recent = [...projects]
		.sort((a, b) => (b.lastVisited ?? 0) - (a.lastVisited ?? 0))
		.slice(0, 5)

	return (
		<main className="dashboard">
			<h1 className="dashboard__title">{title}</h1>
			<p className="dashboard__subtitle">Welcome to your task management dashboard.</p>

			<section className="recentProjects">
				<h2 className="recentProjects__title">Recent projects</h2>
				{recent.length === 0 ? (
					<p className="muted">No projects yet. Create one from the sidebar.</p>
				) : (
					<div className="recentProjects__list">
						{recent.map((p) => (
							<NavLink key={p.id} to={`/projects/${p.id}`} className="recentProjectItem">
								<div className="recentProjectName">{p.name}</div>
								<div className="recentProjectMeta">{p.lastVisited ? new Date(p.lastVisited).toLocaleString() : ''}</div>
							</NavLink>
						))}
					</div>
				)}
			</section>
		</main>
	)
}

export const DashboardView = Dashboard
export default Dashboard

