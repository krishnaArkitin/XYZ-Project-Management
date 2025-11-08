

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Project, ProjectStatus, UserRole } from '../../types';
import { Link } from 'react-router-dom';
import api from '../../api'; // Import the API utility

const StatCard: React.FC<{ title: string; value: number | string; icon: React.ReactNode; color: string; gradient: string }> = ({ title, value, icon, color, gradient }) => (
    <div className={`bg-white p-6 rounded-2xl shadow-md border border-slate-200 flex items-center justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
        <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
        </div>
        <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center text-3xl ${color} ${gradient}`}>
            {icon}
        </div>
    </div>
);

const ProjectRow: React.FC<{project: Project}> = ({ project }) => {
    const statusProgressMap: Record<ProjectStatus, string> = {
        [ProjectStatus.Requested]: '10%',
        [ProjectStatus.Quotation]: '25%',
        [ProjectStatus.Approved]: '40%',
        [ProjectStatus.InProgress]: '75%',
        [ProjectStatus.Completed]: '100%',
        [ProjectStatus.Rejected]: '0%',
    };
    const progress = statusProgressMap[project.status];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-4 border-b border-slate-100 last:border-b-0">
            <div>
                <p className="font-semibold text-slate-800 truncate">{project.title}</p>
                <p className="text-xs text-slate-500">{project.category}</p>
            </div>
            <div>
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-slate-500">{project.status}</span>
                    <span className="text-xs font-bold text-indigo-600">{progress}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{width: progress}}></div>
                </div>
            </div>
            <Link to={`/dashboard/project/${project._id}`} className="md:text-right text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                View Details &rarr;
            </Link>
        </div>
    );
}

const ActivityItem: React.FC<{icon: string, text: React.ReactNode, time: string}> = ({icon, text, time}) => (
    <div className="flex items-start space-x-4 py-3">
        <div className="flex-shrink-0 bg-slate-100 w-10 h-10 flex items-center justify-center rounded-full text-slate-600 text-xl">{icon}</div>
        <div>
            <p className="text-sm text-slate-800">{text}</p>
            <p className="text-xs text-slate-500 mt-0.5">{time}</p>
        </div>
    </div>
);

const DashboardHome: React.FC = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const { data } = await api.get<Project[]>('/projects');
                setProjects(data);
            } catch (err) {
                console.error('Failed to fetch projects:', err);
                setError('Failed to load projects.');
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [user]);


    const stats = React.useMemo(() => {
        return {
            total: projects.length,
            inProgress: projects.filter(p => p.status === ProjectStatus.InProgress).length,
            awaitingQuote: projects.filter(p => p.status === ProjectStatus.Quotation).length,
            completed: projects.filter(p => p.status === ProjectStatus.Completed).length,
        }
    }, [projects]);
    
    return (
        <div className="space-y-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">Welcome back, {user?.name}! 👋</h1>
              <p className="text-slate-600 mt-1">Here's what's happening with your projects today.</p>
            </div>
            
            {/* Stats */}
            {loading ? (
                <div className="text-center text-slate-500 py-10">Loading stats...</div>
            ) : error ? (
                <div className="text-center text-red-500 py-10">{error}</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Total Projects" value={stats.total} icon={'📁'} color="text-indigo-600" gradient="bg-indigo-100" />
                    <StatCard title="In Progress" value={stats.inProgress} icon={'⏳'} color="text-blue-600" gradient="bg-blue-100" />
                    <StatCard title="Awaiting Quote" value={stats.awaitingQuote} icon={'📝'} color="text-yellow-600" gradient="bg-yellow-100" />
                    <StatCard title="Completed" value={stats.completed} icon={'✅'} color="text-green-600" gradient="bg-green-100" />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Projects Overview */}
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-md border border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-slate-800">Projects Overview</h2>
                        <Link to="/dashboard/projects" className="text-sm font-medium text-indigo-600 hover:underline">View all</Link>
                    </div>
                    {loading ? (
                        <div className="text-center text-slate-500 py-10">Loading projects...</div>
                    ) : error ? (
                        <div className="text-center text-red-500 py-10">{error}</div>
                    ) : projects.length === 0 ? (
                        <div className="text-center text-slate-500 py-10">No projects found.</div>
                    ) : (
                        <div>
                            {projects.slice(0, 4).map(p => <ProjectRow key={p._id} project={p} />)}
                        </div>
                    )}
                </div>

                {/* Recent Activity (Mocked for now) */}
                <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Activity</h2>
                    <div className="space-y-2 divide-y divide-slate-100">
                        <ActivityItem icon="💬" text={<>New message from <strong>Admin</strong> on "Website Redesign"</>} time="2 hours ago" />
                        <ActivityItem icon="🗓️" text={<>Timeline updated for <strong>New IoT Device</strong></>} time="1 day ago" />
                        <ActivityItem icon="✔️" text={<>You approved the quote for <strong>Mobile App Dev</strong></>} time="3 days ago" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
