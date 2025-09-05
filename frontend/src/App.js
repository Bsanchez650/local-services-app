import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Function to fetch services with optional search/filter
  const fetchServices = async (search = '', category = '') => {
    setLoading(true);
    try {
      let url = 'http://localhost:5000/api/services';
      const params = new URLSearchParams();
      
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      
      if (params.toString()) {
        url += '?' + params.toString();
      }
      
      const response = await fetch(url);
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  // Load all services on initial render
  useEffect(() => {
    fetchServices();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchServices(searchTerm, selectedCategory);
  };

  // Handle real-time search as user types
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchServices(searchTerm, selectedCategory);
    }, 300); // Wait 300ms after user stops typing

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Local Services - Redwood City</h1>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} style={{margin: '20px 0'}}>
          <input
            type="text"
            placeholder="Search services (e.g., 'cuts', 'skincare', 'catering')"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '10px',
              fontSize: '16px',
              width: '300px',
              marginRight: '10px'
            }}
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '10px',
              fontSize: '16px',
              marginRight: '10px'
            }}
          >
            <option value="">All Categories</option>
            <option value="beauty">Beauty & Cosmetology</option>
            <option value="wellness">Wellness & Skincare</option>
            <option value="food">Food Services</option>
            <option value="floral">Floral & Events</option>
          </select>
          
          <button type="submit" style={{padding: '10px 20px', fontSize: '16px'}}>
            Search
          </button>
        </form>

        {loading ? (
          <p>Loading services...</p>
        ) : (
          <div>
            <h2>Found {services.length} service{services.length !== 1 ? 's' : ''}</h2>
            {services.length === 0 ? (
              <p>No services found. Try a different search term.</p>
            ) : (
              services.map(service => (
                <div key={service.id} style={{
                  border: '1px solid #ccc', 
                  margin: '10px', 
                  padding: '15px',
                  textAlign: 'left',
                  borderRadius: '8px'
                }}>
                  <h3>{service.business_name}</h3>
                  <p><strong>Owner:</strong> {service.owner_name}</p>
                  <p><strong>Category:</strong> {service.category}</p>
                  <p><strong>Instagram:</strong> {service.instagram_handle}</p>
                  <p><strong>Price Range:</strong> {service.price_range}</p>
                  <p><strong>Phone:</strong> {service.phone}</p>
                  <p><strong>Address:</strong> {service.address}</p>
                  <p>{service.description}</p>
                </div>
              ))
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;