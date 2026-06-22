import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Shield, Plus, Edit3, Trash2, Calendar, ShoppingBag, FolderHeart, UserCheck, ShieldCheck, Upload, X, RefreshCw, Users, UserPlus } from 'lucide-react';
import { fetchProducts, createProduct, updateProduct, deleteProduct, resetProductStatus } from '../slices/productSlice';
import { fetchCategories, createCategory, updateCategory, deleteCategory, resetCategoryStatus } from '../slices/categorySlice';
import { getAllOrders } from '../slices/orderSlice';
import api from '../utils/api';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

const AdminScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  // Redux lists
  const { products, loading: prodLoading, error: prodError, createSuccess: prodCreateSuccess, updateSuccess: prodUpdateSuccess, deleteSuccess: prodDeleteSuccess } = useSelector((state) => state.products);
  const { categories, loading: catLoading, error: catError, createSuccess: catCreateSuccess, updateSuccess: catUpdateSuccess, deleteSuccess: catDeleteSuccess } = useSelector((state) => state.categories);
  const { allOrders, allOrdersLoading, allOrdersError } = useSelector((state) => state.orders);

  // Active Tab
  const [activeTab, setActiveTab] = useState('products');

  // Single Product view dropdown and pagination
  const [selectedProductId, setSelectedProductId] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchQuery, setSearchQuery] = useState('');

  // Modal / Form state
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productStock, setProductStock] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productCocoa, setProductCocoa] = useState(50);
  const [productNutFree, setProductNutFree] = useState(false);
  const [productImage, setProductImage] = useState('/uploads/placeholder-chocolate.jpg');

  // Category Form State
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categoryImage, setCategoryImage] = useState('/uploads/placeholder-category.jpg');

  // File Upload State
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // User Tab States
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState('');

  // User Form / Modal State
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  const [userFormError, setUserFormError] = useState('');
  const [userFormLoading, setUserFormLoading] = useState(false);

  // Fetch users on mount to get current user counts
  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      fetchUsers();
    }
  }, [userInfo]);

  // Validate admin access
  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/admin-login');
    }
  }, [userInfo, navigate]);

  // Load lists on mount and updates
  useEffect(() => {
    if (activeTab === 'products') {
      dispatch(fetchProducts());
      dispatch(fetchCategories()); // Needed for dropdown
    } else if (activeTab === 'categories') {
      dispatch(fetchCategories());
    } else if (activeTab === 'orders') {
      dispatch(getAllOrders());
    } else if (activeTab === 'users') {
      fetchUsers();
    }
  }, [dispatch, activeTab, prodCreateSuccess, prodUpdateSuccess, prodDeleteSuccess, catCreateSuccess, catUpdateSuccess, catDeleteSuccess]);

  // Close modals on success
  useEffect(() => {
    if (prodCreateSuccess || prodUpdateSuccess) {
      closeProductForm();
      dispatch(resetProductStatus());
    }
    if (catCreateSuccess || catUpdateSuccess) {
      closeCategoryForm();
      dispatch(resetCategoryStatus());
    }
  }, [prodCreateSuccess, prodUpdateSuccess, catCreateSuccess, catUpdateSuccess, dispatch]);

  // Handle Image Upload to backend route POST /api/products/upload
  const handleImageUpload = async (e, type = 'product') => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    setUploadError('');

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const { data } = await api.post('/products/upload', formData, config);
      if (type === 'product') {
        setProductImage(data.image);
      } else {
        setCategoryImage(data.image);
      }
    } catch (error) {
      setUploadError(error.response?.data?.message || error.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Product Form controls
  const openNewProductForm = () => {
    setEditingProductId(null);
    setProductName('');
    setProductPrice('');
    setProductCategory(categories[0]?._id || '');
    setProductStock('');
    setProductDescription('');
    setProductCocoa(50);
    setProductNutFree(false);
    setProductImage('/uploads/placeholder-chocolate.jpg');
    setShowProductForm(true);
  };

  const openEditProductForm = (prod) => {
    setEditingProductId(prod._id);
    setProductName(prod.name);
    setProductPrice(prod.price);
    setProductCategory(prod.category?._id || prod.category || '');
    setProductStock(prod.stock);
    setProductDescription(prod.description);
    setProductCocoa(prod.cocoaPercentage || 50);
    setProductNutFree(prod.isNutFree || false);
    setProductImage(prod.image);
    setShowProductForm(true);
  };

  const closeProductForm = () => {
    setShowProductForm(false);
    setEditingProductId(null);
    setUploadError('');
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    const productData = {
      name: productName,
      price: Number(productPrice),
      category: productCategory,
      stock: Number(productStock),
      description: productDescription,
      cocoaPercentage: Number(productCocoa),
      isNutFree: productNutFree,
      image: productImage,
    };

    if (editingProductId) {
      dispatch(updateProduct({ id: editingProductId, productData }));
    } else {
      dispatch(createProduct(productData));
    }
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this chocolate?')) {
      dispatch(deleteProduct(productId));
    }
  };

  // Category Form controls
  const openNewCategoryForm = () => {
    setEditingCategoryId(null);
    setCategoryName('');
    setCategoryDescription('');
    setCategoryImage('/uploads/placeholder-category.jpg');
    setShowCategoryForm(true);
  };

  const openEditCategoryForm = (cat) => {
    setEditingCategoryId(cat._id);
    setCategoryName(cat.name);
    setCategoryDescription(cat.description);
    setCategoryImage(cat.image);
    setShowCategoryForm(true);
  };

  const closeCategoryForm = () => {
    setShowCategoryForm(false);
    setEditingCategoryId(null);
    setUploadError('');
  };

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    const categoryData = {
      name: categoryName,
      description: categoryDescription,
      image: categoryImage,
    };

    if (editingCategoryId) {
      dispatch(updateCategory({ id: editingCategoryId, categoryData }));
    } else {
      dispatch(createCategory(categoryData));
    }
  };

  const handleDeleteCategory = (catId) => {
    if (window.confirm('Are you sure you want to delete this category? All associated chocolates may lose their category link.')) {
      dispatch(deleteCategory(catId));
    }
  };

  // Fetch users list
  const fetchUsers = async () => {
    setUsersLoading(true);
    setUsersError('');
    try {
      const { data } = await api.get('/auth/users');
      setUsers(data);
    } catch (err) {
      setUsersError(err.response?.data?.message || err.message || 'Failed to fetch users');
    } finally {
      setUsersLoading(false);
    }
  };

  // Delete User
  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/auth/users/${id}`);
        fetchUsers(); // Refresh list
      } catch (err) {
        alert(err.response?.data?.message || err.message || 'Failed to delete user');
      }
    }
  };

  // Open User Form for new user
  const openNewUserForm = () => {
    setEditingUserId(null);
    setUserName('');
    setUserEmail('');
    setUserPhone('');
    setUserPassword('');
    setUserIsAdmin(false);
    setUserFormError('');
    setShowUserForm(true);
  };

  // Open User Form for editing
  const openEditUserForm = (user) => {
    setEditingUserId(user._id);
    setUserName(user.name);
    setUserEmail(user.email);
    setUserPhone(user.phone || '');
    setUserPassword('');
    setUserIsAdmin(user.isAdmin || false);
    setUserFormError('');
    setShowUserForm(true);
  };

  // Close User Form
  const closeUserForm = () => {
    setShowUserForm(false);
    setEditingUserId(null);
    setUserFormError('');
  };

  // Submit User Form (Create / Update)
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setUserFormLoading(true);
    setUserFormError('');

    const userData = {
      name: userName,
      email: userEmail,
      phone: userPhone,
      isAdmin: userIsAdmin,
    };

    if (userPassword) {
      userData.password = userPassword;
    }

    try {
      if (editingUserId) {
        await api.put(`/auth/users/${editingUserId}`, userData);
      } else {
        if (!userPassword) {
          throw new Error('Password is required for new users');
        }
        await api.post('/auth/users', userData);
      }
      closeUserForm();
      fetchUsers(); // Refresh list
    } catch (err) {
      setUserFormError(err.response?.data?.message || err.message || 'Failed to save user');
    } finally {
      setUserFormLoading(false);
    }
  };

  // Filter products based on dropdown selection and search query
  let filteredProducts = products;
  
  if (selectedProductId.startsWith('cat-')) {
    const filterCatId = selectedProductId.substring(4);
    filteredProducts = products.filter(
      (p) => (p.category?._id || p.category) === filterCatId
    );
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase().trim();
    filteredProducts = filteredProducts.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(q);
      const idString = `CHOC-${p._id.slice(-6).toUpperCase()}`.toLowerCase();
      const idMatch = idString.includes(q) || p._id.toLowerCase().includes(q);
      return nameMatch || idMatch;
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in flex flex-col lg:flex-row gap-8 items-start">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-6 bg-chocolate-dark/65 backdrop-blur-md border border-caramel-gold/10 rounded-2xl p-6 w-full">
        {/* Title */}
        <div className="border-b border-caramel-gold/15 pb-4">
          <span className="text-[10px] text-caramel-gold uppercase tracking-widest font-extrabold flex items-center gap-1.5">
            <Shield className="w-4 h-4" />
            Administrator Area
          </span>
          <h1 className="text-xl font-extrabold text-cream-light mt-0.5">
            ChocoLuxe Admin
          </h1>
        </div>

        {/* Sidebar Menu sections */}
        <div className="flex flex-col gap-6 w-full">
          {/* Section: Inventory */}
          <div>
            <span className="text-[10px] text-cream-medium/40 font-bold uppercase tracking-wider block mb-3">
              Inventory
            </span>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-xs font-semibold cursor-pointer ${
                  activeTab === 'products'
                    ? 'bg-gradient-to-r from-caramel-gold to-caramel-hover text-chocolate-darker font-extrabold shadow-lg shadow-caramel-gold/15'
                    : 'text-cream-medium/60 hover:text-cream-light hover:bg-caramel-gold/10'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4" />
                  Chocolates
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'products' ? 'bg-chocolate-darker text-caramel-gold' : 'bg-chocolate-darker/60 text-cream-medium/60 border border-caramel-gold/10'
                }`}>
                  {products.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('categories')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-xs font-semibold cursor-pointer ${
                  activeTab === 'categories'
                    ? 'bg-gradient-to-r from-caramel-gold to-caramel-hover text-chocolate-darker font-extrabold shadow-lg shadow-caramel-gold/15'
                    : 'text-cream-medium/60 hover:text-cream-light hover:bg-caramel-gold/10'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <FolderHeart className="w-4 h-4" />
                  Categories
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'categories' ? 'bg-chocolate-darker text-caramel-gold' : 'bg-chocolate-darker/60 text-cream-medium/60 border border-caramel-gold/10'
                }`}>
                  {categories.length}
                </span>
              </button>
            </div>
          </div>

          {/* Section: Management */}
          <div>
            <span className="text-[10px] text-cream-medium/40 font-bold uppercase tracking-wider block mb-3">
              Management
            </span>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-xs font-semibold cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-gradient-to-r from-caramel-gold to-caramel-hover text-chocolate-darker font-extrabold shadow-lg shadow-caramel-gold/15'
                    : 'text-cream-medium/60 hover:text-cream-light hover:bg-caramel-gold/10'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4" />
                  Client Orders
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'orders' ? 'bg-chocolate-darker text-caramel-gold' : 'bg-chocolate-darker/60 text-cream-medium/60 border border-caramel-gold/10'
                }`}>
                  {allOrders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-xs font-semibold cursor-pointer ${
                  activeTab === 'users'
                    ? 'bg-gradient-to-r from-caramel-gold to-caramel-hover text-chocolate-darker font-extrabold shadow-lg shadow-caramel-gold/15'
                    : 'text-cream-medium/60 hover:text-cream-light hover:bg-caramel-gold/10'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Users className="w-4 h-4" />
                  Users
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'users' ? 'bg-chocolate-darker text-caramel-gold' : 'bg-chocolate-darker/60 text-cream-medium/60 border border-caramel-gold/10'
                }`}>
                  {users.length}
                </span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow w-full lg:min-w-0 flex flex-col gap-6">

      {/* TAB CONTENT: PRODUCTS */}
      {activeTab === 'products' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          {/* View Mode, Search & Add Control Bar */}
          <div className="flex flex-col xl:flex-row gap-4 items-center justify-between bg-chocolate-dark/40 border border-caramel-gold/5 p-4 rounded-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full xl:w-auto flex-grow max-w-4xl">
              {/* Dropdown Selector */}
              <div className="flex flex-col gap-1 w-full sm:w-72">
                <span className="text-[10px] text-cream-medium/60 font-semibold uppercase tracking-wider">
                  Select Category or Chocolate:
                </span>
                <select
                  value={selectedProductId}
                  onChange={(e) => {
                    setSelectedProductId(e.target.value);
                    setSearchQuery(''); // Clear search query when changing dropdown
                    setCurrentPage(1);
                  }}
                  className="bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-2.5 px-3 text-xs text-cream-light focus:outline-none cursor-pointer w-full"
                >
                  <option value="all">All Chocolates (Table View)</option>
                  
                  {/* Category Filters */}
                  <optgroup label="Category Filters">
                    {categories.map((cat) => (
                      <option key={cat._id} value={`cat-${cat._id}`}>
                        Filter: {cat.name}
                      </option>
                    ))}
                  </optgroup>

                  {/* Specific Chocolates grouped by Category */}
                  {categories.map((cat) => {
                    const catProducts = products.filter(p => (p.category?._id || p.category) === cat._id);
                    if (catProducts.length === 0) return null;
                    return (
                      <optgroup key={cat._id} label={cat.name}>
                        {catProducts.map((prod) => (
                          <option key={prod._id} value={prod._id}>
                            {prod.name} (CHOC-{prod._id.slice(-6).toUpperCase()})
                          </option>
                        ))}
                      </optgroup>
                    );
                  })}

                  {/* Fallback for chocolates without category */}
                  {products.filter(p => !p.category).length > 0 && (
                    <optgroup label="Uncategorized">
                      {products.filter(p => !p.category).map((prod) => (
                        <option key={prod._id} value={prod._id}>
                          {prod.name} (CHOC-{prod._id.slice(-6).toUpperCase()})
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>

              {/* Search Input Box */}
              <div className="flex flex-col gap-1 w-full sm:flex-1">
                <span className="text-[10px] text-cream-medium/60 font-semibold uppercase tracking-wider">
                  Quick Search by Name or ID:
                </span>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (e.target.value) {
                        setSelectedProductId('all');
                      }
                      setCurrentPage(1);
                    }}
                    placeholder="Type name (e.g. Belgian) or unique ID (e.g. E610C8)..."
                    className="bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-2.5 px-3.5 pr-10 text-xs text-cream-light focus:outline-none w-full"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-3 text-cream-medium hover:text-caramel-gold cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={openNewProductForm}
              className="flex items-center gap-2 bg-caramel-gold hover:bg-caramel-hover text-chocolate-darker text-xs font-bold uppercase tracking-wider px-4 py-3 rounded-xl transition-all cursor-pointer w-full xl:w-auto justify-center self-end xl:mb-0.5"
            >
              <Plus className="w-4 h-4" />
              Add Chocolate
            </button>
          </div>

          {prodError && <Alert variant="danger">{prodError}</Alert>}

          {prodLoading ? (
            <div className="py-12"><Spinner /></div>
          ) : (selectedProductId === 'all' || selectedProductId.startsWith('cat-')) ? (
            /* PAGINATED TABLE VIEW (ALL OR FILTERED BY CATEGORY/SEARCH) */
            <div className="flex flex-col gap-4">
              <div className="glass-panel rounded-2xl border border-caramel-gold/10 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-caramel-gold/10 text-cream-medium/40 font-bold uppercase tracking-wider bg-chocolate-darker/50">
                        <th className="py-3.5 px-4">Name & ID</th>
                        <th className="py-3.5 px-2">Category</th>
                        <th className="py-3.5 px-2 text-center">Price</th>
                        <th className="py-3.5 px-2 text-center">Stock</th>
                        <th className="py-3.5 px-2 text-center">Cocoa %</th>
                        <th className="py-3.5 px-2 text-center">Nut Free</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-caramel-gold/5 text-cream-medium/85 font-medium">
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="py-8 text-center text-cream-medium/55">
                            No chocolates match your search query or category filter.
                          </td>
                        </tr>
                      ) : (
                        filteredProducts
                          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                          .map((prod) => (
                            <tr key={prod._id} className="hover:bg-caramel-gold/5 transition-colors">
                              <td className="py-3 px-4 truncate max-w-[220px]">
                                <div className="font-bold text-cream-light">{prod.name}</div>
                                <div className="text-[10px] text-cream-medium/40 font-mono mt-0.5">CHOC-{prod._id.slice(-6).toUpperCase()}</div>
                              </td>
                              <td className="py-3 px-2 text-caramel-gold text-[10px] font-bold uppercase tracking-wide">
                                {prod.category?.name || 'Artisanal'}
                              </td>
                              <td className="py-3 px-2 text-center text-cream-light font-extrabold">
                                ₹{prod.price.toFixed(2)}
                              </td>
                              <td className="py-3 px-2 text-center">
                                <span className={prod.stock === 0 ? 'text-red-400' : 'text-cream-light'}>
                                  {prod.stock}
                                </span>
                              </td>
                              <td className="py-3 px-2 text-center font-bold text-caramel-gold">
                                {prod.cocoaPercentage}%
                              </td>
                              <td className="py-3 px-2 text-center">
                                {prod.isNutFree ? (
                                  <span className="text-emerald-400">Yes</span>
                                ) : (
                                  <span className="text-cream-medium/30">No</span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex justify-end gap-1.5">
                                  <button
                                    onClick={() => openEditProductForm(prod)}
                                    className="p-1.5 rounded-lg border border-caramel-gold/20 text-cream-medium hover:text-caramel-gold hover:border-caramel-gold transition-colors cursor-pointer"
                                    title="Edit chocolate"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(prod._id)}
                                    className="p-1.5 rounded-lg border border-red-500/10 text-cream-medium hover:text-red-400 hover:border-red-500/30 transition-colors cursor-pointer"
                                    title="Delete chocolate"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
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

              {/* PAGINATION CONTROLS */}
              {Math.ceil(filteredProducts.length / itemsPerPage) > 1 && (
                <div className="flex justify-between items-center bg-chocolate-dark/40 border border-caramel-gold/10 px-4 py-3.5 rounded-2xl">
                  <div className="flex flex-1 justify-between sm:hidden">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className="relative inline-flex items-center rounded-xl border border-caramel-gold/20 bg-chocolate-dark px-4 py-2 text-xs font-bold text-cream-medium/70 hover:text-cream-light hover:border-caramel-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      Previous
                    </button>
                    <button
                      disabled={currentPage === Math.ceil(filteredProducts.length / itemsPerPage)}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredProducts.length / itemsPerPage)))}
                      className="relative ml-3 inline-flex items-center rounded-xl border border-caramel-gold/20 bg-chocolate-dark px-4 py-2 text-xs font-bold text-cream-medium/70 hover:text-cream-light hover:border-caramel-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between w-full">
                    <div>
                      <p className="text-xs text-cream-medium/50">
                        Showing <span className="font-bold text-cream-light">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                        <span className="font-bold text-cream-light">
                          {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
                        </span>{" "}
                        of <span className="font-bold text-cream-light">{filteredProducts.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="isolate inline-flex -space-x-px rounded-xl shadow-xs gap-1.5" aria-label="Pagination">
                        <button
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          className="relative inline-flex items-center rounded-xl border border-caramel-gold/20 bg-chocolate-dark p-2 text-xs font-bold text-cream-medium/70 hover:text-cream-light hover:border-caramel-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                        >
                          &larr; Prev
                        </button>
                        {Array.from({ length: Math.ceil(filteredProducts.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                              currentPage === page
                                ? "bg-caramel-gold border-caramel-gold text-chocolate-darker shadow-sm"
                                : "bg-chocolate-dark border-caramel-gold/20 text-cream-medium/70 hover:text-cream-light hover:border-caramel-gold"
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          disabled={currentPage === Math.ceil(filteredProducts.length / itemsPerPage)}
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredProducts.length / itemsPerPage)))}
                          className="relative inline-flex items-center rounded-xl border border-caramel-gold/20 bg-chocolate-dark p-2 text-xs font-bold text-cream-medium/70 hover:text-cream-light hover:border-caramel-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                        >
                          Next &rarr;
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* SINGLE CHOCOLATE: INDIVIDUAL VIEW */
            (() => {
              const prod = products.find(p => p._id === selectedProductId);
              if (!prod) return <div className="text-cream-medium/60 text-xs py-8 text-center bg-chocolate-dark/20 rounded-2xl border border-caramel-gold/5">Chocolate recipe not found.</div>;
              return (
                <div className="glass-panel rounded-3xl border border-caramel-gold/15 p-6 md:p-8 shadow-xl animate-fade-in flex flex-col md:flex-row gap-8">
                  {/* Left Column: Product Image */}
                  <div className="w-full md:w-1/3 flex-shrink-0 bg-chocolate-darker border border-caramel-gold/15 rounded-2xl overflow-hidden flex items-center justify-center relative min-h-[220px]">
                    <img
                      src={
                        prod.image.startsWith('http')
                          ? prod.image
                          : `http://localhost:5000${prod.image}`
                      }
                      alt={prod.name}
                      className="w-full h-full object-cover transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1549007994-cb92ca8a7a72?q=80&w=600&auto=format&fit=crop';
                      }}
                    />
                    <span className="absolute top-3 left-3 bg-chocolate-darker/80 border border-caramel-gold/20 text-caramel-gold text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      {prod.category?.name || 'Artisanal'}
                    </span>
                  </div>

                  {/* Right Column: Details & Actions */}
                  <div className="flex-1 flex flex-col justify-between gap-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-caramel-gold uppercase tracking-widest font-extrabold">
                          Recipe Details &bull; CHOC-{prod._id.slice(-6).toUpperCase()}
                        </span>
                        <h2 className="text-2xl font-extrabold text-cream-light">
                          {prod.name}
                        </h2>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-chocolate-darker/40 border border-caramel-gold/5 p-4 rounded-2xl text-xs font-semibold">
                        <div className="flex flex-col gap-1">
                          <span className="text-cream-medium/40 text-[10px] uppercase">Price</span>
                          <span className="text-cream-light font-extrabold text-sm">₹{prod.price.toFixed(2)}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-cream-medium/40 text-[10px] uppercase">Stock Status</span>
                          <span className={`font-bold ${prod.stock === 0 ? 'text-red-400' : 'text-cream-light'}`}>
                            {prod.stock === 0 ? 'Out of Stock' : `${prod.stock} Units`}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-cream-medium/40 text-[10px] uppercase">Cocoa Content</span>
                          <span className="text-caramel-gold font-bold">{prod.cocoaPercentage}% Cocoa</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-cream-medium/40 text-[10px] uppercase">Nut Allergens</span>
                          <span className={prod.isNutFree ? 'text-emerald-400 font-bold' : 'text-cream-medium/50'}>
                            {prod.isNutFree ? 'Nut Free' : 'Contains Nuts'}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <span className="text-cream-light font-bold text-xs uppercase tracking-wider">Description</span>
                        <p className="text-cream-medium/70 text-xs leading-relaxed font-normal bg-chocolate-darker/20 p-4 rounded-xl border border-caramel-gold/5">
                          {prod.description}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 border-t border-caramel-gold/10 pt-5">
                      <button
                        onClick={() => openEditProductForm(prod)}
                        className="flex items-center gap-2 border border-caramel-gold/30 hover:bg-caramel-gold hover:text-chocolate-darker text-cream-light text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit Chocolate
                      </button>
                      <button
                        onClick={() => {
                          handleDeleteProduct(prod._id);
                          setSelectedProductId('all');
                        }}
                        className="flex items-center gap-2 border border-red-500/30 hover:bg-red-500 hover:text-cream-light text-red-400 text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Chocolate
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()
          )}
        </div>
      )}

      {/* TAB CONTENT: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          <div className="flex justify-between items-center bg-chocolate-dark/40 border border-caramel-gold/5 p-4 rounded-xl">
            <span className="text-xs text-cream-medium/60 font-medium">
              Manage product classification tags and titles.
            </span>
            <button
              onClick={openNewCategoryForm}
              className="flex items-center gap-2 bg-caramel-gold hover:bg-caramel-hover text-chocolate-darker text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          </div>

          {catError && <Alert variant="danger">{catError}</Alert>}

          {catLoading ? (
            <div className="py-12"><Spinner /></div>
          ) : (
            <div className="glass-panel rounded-2xl border border-caramel-gold/10 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-caramel-gold/10 text-cream-medium/40 font-bold uppercase tracking-wider bg-chocolate-darker/50">
                      <th className="py-3.5 px-4">Category Name</th>
                      <th className="py-3.5 px-2">Description</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-caramel-gold/5 text-cream-medium/85 font-medium">
                    {categories.map((cat) => (
                      <tr key={cat._id} className="hover:bg-caramel-gold/5 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-cream-light uppercase tracking-wider text-[10px]">
                          {cat.name}
                        </td>
                        <td className="py-3.5 px-2 text-cream-medium/60 truncate max-w-sm">
                          {cat.description}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => openEditCategoryForm(cat)}
                              className="p-1.5 rounded-lg border border-caramel-gold/20 text-cream-medium hover:text-caramel-gold hover:border-caramel-gold transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat._id)}
                              className="p-1.5 rounded-lg border border-red-500/10 text-cream-medium hover:text-red-400 hover:border-red-500/30 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: ORDERS */}
      {activeTab === 'orders' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          {allOrdersError && <Alert variant="danger">{allOrdersError}</Alert>}

          {allOrdersLoading ? (
            <div className="py-12"><Spinner /></div>
          ) : (
            <div className="glass-panel rounded-2xl border border-caramel-gold/10 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-caramel-gold/10 text-cream-medium/40 font-bold uppercase tracking-wider bg-chocolate-darker/50">
                      <th className="py-3.5 px-4">Order ID</th>
                      <th className="py-3.5 px-2">Customer</th>
                      <th className="py-3.5 px-2 text-center">Date</th>
                      <th className="py-3.5 px-2 text-center">Total</th>
                      <th className="py-3.5 px-2 text-center">Paid</th>
                      <th className="py-3.5 px-2 text-center">Delivered</th>
                      <th className="py-3.5 px-2 text-center">Status</th>
                      <th className="py-3.5 px-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-caramel-gold/5 text-cream-medium/85 font-medium">
                    {allOrders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-caramel-gold/5 transition-colors">
                        <td className="py-3 px-4 font-mono text-cream-light font-bold">
                          #{ord._id.slice(-6)}
                        </td>
                        <td className="py-3 px-2 text-cream-light font-bold">
                          {ord.user?.name || 'Guest User'}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-2 text-center text-cream-light font-extrabold">
                          ₹{ord.totalPrice.toFixed(2)}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {ord.isPaid ? (
                            <span className="text-emerald-400">Yes</span>
                          ) : (
                            <span className="text-red-400">No</span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {ord.isDelivered ? (
                            <span className="text-emerald-400">Yes</span>
                          ) : (
                            <span className="text-amber-400">No</span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span
                            className={`inline-block px-2.5 py-1 border rounded-full text-[9px] font-bold uppercase tracking-wider ${{
                                Pending: 'border-amber-500/30 text-amber-400 bg-amber-500/5',
                                Processing: 'border-blue-500/30 text-blue-400 bg-blue-500/5',
                                Shipped: 'border-purple-500/30 text-purple-400 bg-purple-500/5',
                                Delivered: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5',
                                Cancelled: 'border-red-500/30 text-red-400 bg-red-500/5',
                              }[ord.status] || 'border-caramel-gold/20 text-cream-medium'
                              }`}
                          >
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => navigate(`/orders/${ord._id}`)}
                            className="bg-transparent border border-caramel-gold/30 hover:bg-caramel-gold hover:text-chocolate-darker text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: USERS */}
      {activeTab === 'users' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          <div className="flex justify-between items-center bg-chocolate-dark/40 border border-caramel-gold/5 p-4 rounded-xl">
            <span className="text-xs text-cream-medium/60 font-medium">
              Registered customers and administrative accounts database.
            </span>
            <button
              onClick={openNewUserForm}
              className="flex items-center gap-2 bg-caramel-gold hover:bg-caramel-hover text-chocolate-darker text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all"
            >
              <UserPlus className="w-4 h-4" />
              Add User
            </button>
          </div>

          {usersError && <Alert variant="danger">{usersError}</Alert>}

          {usersLoading ? (
            <div className="py-12"><Spinner /></div>
          ) : (
            <div className="glass-panel rounded-2xl border border-caramel-gold/10 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-caramel-gold/10 text-cream-medium/40 font-bold uppercase tracking-wider bg-chocolate-darker/50">
                      <th className="py-3.5 px-4">Name</th>
                      <th className="py-3.5 px-2">Email</th>
                      <th className="py-3.5 px-2 text-center">Phone</th>
                      <th className="py-3.5 px-2 text-center">Role</th>
                      <th className="py-3.5 px-2 text-center">Joined Date</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-caramel-gold/5 text-cream-medium/85 font-medium">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-caramel-gold/5 transition-colors">
                        <td className="py-3 px-4 font-bold text-cream-light">
                          {user.name}
                        </td>
                        <td className="py-3 px-2 text-cream-medium/80">
                          {user.email}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {user.phone || <span className="text-cream-medium/20">—</span>}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {user.isAdmin ? (
                            <span className="inline-flex items-center gap-1 text-caramel-gold font-extrabold uppercase text-[10px] tracking-wider">
                              <ShieldCheck className="w-3 h-3 text-caramel-gold" /> Admin
                            </span>
                          ) : (
                            <span className="text-cream-medium/60 text-[10px] uppercase tracking-wide">Customer</span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-center text-cream-medium/60">
                          {new Date(user.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => openEditUserForm(user)}
                              className="p-1.5 rounded-lg border border-caramel-gold/20 text-cream-medium hover:text-caramel-gold hover:border-caramel-gold transition-colors"
                              title="Edit user details"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              disabled={userInfo && userInfo._id === user._id}
                              className={`p-1.5 rounded-lg border transition-colors ${userInfo && userInfo._id === user._id
                                  ? 'border-cream-medium/5 text-cream-medium/10 cursor-not-allowed'
                                  : 'border-red-500/10 text-cream-medium hover:text-red-400 hover:border-red-500/30'
                                }`}
                              title={userInfo && userInfo._id === user._id ? "You cannot delete yourself" : "Delete user"}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
      </div>

      {/* MODAL / OVERLAY: USER FORM (CREATE / EDIT) */}
      {showUserForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-chocolate-darker/80 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto py-8 lg:py-16">
          <div className="w-full max-w-xl bg-chocolate-dark border border-caramel-gold/20 rounded-3xl p-6 flex flex-col gap-6 shadow-2xl relative animate-fade-in my-auto">
            <button
              onClick={closeUserForm}
              className="absolute right-4 top-4 text-cream-medium hover:text-caramel-gold"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold uppercase tracking-widest text-caramel-gold border-b border-caramel-gold/10 pb-3">
              {editingUserId ? 'Edit User Details' : 'Register New User'}
            </h3>

            {userFormError && <Alert variant="danger">{userFormError}</Alert>}

            <form onSubmit={handleUserSubmit} className="flex flex-col gap-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-cream-light uppercase">Full Name</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-2.5 px-3 w-full text-cream-light focus:outline-none"
                    required
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-cream-light uppercase">Email Address</label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-2.5 px-3 w-full text-cream-light focus:outline-none"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-cream-light uppercase">Phone Number</label>
                  <input
                    type="text"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-2.5 px-3 w-full text-cream-light focus:outline-none"
                  />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-cream-light uppercase">
                    Password {editingUserId && '(leave blank to keep unchanged)'}
                  </label>
                  <input
                    type="password"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    className="bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-2.5 px-3 w-full text-cream-light focus:outline-none placeholder-cream-medium/20"
                    placeholder={editingUserId ? "••••••••" : "Enter account password"}
                    required={!editingUserId}
                  />
                </div>
              </div>

              {/* Is Admin Check */}
              <div className="flex items-center gap-3 mt-2 select-none">
                <input
                  type="checkbox"
                  id="isAdminModal"
                  checked={userIsAdmin}
                  onChange={(e) => setUserIsAdmin(e.target.checked)}
                  disabled={userInfo && userInfo._id === editingUserId}
                  className={`w-5 h-5 rounded border-caramel-gold/20 bg-chocolate-darker text-caramel-gold accent-caramel-gold focus:ring-transparent ${userInfo && userInfo._id === editingUserId ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                />
                <label
                  htmlFor="isAdminModal"
                  className={`text-cream-light uppercase ${userInfo && userInfo._id === editingUserId ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                >
                  Administrator Account Role
                </label>
              </div>
              {userInfo && userInfo._id === editingUserId && (
                <span className="text-[10px] text-caramel-gold/70 -mt-2">
                  To prevent locking yourself out of the dashboard, you cannot revoke your own admin privilege.
                </span>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-2.5 border-t border-caramel-gold/10 pt-4 mt-2">
                <button
                  type="button"
                  onClick={closeUserForm}
                  className="bg-transparent border border-caramel-gold/20 text-cream-medium hover:text-caramel-gold px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={userFormLoading}
                  className="bg-caramel-gold hover:bg-caramel-hover disabled:bg-caramel-gold/50 text-chocolate-darker px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider flex items-center gap-2"
                >
                  {userFormLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  {editingUserId ? 'Save Details' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL / OVERLAY: PRODUCT FORM (CREATE / EDIT) */}
      {showProductForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-chocolate-darker/80 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto py-8 lg:py-16">
          <div className="w-full max-w-xl bg-chocolate-dark border border-caramel-gold/20 rounded-3xl p-6 flex flex-col gap-6 shadow-2xl relative my-auto">
            <button
              onClick={closeProductForm}
              className="absolute right-4 top-4 text-cream-medium hover:text-caramel-gold"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold uppercase tracking-widest text-caramel-gold border-b border-caramel-gold/10 pb-3">
              {editingProductId ? 'Edit Chocolate Recipe' : 'Add New Chocolate'}
            </h3>

            {uploadError && <Alert variant="danger">{uploadError}</Alert>}

            <form onSubmit={handleProductSubmit} className="flex flex-col gap-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-cream-light uppercase">Chocolate Name</label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-2.5 px-3 w-full text-cream-light focus:outline-none"
                    required
                  />
                </div>

                {/* Price */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-cream-light uppercase">Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    className="bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-2.5 px-3 w-full text-cream-light focus:outline-none"
                    required
                  />
                </div>

                {/* Category selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-cream-light uppercase">Category</label>
                  <select
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    className="bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-2.5 px-3 w-full text-cream-light focus:outline-none"
                    required
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Stock count */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-cream-light uppercase">Stock Qty</label>
                  <input
                    type="number"
                    value={productStock}
                    onChange={(e) => setProductStock(e.target.value)}
                    className="bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-2.5 px-3 w-full text-cream-light focus:outline-none"
                    required
                  />
                </div>

                {/* Cocoa % */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-cream-light uppercase">Cocoa Percentage ({productCocoa}%)</label>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={productCocoa}
                    onChange={(e) => setProductCocoa(e.target.value)}
                    className="w-full accent-caramel-gold"
                  />
                </div>

                {/* Nut Free Check */}
                <div className="flex items-center gap-3 mt-4 select-none">
                  <input
                    type="checkbox"
                    id="nutFreeModal"
                    checked={productNutFree}
                    onChange={(e) => setProductNutFree(e.target.checked)}
                    className="w-5 h-5 rounded border-caramel-gold/20 bg-chocolate-darker text-caramel-gold accent-caramel-gold focus:ring-transparent"
                  />
                  <label htmlFor="nutFreeModal" className="text-cream-light uppercase cursor-pointer">
                    Nut Free Recipe
                  </label>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-cream-light uppercase">Description</label>
                <textarea
                  rows={3}
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  className="bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-2.5 px-3 w-full text-cream-light focus:outline-none placeholder-cream-medium/20"
                  placeholder="Review cocoa origins, taste notes, ingredients, allergen warnings..."
                  required
                ></textarea>
              </div>

              {/* Image upload */}
              <div className="flex flex-col gap-2">
                <label className="text-cream-light uppercase">Product Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-chocolate-darker border border-caramel-gold/10 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                    <img
                      src={
                        productImage.startsWith('http')
                          ? productImage
                          : `http://localhost:5000${productImage}`
                      }
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1549007994-cb92ca8a7a72?q=80&w=600&auto=format&fit=crop';
                      }}
                    />
                  </div>
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      value={productImage}
                      onChange={(e) => setProductImage(e.target.value)}
                      className="bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-2.5 pl-3 pr-10 w-full text-cream-light focus:outline-none text-[10px]"
                      placeholder="/uploads/file.jpg"
                      required
                    />
                    <label className="absolute right-2.5 top-2.5 hover:text-caramel-gold text-cream-medium/40 cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'product')}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>
                {uploading && <span className="text-[10px] text-caramel-gold animate-pulse">Uploading file to server...</span>}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2.5 border-t border-caramel-gold/10 pt-4 mt-2">
                <button
                  type="button"
                  onClick={closeProductForm}
                  className="bg-transparent border border-caramel-gold/20 text-cream-medium hover:text-caramel-gold px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-caramel-gold hover:bg-caramel-hover text-chocolate-darker px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider"
                >
                  {editingProductId ? 'Save Changes' : 'Create Recipe'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL / OVERLAY: CATEGORY FORM (CREATE / EDIT) */}
      {showCategoryForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-chocolate-darker/80 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto py-8 lg:py-16">
          <div className="w-full max-w-xl bg-chocolate-dark border border-caramel-gold/20 rounded-3xl p-6 flex flex-col gap-6 shadow-2xl relative animate-fade-in my-auto">
            <button
              onClick={closeCategoryForm}
              className="absolute right-4 top-4 text-cream-medium hover:text-caramel-gold"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold uppercase tracking-widest text-caramel-gold border-b border-caramel-gold/10 pb-3">
              {editingCategoryId ? 'Edit Category' : 'Create Category'}
            </h3>

            {uploadError && <Alert variant="danger">{uploadError}</Alert>}

            <form onSubmit={handleCategorySubmit} className="flex flex-col gap-4 text-xs font-semibold">
              {/* Category Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-cream-light uppercase">Category Title</label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-2.5 px-4 w-full text-cream-light focus:outline-none"
                  required
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-cream-light uppercase">Description</label>
                <textarea
                  rows={3}
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  className="bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-2.5 px-4 w-full text-cream-light focus:outline-none"
                  placeholder="Add details about origins, cocoa processing, flavor themes..."
                  required
                ></textarea>
              </div>

              {/* Image upload */}
              <div className="flex flex-col gap-2">
                <label className="text-cream-light uppercase">Category Thumbnail</label>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-chocolate-darker border border-caramel-gold/10 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                    <img
                      src={
                        categoryImage.startsWith('http')
                          ? categoryImage
                          : `http://localhost:5000${categoryImage}`
                      }
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1548907040-4d42b52125bb?q=80&w=600&auto=format&fit=crop';
                      }}
                    />
                  </div>
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      value={categoryImage}
                      onChange={(e) => setCategoryImage(e.target.value)}
                      className="bg-chocolate-darker border border-caramel-gold/20 rounded-xl py-2.5 pl-3 pr-10 w-full text-cream-light focus:outline-none text-[10px]"
                      placeholder="/uploads/category-file.jpg"
                      required
                    />
                    <label className="absolute right-2.5 top-2.5 hover:text-caramel-gold text-cream-medium/40 cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'category')}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>
                {uploading && <span className="text-[10px] text-caramel-gold animate-pulse">Uploading file to server...</span>}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2.5 border-t border-caramel-gold/10 pt-4 mt-2">
                <button
                  type="button"
                  onClick={closeCategoryForm}
                  className="bg-transparent border border-caramel-gold/20 text-cream-medium hover:text-caramel-gold px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-caramel-gold hover:bg-caramel-hover text-chocolate-darker px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider"
                >
                  {editingCategoryId ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminScreen;
