
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Project, ProjectStatus, TimelineEvent, UserRole, User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import api from '../../api'; // Import the API utility

const ProjectTimeline: React.FC<{ timeline: TimelineEvent[], user: User | null }> = ({ timeline, user }) => (
    <div className="mt-8 flow-root">
        <ul className="-mb-8">
            {timeline.slice().reverse().map((event, eventIdx) => (
                <li key={event._id || `event-${eventIdx}`}> {/* Use _id if available, fallback to index */}
                    <div className="relative pb-10">
                        {eventIdx !== timeline.length - 1 ? (
                            <span className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex items-start space-x-4">
                             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 ring-8 ring-indigo-100">
                                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path></svg>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5">
                                <p className="font-semibold text-slate-800 text-sm">{event.title}</p>
                                <p className="mt-1 text-sm text-slate-600">{event.description}</p>
                                <p className="mt-1 text-xs text-slate-500">
                                    <time>{event.date}</time> &middot; By {event.author}
                                </p>
                            </div>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    </div>
);


const RoleSpecificActions: React.FC<{
    userRole: UserRole, 
    projectStatus: ProjectStatus,
    projectId: string,
    onStatusUpdate: (newStatus: ProjectStatus) => void
}> = ({ userRole, projectStatus, projectId, onStatusUpdate }) => {

    const updateProjectStatus = async (newStatus: ProjectStatus) => {
        try {
            await api.put(`/projects/${projectId}`, { status: newStatus });
            onStatusUpdate(newStatus);
        } catch (error) {
            console.error('Failed to update project status:', error);
            alert('Failed to update project status.');
        }
    }

    if (userRole === UserRole.Admin && projectStatus === ProjectStatus.Requested) {
        return <button 
            onClick={() => updateProjectStatus(ProjectStatus.Quotation)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">Submit Quotation</button>
    }
    if (userRole === UserRole.Client && projectStatus === ProjectStatus.Quotation) {
        return <button 
            onClick={() => updateProjectStatus(ProjectStatus.Approved)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">Approve Quotation</button>
    }
    return null;
}

const ProjectDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newTimelineEntry, setNewTimelineEntry] = useState('');
    const [timelineError, setTimelineError] = useState('');

    useEffect(() => {
        const fetchProject = async () => {
            if (!id) {
                setError('Project ID is missing.');
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const { data } = await api.get<Project>(`/projects/${id}`);
                setProject(data);
            } catch (err: any) {
                console.error('Failed to fetch project:', err);
                if (err.response && err.response.status === 403) {
                    setError('You do not have permission to view this project.');
                } else if (err.response && err.response.status === 404) {
                    setError('Project not found.');
                } else {
                    setError('Failed to load project details.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id, user]); // Re-fetch if ID or user changes

    const handleStatusUpdate = (newStatus: ProjectStatus) => {
        if (project) {
            setProject({ ...project, status: newStatus });
        }
    };

    const handleAddTimelineEntry = async () => {
        if (!newTimelineEntry.trim()) {
            setTimelineError('Timeline entry cannot be empty.');
            return;
        }
        if (!project) return;

        setTimelineError('');
        try {
            const response = await api.post(`/projects/${project._id}/timeline`, {
                title: 'Project Update', // A generic title for now
                description: newTimelineEntry,
                date: new Date().toISOString().split('T')[0],
            });
            // Assuming the backend returns the newly created event
            setProject(prev => prev ? { ...prev, timeline: [...prev.timeline, response.data] } : null);
            setNewTimelineEntry('');
        } catch (err) {
            console.error('Failed to add timeline entry:', err);
            setTimelineError('Failed to add update.');
        }
    };
    
    if (loading) {
        return (
            <div className="text-center p-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
                <p className="mt-4 text-slate-700">Loading project details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-10">
                <h1 className="text-2xl font-bold text-red-600">Error</h1>
                <p className="text-slate-600">{error}</p>
                <Link to="/dashboard/projects" className="mt-4 inline-block text-indigo-600 hover:underline">Go to all projects</Link>
            </div>
        );
    }

    if (!project) {
        return <div className="text-center p-10">
            <h1 className="text-2xl font-bold text-slate-800">Project Not Found</h1>
            <p className="text-slate-600">The project you are looking for does not exist.</p>
            <Link to="/dashboard/projects" className="mt-4 inline-block text-indigo-600 hover:underline">Go to all projects</Link>
        </div>;
    }
    
    // Check if clientId or vendorId are populated (User object) or just string IDs
    const clientId = typeof project.clientId === 'object' ? project.clientId._id : project.clientId;
    const vendorId = typeof project.vendorId === 'object' ? project.vendorId._id : project.vendorId;

    const isAuthorized = user && (
        user.role === UserRole.Admin ||
        clientId === user._id ||
        (vendorId && vendorId === user._id)
    );

    if (!isAuthorized) {
        return <div className="text-center p-10">
            <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
            <p className="text-slate-600">You do not have permission to view this project.</p>
            <Link to="/dashboard/projects" className="mt-4 inline-block text-indigo-600 hover:underline">Go to all projects</Link>
        </div>;
    }
    
    const canUpdateTimeline = user?.role === UserRole.Admin || user?.role === UserRole.Vendor;
    const statusSteps = [ProjectStatus.Requested, ProjectStatus.Quotation, ProjectStatus.Approved, ProjectStatus.InProgress, ProjectStatus.Completed];
    const currentStatusIndex = statusSteps.indexOf(project.status);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <p className="text-indigo-600 font-semibold">{project.category}</p>
                    <h1 className="text-3xl font-bold text-slate-900">{project.title}</h1>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                    <span className={`px-3 py-1.5 text-sm font-semibold rounded-full bg-blue-100 text-blue-800`}>
                        {project.status}
                    </span>
                    {user && <RoleSpecificActions userRole={user.role} projectStatus={project.status} projectId={project._id} onStatusUpdate={handleStatusUpdate} />}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white shadow-md rounded-2xl p-6 border border-slate-200">
                 <h3 className="text-lg font-semibold text-slate-700 mb-4">Project Progress</h3>
                 <div className="flex justify-between mb-2">
                   {statusSteps.map((step, index) => (
                       <div key={step} className={`text-xs w-1/5 text-center whitespace-nowrap ${index <= currentStatusIndex ? 'font-bold text-indigo-600' : 'text-slate-500'}`}>{step}</div>
                   ))}
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                    <div className="bg-indigo-600 h-3 rounded-full transition-all duration-500" style={{ width: `${(currentStatusIndex + 0.5) / statusSteps.length * 100}%` }}></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 bg-white shadow-md rounded-2xl p-8 border border-slate-200">
                    <h2 className="text-xl font-semibold text-slate-800 border-b border-slate-200 pb-4">Timeline & Updates</h2>
                    <ProjectTimeline timeline={project.timeline} user={user} />
                    {canUpdateTimeline && (
                         <div className="mt-8 border-t border-slate-200 pt-6">
                             <h3 className="text-lg font-semibold text-slate-700 mb-2">Add Timeline Update</h3>
                             <textarea 
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition" 
                                rows={3}
                                placeholder="Describe the update..."
                                value={newTimelineEntry}
                                onChange={(e) => setNewTimelineEntry(e.target.value)}
                              />
                             {timelineError && <p className="text-sm text-red-600 mt-2">{timelineError}</p>}
                             <button 
                                onClick={handleAddTimelineEntry}
                                className="mt-3 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-sm transition-colors">
                                 Post Update
                             </button>
                         </div>
                    )}
                </div>
                <div className="space-y-6">
                    <div className="bg-white shadow-md rounded-2xl p-6 border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-700 mb-4 border-b border-slate-200 pb-3">Details</h3>
                        <div className="space-y-3 text-sm">
                            <p className="font-semibold">Description:</p>
                            <p className="text-slate-600 -mt-2">{project.description}</p>
                            
                            {(user?.role !== UserRole.Vendor && project.budget) && (
                                <p><strong>Budget:</strong> <span className="text-slate-600">{project.budget}</span></p>
                            )}
                            <p><strong>Expected Timeline:</strong> <span className="text-slate-600">{project.expectedTimeline}</span></p>
                            <p><strong>Client:</strong> <span className="text-slate-600">{(project.clientId as User)?.name || 'N/A'}</span></p>
                            {project.vendorId && <p><strong>Vendor:</strong> <span className="text-slate-600">{(project.vendorId as User)?.name || 'N/A'}</span></p>}
                        </div>
                    </div>
                    <div className="bg-white shadow-md rounded-2xl p-6 border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-700 mb-4 border-b border-slate-200 pb-3">Project Files</h3>
                        <ul className="space-y-2">
                            {project.files.length > 0 ? (
                                project.files.map(file => (
                                    <li key={file.name} className="flex items-center">
                                        <span className="text-slate-400 mr-2">📄</span>
                                        <a href={file.url} className="text-indigo-600 hover:underline text-sm font-medium">{file.name}</a>
                                    </li>
                                ))
                            ) : (
                                <li className="text-sm text-slate-500">No files uploaded.</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
