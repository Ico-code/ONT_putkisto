import React from "react";
// Changed to a standard global CSS import
import "./Header.css";
import { Search, Moon, Sun } from "lucide-react";

interface User {
  name: string;
  role: string;
  avatarUrl: string;
}

interface HeaderProps {
  user: User;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  isDarkMode,
  toggleTheme,
}) => {
  // Icon size consistency
  const iconSize = 10;

  return (
    <header className="header">
      {/* Search Bar */}
      <div className="searchBar">
        <Search size={iconSize} className="icon searchIcon" />
        <input
          type="text"
          placeholder="Search tasks, commits, or pipelines..."
        />
      </div>

      {/* Right Side Controls */}
      <div className="controls">
        {/* Theme Toggle Button */}
        <button className="controlButton" onClick={toggleTheme}>
          {isDarkMode ? (
            <Sun size={iconSize} className="icon" />
          ) : (
            <Moon size={iconSize} className="icon" />
          )}
        </button>

        {/* User Profile */}
        <div className="userProfile">
          <div className="userInfo">
            <p className="userName">{user.name}</p>
            <p className="userRole">{user.role}</p>
          </div>
          <img src={user.avatarUrl} alt="User Avatar" className="avatar" />
          {/* Dropdown menu logic would go here */}
        </div>
      </div>
    </header>
  );
};
