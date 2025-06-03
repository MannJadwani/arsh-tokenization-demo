import React, { useState, useEffect } from 'react';
import { Search, Filter, Building2, TrendingUp, MapPin, ArrowRight, Users, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Marketplace = () => {
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [minYield, setMinYield] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Sample properties data
  const sampleProperties = [
    {
      id: 1,
      name: "Mumbai Prime Commercial SPV",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=300&fit=crop",
      city: "Mumbai",
      location: "Bandra-Kurla Complex",
      pricePerToken: 1000,
      totalTokens: 10000,
      soldTokens: 6500,
      expectedYield: 12.5,
      category: "Commercial",
      description: "Premium commercial space in Mumbai's financial district",
      minInvestment: 10000,
      propertyValue: 10000000,
      fundingProgress: 65
    },
    {
      id: 2,
      name: "Bangalore Tech Park SPV",
      image: "https://images.unsplash.com/photo-1559628233-b5935ce5ac8e?w=500&h=300&fit=crop",
      city: "Bangalore",
      location: "Electronic City",
      pricePerToken: 1050,
      totalTokens: 8000,
      soldTokens: 4800,
      expectedYield: 15.2,
      category: "Commercial",
      description: "Modern tech park with multinational tenants",
      minInvestment: 10500,
      propertyValue: 8400000,
      fundingProgress: 60
    },
    {
      id: 3,
      name: "Delhi Residential SPV",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&h=300&fit=crop",
      city: "Delhi",
      location: "Connaught Place",
      pricePerToken: 2000,
      totalTokens: 5000,
      soldTokens: 3500,
      expectedYield: 9.8,
      category: "Residential",
      description: "Luxury residential apartments in central Delhi",
      minInvestment: 20000,
      propertyValue: 10000000,
      fundingProgress: 70
    },
    {
      id: 4,
      name: "Pune IT Hub SPV",
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=500&h=300&fit=crop",
      city: "Pune",
      location: "Hinjewadi",
      pricePerToken: 800,
      totalTokens: 12500,
      soldTokens: 8750,
      expectedYield: 11.3,
      category: "Commercial",
      description: "IT office space in Pune's tech corridor",
      minInvestment: 8000,
      propertyValue: 10000000,
      fundingProgress: 70
    },
    {
      id: 5,
      name: "Chennai Industrial SPV",
      image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=500&h=300&fit=crop",
      city: "Chennai",
      location: "Sriperumbudur",
      pricePerToken: 600,
      totalTokens: 15000,
      soldTokens: 9000,
      expectedYield: 13.7,
      category: "Industrial",
      description: "Industrial warehousing facility near automotive hub",
      minInvestment: 6000,
      propertyValue: 9000000,
      fundingProgress: 60
    },
    {
      id: 6,
      name: "Hyderabad Biotech SPV",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&h=300&fit=crop",
      city: "Hyderabad",
      location: "HITEC City",
      pricePerToken: 1200,
      totalTokens: 7500,
      soldTokens: 5250,
      expectedYield: 14.1,
      category: "Commercial",
      description: "Biotech research facility in HITEC City",
      minInvestment: 12000,
      propertyValue: 9000000,
      fundingProgress: 70
    }
  ];

  useEffect(() => {
    // Check authentication and KYC status
    const authStatus = localStorage.getItem('isLoggedIn');
    const userAuth = localStorage.getItem('userAuth');
    
    if (!authStatus || !userAuth) {
      navigate('/login');
      return;
    }

    const userData = JSON.parse(userAuth);
    if (userData.kyc !== 'approved') {
      navigate('/kyc');
      return;
    }

    setUser(userData);

    // Initialize properties in localStorage if not exists
    const storedProperties = localStorage.getItem('properties');
    if (!storedProperties) {
      localStorage.setItem('properties', JSON.stringify(sampleProperties));
      setProperties(sampleProperties);
      setFilteredProperties(sampleProperties);
    } else {
      const parsedProperties = JSON.parse(storedProperties);
      setProperties(parsedProperties);
      setFilteredProperties(parsedProperties);
    }

    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    // Filter properties based on search and yield
    let filtered = properties.filter(property => {
      const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          property.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesYield = property.expectedYield >= minYield;
      return matchesSearch && matchesYield;
    });

    setFilteredProperties(filtered);
  }, [searchTerm, minYield, properties]);

  const handlePropertyClick = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Marketplace
            </span>
          </h1>
          <p className="text-gray-400 text-lg">Discover and invest in tokenized real estate opportunities</p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold">{properties.length}</div>
                <div className="text-sm text-gray-400">Available SPVs</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-green-400" />
              <div>
                <div className="text-2xl font-bold">12.8%</div>
                <div className="text-sm text-gray-400">Avg. Yield</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-purple-400" />
              <div>
                <div className="text-2xl font-bold">2,450</div>
                <div className="text-sm text-gray-400">Active Investors</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold">₹58.2Cr</div>
                <div className="text-sm text-gray-400">Total Volume</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">Search Properties</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, city, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="md:w-64">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Min. Yield: {minYield}%
              </label>
              <input
                type="range"
                min="0"
                max="20"
                step="0.5"
                value={minYield}
                onChange={(e) => setMinYield(parseFloat(e.target.value))}
                className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              onClick={() => handlePropertyClick(property.id)}
              className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 cursor-pointer group hover:scale-105"
            >
              {/* Property Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-500/20 backdrop-blur-sm text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                    {property.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-green-500/20 backdrop-blur-sm text-green-300 px-3 py-1 rounded-full text-sm font-bold">
                    {property.expectedYield}% APY
                  </span>
                </div>
              </div>

              {/* Property Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                  {property.name}
                </h3>
                <div className="flex items-center text-gray-400 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.location}, {property.city}</span>
                </div>
                <p className="text-gray-400 text-sm mb-4">{property.description}</p>

                {/* Tokenomics */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Price per Token</span>
                    <span className="font-semibold">₹{property.pricePerToken.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Min Investment</span>
                    <span className="font-semibold">₹{property.minInvestment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Tokens Available</span>
                    <span className="font-semibold">{(property.totalTokens - property.soldTokens).toLocaleString()}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Funding Progress</span>
                    <span className="font-semibold">{property.fundingProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${property.fundingProgress}%` }}
                    ></div>
                  </div>
                </div>

                {/* CTA Button */}
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 group">
                  <span>View Details</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No properties found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
