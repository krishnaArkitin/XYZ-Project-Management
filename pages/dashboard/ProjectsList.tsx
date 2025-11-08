
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Project, ProjectCategory, ProjectStatus, UserRole } from '../../types';
import { PlusCircleIcon, SearchIcon } from '../../components/icons/Icons';
import { useAuth } from '../../context/AuthContext';
import api from '../../api'; // Import the API utility

const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
        case ProjectStatus.InProgress: return 'bg-blue-100 text-blue-800';
        case ProjectStatus.Completed: return 'bg-green-100 text-green-800';
        case ProjectStatus.Quotation: return 'bg-yellow-100 text-yellow-800';
        case ProjectStatus.Approved: return 'bg-indigo-100 text-indigo-800';
        case ProjectStatus.Rejected: return 'bg-red-100 text-red-800';
        default: return 'bg-slate-100 text-slate-800';
    }
};

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col border border-slate-200">
        <div className="p-6 flex-grow">
            <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-indigo-600">{project.category}</p>
                 <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                    {project.status}
                </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">{project.title}</h3>
            <p className="text-slate-600 mt-2 text-sm line-clamp-2">{project.description}</p>
        </div>
        <div className="bg-slate-50 px-6 py-4 rounded-b-2xl border-t border-slate-200 mt-4">
            <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Timeline: <strong>{project.expectedTimeline}</strong></span>
                 <Link to={`/dashboard/project/${project._id}`} className="font-medium text-indigo-600 hover:text-indigo-800">
                    View Details &rarr;
                </Link>
            </div>
        </div>
    </div>
);


const ProjectsList: React.FC = () => {
    const { user } = useAuth();
    const [allProjects, setAllProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | 'All'>('All');

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
                setAllProjects(data);
                setFilteredProjects(data);
            } catch (err) {
                console.error('Failed to fetch projects:', err);
                setError('Failed to load projects.');
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [user]);

    useEffect(() => {
        let currentProjects = [...allProjects];

        if (selectedStatus !== 'All') {
            currentProjects = currentProjects.filter(p => p.status === selectedStatus);
        }

        if (searchTerm) {
            currentProjects = currentProjects.filter(p =>
                p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredProjects(currentProjects);
    }, [allProjects, searchTerm, selectedStatus]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
                    <p className="text-slate-600 mt-1">Search, filter, and manage all your projects.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-grow md:flex-grow-0">
                        <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search" 
                            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg w-full md:w-48 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select 
                        className="py-2 px-3 border border-slate-300 bg-white rounded-lg flex-shrink-0 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value as ProjectStatus | 'All')}
                    >
                        <option value="All">Status: All</option>
                        {Object.values(ProjectStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                     {user?.role !== UserRole.Vendor && (
                        <Link to="/dashboard/create-project" className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                            <PlusCircleIcon />
                            <span className="hidden sm:inline">New Project</span>
                        </Link>
                     )}
                </div>
            </div>
            {loading ? (
                <div className="text-center text-slate-500 py-10">Loading projects...</div>
            ) : error ? (
                <div className="text-center text-red-500 py-10">{error}</div>
            ) : filteredProjects.length === 0 ? (
                <div className="text-center text-slate-500 py-10">No projects found matching your criteria.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map(project => (
                        <ProjectCard key={project._id} project={project} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectsList;
