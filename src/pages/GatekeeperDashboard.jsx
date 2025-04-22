import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';

const GatekeeperDashboard = () => {
  const [visitors, setVisitors] = useState([]);
  const [filteredVisitors, setFilteredVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newVisitor, setNewVisitor] = useState({
    name: '',
    address: '',
    whomToMeet: '',
    phone: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Check user role when the component mounts
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')); // Assuming user object is saved in localStorage after login

    if (!user || (user.role !== 'gatekeeper' && user.role !== 'admin')) {
      // Redirect if not gatekeeper or admin
      navigate('/login');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVisitor({ ...newVisitor, [name]: value });
  };

  const handleAddVisitor = async (e) => {
    e.preventDefault();
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0];

    try {
      await api.post('/gatekeeper/visitors', { ...newVisitor, date, time });
      setNewVisitor({ name: '', address: '', whomToMeet: '', phone: '' });
      fetchVisitors();
    } catch (error) {
      console.error('Error adding visitor:', error);
    }
  };

  const fetchVisitors = async () => {
    try {
      const res = await api.get('/gatekeeper/visitors');
      if (Array.isArray(res.data)) {
        setVisitors(res.data);
        setFilteredVisitors(res.data);
      } else {
        console.error('Expected array, got:', res.data);
      }
    } catch (error) {
      console.error('Error fetching visitors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = visitors.filter(
      (v) =>
        v.name.toLowerCase().includes(query) ||
        v.phone.toLowerCase().includes(query) ||
        v.time.toLowerCase().includes(query)
    );
    setFilteredVisitors(filtered);
  }, [searchQuery, visitors]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 relative">
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>

      <h1 className="text-3xl font-bold mb-4">Gatekeeper Dashboard - Visitors</h1>

      {/* Add Visitor Form */}
      <form onSubmit={handleAddVisitor} className="mb-6 p-4 border rounded shadow">
        <h2 className="text-xl font-bold mb-4">Add New Visitor</h2>
        {['name', 'address', 'whomToMeet', 'phone'].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field.replace(/([A-Z])/g, ' $1')}
            value={newVisitor[field]}
            onChange={handleInputChange}
            className="w-full p-2 mb-4 border rounded"
            required
          />
        ))}
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          Add Visitor
        </button>
      </form>

      {/* Search Box */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, phone, or time..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <h2 className="text-xl font-bold mb-4">Previous Visitors</h2>
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            {['Name', 'Address', 'Whom to Meet', 'Phone', 'Date', 'Time'].map((col) => (
              <th key={col} className="border p-2">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredVisitors.map((v) => (
            <tr key={v._id}>
              <td className="border p-2">{v.name}</td>
              <td className="border p-2">{v.address}</td>
              <td className="border p-2">{v.whomToMeet}</td>
              <td className="border p-2">{v.phone}</td>
              <td className="border p-2">{v.date}</td>
              <td className="border p-2">{v.time}</td>
            </tr>
          ))}
          {filteredVisitors.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center p-4">
                No visitors found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GatekeeperDashboard;
