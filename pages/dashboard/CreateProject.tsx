
import React, { useState } from 'react';
import { ProjectCategory, ProjectStatus, UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import api from '../../api'; // Import the API utility
import { useNavigate } from 'react-router-dom';

const CreateProject: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<ProjectCategory | ''>('');
    const [description, setDescription] = useState('');
    const [expectedTimeline, setExpectedTimeline] = useState('');
    const [budget, setBudget] = useState('');
    const [files, setFiles] = useState<File[]>([]); // For file uploads
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        if (!user) {
            setError('You must be logged in to create a project.');
            setLoading(false);
            return;
        }

        if (!title || !category || !description || !expectedTimeline) {
            setError('Please fill in all required fields.');
            setLoading(false);
            return;
        }

        try {
            // In a real application, files would be uploaded to cloud storage (e.g., Firebase Storage, AWS S3)
            // and their URLs would be saved in the database. For this example, we'll just simulate it.
            const fileData = files.map(file => ({ name: file.name, url: '#' }));

            const newProjectData = {
                title,
                category,
                description,
                expectedTimeline,
                budget: budget || undefined,
                clientId: user.role === UserRole.Client ? user._id : undefined, // If client, they are the client
                status: ProjectStatus.Requested,
                files: fileData,
                // Admin can optionally specify client/vendor, but for this form, client creates for themselves
            };

            const { data } = await api.post('/projects', newProjectData);
            setSuccess(`Project "${data.title}" created successfully!`);
            // Clear form
            setTitle('');
            setCategory('');
            setDescription('');
            setExpectedTimeline('');
            setBudget('');
            setFiles([]);
            navigate(`/dashboard/project/${data._id}`); // Navigate to new project
        } catch (err: any) {
            console.error('Failed to create project:', err);
            setError(err.response?.data?.message || 'Failed to create project. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
             <div>
                <h1 className="text-3xl font-bold text-slate-900">Submit a New Project</h1>
                <p className="text-slate-600 mt-1">Fill out the details below to get your project started.</p>
             </div>
             <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-200">
                 <form className="space-y-6" onSubmit={handleSubmit}>
                     <div>
                         <label htmlFor="project-title" className="block text-sm font-semibold text-slate-700 mb-1">Project Title</label>
                         <input 
                            type="text" 
                            id="project-title" 
                            placeholder="e.g., Brand Identity Redesign" 
                            className="block w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                         />
                     </div>

                     <div>
                         <label htmlFor="category" className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                         <select 
                            id="category" 
                            className="block w-full px-3 py-2 border border-slate-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            value={category}
                            onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                            required
                         >
                             <option value="">Select a category...</option>
                             {Object.values(ProjectCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                         </select>
                     </div>

                     <div>
                         <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-1">Description / Requirements</label>
                         <textarea 
                            id="description" 
                            rows={5} 
                            placeholder="Describe the project goals, scope, and key requirements..." 
                            className="block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                         ></textarea>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                             <label htmlFor="timeline" className="block text-sm font-semibold text-slate-700 mb-1">Expected Timeline</label>
                             <input 
                                type="text" 
                                id="timeline" 
                                placeholder="e.g., 3-6 Months" 
                                className="block w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition" 
                                value={expectedTimeline}
                                onChange={(e) => setExpectedTimeline(e.target.value)}
                                required
                             />
                         </div>
                         <div>
                             <label htmlFor="budget" className="block text-sm font-semibold text-slate-700 mb-1">Budget Range (Optional)</label>
                             <input 
                                type="text" 
                                id="budget" 
                                placeholder="e.g., $10,000 - $20,000" 
                                className="block w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition" 
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                             />
                         </div>
                     </div>
                     
                     <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Supporting Files</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors">
                            <div className="space-y-1 text-center">
                                <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="flex text-sm text-slate-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                        <span>Upload files</span>
                                        <input 
                                            id="file-upload" 
                                            name="file-upload" 
                                            type="file" 
                                            className="sr-only" 
                                            multiple 
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-slate-500">PNG, JPG, PDF up to 10MB</p>
                                {files.length > 0 && (
                                    <ul className="text-left mt-2 text-sm text-slate-700">
                                        {files.map((file, index) => <li key={index}>{file.name}</li>)}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}
                    {success && <p className="text-sm text-green-600">{success}</p>}

                     <div className="pt-6 mt-8 border-t border-slate-200 flex justify-end gap-3">
                        <button type="button" className="bg-white py-2 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors" onClick={() => navigate('/dashboard/projects')} disabled={loading}>Cancel</button>
                        <button type="submit" className="inline-flex justify-center py-2.5 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Project'}
                        </button>
                     </div>
                 </form>
             </div>
        </div>
    );
};

export default CreateProject;
