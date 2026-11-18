import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Layers,
  Shield,
  Trash2,
  LogOut,
  RotateCcw,
  User,
  Database,
  Glasses,
  Laptop,
  Smartphone,
  Watch,
  Headphones,
  ShoppingBag,
  ShoppingCart,
  Search,
  Star
} from 'lucide-react';

export function SqliLoginLab({ isSecure }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authResponse, setAuthResponse] = useState(null);

  // Authenticated session state
  const [currentUser, setCurrentUser] = useState(null);
  const [adminTab, setAdminTab] = useState('users'); // 'users' or 'products'

  // Admin user management state
  const [usersList, setUsersList] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  // Product catalog state (for user and admin)
  const [productsList, setProductsList] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('category') || params.get('catagory') || 'glasses';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);

  // Sync category with URL query parameter
  const updateCategoryInUrl = (cat) => {
    const url = new URL(window.location.href);
    if (cat && cat !== 'all') {
      url.searchParams.set('category', cat.toLowerCase());
    } else {
      url.searchParams.delete('category');
    }
    window.history.pushState({}, '', url.toString());
  };

  // Fetch all users for Admin view
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:3001/api/sqli/users');
      const data = await res.json();
      if (data.success && data.users) {
        setUsersList(data.users);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setUsersLoading(false);
    }
  };

  // Fetch products by category (vulnerable SQLi endpoint)
  const fetchProducts = async (cat) => {
    setProductsLoading(true);
    try {
      const queryParam = encodeURIComponent(cat || '');
      const modeParam = isSecure ? '&mode=secure' : '';
      const targetUrl = `http://127.0.0.1:3001/api/sqli/products?category=${queryParam}${modeParam}`;
      
      const res = await fetch(targetUrl);
      const data = await res.json();
      
      if (data.success && data.products) {
        setProductsList(data.products);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setProductsLoading(false);
    }
  };

  // Handle category switch
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setSearchQuery('');
    updateCategoryInUrl(cat);
    fetchProducts(cat);
  };

  // Handle search / custom filter submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      handleCategoryChange('all');
      return;
    }
    setSelectedCategory(searchQuery);
    updateCategoryInUrl(searchQuery);
    fetchProducts(searchQuery);
  };

  // Delete a user (Admin capability)
  const handleDeleteUser = async (id, uname) => {
    if (id === 1) {
      alert('Primary admin account (waheed@gmail.com) cannot be deleted.');
      return;
    }
    try {
      const res = await fetch(`http://127.0.0.1:3001/api/sqli/users/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setUsersList(prev => prev.filter(u => u.id !== id));
        setActionMessage(`User "${uname}" (ID: ${id}) deleted from database.`);
        setTimeout(() => setActionMessage(null), 4000);
      }
    } catch {
      alert('Failed to delete user.');
    }
  };

  // Reset users to the demonstration 17 users
  const handleResetUsers = async () => {
    try {
      const res = await fetch('http://127.0.0.1:3001/api/sqli/reset-users', {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        setUsersList(data.users);
        setActionMessage('All demonstration user accounts restored.');
        setTimeout(() => setActionMessage(null), 4000);
      }
    } catch {
      alert('Failed to reset users.');
    }
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
    setAuthResponse(null);
    setUsername('');
    setPassword('');
    setUsersList([]);
    setProductsList([]);
    setActionMessage(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('category');
    window.history.pushState({}, '', url.toString());
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthResponse(null);

    try {
      const res = await fetch('http://127.0.0.1:3001/api/sqli/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          mode: isSecure ? 'secure' : 'vulnerable'
        })
      });

      const data = await res.json();
      setAuthResponse(data);

      if (data.authenticated && data.user) {
        setCurrentUser(data.user);
        if (data.user.role === 'admin') {
          fetchUsers();
          fetchProducts(selectedCategory);
        } else {
          // Standard user directly sees the product store
          updateCategoryInUrl(selectedCategory);
          fetchProducts(selectedCategory);
        }
      }
    } catch {
      setAuthResponse({
        success: false,
        authenticated: false,
        message: 'Unable to connect to authentication server.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Product category icon mapping
  const getCategoryIcon = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('glasses')) return <Glasses size={34} />;
    if (cat.includes('laptop')) return <Laptop size={34} />;
    if (cat.includes('smartphone') || cat.includes('phone')) return <Smartphone size={34} />;
    if (cat.includes('watch')) return <Watch size={34} />;
    if (cat.includes('accessories')) return <Headphones size={34} />;
    return <ShoppingBag size={34} />;
  };

  // Pre-configured category options
  const categoryTabs = [
    { id: 'all', label: 'All Products', count: 40 },
    { id: 'glasses', label: 'Glasses', count: 8 },
    { id: 'laptops', label: 'Laptops', count: 8 },
    { id: 'smartphones', label: 'Smartphones', count: 8 },
    { id: 'watches', label: 'Watches', count: 8 },
    { id: 'accessories', label: 'Accessories', count: 8 }
  ];

  // ===========================================================================
  // REALISTIC ONLINE STOREFRONT VIEW (NORMAL WEBSITE INTERFACE)
  // ===========================================================================
  const renderProductCatalog = (isAdminView = false) => (
    <div className="store-container">
      {/* Real Store Header Bar */}
      <div className="store-header-bar">
        <div className="store-brand-group">
          <div className="store-brand-logo">
            <ShoppingBag size={24} />
          </div>
          <div>
            <h1 className="store-brand-name">Apex Optics & Gear</h1>
            <p className="store-brand-tagline">Premium Eyewear, Electronics & Modern Gadgets</p>
          </div>
        </div>

        <div className="store-user-tools">
          <div className="store-cart-badge" title="Shopping Cart">
            <ShoppingCart size={16} style={{ color: 'var(--cyan)' }} />
            <span>Cart ({cartCount})</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', fontSize: '13px' }}>
            <User size={15} style={{ color: 'var(--text-muted)' }} />
            <span>{currentUser?.username || 'Customer'}</span>
          </div>

          {isAdminView && (
            <button 
              type="button" 
              className="admin-btn-outline"
              onClick={() => setAdminTab('users')}
              title="Return to Admin User Management"
            >
              <Shield size={14} />
              Admin Portal
            </button>
          )}

          <button 
            type="button" 
            className="admin-btn-logout"
            onClick={handleLogout}
            title="Sign out of account"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Store Search Bar */}
      <form onSubmit={handleSearchSubmit} className="store-search-bar">
        <Search size={18} style={{ color: 'var(--text-muted)' }} />
        <input 
          type="text"
          className="store-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products by keyword or category..."
        />
        {searchQuery && (
          <button 
            type="button" 
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px' }}
            onClick={() => { setSearchQuery(''); handleCategoryChange('all'); }}
          >
            Clear
          </button>
        )}
      </form>

      {/* Category Navigation Pills */}
      <div className="category-nav-bar">
        {categoryTabs.map((tab) => {
          const isActive = selectedCategory.toLowerCase() === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`category-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleCategoryChange(tab.id)}
            >
              {tab.id === 'glasses' && <Glasses size={15} />}
              {tab.id === 'laptops' && <Laptop size={15} />}
              {tab.id === 'smartphones' && <Smartphone size={15} />}
              {tab.id === 'watches' && <Watch size={15} />}
              {tab.id === 'accessories' && <Headphones size={15} />}
              {tab.id === 'all' && <ShoppingBag size={15} />}
              <span>{tab.label}</span>
              <span className="category-tab-count">{tab.count}</span>
            </button>
          );
        })}
      </div>

      {/* Results Header */}
      <div className="store-results-header">
        <div>
          Showing <strong>{productsList.length}</strong> items in{' '}
          <strong style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>
            {selectedCategory === 'all' ? 'All Products' : selectedCategory}
          </strong>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Prices include standard taxes
        </div>
      </div>

      {/* Products Grid */}
      {productsLoading ? (
        <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Loading catalog...
        </div>
      ) : productsList.length === 0 ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)', background: 'rgba(7, 12, 22, 0.5)', borderRadius: '14px' }}>
          No products found for "{selectedCategory}".
        </div>
      ) : (
        <div className="product-store-grid">
          {productsList.map((product) => (
            <div key={product.id} className="product-item-card">
              <div className="product-icon-wrap">
                {getCategoryIcon(product.category)}
              </div>

              <span className="product-category-chip">
                {product.category || 'Gear'}
              </span>

              <h3 className="product-name-heading">
                {product.name}
              </h3>

              {/* Star Rating Display */}
              <div className="product-rating-row">
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <span>4.9</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>(48)</span>
              </div>

              <div className="product-footer-row">
                <div>
                  <div className="product-price-value">
                    ${parseFloat(product.price).toFixed(2)}
                  </div>
                  <div className="product-stock-status">
                    <span className="stock-indicator-dot"></span>
                    In Stock ({product.stock})
                  </div>
                </div>

                <button 
                  type="button" 
                  className="product-cart-btn"
                  onClick={() => setCartCount(c => c + 1)}
                  title={`Add ${product.name} to cart`}
                >
                  <ShoppingCart size={13} />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ===========================================================================
  // VIEW 1: ADMINISTRATOR VIEW (role === 'admin')
  // Tabs: User Management (see users & passwords, delete) OR Product Store
  // ===========================================================================
  if (currentUser && currentUser.role === 'admin') {
    if (adminTab === 'products') {
      return (
        <div className="lab-container" style={{ padding: '20px 16px' }}>
          <div className="store-wrapper">
            {renderProductCatalog(true)}
          </div>
        </div>
      );
    }

    return (
      <div className="lab-container" style={{ padding: '20px 16px' }}>
        <div className="admin-portal-wrapper">
          <div className="admin-portal-card">
            {/* Top Bar */}
            <div className="admin-top-bar">
              <div className="admin-title-area">
                <div className="admin-portal-icon">
                  <Shield size={24} />
                </div>
                <div>
                  <h1 className="admin-heading">
                    Administrator Dashboard
                    <span className="admin-badge">Admin Access</span>
                  </h1>
                  <p className="admin-subtitle">
                    Signed in as <strong>{currentUser.email || 'waheed@gmail.com'}</strong> ({currentUser.username})
                  </p>
                </div>
              </div>

              <div className="admin-actions">
                <button 
                  type="button" 
                  className="admin-btn-outline"
                  onClick={() => {
                    setAdminTab('products');
                    updateCategoryInUrl(selectedCategory);
                    fetchProducts(selectedCategory);
                  }}
                  title="Switch to product storefront view"
                >
                  <ShoppingBag size={15} />
                  View Storefront
                </button>
                <button 
                  type="button" 
                  className="admin-btn-outline"
                  onClick={handleResetUsers}
                  title="Restore default user records in MySQL"
                >
                  <RotateCcw size={15} />
                  Reset Users
                </button>
                <button 
                  type="button" 
                  className="admin-btn-logout"
                  onClick={handleLogout}
                  title="Sign out of admin session"
                >
                  <LogOut size={15} />
                  Sign Out
                </button>
              </div>
            </div>

            {/* Notification message if user was deleted or reset */}
            {actionMessage && (
              <div className="auth-notification success" style={{ marginTop: '20px', marginBottom: '0' }}>
                <CheckCircle2 size={16} />
                <span>{actionMessage}</span>
              </div>
            )}

            {/* Quick Metrics */}
            <div className="admin-stats-row">
              <div className="admin-stat-card">
                <div className="admin-stat-label">Total Accounts</div>
                <div className="admin-stat-val" style={{ color: 'var(--cyan)' }}>
                  {usersList.length}
                </div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-label">Access Level</div>
                <div className="admin-stat-val" style={{ color: '#c084fc' }}>
                  Full Database Admin
                </div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-label">Database Target</div>
                <div className="admin-stat-val" style={{ color: 'var(--green)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Database size={18} />
                  sql_injection_lab
                </div>
              </div>
            </div>

            {/* User Management Section */}
            <div style={{ marginTop: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                  Registered Users & Credentials
                </h2>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Plain-text passwords visible to administrator
                </span>
              </div>

              <div className="admin-table-wrapper">
                {usersLoading ? (
                  <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Loading user records from database...
                  </div>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: '50px' }}>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Password (Plain Text)</th>
                        <th>Role</th>
                        <th style={{ textAlign: 'right', width: '110px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.map((u) => {
                        const isMainAdmin = u.id === 1;
                        return (
                          <tr key={u.id}>
                            <td style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                              #{u.id}
                            </td>
                            <td style={{ fontWeight: 600 }}>
                              {u.username}
                            </td>
                            <td style={{ color: 'var(--cyan)' }}>
                              {u.email}
                            </td>
                            <td>
                              <span className="plain-pwd-badge">
                                {u.password}
                              </span>
                            </td>
                            <td>
                              <span className={`role-badge ${u.role === 'admin' ? 'admin' : u.role === 'user' ? 'user' : 'staff'}`}>
                                {u.role}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <button
                                type="button"
                                className="delete-action-btn"
                                onClick={() => handleDeleteUser(u.id, u.username)}
                                disabled={isMainAdmin}
                                title={isMainAdmin ? 'Primary admin account cannot be deleted' : `Delete ${u.username}`}
                              >
                                <Trash2 size={13} />
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // VIEW 2: STANDARD USER VIEW (role === 'user', e.g. abdul@gmail.com)
  // Clean, authentic online store with 30-40 products and ?category=glasses in URL
  // ===========================================================================
  if (currentUser && currentUser.role !== 'admin') {
    return (
      <div className="lab-container" style={{ padding: '20px 16px' }}>
        <div className="store-wrapper">
          {renderProductCatalog(false)}
        </div>
      </div>
    );
  }

  // ===========================================================================
  // VIEW 3: LOGIN FORM (UNAUTHENTICATED)
  // Clean, realistic login container without any clutter
  // ===========================================================================
  return (
    <div className="lab-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 140px)' }}>
      <div className="auth-page-wrapper" style={{ margin: 0 }}>
        {/* Realistic Modern Login Container */}
        <div className="real-auth-card">
          {/* Header */}
          <div className="auth-header">
            <div className="auth-logo">
              <Layers size={24} />
            </div>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your account</p>
          </div>

          {/* Authentication Notification Banner */}
          {authResponse && (
            <div className={`auth-notification ${authResponse.authenticated ? 'success' : 'error'}`}>
              {authResponse.authenticated ? (
                <>
                  <CheckCircle2 size={18} style={{ color: 'var(--green)', flexShrink: 0 }} />
                  <div>
                    <strong>Welcome back, {authResponse.user?.username || 'User'}!</strong>
                    <div style={{ fontSize: '11.5px', opacity: 0.85 }}>
                      Signed in successfully as {authResponse.user?.role || 'Administrator'}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle size={18} style={{ color: '#f87171', flexShrink: 0 }} />
                  <div>
                    <strong>Authentication Failed</strong>
                    <div style={{ fontSize: '11.5px', opacity: 0.85 }}>
                      {authResponse.sqlMessage ? authResponse.sqlMessage : 'Invalid email or password.'}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit}>
            {/* Email / Username Input */}
            <div className="auth-field-group">
              <label className="auth-label" htmlFor="username">
                Email or Username
              </label>
              <input 
                id="username"
                type="text" 
                className="auth-input" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="name@company.com or username"
                autoComplete="username"
                required
              />
            </div>

            {/* Password Input with Show/Hide Toggle (Optional for SQLi comments) */}
            <div className="auth-field-group">
              <label className="auth-label" htmlFor="password">
                Password
              </label>
              <div className="auth-password-wrapper">
                <input 
                  id="password"
                  type={showPassword ? 'text' : 'password'} 
                  className="auth-input" 
                  style={{ paddingRight: '44px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password (optional for comment payloads)"
                  autoComplete="current-password"
                />
                <button 
                  type="button" 
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="auth-actions-row">
              <label className="auth-checkbox-label">
                <input 
                  type="checkbox" 
                  className="auth-checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>

              <a 
                href="#forgot" 
                className="auth-link" 
                onClick={(e) => { e.preventDefault(); alert('Password recovery is disabled in this demonstration.'); }}
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="auth-submit-btn" 
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="auth-bottom-text">
            Don't have an account?{' '}
            <a 
              href="#signup" 
              className="auth-link"
              onClick={(e) => { e.preventDefault(); alert('Account registration is disabled in this demonstration.'); }}
            >
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
