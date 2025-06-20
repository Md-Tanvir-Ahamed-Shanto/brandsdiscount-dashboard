import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../api/client';

function UserProfile() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      const response = await apiClient.put('/user/profile', formData);
      updateUser(response.data);
      setEditing(false);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <div>
      <h2>User Profile</h2>
      {editing ? (
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditing(false)}>Cancel</button>
        </form>
      ) : (
        <div>
          <p>Name: {user?.name}</p>
          <p>Email: {user?.email}</p>
          <button onClick={() => setEditing(true)}>Edit</button>
        </div>
      )}
    </div>
  );
}