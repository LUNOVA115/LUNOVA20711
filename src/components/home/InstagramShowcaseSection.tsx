import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Instagram, Heart, MessageCircle, ExternalLink, Sparkles, ArrowRight } from 'lucide-react';

export const InstagramShowcaseSection: React.FC = () => {
  const { instagramSettings } = useStore();

  if (!instagramSettings.isConnected || !instagramSettings.displayFeedOnHome) {
    return null;
  }

  const posts = instagramSettings.recentPosts || [];
  const handle = instagramSettings.handle || 'lunova.home_decors';
  const profileUrl = instagramSettings.profileUrl || `https://www.instagram.com/${handle}/?hl=en`;

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-[#08090c] via-black to-[#050608] border-t border-zinc-900">
      
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-radial from-pink-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-zinc-800/80 pb-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-pink-400 font-mono text-xs uppercase tracking-widest">
              <Instagram className="w-4 h-4" />
              <span>LUNOVA Curated Atelier • Instagram Journal</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif text-white uppercase tracking-wider font-light">
              Follow Our <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-amber-300 to-amber-100">Visual Universe</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-xl font-light">
              Tag <span className="text-white font-mono font-semibold">#{handle.toUpperCase()}</span> to be featured in our permanent architectural collector gallery.
            </p>
          </div>

          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-xs font-mono font-semibold text-white transition-all hover:scale-105 shadow-lg shadow-pink-500/10 shrink-0"
          >
            <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            <span>Follow @{handle}</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </a>
        </div>

        {/* Dynamic Grid of Connected Posts */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {posts.map((post) => (
            <a
              key={post.id}
              href={post.permalink || profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800/80 hover:border-pink-500/60 shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <img
                src={post.mediaUrl}
                alt={post.caption}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-3.5 text-white">
                <div className="flex justify-end">
                  <div className="p-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-pink-400">
                    <Instagram className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] text-zinc-300 line-clamp-2 leading-snug font-light">
                    {post.caption}
                  </p>
                  <div className="flex items-center space-x-3 text-[10px] font-mono text-pink-300">
                    <span className="flex items-center space-x-1">
                      <Heart className="w-3 h-3 fill-pink-400 text-pink-400" />
                      <span>{post.likesCount || 180}</span>
                    </span>
                    <span className="flex items-center space-x-1 text-zinc-400">
                      <MessageCircle className="w-3 h-3" />
                      <span>{post.commentsCount || 12}</span>
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Bottom Callout */}
        <div className="flex items-center justify-between text-xs text-zinc-500 font-mono pt-2">
          <span>Official Instagram API Sync • @{handle}</span>
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:text-amber-300 flex items-center space-x-1 transition-colors"
          >
            <span>View All Instagram Posts</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>

      </div>
    </section>
  );
};
