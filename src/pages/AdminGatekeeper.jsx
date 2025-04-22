import { useEffect, useState } from 'react';
import api from '../utils/axios';

const AdminGatekeeper = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminGatekeeperData = async () => {
      try {
        const response = await api.get('/admin/all-admin-gatekeepers');
        setUsers(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminGatekeeperData();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  // Filter users into admins and gatekeepers
  const admins = users.filter(user => user.role === 'admin');
  const gatekeepers = users.filter(user => user.role === 'gatekeeper');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Admin and Gatekeeper Details</h1>
      
      {/* Admins Table */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Admins</h2>
        <table className="w-full border-collapse border">
          <thead className="bg-blue-200">
            <tr>
              <th className="border py-2 px-4">Name</th>
              <th className="border py-2 px-4">Email</th>
              <th className="border py-2 px-4">Role</th>
            </tr>
          </thead>
          <tbody>
            {admins.length > 0 ? (
              admins.map(admin => (
                <tr key={admin._id}>
                  <td className="border py-2 px-4">{admin.name}</td>
                  <td className="border py-2 px-4">{admin.email}</td>
                  <td className="border py-2 px-4">{admin.role}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4">No admins found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Gatekeepers Table */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Gatekeepers</h2>
        <table className="w-full border-collapse border">
          <thead className="bg-green-200">
            <tr>
              <th className="border py-2 px-4">Name</th>
              <th className="border py-2 px-4">Email</th>
              <th className="border py-2 px-4">Role</th>
            </tr>
          </thead>
          <tbody>
            {gatekeepers.length > 0 ? (
              gatekeepers.map(gatekeeper => (
                <tr key={gatekeeper._id}>
                  <td className="border py-2 px-4">{gatekeeper.name}</td>
                  <td className="border py-2 px-4">{gatekeeper.email}</td>
                  <td className="border py-2 px-4">{gatekeeper.role}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4">No gatekeepers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminGatekeeper;