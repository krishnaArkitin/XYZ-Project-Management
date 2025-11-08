
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Project, UserRole } from '../../types';
import { HomeIcon, ListIcon, MessageIcon, VideoIcon, PlusCircleIcon, LogoutIcon } from '../icons/Icons';
import api from '../../api'; // Import the API utility

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const commonNavItems: NavItem[] = [
  { to: '/dashboard/home', icon: <HomeIcon />, label: 'Dashboard' },
  { to: '/dashboard/projects', icon: <ListIcon />, label: 'All Projects' },
  { to: '/dashboard/messaging', icon: <MessageIcon />, label: 'Messages' },
  { to: '/dashboard/video-call', icon: <VideoIcon />, label: 'Video Calls' },
];

const roleNavItems: Record<UserRole, NavItem[]> = {
  [UserRole.Client]: [
    { to: '/dashboard/create-project', icon: <PlusCircleIcon />, label: 'New Project' },
  ],
  [UserRole.Admin]: [
    { to: '/dashboard/create-project', icon: <PlusCircleIcon />, label: 'New Project' },
  ],
  [UserRole.Vendor]: [],
};


const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [errorProjects, setErrorProjects] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProjects = async () => {
      if (!user) {
        setLoadingProjects(false);
        return;
      }
      setLoadingProjects(true);
      setErrorProjects(null);
      try {
        const { data } = await api.get<Project[]>('/projects');
        setUserProjects(data.slice(0, 3)); // Display up to 3 projects in sidebar
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        setErrorProjects('Failed to load projects.');
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchUserProjects();
  }, [user]);

  if (!user) {
    // This case should ideally be handled by ProtectedRoute, but a fallback is good.
    navigate('/'); // Redirect to landing page
    return null;
  }
  
  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to landing page after logout
  };

  const navItems = [...commonNavItems, ...roleNavItems[user.role]];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200">
      <div className="h-20 flex items-center justify-center border-b border-slate-200">
        <h1 className="text-2xl font-bold text-indigo-600">XYZ Corp</h1>
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-4 py-6 space-y-4">
            <div>
                <h3 className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Menu</h3>
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 group ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </NavLink>
                ))}
            </div>
            {loadingProjects ? (
                <div className="px-4 text-slate-500 text-sm">Loading projects...</div>
            ) : errorProjects ? (
                <div className="px-4 text-red-500 text-sm">{errorProjects}</div>
            ) : userProjects.length > 0 && (
              <div>
                <h3 className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">My Projects</h3>
                <div className="space-y-1">
                {userProjects.map(project => (
                   <Link key={project._id} to={`/dashboard/project/${project._id}`} className="flex items-center px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors duration-200">
                      <span className="w-2.5 h-2.5 mr-3 rounded-full bg-indigo-500"></span>
                      <span className="truncate">{project.title}</span>
                   </Link>
                ))}
                </div>
              </div>
            )}
        </nav>
      </div>
      <div className="p-4 border-t border-slate-200">
          <div className="flex items-center">
              <img className="h-10 w-10 rounded-full object-cover" src={user.avatarUrl} alt="User avatar" />
              <div className="ml-3">
                  <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.role}</p>
              </div>
              <button onClick={handleLogout} className="ml-auto text-slate-500 hover:text-indigo-600 p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                <LogoutIcon />
              </button>
          </div>
      </div>
    </aside>
  );
};

export default Sidebar;
