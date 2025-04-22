import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('gatekeeper');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/signup', { name, email, password, role });
      navigate('/');
    } catch (err) {
      setError('An error occurred during signup');
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 border border-gray-200 rounded-lg shadow-md">
      <h2 className="text-2xl text-center mb-4">Signup</h2>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="role" className="block text-sm font-medium">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            required
          >
            <option value="gatekeeper">Gatekeeper</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-md">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
