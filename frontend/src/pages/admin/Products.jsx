import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, Image as ImageIcon, X, GripVertical } from 'lucide-react';
import api, { imageUrl } from '../../lib/api';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [dragIndex, setDragIndex] = useState(null);
    const [savingOrder, setSavingOrder] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        price_monthly: '',
        price_yearly: '',
        description: '',
        tag: '',
        link: '',
        image: null
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    // --- Drag & drop reordering ---
    const handleDragStart = (index) => setDragIndex(index);
    const handleDragOver = (e) => e.preventDefault();
    const handleDrop = async (dropIndex) => {
        if (dragIndex === null || dragIndex === dropIndex) {
            setDragIndex(null);
            return;
        }
        const reordered = [...products];
        const [moved] = reordered.splice(dragIndex, 1);
        reordered.splice(dropIndex, 0, moved);
        setProducts(reordered); // optimistic
        setDragIndex(null);
        setSavingOrder(true);
        try {
            await api.put('/products/reorder', { ids: reordered.map((p) => p.id) });
        } catch (error) {
            console.error(error);
            fetchProducts(); // revert to server order on failure
        } finally {
            setSavingOrder(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await api.delete(`/products/${id}`);
                fetchProducts();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            price: product.price,
            price_monthly: product.price_monthly || '',
            price_yearly: product.price_yearly || '',
            description: product.description,
            tag: product.tag,
            link: product.link,
            image: null // Don't preload image file, only replace if needed
        });
        setEditingId(product.id);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsEditing(false);
        setEditingId(null);
        setFormData({ name: '', price: '', price_monthly: '', price_yearly: '', description: '', tag: '', link: '', image: null });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, image: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('price', formData.price);
            data.append('price_monthly', formData.price_monthly || '');
            data.append('price_yearly', formData.price_yearly || '');
            data.append('description', formData.description);
            data.append('tag', formData.tag);
            data.append('link', formData.link);
            if (formData.image) {
                data.append('image', formData.image);
            }

            if (isEditing) {
                await api.put(`/products/${editingId}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/products', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            handleCloseModal();
            fetchProducts();
        } catch (error) {
            alert('Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Header Actions */}
            <div className="flex justify-between items-center mb-8">
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-purple-500/50"
                    />
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Product
                </button>
            </div>

            {/* Reorder hint */}
            <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
                <GripVertical className="w-4 h-4" />
                <span>Seret &amp; lepas kartu untuk mengatur urutan tampil di landing page.</span>
                {savingOrder && <span className="text-cyan-400">Menyimpan urutan…</span>}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product, index) => (
                    <div
                        key={product.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(index)}
                        className={`group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all cursor-move ${dragIndex === index ? 'opacity-40 ring-2 ring-cyan-500/50' : ''}`}
                    >
                        <div className="aspect-square bg-gray-900 relative">
                            <div className="absolute top-2 right-2 z-10 p-1 rounded-md bg-black/50 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" title="Seret untuk mengurutkan">
                                <GripVertical className="w-4 h-4" />
                            </div>
                            {product.image ? (
                                <img
                                    src={imageUrl(product.image)}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-600">
                                    <ImageIcon className="w-12 h-12 opacity-50" />
                                </div>
                            )}
                            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-medium border border-white/10">
                                {product.tag || 'Regular'}
                            </div>
                            <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-medium border border-white/10 flex items-center gap-1 text-white">
                                {product.click_count || 0} Clicks
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold truncate pr-2">{product.name}</h3>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="p-1.5 hover:bg-white/10 rounded-lg text-blue-400 transition-colors"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="p-1.5 hover:bg-white/10 rounded-lg text-red-400 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-cyan-400 font-bold mb-1">{product.price}</p>
                            {(product.price_monthly || product.price_yearly) && (
                                <div className="text-xs text-gray-400 mb-2 space-y-0.5">
                                    {product.price_monthly && <div>{product.price_monthly} <span className="text-gray-600">/bln</span></div>}
                                    {product.price_yearly && <div>{product.price_yearly} <span className="text-gray-600">/thn</span></div>}
                                </div>
                            )}
                            <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
                                {product.link && <a href={product.link} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{product.link}</a>}

                            </div>
                            <p className="text-gray-500 text-xs line-clamp-2">{product.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-lg p-6 relative">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold mb-6">{isEditing ? 'Edit Product' : 'Create New Product'}</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Product Name</label>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 focus:outline-none focus:border-purple-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Label Harga / Tier</label>
                                    <input
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        placeholder="e.g. FREE, Subscription"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 focus:outline-none focus:border-purple-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Harga / Bulan</label>
                                    <input
                                        name="price_monthly"
                                        value={formData.price_monthly}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Rp 150.000"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Harga / Tahun</label>
                                    <input
                                        name="price_yearly"
                                        value={formData.price_yearly}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Rp 1.500.000"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Tag (e.g. Best Seller)</label>
                                <input
                                    name="tag"
                                    value={formData.tag}
                                    onChange={handleInputChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Product Link (URL)</label>
                                <input
                                    name="link"
                                    value={formData.link}
                                    onChange={handleInputChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 focus:outline-none focus:border-blue-500"
                                    placeholder="https://..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 focus:outline-none focus:border-purple-500"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Product Image</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl mt-4 disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
