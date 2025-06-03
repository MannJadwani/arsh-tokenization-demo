import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, Users, DollarSign, Package, Building2, Plus, Trash2, MapPin, X, Edit, Eye } from 'lucide-react';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('pending-orders');
  const [pendingOrders, setPendingOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [newProperty, setNewProperty] = useState({
    name: '',
    location: '',
    description: '',
    images: [''],
    pricePerToken: '',
    totalTokens: '',
    expectedReturn: '',
    riskLevel: 'Medium',
    propertyType: 'Apartment',
    area: '',
    propertyValue: '',
    amenities: [''],
    highlights: ['']
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if admin access is granted via URL parameter
    const urlParams = new URLSearchParams(location.search);
    const adminParam = urlParams.get('admin');
    
    if (adminParam !== '1') {
      navigate('/marketplace');
      return;
    }

    loadAdminData();
  }, [navigate, location.search]);

  const loadAdminData = () => {
    try {
      // Load all orders
      const storedOrders = localStorage.getItem('orders');
      const ordersData = storedOrders ? JSON.parse(storedOrders) : [];
      
      // Load holdings
      const storedHoldings = localStorage.getItem('holdings');
      const holdingsData = storedHoldings ? JSON.parse(storedHoldings) : [];
      
      // Load properties
      const storedProperties = localStorage.getItem('properties');
      const propertiesData = storedProperties ? JSON.parse(storedProperties) : [];
      
      // Filter pending sell orders
      const pendingSellOrders = ordersData.filter(
        order => order.type === 'sell' && order.status === 'pending'
      );
      
      setAllOrders(ordersData);
      setPendingOrders(pendingSellOrders);
      setHoldings(holdingsData);
      setProperties(propertiesData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading admin data:', error);
      setLoading(false);
    }
  };

  const handleApproveOrder = (orderId) => {
    const orderToApprove = pendingOrders.find(order => order.id === orderId);
    if (!orderToApprove) return;

    try {
      // Update order status to 'done'
      const updatedOrders = allOrders.map(order => {
        if (order.id === orderId) {
          return { ...order, status: 'done', approvedDate: new Date().toISOString() };
        }
        return order;
      });

      // Update holdings - remove locked quantity permanently
      const updatedHoldings = holdings.map(holding => {
        if (holding.userId === orderToApprove.userId && holding.propertyId === orderToApprove.propertyId) {
          const newLockedQuantity = Math.max(0, (holding.lockedQuantity || 0) - orderToApprove.quantity);
          const newTotalQuantity = holding.quantity - orderToApprove.quantity;
          
          // Calculate proportional reduction in totalInvested
          const soldRatio = orderToApprove.quantity / holding.quantity;
          const soldInvestment = holding.totalInvested * soldRatio;
          
          return {
            ...holding,
            quantity: newTotalQuantity,
            lockedQuantity: newLockedQuantity,
            totalInvested: holding.totalInvested - soldInvestment,
            avgPrice: newTotalQuantity > 0 
              ? (holding.totalInvested - soldInvestment) / newTotalQuantity 
              : holding.avgPrice
          };
        }
        return holding;
      });

      // Save to localStorage
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      localStorage.setItem('holdings', JSON.stringify(updatedHoldings));

      // Show success message
      alert(`Sell order approved! ${orderToApprove.quantity} tokens sold for ₹${orderToApprove.totalValue.toFixed(2)}`);

      // Reload data
      loadAdminData();
    } catch (error) {
      console.error('Error approving order:', error);
      alert('Error approving order. Please try again.');
    }
  };
  const handleRejectOrder = (orderId) => {
    const orderToReject = pendingOrders.find(order => order.id === orderId);
    if (!orderToReject) return;

    try {
      // Update order status to 'rejected'
      const updatedOrders = allOrders.map(order => {
        if (order.id === orderId) {
          return { ...order, status: 'rejected', rejectedDate: new Date().toISOString() };
        }
        return order;
      });

      // Update holdings - return locked quantity back to available
      const updatedHoldings = holdings.map(holding => {
        if (holding.userId === orderToReject.userId && holding.propertyId === orderToReject.propertyId) {
          return {
            ...holding,
            lockedQuantity: Math.max(0, (holding.lockedQuantity || 0) - orderToReject.quantity)
          };
        }
        return holding;
      });

      // Save to localStorage
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      localStorage.setItem('holdings', JSON.stringify(updatedHoldings));

      // Show success message
      alert(`Sell order rejected! ${orderToReject.quantity} tokens returned to user's available balance.`);

      // Reload data
      loadAdminData();
    } catch (error) {
      console.error('Error rejecting order:', error);
      alert('Error rejecting order. Please try again.');
    }
  };
  const handleAddProperty = () => {
    try {
      // Validate required fields
      if (!newProperty.name || !newProperty.location || !newProperty.pricePerToken || !newProperty.totalTokens) {
        alert('Please fill in all required fields');
        return;
      }

      const propertyData = {
        id: Date.now(),
        ...newProperty,
        pricePerToken: parseFloat(newProperty.pricePerToken),
        totalTokens: parseInt(newProperty.totalTokens),
        expectedReturn: parseFloat(newProperty.expectedReturn) || 0,
        area: parseFloat(newProperty.area) || 0,
        propertyValue: parseFloat(newProperty.propertyValue) || 0,
        images: newProperty.images.filter(img => img.trim() !== ''),
        amenities: newProperty.amenities.filter(amenity => amenity.trim() !== ''),
        highlights: newProperty.highlights.filter(highlight => highlight.trim() !== ''),
        soldTokens: 0,
        fundingProgress: 0,
        createdAt: new Date().toISOString()
      };

      const updatedProperties = [...properties, propertyData];
      localStorage.setItem('properties', JSON.stringify(updatedProperties));
      setProperties(updatedProperties);
      setShowAddPropertyModal(false);
      
      // Reset form
      setNewProperty({
        name: '',
        location: '',
        description: '',
        images: [''],
        pricePerToken: '',
        totalTokens: '',
        expectedReturn: '',
        riskLevel: 'Medium',
        propertyType: 'Apartment',
        area: '',
        propertyValue: '',
        amenities: [''],
        highlights: ['']
      });
      
      alert('Property added successfully to the marketplace!');
    } catch (error) {
      console.error('Error adding property:', error);
      alert('Error adding property. Please try again.');
    }
  };
  const handleRemoveProperty = (propertyId) => {
    if (!confirm('Are you sure you want to remove this property from the marketplace?')) {
      return;
    }

    try {
      const updatedProperties = properties.filter(property => property.id !== propertyId);
      localStorage.setItem('properties', JSON.stringify(updatedProperties));
      setProperties(updatedProperties);
      
      alert('Property removed from the marketplace!');
    } catch (error) {
      console.error('Error removing property:', error);
      alert('Error removing property. Please try again.');
    }
  };

  const addArrayField = (fieldName) => {
    setNewProperty(prev => ({
      ...prev,
      [fieldName]: [...prev[fieldName], '']
    }));
  };

  const removeArrayField = (fieldName, index) => {
    setNewProperty(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index)
    }));
  };

  const updateArrayField = (fieldName, index, value) => {
    setNewProperty(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].map((item, i) => i === index ? value : item)
    }));
  };

  const handleEditProperty = (property) => {
    setEditingProperty(property);
    setNewProperty({
      name: property.name || '',
      location: property.location || '',
      description: property.description || '',
      images: property.images && property.images.length > 0 ? property.images : [''],
      pricePerToken: property.pricePerToken?.toString() || '',
      totalTokens: property.totalTokens?.toString() || '',
      expectedReturn: property.expectedReturn?.toString() || '',
      riskLevel: property.riskLevel || 'Medium',
      propertyType: property.propertyType || 'Apartment',
      area: property.area?.toString() || '',
      propertyValue: property.propertyValue?.toString() || '',
      amenities: property.amenities && property.amenities.length > 0 ? property.amenities : [''],
      highlights: property.highlights && property.highlights.length > 0 ? property.highlights : ['']
    });
    setShowAddPropertyModal(true);
  };

  const handleSaveProperty = () => {
    try {
      // Validate required fields
      if (!newProperty.name || !newProperty.location || !newProperty.totalTokens) {
        alert('Please fill in all required fields (Name, Location, Total Tokens)');
        return;
      }

      // Ensure we have either property value or price per token
      if (!newProperty.propertyValue && !newProperty.pricePerToken) {
        alert('Please enter either the total property value or price per token');
        return;
      }

      // Calculate missing values
      let finalPricePerToken = newProperty.pricePerToken;
      let finalPropertyValue = newProperty.propertyValue;

      if (newProperty.propertyValue && newProperty.totalTokens && !newProperty.pricePerToken) {
        finalPricePerToken = calculatePricePerToken(newProperty.propertyValue, newProperty.totalTokens);
      } else if (newProperty.pricePerToken && newProperty.totalTokens && !newProperty.propertyValue) {
        finalPropertyValue = (parseFloat(newProperty.pricePerToken) * parseInt(newProperty.totalTokens)).toString();
      }

      if (!finalPricePerToken || parseFloat(finalPricePerToken) <= 0) {
        alert('Price per token must be greater than 0');
        return;
      }

      const propertyData = {
        id: editingProperty ? editingProperty.id : Date.now(),
        ...newProperty,
        pricePerToken: parseFloat(finalPricePerToken),
        totalTokens: parseInt(newProperty.totalTokens),
        expectedReturn: parseFloat(newProperty.expectedReturn) || 0,
        area: parseFloat(newProperty.area) || 0,
        propertyValue: parseFloat(finalPropertyValue) || 0,
        images: newProperty.images.filter(img => img.trim() !== ''),
        amenities: newProperty.amenities.filter(amenity => amenity.trim() !== ''),
        highlights: newProperty.highlights.filter(highlight => highlight.trim() !== ''),
        soldTokens: editingProperty ? editingProperty.soldTokens : 0,
        fundingProgress: editingProperty ? editingProperty.fundingProgress : 0,
        createdAt: editingProperty ? editingProperty.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      let updatedProperties;
      if (editingProperty) {
        updatedProperties = properties.map(p => p.id === editingProperty.id ? propertyData : p);
      } else {
        updatedProperties = [...properties, propertyData];
      }

      localStorage.setItem('properties', JSON.stringify(updatedProperties));
      setProperties(updatedProperties);
      setShowAddPropertyModal(false);
      setEditingProperty(null);
      
      // Reset form
      setNewProperty({
        name: '',
        location: '',
        description: '',
        images: [''],
        pricePerToken: '',
        totalTokens: '',
        expectedReturn: '',
        riskLevel: 'Medium',
        propertyType: 'Apartment',
        area: '',
        propertyValue: '',
        amenities: [''],
        highlights: ['']
      });
      
      alert(editingProperty ? 'Property updated successfully!' : 'Property added successfully to the marketplace!');
    } catch (error) {
      console.error('Error saving property:', error);
      alert('Error saving property. Please try again.');
    }
  };

  // Calculate price per token when property value or total tokens change
  const calculatePricePerToken = (propertyValue, totalTokens) => {
    if (propertyValue && totalTokens && parseFloat(propertyValue) > 0 && parseInt(totalTokens) > 0) {
      const pricePerToken = parseFloat(propertyValue) / parseInt(totalTokens);
      return pricePerToken.toFixed(2);
    }
    return '';
  };

  // Handle property value change and auto-calculate price per token
  const handlePropertyValueChange = (value) => {
    setNewProperty(prev => {
      const newState = { ...prev, propertyValue: value };
      if (prev.totalTokens) {
        newState.pricePerToken = calculatePricePerToken(value, prev.totalTokens);
      }
      return newState;
    });
  };

  // Handle total tokens change and auto-calculate price per token
  const handleTotalTokensChange = (value) => {
    setNewProperty(prev => {
      const newState = { ...prev, totalTokens: value };
      if (prev.propertyValue) {
        newState.pricePerToken = calculatePricePerToken(prev.propertyValue, value);
      }
      return newState;
    });
  };

  // Handle manual price per token change and auto-calculate property value
  const handlePricePerTokenChange = (value) => {
    setNewProperty(prev => {
      const newState = { ...prev, pricePerToken: value };
      if (prev.totalTokens && value) {
        const calculatedPropertyValue = parseFloat(value) * parseInt(prev.totalTokens);
        newState.propertyValue = calculatedPropertyValue.toString();
      }
      return newState;
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'pending-orders':
        return (
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">Pending Sell Orders</h2>
              <p className="text-gray-400 text-sm">Review and approve/reject user sell orders</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      User ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Ask Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Total Value
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {pendingOrders.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center text-gray-400">
                        <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No pending orders</p>
                        <p className="text-sm">All sell orders have been processed</p>
                      </td>
                    </tr>
                  ) : (
                    pendingOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-800/50">
                        <td className="px-6 py-4 text-sm text-white font-mono">
                          #{order.id.toString().slice(-8)}
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          {order.date || new Date(order.timestamp).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          User #{order.userId}
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          {order.propertyName}
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          {order.quantity.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          ₹{(order.price || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          ₹{(order.totalValue || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApproveOrder(order.id)}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors inline-flex items-center space-x-1"
                            >
                              <CheckCircle className="h-3 w-3" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleRejectOrder(order.id)}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg transition-colors inline-flex items-center space-x-1"
                            >
                              <XCircle className="h-3 w-3" />
                              <span>Reject</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'properties':
        return (
          <div className="space-y-6">
            {/* Add Property Button */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">Property Management</h2>
                <p className="text-gray-400 text-sm">Manage marketplace properties</p>
              </div>
              <button
                onClick={() => {
                  setEditingProperty(null);
                  setNewProperty({
                    name: '',
                    location: '',
                    description: '',
                    images: [''],
                    pricePerToken: '',
                    totalTokens: '',
                    expectedReturn: '',
                    riskLevel: 'Medium',
                    propertyType: 'Apartment',
                    area: '',
                    propertyValue: '',
                    amenities: [''],
                    highlights: ['']
                  });
                  setShowAddPropertyModal(true);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors inline-flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Property</span>
              </button>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.length === 0 ? (
                <div className="col-span-full bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
                  <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Properties Listed</h3>
                  <p className="text-gray-400 mb-6">Start by adding your first property to the marketplace</p>
                  <button
                    onClick={() => {
                      setEditingProperty(null);
                      setShowAddPropertyModal(true);
                    }}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors inline-flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Property</span>
                  </button>
                </div>
              ) : (
                properties.map((property) => (
                  <div key={property.id} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                    {/* Property Image */}
                    <div className="h-48 bg-gray-800 relative">
                      {property.images && property.images[0] ? (
                        <img
                          src={property.images[0]}
                          alt={property.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center" style={{ display: property.images && property.images[0] ? 'none' : 'flex' }}>
                        <Building2 className="h-12 w-12 text-gray-600" />
                      </div>
                      
                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                          Active
                        </span>
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-2 truncate">{property.name}</h3>
                      <div className="flex items-center text-gray-400 text-sm mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="truncate">{property.location}</span>
                      </div>

                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-gray-800 rounded-lg p-3">
                          <div className="text-xs text-gray-400">Price/Token</div>
                          <div className="text-sm font-semibold text-white">₹{property.pricePerToken}</div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-3">
                          <div className="text-xs text-gray-400">Total Tokens</div>
                          <div className="text-sm font-semibold text-white">{property.totalTokens?.toLocaleString()}</div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-3">
                          <div className="text-xs text-gray-400">Expected Yield</div>
                          <div className="text-sm font-semibold text-green-400">{property.expectedReturn}%</div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-3">
                          <div className="text-xs text-gray-400">Sold Tokens</div>
                          <div className="text-sm font-semibold text-white">{property.soldTokens || 0}</div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Funding Progress</span>
                          <span>{property.fundingProgress || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${property.fundingProgress || 0}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/property/${property.id}`)}
                          className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors inline-flex items-center justify-center space-x-1"
                        >
                          <Eye className="h-3 w-3" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleEditProperty(property)}
                          className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors inline-flex items-center justify-center space-x-1"
                        >
                          <Edit className="h-3 w-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleRemoveProperty(property.id)}
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors inline-flex items-center justify-center"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Calculate statistics
  const totalPendingOrders = pendingOrders.length;
  const totalPendingValue = pendingOrders.reduce((sum, order) => sum + (order.totalValue || 0), 0);
  const totalPendingTokens = pendingOrders.reduce((sum, order) => sum + order.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-950 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage pending sell orders, properties, and marketplace listings</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-800">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('pending-orders')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'pending-orders'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Pending Orders</span>
                  {totalPendingOrders > 0 && (
                    <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">
                      {totalPendingOrders}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => setActiveTab('properties')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'properties'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4" />
                  <span>Properties</span>
                  <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded-full">
                    {properties.length}
                  </span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Statistics - Only show for pending orders tab */}
        {activeTab === 'pending-orders' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Pending Orders</span>
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-white">{totalPendingOrders}</div>
            </div>
            
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Pending Value</span>
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-white">₹{totalPendingValue.toFixed(2)}</div>
            </div>
            
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Pending Tokens</span>
                <Package className="h-5 w-5 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-white">{totalPendingTokens.toLocaleString()}</div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {renderTabContent()}

        {/* Add/Edit Property Modal */}
        {showAddPropertyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">
                  {editingProperty ? 'Edit Property' : 'Add New Property'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddPropertyModal(false);
                    setEditingProperty(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Property Name *</label>
                    <input
                      type="text"
                      value={newProperty.name}
                      onChange={(e) => setNewProperty(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter property name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Location *</label>
                    <input
                      type="text"
                      value={newProperty.location}
                      onChange={(e) => setNewProperty(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter location"
                    />
                  </div>
                </div>

                {/* Financial Details */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-white border-b border-gray-700 pb-2">Financial Details</h4>
                  
                  {/* Property Value and Total Tokens - Primary inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Total Property Value (₹) *
                        <span className="text-xs text-gray-500 block">Enter the total value of the property</span>
                      </label>
                      <input
                        type="number"
                        value={newProperty.propertyValue}
                        onChange={(e) => handlePropertyValueChange(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="10000000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Total Tokens *
                        <span className="text-xs text-gray-500 block">Number of tokens to create</span>
                      </label>
                      <input
                        type="number"
                        value={newProperty.totalTokens}
                        onChange={(e) => handleTotalTokensChange(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="10000"
                      />
                    </div>
                  </div>

                  {/* Price per Token - Auto-calculated */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Price per Token (₹) *
                        <span className="text-xs text-gray-500 block">
                          {newProperty.propertyValue && newProperty.totalTokens ? 
                            'Auto-calculated from property value ÷ total tokens' : 
                            'Will be calculated automatically or enter manually'
                          }
                        </span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={newProperty.pricePerToken}
                        onChange={(e) => handlePricePerTokenChange(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="1000"
                      />
                      {newProperty.propertyValue && newProperty.totalTokens && (
                        <div className="mt-1 text-xs text-green-400">
                          ✓ Calculated: ₹{calculatePricePerToken(newProperty.propertyValue, newProperty.totalTokens)} per token
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Expected Return (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newProperty.expectedReturn}
                        onChange={(e) => setNewProperty(prev => ({ ...prev, expectedReturn: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="12.5"
                      />
                    </div>
                  </div>

                  {/* Financial Summary */}
                  {newProperty.propertyValue && newProperty.totalTokens && newProperty.pricePerToken && (
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <h5 className="text-sm font-medium text-gray-300 mb-2">Financial Summary</h5>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Property Value:</span>
                          <div className="text-white font-medium">₹{parseFloat(newProperty.propertyValue).toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Total Tokens:</span>
                          <div className="text-white font-medium">{parseInt(newProperty.totalTokens).toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Price per Token:</span>
                          <div className="text-white font-medium">₹{parseFloat(newProperty.pricePerToken).toFixed(2)}</div>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-700">
                        <span className="text-gray-400 text-xs">Minimum Investment (1 token): </span>
                        <span className="text-green-400 font-medium">₹{parseFloat(newProperty.pricePerToken).toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Property Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Property Type</label>
                    <select
                      value={newProperty.propertyType}
                      onChange={(e) => setNewProperty(prev => ({ ...prev, propertyType: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Apartment">Apartment</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Industrial">Industrial</option>
                      <option value="Office">Office</option>
                      <option value="Retail">Retail</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Risk Level</label>
                    <select
                      value={newProperty.riskLevel}
                      onChange={(e) => setNewProperty(prev => ({ ...prev, riskLevel: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Area (sq ft)</label>
                    <input
                      type="number"
                      value={newProperty.area}
                      onChange={(e) => setNewProperty(prev => ({ ...prev, area: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1000"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={newProperty.description}
                    onChange={(e) => setNewProperty(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter property description"
                  />
                </div>

                {/* Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Property Images</label>
                  {newProperty.images.map((image, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => updateArrayField('images', index, e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com/image.jpg"
                      />
                      {newProperty.images.length > 1 && (
                        <button
                          onClick={() => removeArrayField('images', index)}
                          className="px-2 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayField('images')}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg"
                  >
                    Add Image
                  </button>
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Amenities</label>
                  {newProperty.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={amenity}
                        onChange={(e) => updateArrayField('amenities', index, e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter amenity"
                      />
                      {newProperty.amenities.length > 1 && (
                        <button
                          onClick={() => removeArrayField('amenities', index)}
                          className="px-2 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayField('amenities')}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg"
                  >
                    Add Amenity
                  </button>
                </div>

                {/* Highlights */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Key Highlights</label>
                  {newProperty.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={highlight}
                        onChange={(e) => updateArrayField('highlights', index, e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter highlight"
                      />
                      {newProperty.highlights.length > 1 && (
                        <button
                          onClick={() => removeArrayField('highlights', index)}
                          className="px-2 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayField('highlights')}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg"
                  >
                    Add Highlight
                  </button>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-800 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAddPropertyModal(false);
                    setEditingProperty(null);
                  }}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProperty}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {editingProperty ? 'Update Property' : 'Add Property'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
