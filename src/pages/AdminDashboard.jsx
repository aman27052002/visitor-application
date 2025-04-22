import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios'
import AdminGatekeeper from './AdminGatekeeper'; // Added import

const AdminDashboard = () => {
  const [members, setMembers] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMember, setNewMember] = useState({
    name: '',
    address: '',
    phone: '',
    memberId: '',
    cars: '',
  });
  const [editingMember, setEditingMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchVisitorQuery, setSearchVisitorQuery] = useState('');
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('user');
      if (!token) {
        navigate('/login');
        return;
      }
      const [membersRes, visitorsRes] = await Promise.all([
        api.get('/admin/members'),
        api.get('/admin/visitors')
      ]);
      setMembers(membersRes.data);
      setVisitors(visitorsRes.data);
      setError(null);
    } catch (err) {
      console.error('Fetch Error:', err);
      if (err.response) {
        if (err.response.status === 401) {
          localStorage.removeItem('user');
          navigate('/login');
        } else {
          setError(err.response.data?.message || 'Server error. Try again.');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    const cars = newMember.cars.split(',').map(car => car.trim());

    if (cars.length > 4) {
      setError('Parking limit exceeded: Maximum 4 cars allowed.');
      return;
    }

    try {
      if (editingMember) {
        await api.put(`/admin/members/${editingMember._id}`, { ...newMember, cars });
        setEditingMember(null);
      } else {
        await api.post('/admin/members', { ...newMember, cars });
      }
      setNewMember({ name: '', address: '', phone: '', memberId: '', cars: '' });
      fetchData();
    } catch (err) {
      console.error('Add/Edit Error:', err);
      if (err.response) {
        if (err.response.status === 401) {
          localStorage.removeItem('user');
          navigate('/login');
        } else {
          setError('Server error. Try again.');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    }
  };

  const handleEditMember = (member) => {
    setNewMember({
      ...member,
      cars: member.cars.join(', ')
    });
    setEditingMember(member);
  };

  const handleDeleteMember = async (id) => {
    try {
      await api.delete(`/admin/members/${id}`);
      fetchData();
    } catch (err) {
      console.error('Delete Error:', err);
      if (err.response) {
        if (err.response.status === 401) {
          localStorage.removeItem('user');
          navigate('/login');
        } else {
          setError('Server error. Try again.');
        }
      } else {
        setError('Network error.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return <div className="text-center mt-10 text-lg font-semibold">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="p-6 relative min-h-screen bg-gray-100">

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 p-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
      >
        Logout
      </button>

      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {/* Add/Edit Member Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-10">
        <h2 className="text-2xl font-bold mb-4">{editingMember ? 'Edit Member' : 'Add New Member'}</h2>
        <form onSubmit={handleAddMember} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['name', 'address', 'phone', 'memberId'].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={newMember[field]}
              onChange={handleInputChange}
              className="p-2 border rounded-md"
              required
            />
          ))}
          <input
            type="text"
            name="cars"
            placeholder="Car Numbers (comma separated)"
            value={newMember.cars}
            onChange={handleInputChange}
            className="p-2 border rounded-md col-span-1 md:col-span-2"
            required
          />
          <button
            type="submit"
            className="col-span-1 md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md mt-4"
          >
            {editingMember ? 'Update Member' : 'Add Member'}
          </button>
        </form>
      </div>

      {/* Search Field for Members */}
      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search by Name, Phone, or Member ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded-md w-full md:w-1/3"
        />
      </div>

      {/* Members Table */}
      <h2 className="text-2xl font-bold mb-4">Members List</h2>
      <div className="overflow-x-auto mb-10">
        <table className="w-full bg-white shadow-md rounded-lg">
          <thead className="bg-blue-100">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Address</th>
              <th className="py-3 px-4 text-left">Phone</th>
              <th className="py-3 px-4 text-left">Member ID</th>
              <th className="py-3 px-4 text-left">Cars</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.filter((member) =>
              member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              member.phone.includes(searchQuery) ||
              member.memberId.toLowerCase().includes(searchQuery.toLowerCase())
            ).length > 0 ? (
              members
                .filter((member) =>
                  member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  member.phone.includes(searchQuery) ||
                  member.memberId.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((member) => (
                  <tr key={member._id} className="border-t">
                    <td className="py-2 px-4">{member.name}</td>
                    <td className="py-2 px-4">{member.address}</td>
                    <td className="py-2 px-4">{member.phone}</td>
                    <td className="py-2 px-4">{member.memberId}</td>
                    <td className="py-2 px-4">{member.cars.join(', ')}</td>
                    <td className="py-2 px-4 space-x-2">
                      <button
                        onClick={() => handleEditMember(member)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member._id)}
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">No matching members found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Search Field for Visitors */}
      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search by Name, Phone, Date, or Time"
          value={searchVisitorQuery}
          onChange={(e) => setSearchVisitorQuery(e.target.value)}
          className="p-2 border rounded-md w-full md:w-1/3"
        />
      </div>

      {/* Visitors Table */}
      <h2 className="text-2xl font-bold mb-4">Visitors List</h2>
      <div className="overflow-x-auto mb-10">
        <table className="w-full bg-white shadow-md rounded-lg">
          <thead className="bg-green-100">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Address</th>
              <th className="py-3 px-4 text-left">Whom to Meet</th>
              <th className="py-3 px-4 text-left">Phone</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Time</th>
            </tr>
          </thead>
          <tbody>
            {visitors.filter((visitor) =>
              visitor.name.toLowerCase().includes(searchVisitorQuery.toLowerCase()) ||
              visitor.phone.includes(searchVisitorQuery) ||
              visitor.date.includes(searchVisitorQuery) ||
              visitor.time.includes(searchVisitorQuery)
            ).length > 0 ? (
              visitors
                .filter((visitor) =>
                  visitor.name.toLowerCase().includes(searchVisitorQuery.toLowerCase()) ||
                  visitor.phone.includes(searchVisitorQuery) ||
                  visitor.date.includes(searchVisitorQuery) ||
                  visitor.time.includes(searchVisitorQuery)
                )
                .map((visitor) => (
                  <tr key={visitor._id} className="border-t">
                    <td className="py-2 px-4">{visitor.name}</td>
                    <td className="py-2 px-4">{visitor.address}</td>
                    <td className="py-2 px-4">{visitor.whomToMeet}</td>
                    <td className="py-2 px-4">{visitor.phone}</td>
                    <td className="py-2 px-4">{visitor.date}</td>
                    <td className="py-2 px-4">{visitor.time}</td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">No visitors found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Added Admins and Gatekeepers section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Admins and Gatekeepers</h2>
        <AdminGatekeeper />
      </div>

    </div>
  );
};

export default AdminDashboard;