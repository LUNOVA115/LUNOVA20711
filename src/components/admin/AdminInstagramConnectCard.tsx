import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Instagram, 
  Check, 
  ExternalLink, 
  RefreshCw, 
  Unlink, 
  Sparkles, 
  ShieldCheck, 
  Heart, 
  MessageCircle, 
  Sliders, 
  Image as ImageIcon,
  Plus,
  Trash2,
  Lock,
  UserCheck,
  Upload,
  AlertCircle,
  Eye,
  CheckCircle2,
  X,
  Link as LinkIcon,
  ArrowRight,
  Globe
} from 'lucide-react';
import { 
  IMAGE_1_GOLD_TABLE, 
  IMAGE_2_BLUE_TABLE, 
  IMAGE_3_WARM_MOON, 
  IMAGE_4_CRATER_MOON, 
  IMAGE_5_LUNAR_SURFACE, 
  IMAGE_7_COOL_WHITE_MOON 
} from '../../data/productImages';

// Helper to extract clean handle from handles, @mentions, or full Instagram URLs
const extractInstagramHandle = (input: string): string => {
  let cleaned = input.trim();
  // Strip URL prefixes
  cleaned = cleaned.replace(/^https?:\/\/(www\.)?instagram\.com\//i, '');
  cleaned = cleaned.replace(/^instagram\.com\//i, '');
  // Strip trailing query params or slashes
  cleaned = cleaned.split('?')[0].split('/')[0];
  // Strip @
  cleaned = cleaned.replace(/^@+/, '');
  return cleaned.trim();
};

export const AdminInstagramConnectCard: React.FC = () => {
  const { 
    instagramSettings, 
    updateInstagramSettings, 
    connectInstagramAccount, 
    disconnectInstagramAccount, 
    syncInstagramFeed,
    addInstagramPost,
    deleteInstagramPost,
    adminUser,
    addToast 
  } = useStore();

  // Inputs
  const [handleInput, setHandleInput] = useState(instagramSettings.handle || '');
  const [nameInput, setNameInput] = useState(instagramSettings.accountName || '');
  const [bioInput, setBioInput] = useState(instagramSettings.bio || '');
  const [avatarInput, setAvatarInput] = useState(instagramSettings.profilePicture || '');

  // UI state
  const [isEditing, setIsEditing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAddPostModalOpen, setIsAddPostModalOpen] = useState(false);

  // New Post Form
  const [postImageUrl, setPostImageUrl] = useState('');
  const [postCaption, setPostCaption] = useState('');
  const [postPermalink, setPostPermalink] = useState('');

  // Handle direct connect
  const handleConnect = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanHandle = extractInstagramHandle(handleInput);
    if (!cleanHandle) {
      addToast('Please enter your Instagram handle or profile URL (e.g. @yourbrand or instagram.com/yourbrand)', 'error');
      return;
    }

    setIsConnecting(true);
    setTimeout(() => {
      connectInstagramAccount(
        cleanHandle,
        nameInput.trim() || `${cleanHandle.toUpperCase()} | Official`,
        bioInput.trim() || 'Atmospheric Lighting & Curated Luxury Atelier',
        avatarInput.trim() || undefined
      );
      setIsConnecting(false);
      setIsEditing(false);
    }, 400);
  };

  // Quick sync
  const handleTriggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      syncInstagramFeed();
      setIsSyncing(false);
    }, 500);
  };

  // Add post to showcase
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postImageUrl.trim()) {
      addToast('Please enter an image URL for your post.', 'warning');
      return;
    }

    addInstagramPost({
      mediaUrl: postImageUrl.trim(),
      caption: postCaption.trim() || `Atmospheric design by @${instagramSettings.handle || 'admin'}`,
      permalink: postPermalink.trim() || `https://instagram.com/${instagramSettings.handle || 'lunova.atelier'}`
    });

    setPostImageUrl('');
    setPostCaption('');
    setPostPermalink('');
    setIsAddPostModalOpen(false);
  };

  return (
    <div className="bg-zinc-950 border border-pink-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden ring-1 ring-pink-500/10">
      
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-pink-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5 relative z-10">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 p-0.5 shadow-lg shadow-pink-500/20 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
              <Instagram className="w-6 h-6 text-pink-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold uppercase tracking-wider text-white">
                Admin Instagram Account Connection
              </h3>
              {instagramSettings.isConnected ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>CONNECTED</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold">
                  READY TO CONNECT
                </span>
              )}
            </div>
            <p className="text-zinc-400 text-xs mt-0.5">
              Connect your own Instagram account to showcase your genuine media feed, link your profile in footer, and tag products.
            </p>
          </div>
        </div>

        {/* Top Controls */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          {instagramSettings.isConnected && (
            <>
              <button
                type="button"
                onClick={() => setIsAddPostModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-pink-500/15 hover:bg-pink-500/25 text-pink-300 border border-pink-500/30 text-xs font-mono font-semibold flex items-center space-x-1.5 transition-colors"
                title="Add custom post from your feed"
              >
                <Plus className="w-3.5 h-3.5 text-pink-400" />
                <span>Add Post</span>
              </button>

              <button
                type="button"
                onClick={handleTriggerSync}
                disabled={isSyncing}
                className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 text-xs font-mono font-semibold flex items-center space-x-1.5 transition-colors disabled:opacity-50"
                title="Sync latest Instagram media"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-pink-400 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Feed'}</span>
              </button>
            </>
          )}

          <a
            href={instagramSettings.profileUrl || `https://instagram.com/${instagramSettings.handle || 'lunova.atelier'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 text-xs font-mono font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <span>@{instagramSettings.handle || 'page'}</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </a>
        </div>
      </div>

      {/* Main Connection Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Left Col: Account Status / Direct Form (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* If Connected and Not in Edit Mode */}
          {instagramSettings.isConnected && !isEditing ? (
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className="relative">
                    <img
                      src={instagramSettings.profilePicture || instagramSettings.recentPosts?.[0]?.mediaUrl || IMAGE_3_WARM_MOON}
                      alt={instagramSettings.handle}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-pink-500/40 p-0.5 bg-zinc-950"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-zinc-950 flex items-center justify-center">
                      <Check className="w-3 h-3 text-zinc-950 stroke-[3]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-base font-bold text-white tracking-wide">
                        @{instagramSettings.handle}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold flex items-center space-x-1">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        <span>VERIFIED ACCOUNT</span>
                      </span>
                    </div>
                    <div className="text-xs text-zinc-300 font-medium mt-0.5">
                      {instagramSettings.accountName || 'Official Instagram Page'}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                      Target URL: {instagramSettings.profileUrl}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setHandleInput(instagramSettings.handle);
                      setNameInput(instagramSettings.accountName || '');
                      setBioInput(instagramSettings.bio || '');
                      setAvatarInput(instagramSettings.profilePicture || '');
                      setIsEditing(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors"
                  >
                    Change Account
                  </button>

                  <button
                    type="button"
                    onClick={disconnectInstagramAccount}
                    className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                    title="Disconnect Instagram"
                  >
                    <Unlink className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {instagramSettings.bio && (
                <div className="text-xs text-zinc-300 bg-zinc-950/70 p-3 rounded-xl border border-zinc-800 font-light">
                  {instagramSettings.bio}
                </div>
              )}

              {/* Stats overview */}
              <div className="grid grid-cols-3 gap-3 pt-1 text-center font-mono">
                <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <div className="text-xs font-bold text-white">{(instagramSettings.followersCount || 148500).toLocaleString()}</div>
                  <div className="text-[9px] text-zinc-400 uppercase mt-0.5">Followers</div>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <div className="text-xs font-bold text-white">{(instagramSettings.recentPosts?.length || 0)}</div>
                  <div className="text-[9px] text-zinc-400 uppercase mt-0.5">Live Posts</div>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <div className="text-xs font-bold text-emerald-400">Active</div>
                  <div className="text-[9px] text-zinc-400 uppercase mt-0.5">Store Sync</div>
                </div>
              </div>
            </div>
          ) : (
            /* Direct Connect Form (Easy & Immediate) */
            <form onSubmit={handleConnect} className="p-6 rounded-2xl bg-zinc-900/60 border border-pink-500/30 space-y-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-pink-400 font-mono text-xs uppercase tracking-wider font-bold">
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Connect Your Own Instagram Page</span>
                </div>
                <h4 className="text-base font-bold text-white">
                  Enter Your Instagram Handle or URL
                </h4>
                <p className="text-xs text-zinc-400">
                  Type your Instagram username (e.g. <span className="text-pink-300 font-mono">your_brand</span>) or paste your profile link.
                </p>
              </div>

              <div className="space-y-3">
                {/* Username Input */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                    Your Instagram Handle / Profile URL *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs">@</span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. my_official_store or instagram.com/my_store"
                      value={handleInput}
                      onChange={(e) => setHandleInput(e.target.value)}
                      className="w-full pl-8 pr-4 py-2.5 bg-zinc-950 border border-zinc-700/90 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                    />
                  </div>
                </div>

                {/* Display Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                      Business Display Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. LUNOVA | Atelier"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700/90 rounded-xl text-white text-xs focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                      Profile Avatar URL (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={avatarInput}
                      onChange={(e) => setAvatarInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700/90 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                    Bio / Description (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe your brand and installations..."
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-700/90 rounded-xl text-white text-xs focus:outline-none focus:border-pink-500 resize-y"
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex items-center space-x-3">
                <button
                  type="submit"
                  disabled={isConnecting}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:opacity-95 text-zinc-950 font-bold uppercase tracking-wider text-xs shadow-lg shadow-pink-500/20 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-zinc-950" />
                      <span>Connecting & Verifying...</span>
                    </>
                  ) : (
                    <>
                      <Instagram className="w-4 h-4" />
                      <span>Connect Instagram Page Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Visibility Controls */}
          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 block">
              Storefront Display Preferences
            </span>

            <div className="space-y-2.5">
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/60 cursor-pointer hover:border-zinc-700 transition-colors">
                <div className="flex items-center space-x-2.5">
                  <Eye className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="text-zinc-200 font-medium text-xs">Live Instagram Showcase on Home Page</div>
                    <div className="text-[10px] text-zinc-500">Shows curated 6-post media grid at the bottom of the home page</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={instagramSettings.displayFeedOnHome}
                  onChange={(e) => updateInstagramSettings({ displayFeedOnHome: e.target.checked })}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-pink-500 focus:ring-pink-500"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/60 cursor-pointer hover:border-zinc-700 transition-colors">
                <div className="flex items-center space-x-2.5">
                  <Instagram className="w-4 h-4 text-pink-400" />
                  <div>
                    <div className="text-zinc-200 font-medium text-xs">Official Badge in Global Footer & Contact Page</div>
                    <div className="text-[10px] text-zinc-500">Links directly to your Instagram profile across the site</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={instagramSettings.displayOnFooter}
                  onChange={(e) => updateInstagramSettings({ displayOnFooter: e.target.checked, displayOnContact: e.target.checked })}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-pink-500 focus:ring-pink-500"
                />
              </label>
            </div>
          </div>

        </div>

        {/* Right Col: Showcase Media Manager (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center space-x-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
              <span>Showcase Feed ({instagramSettings.recentPosts?.length || 0} items)</span>
            </span>

            <button
              type="button"
              onClick={() => setIsAddPostModalOpen(true)}
              className="text-[11px] font-mono text-pink-400 hover:text-pink-300 flex items-center space-x-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Your Photo</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-zinc-900/60 p-3 rounded-2xl border border-zinc-800 max-h-96 overflow-y-auto">
            {(instagramSettings.recentPosts || []).map((post) => (
              <div
                key={post.id}
                className="relative aspect-square rounded-xl overflow-hidden group bg-zinc-950 border border-zinc-800/80 hover:border-pink-500/50 transition-all"
              >
                <img
                  src={post.mediaUrl}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => deleteInstagramPost(post.id)}
                  className="absolute top-1.5 right-1.5 p-1.5 rounded-lg bg-black/80 hover:bg-rose-600 text-zinc-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity border border-white/20"
                  title="Remove this post"
                >
                  <Trash2 className="w-3 h-3" />
                </button>

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-white pointer-events-none">
                  <div className="flex items-center space-x-1 text-[8px] font-mono text-pink-300">
                    <Heart className="w-2.5 h-2.5 fill-pink-400 text-pink-400" />
                    <span>{post.likesCount || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/80 text-[11px] text-zinc-400 flex items-start space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>
              All posts displayed above link directly to <span className="text-pink-300 font-mono">@{instagramSettings.handle || 'your_page'}</span> on Instagram.
            </span>
          </div>
        </div>

      </div>

      {/* =========================================================================
          MODAL: ADD YOUR OWN INSTAGRAM PHOTO / REEL
      ========================================================================= */}
      {isAddPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-zinc-950 border border-pink-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-5 text-xs">
            
            <button
              onClick={() => setIsAddPostModalOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <Plus className="w-4 h-4 text-pink-400" />
                <span>Add Post to Instagram Showcase</span>
              </h3>
              <p className="text-zinc-400 text-[11px]">
                Add an image URL and caption from your Instagram feed to display on the storefront.
              </p>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block font-semibold text-zinc-300 uppercase mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/... or your media URL"
                  value={postImageUrl}
                  onChange={(e) => setPostImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-pink-500"
                />

                {/* Presets */}
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-[10px] text-zinc-500 font-mono">Quick Preset:</span>
                  <button
                    type="button"
                    onClick={() => setPostImageUrl(IMAGE_1_GOLD_TABLE)}
                    className="text-[10px] text-amber-400 hover:underline font-mono"
                  >
                    Gold Table
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostImageUrl(IMAGE_4_CRATER_MOON)}
                    className="text-[10px] text-amber-400 hover:underline font-mono"
                  >
                    Crater Moon
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostImageUrl(IMAGE_2_BLUE_TABLE)}
                    className="text-[10px] text-amber-400 hover:underline font-mono"
                  >
                    Cobalt Abyss
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 uppercase mb-1">
                  Caption / Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Hand-crafted architectural lighting installation by our workshop..."
                  value={postCaption}
                  onChange={(e) => setPostCaption(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-zinc-200 text-xs focus:outline-none focus:border-pink-500 resize-y"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 uppercase mb-1">
                  Direct Instagram Post Permalink (Optional)
                </label>
                <input
                  type="url"
                  placeholder={`https://instagram.com/p/...`}
                  value={postPermalink}
                  onChange={(e) => setPostPermalink(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddPostModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pink-500 hover:bg-pink-400 text-zinc-950 font-bold uppercase tracking-wider shadow-md shadow-pink-500/20"
                >
                  Add to Showcase
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
