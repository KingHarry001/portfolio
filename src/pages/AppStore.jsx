// src/pages/AppStore.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Download, 
  Star, 
  TrendingUp, 
  Sparkles,
  Filter,
  Grid3x3,
  List
} from 'lucide-react';
// import { useApps } from '../hooks/useApps';

const mockApps = [
  {
    id: '1',
    name: 'TaskMaster Pro',
    slug: 'taskmaster-pro',
    short_description: 'Powerful task management with AI suggestions',
    icon_url: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=200&h=200&fit=crop',
    category: 'Productivity',
    rating: 4.8,
    rating_count: 1250,
    downloads: 50000,
    size: '28 MB',
    featured: true,
    version: '2.1.0'
  },
  {
    id: '2',
    name: 'FitTrack Health',
    slug: 'fittrack-health',
    short_description: 'Complete fitness and health tracking',
    icon_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop',
    category: 'Health & Fitness',
    rating: 4.6,
    rating_count: 890,
    downloads: 35000,
    size: '35 MB',
    featured: true,
    version: '1.5.2'
  },
  {
    id: '3',
    name: 'Budget Buddy',
    slug: 'budget-buddy',
    short_description: 'Smart personal finance manager',
    icon_url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=200&h=200&fit=crop',
    category: 'Finance',
    rating: 4.7,
    rating_count: 2100,
    downloads: 75000,
    size: '22 MB',
    featured: false,
    version: '3.0.1'
  },
  {
    id: '4',
    name: 'Photo Editor Pro',
    slug: 'photo-editor-pro',
    short_description: 'Professional photo editing tools',
    icon_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=200&fit=crop',
    category: 'Tools',
    rating: 4.5,
    rating_count: 1800,
    downloads: 60000,
    size: '45 MB',
    featured: false,
    version: '4.2.0'
  }
];

const categories = [
  'All',
  'Productivity',
  'Health & Fitness',
  'Social',
  'Entertainment',
  'Finance',
  'Tools',
  'Education'
];

const AppCard = ({ app, viewMode, onAppClick }) => {
  const formatDownloads = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M+`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K+`;
    return num.toString();
  };

  if (viewMode === 'list') {
    return (
      <div 
        onClick={() => onAppClick(app.slug)}
        className="flex items-center gap-4 p-4 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-cyan-500/50 transition-all duration-300 cursor-pointer group"
      >
        <img 
          src={app.icon_url} 
          alt={app.name}
          className="w-16 h-16 rounded-xl"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-white truncate group-hover:text-cyan-400 transition-colors">
              {app.name}
            </h3>
            {app.featured && (
              <Sparkles className="w-4 h-4 text-yellow-400 flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-gray-400 truncate mb-2">{app.short_description}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              {app.rating}
            </span>
            <span>{app.size}</span>
            <span>{formatDownloads(app.downloads)} downloads</span>
          </div>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAppClick(app.slug);
          }}
          className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors flex-shrink-0"
        >
          Get
        </button>
      </div>
    );
  }

  return (
    <div 
      onClick={() => onAppClick(app.slug)}
      className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 cursor-pointer group"
    >
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <img 
            src={app.icon_url} 
            alt={app.name}
            className="w-16 h-16 rounded-xl flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-white truncate group-hover:text-cyan-400 transition-colors">
                {app.name}
              </h3>
              {app.featured && (
                <Sparkles className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-gray-500">{app.category}</p>
          </div>
        </div>
        
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">
          {app.short_description}
        </p>
        
        <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            {app.rating} ({app.rating_count})
          </span>
          <span>{app.size}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Download className="w-3 h-3" />
            {formatDownloads(app.downloads)}
          </span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAppClick(app.slug);
            }}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Get
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AppStore() {
  const navigate = useNavigate();
  
  // TODO: Replace with actual Supabase hook
  // const { apps, loading, error } = useApps();
  const [apps] = useState(mockApps);
  const [filteredApps, setFilteredApps] = useState(mockApps);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [loading] = useState(false);

  useEffect(() => {
    let result = apps;

    if (activeCategory !== 'All') {
      result = result.filter(app => app.category === activeCategory);
    }

    if (searchQuery) {
      result = result.filter(app => 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.short_description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredApps(result);
  }, [searchQuery, activeCategory, apps]);

  const featuredApps = apps.filter(app => app.featured);

  const handleAppClick = (slug) => {
    navigate(`/apps/${slug}`);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-cyan-500/10 rounded-lg">
              <Download className="w-6 h-6 text-cyan-400" />
            </div>
            <h1 className="text-4xl font-bold">App Store</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Download premium apps developed by Harrison King
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search apps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            
            <div className="flex gap-2 bg-gray-900 border border-gray-800 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-cyan-500 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-cyan-500 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Apps */}
        {activeCategory === 'All' && featuredApps.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h2 className="text-2xl font-bold">Featured Apps</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredApps.map(app => (
                <div
                  key={app.id}
                  className="relative bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-2xl p-6 overflow-hidden group cursor-pointer"
                  onClick={() => handleAppClick(app.slug)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative flex items-start gap-4">
                    <img 
                      src={app.icon_url} 
                      alt={app.name}
                      className="w-20 h-20 rounded-2xl"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">{app.name}</h3>
                        <Sparkles className="w-5 h-5 text-yellow-400" />
                      </div>
                      <p className="text-gray-400 mb-3">{app.short_description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {app.rating}
                        </span>
                        <span className="text-gray-500">{app.size}</span>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAppClick(app.slug);
                      }}
                      className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors"
                    >
                      Get
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Apps */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {activeCategory === 'All' ? 'All Apps' : activeCategory}
            </h2>
            <span className="text-gray-500">
              {filteredApps.length} {filteredApps.length === 1 ? 'app' : 'apps'}
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="text-center py-20">
              <Filter className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-400 mb-2">No apps found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
            }>
              {filteredApps.map(app => (
                <AppCard 
                  key={app.id} 
                  app={app} 
                  viewMode={viewMode}
                  onAppClick={handleAppClick}
                />
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 pt-16 border-t border-gray-800">
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">
              {apps.length}
            </div>
            <div className="text-gray-400">Total Apps</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">
              {apps.reduce((sum, app) => sum + app.downloads, 0).toLocaleString()}
            </div>
            <div className="text-gray-400">Total Downloads</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">
              {(apps.reduce((sum, app) => sum + app.rating, 0) / apps.length).toFixed(1)}
            </div>
            <div className="text-gray-400">Avg Rating</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          height: 6px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 3px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #4B5563;
        }
      `}</style>
    </div>
  );
}