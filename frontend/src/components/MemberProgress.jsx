import { useState, useEffect } from 'react';
import { getTaskStats } from '../services/api';

const statusColors = {
  completed: 'bg-green-500',
  'in-progress': 'bg-indigo-500',
  pending: 'bg-gray-300',
};

const MemberProgress = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTaskStats()
      .then((res) => setMembers(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-6 text-gray-400 text-sm">Loading member progress…</div>;
  if (error) return <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-gray-900 mb-4">👥 Member Progress</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => {
          const { total, completed, inProgress, pending } = member.stats;
          const rate = member.completionRate;

          return (
            <div key={member._id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{member.name}</h3>
                  <p className="text-xs text-gray-400">{member.email}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${member.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'}`}>
                  {member.role}
                </span>
              </div>

              {/* Completion rate bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Completion</span>
                  <span className="font-semibold text-gray-700">{rate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${rate >= 80 ? 'bg-green-500' : rate >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${rate}%` }}
                  />
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-lg font-bold text-gray-800">{total}</div>
                  <div className="text-xs text-gray-400">Total</div>
                </div>
                <div className="bg-green-50 rounded-lg p-2">
                  <div className="text-lg font-bold text-green-700">{completed}</div>
                  <div className="text-xs text-green-500">Done</div>
                </div>
                <div className="bg-indigo-50 rounded-lg p-2">
                  <div className="text-lg font-bold text-indigo-700">{inProgress}</div>
                  <div className="text-xs text-indigo-500">Active</div>
                </div>
              </div>

              {/* Status bar */}
              {total > 0 && (
                <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5 flex overflow-hidden">
                  <div className={statusColors.completed} style={{ width: `${(completed / total) * 100}%` }} />
                  <div className={statusColors['in-progress']} style={{ width: `${(inProgress / total) * 100}%` }} />
                  <div className={statusColors.pending} style={{ width: `${(pending / total) * 100}%` }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MemberProgress;
