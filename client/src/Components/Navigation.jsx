import React from "react";
import { Link, useLocation } from "react-router-dom";
import { getAuthToken } from "../Api/journeys";


const Navigation = ({ handleLogout }) => {
  const location = useLocation(); // Get the current path

  const isActive = (path) => location.pathname === path;

  return (
    <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
      <li>
        <Link
          to="/"
          className={`block py-2 pr-4 pl-3 rounded lg:p-0 ${
            isActive("/")
              ? "text-primary-700 font-bold dark:text-white underline"
              : "text-gray-700 dark:text-gray-400"
          }`}
          aria-current={isActive("/") ? "page" : undefined}
        >
          Home
        </Link>
      </li>
      <li>
        <Link
          to="/explore"
          className={`block py-2 pr-4 pl-3 rounded lg:p-0 ${
            isActive("/explore")
              ? "text-primary-700 font-bold dark:text-white underline"
              : "text-gray-700 dark:text-gray-400"
          }`}
        >
          Explore
        </Link>
      </li>
      <li>
        <Link
          to="/profile"
          className={`block py-2 pr-4 pl-3 rounded lg:p-0 ${
            isActive("/profile")
              ? "text-primary-700 font-bold dark:text-white underline"
              : "text-gray-700 dark:text-gray-400"
          }`}
        >
          Profile
        </Link>
      </li>
      {getAuthToken() && (
        <li>
          <button
            onClick={handleLogout}
            className={`block py-1 pr-4 pl-3 rounded-md lg:p-0 ${
              isActive("/logout")
                ? "text-red-500 font-bold dark:text-white"
                : "text-red-300 dark:text-red-400"
            }`}
          >
            Logout
          </button>
        </li>
      )}
    </ul>
  );
};

export default Navigation;
