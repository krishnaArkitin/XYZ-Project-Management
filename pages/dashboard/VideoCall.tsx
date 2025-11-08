
import React, { useEffect, useState } from 'react';
import { Meeting, User, UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';

interface ParticipantAvatarProps {
    participants: (string | User)[];
}

const ParticipantAvatars: React.FC<ParticipantAvatarProps> = ({ participants }) => {
    const populatedParticipants = participants.filter(p => typeof p === 'object') as User[];
    
    return (
        <div className="flex -space-x-2 mt-3">
            {populatedParticipants.map((p, i) => (
                <img key={p._id} className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src={p.avatarUrl} alt={p.name} />
            ))}
            {populatedParticipants.length === 0 && <span className="text-xs text-slate-500">No participants yet</span>}
        </div>
    );
};

const MeetingCard: React.FC<{meeting: Meeting, currentUser: User, onStatusUpdate: (meetingId: string, newStatus: string) => void}> = ({ meeting, currentUser, onStatusUpdate }) => {
    const isCreator = typeof meeting.creator === 'object' ? meeting.creator._id === currentUser._id : meeting.creator === currentUser._id;
    const isParticipant = meeting.participants.some(p => typeof p === 'object' ? p._id === currentUser._id : p === currentUser._id);

    const handleUpdateStatus = async (newStatus: 'Confirmed' | 'Cancelled') => {
        try {
            await api.put(`/meetings/${meeting._id}`, { status: newStatus });
            onStatusUpdate(meeting._id, newStatus);
        } catch (error) {
            console.error('Failed to update meeting status:', error);
            alert('Failed to update meeting status.');
        }
    };

    const displayParticipants = meeting.participants.filter(p => typeof p === 'object') as User[];

    return (
        <div className="p-5 border bg-white border-slate-200 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full mb-2 inline-block ${meeting.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {meeting.status}
                </span>
                <h3 className="font-bold text-slate-800">{meeting.title}</h3>
                <p className="text-sm text-slate-500">{meeting.date} at {meeting.time}</p>
                <ParticipantAvatars participants={meeting.participants} />
            </div>
            <div className="flex-shrink-0 flex items-center gap-2">
                {meeting.status === 'Confirmed' ? (
                     <button className="font-semibold text-sm px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">Join Now</button>
                ) : isParticipant || isCreator ? ( // Only participants or creator can accept/decline
                     <>
                        <button 
                            onClick={() => handleUpdateStatus('Cancelled')}
                            className="font-semibold text-sm px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors">Decline</button>
                        <button 
                            onClick={() => handleUpdateStatus('Confirmed')}
                            className="font-semibold text-sm px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">Accept</button>
                    </>
                ) : null}
            </div>
        </div>
    );
};

const VideoCall: React.FC = () => {
    const { user } = useAuth();
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loadingMeetings, setLoadingMeetings] = useState(true);
    const [errorMeetings, setErrorMeetings] = useState<string | null>(null);

    // Schedule meeting form state
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [availableUsers, setAvailableUsers] = useState<User[]>([]); // For participant selection
    const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]); // Array of user IDs
    const [scheduleError, setScheduleError] = useState<string | null>(null);
    const [scheduleSuccess, setScheduleSuccess] = useState<string | null>(null);

    useEffect(() => {
        const fetchMeetings = async () => {
            if (!user) {
                setLoadingMeetings(false);
                return;
            }
            setLoadingMeetings(true);
            setErrorMeetings(null);
            try {
                const { data } = await api.get<Meeting[]>('/meetings');
                setMeetings(data);
            } catch (err) {
                console.error('Failed to fetch meetings:', err);
                setErrorMeetings('Failed to load meetings.');
            } finally {
                setLoadingMeetings(false);
            }
        };

        const fetchAvailableUsers = async () => {
            if (user?.role === UserRole.Admin) { // Only admins can see all users, for simplicity
                try {
                    const { data } = await api.get<User[]>('/users');
                    setAvailableUsers(data.filter(u => u._id !== user._id)); // Exclude current user from selection
                } catch (err) {
                    console.error('Failed to fetch available users:', err);
                }
            } else {
                 setAvailableUsers([]); // Non-admins might only select from project members
            }
        };

        fetchMeetings();
        fetchAvailableUsers();
    }, [user]);

    const handleMeetingStatusUpdate = (meetingId: string, newStatus: string) => {
        setMeetings(prevMeetings => 
            prevMeetings.map(m => m._id === meetingId ? { ...m, status: newStatus as 'Pending' | 'Confirmed' | 'Cancelled' } : m)
        );
    };

    const handleScheduleMeeting = async (e: React.FormEvent) => {
        e.preventDefault();
        setScheduleError(null);
        setScheduleSuccess(null);

        if (!user) {
            setScheduleError('You must be logged in to schedule a meeting.');
            return;
        }
        if (!title || !date || !time || selectedParticipants.length === 0) {
            setScheduleError('Please fill all fields and select at least one participant.');
            return;
        }

        try {
            const { data } = await api.post<Meeting>('/meetings', {
                title,
                date,
                time,
                participantIds: [...new Set([...selectedParticipants, user._id])], // Ensure creator is included
            });
            setMeetings(prev => [...prev, data]);
            setScheduleSuccess('Meeting scheduled successfully!');
            setTitle('');
            setDate('');
            setTime('');
            setSelectedParticipants([]);
        } catch (err) {
            console.error('Failed to schedule meeting:', err);
            setScheduleError('Failed to schedule meeting. Please try again.');
        }
    };

    if (!user) return null;

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Video Calls & Meetings</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-6">
                     <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Upcoming Meetings</h2>
                        {loadingMeetings ? (
                            <div className="text-center text-slate-500 py-10">Loading meetings...</div>
                        ) : errorMeetings ? (
                            <div className="text-center text-red-500 py-10">{errorMeetings}</div>
                        ) : meetings.length === 0 ? (
                            <div className="text-center text-slate-500 py-10">No upcoming meetings.</div>
                        ) : (
                            <div className="space-y-4">
                                {meetings.map(meeting => <MeetingCard key={meeting._id} meeting={meeting} currentUser={user} onStatusUpdate={handleMeetingStatusUpdate} />)}
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Schedule a Meeting</h2>
                    <form className="space-y-4" onSubmit={handleScheduleMeeting}>
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-slate-700">Purpose</label>
                            <input 
                                type="text" 
                                id="title" 
                                placeholder="e.g., Design Review" 
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                         <div>
                            <label htmlFor="date" className="block text-sm font-medium text-slate-700">Date</label>
                            <input 
                                type="date" 
                                id="date" 
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition" 
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>
                         <div>
                            <label htmlFor="time" className="block text-sm font-medium text-slate-700">Time</label>
                            <input 
                                type="time" 
                                id="time" 
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition" 
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                required
                            />
                        </div>
                        {availableUsers.length > 0 && (
                            <div>
                                <label htmlFor="participants" className="block text-sm font-medium text-slate-700">Participants</label>
                                <select 
                                    id="participants" 
                                    multiple 
                                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    value={selectedParticipants}
                                    onChange={(e) => 
                                        setSelectedParticipants(Array.from(e.target.selectedOptions, option => option.value))
                                    }
                                    required
                                >
                                    {availableUsers.map(u => (
                                        <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                                    ))}
                                </select>
                                <p className="mt-1 text-xs text-slate-500">Hold Ctrl/Cmd to select multiple.</p>
                            </div>
                        )}
                        {scheduleError && <p className="text-sm text-red-600">{scheduleError}</p>}
                        {scheduleSuccess && <p className="text-sm text-green-600">{scheduleSuccess}</p>}
                        <button type="submit" className="w-full font-semibold px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                            Schedule Meeting
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VideoCall;
