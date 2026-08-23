import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Category } from '../../types';
import { 
  FolderTree, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  ExternalLink,
  Layers
} from 'lucide-react';
import { IMAGE_3_WARM_MOON, IMAGE_8_LIFESTYLE_TABLE, IMAGE_2_BLUE_TABLE } from '../../data/productImages';

export const AdminCategoriesPage: React.FC = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory, navigate } = useStore();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatDescription, setNewCatDescription] = useState('');
  const [newCatImage, setNewCatImage] = useState(IMAGE_3_WARM_MOON);

  // Edit
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    addCategory({
      name: newCatName.trim(),
      slug: (newCatSlug || newCatName).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: newCatDescription,
      image: newCatImage,
      itemCount: 0,
      enabled: true
    });

    setIsAddModalOpen(false);
    setNewCatName('');
    setNewCatSlug('');
    setNewCatDescription('');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategory(editingCategory);
      setEditingCategory(null);
    }
  };

  return (
    <AdminLayout
      activeSection="categories"
      title="Collections & Taxonomy Architecture"
      subtitle="Organize public gallery series, descriptions, and curated feature spotlights."
      actionButton={
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold uppercase tracking-wider flex items-center space-x-2 shadow-lg shadow-amber-400/20 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Collection Category</span>
        </button>
      }
    >
      <div className="space-y-6">
        
        {/* Categories Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat) => {
            const productCount = products.filter(
              (p) => p.category.toLowerCase() === cat.name.toLowerCase()
            ).length;

            return (
              <div
                key={cat.id}
                className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4 shadow-xl flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 p-1 shrink-0 overflow-hidden">
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-xl" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">{cat.name}</h3>
                      <div className="text-xs font-mono text-amber-300">
                        slug: /{cat.slug}
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-zinc-900 border border-zinc-800 text-zinc-300">
                    {productCount} items linked
                  </span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                  {cat.description}
                </p>

                <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
                  <button
                    onClick={() => navigate(`/collections/${cat.slug}`)}
                    className="text-xs text-zinc-400 hover:text-white flex items-center space-x-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Live Gallery</span>
                  </button>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingCategory(cat)}
                      className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-amber-300 transition-colors"
                      title="Edit Category"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-rose-400 transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
            <div onClick={() => setIsAddModalOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
            <div className="relative bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full z-10 space-y-5 text-xs shadow-2xl">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-base font-semibold text-white uppercase tracking-wider">
                  Add Collection Series
                </h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Series Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Celestial Wall Reliefs"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Route Slug</label>
                  <input
                    type="text"
                    placeholder="e.g. celestial-reliefs"
                    value={newCatSlug}
                    onChange={(e) => setNewCatSlug(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Architectural Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe design concept, physics, and ambiance..."
                    value={newCatDescription}
                    onChange={(e) => setNewCatDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-400 text-zinc-950 font-bold uppercase tracking-wider"
                  >
                    Create Collection
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingCategory && (
          <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
            <div onClick={() => setEditingCategory(null)} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
            <div className="relative bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full z-10 space-y-5 text-xs shadow-2xl">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-base font-semibold text-white uppercase tracking-wider">
                  Edit: {editingCategory.name}
                </h3>
                <button onClick={() => setEditingCategory(null)} className="text-zinc-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Series Name</label>
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editingCategory.description}
                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="px-4 py-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-400 text-zinc-950 font-bold uppercase tracking-wider"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};
