import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import { Header } from './header/header'
import { Sidebar } from './sideBar/sideBar'
import './DefaultLayout.css'

const DefaultLayout: React.FC = () => {
  const location = useLocation()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const mockUser = {
    name: 'Demo User',
    role: 'Admin',
    avatarUrl: 'https://avatars.dicebear.com/api/identicon/demo.svg',
  }

  const toggleTheme = () => setIsDarkMode(v => !v)

  return (
    <div className={`app-layout ${isDarkMode ? 'dark' : ''}`}>
      <Sidebar activeRoute={location.pathname} isCollapsed={isSidebarCollapsed} onToggleCollapsed={() => setIsSidebarCollapsed((v) => !v)} />
      <div className={`app-layout__content ${isSidebarCollapsed ? 'collapsed-sidebar' : ''}`}>
        <Header user={mockUser} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <section className="app-layout__view">
          <Outlet />
        </section>
      </div>
    </div>
  )
}

export default DefaultLayout
