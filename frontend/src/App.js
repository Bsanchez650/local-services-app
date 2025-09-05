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

  // Handle real-time search as user types
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchServices(searchTerm, selectedCategory);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, selectedCategory]);

  // Get initials for profile pic
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="App">
      <div className="App-header">
        
        {/* Header */}
        <div className="header-section">
          <h1 className="main-title">ServiceSpot</h1>
          <p className="subtitle">Discover local services in Redwood City</p>
        </div>

        {/* Search */}
        <div className="search-container">
          <form className="search-form" onSubmit={(e) => e.preventDefault()}>
            <div className="search-row">
              <input
                type="text"
                className="search-input"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All</option>
                <option value="beauty">Beauty</option>
                <option value="wellness">Wellness</option>
                <option value="food">Food</option>
                <option value="floral">Floral</option>
              </select>
            </div>
          </form>
        </div>

        {/* Results Stats */}
        <div className="search-stats">
          {loading ? (
            "Searching..."
          ) : (
            `${services.length} service${services.length !== 1 ? 's' : ''} found`
          )}
        </div>

        {/* Services Feed */}
        <div className="services-feed">
          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Loading services...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="no-results">
              <p>No services found</p>
              <p>Try a different search term</p>
            </div>
          ) : (
            services.map(service => (
              <div key={service.id} className="service-card">
                
                {/* Service Header */}
                <div className="service-header">
                  <div className="profile-pic">
                    {getInitials(service.business_name)}
                  </div>
                  <div className="service-info">
                    <div className="business-name">{service.business_name}</div>
                    <div className="business-meta">
                      <span className="category-badge">{service.category}</span>
                    </div>
                  </div>
                </div>

                {/* Service Content */}
                <div className="service-content">
                  <p className="description">{service.description}</p>
                  
                  <div className="service-details">
                    <div className="detail-item">
                      <span className="detail-icon">👤</span>
                      <span>{service.owner_name}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-icon">💰</span>
                      <span className="price-range">{service.price_range}</span>
                    </div>
                    
                    {service.instagram_handle && (
                      <div className="detail-item">
                        <span className="detail-icon">📷</span>
                        <a 
                          href={`https://instagram.com/${service.instagram_handle.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="instagram-handle"
                        >
                          {service.instagram_handle}
                        </a>
                      </div>
                    )}
                    
                    {service.phone && (
                      <div className="detail-item">
                        <span className="detail-icon">📞</span>
                        <span>{service.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Service Actions */}
                <div className="service-actions">
                  <button className="action-btn">
                    <span>❤️</span>
                    <span>Like</span>
                  </button>
                  
                  <button className="action-btn">
                    <span>📤</span>
                    <span>Share</span>
                  </button>
                  
                  <button className="action-btn primary">
                    <span>📞</span>
                    <span>Contact</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;