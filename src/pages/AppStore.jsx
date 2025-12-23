// src/pages/AppStore.jsx - Updated with Theme Support
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
import { appsAPI } from '../api/supabase';

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
        className="flex items-center gap-4 p-4 bg-card/50 border border-border rounded-xl hover:border-chart-1/50 transition-all duration-300 cursor-pointer group"
      >
        <img 
          src={app.icon_url} 
          alt={app.name}
          className="w-16 h-16 rounded-xl object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-foreground truncate group-hover:text-chart-1 transition-colors">
              {app.name}
            </h3>
            {app.featured && (
              <Sparkles className="w-4 h-4 text-chart-4 flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate mb-2">{app.short_description}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-chart-4 text-chart-4" />
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
          className="px-6 py-2 bg-chart-1 hover:bg-chart-1/80 text-primary-foreground rounded-lg font-medium transition-colors flex-shrink-0"
        >
          Get
        </button>
      </div>
    );
  }

  return (
    <div 
      onClick={() => onAppClick(app.slug)}
      className="bg-card/50 border border-border rounded-xl overflow-hidden hover:border-chart-1/50 transition-all duration-300 cursor-pointer group"
    >
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <img 
            src={app.icon_url} 
            alt={app.name}
            className="w-16 h-16 rounded-xl flex-shrink-0 object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-foreground truncate group-hover:text-chart-1 transition-colors">
                {app.name}
              </h3>
              {app.featured && (
                <Sparkles className="w-4 h-4 text-chart-4 flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">{app.category}</p>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {app.short_description}
        </p>
        
        <div className="flex items-center justify-between mb-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-chart-4 text-chart-4" />
            {app.rating} ({app.rating_count})
          </span>
          <span>{app.size}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Download className="w-3 h-3" />
            {formatDownloads(app.downloads)}
          </span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAppClick(app.slug);
            }}
            className="px-4 py-2 bg-chart-1 hover:bg-chart-1/80 text-primary-foreground rounded-lg text-sm font-medium transition-colors"
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
  
  const [apps, setApps] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      setLoading(true);
      const data = await appsAPI.getAll({ published: true });
      setApps(data || []);
      setFilteredApps(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching apps:', err);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen bg-background text-foreground pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-chart-1/10 rounded-lg">
              <Download className="w-6 h-6 text-chart-1" />
            </div>
            <h1 className="text-4xl font-bold">App Store</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Download premium apps developed by Harrison King
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search apps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-chart-1 transition-colors"
              />
            </div>
            
            <div className="flex gap-2 bg-card border border-border rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-chart-1 text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-chart-1 text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
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
                    ? 'bg-chart-1 text-primary-foreground'
                    : 'bg-card text-muted-foreground hover:text-foreground border border-border'
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
              <TrendingUp className="w-5 h-5 text-chart-1" />
              <h2 className="text-2xl font-bold">Featured Apps</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredApps.map(app => (
                <div
                  key={app.id}
                  className="relative bg-gradient-to-br from-chart-1/10 to-chart-3/10 border border-chart-1/20 rounded-2xl p-6 overflow-hidden group cursor-pointer hover:border-chart-1/40 transition-all"
                  onClick={() => handleAppClick(app.slug)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-chart-1/5 to-chart-3/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative flex items-start gap-4">
                    <img 
                      src={app.icon_url} 
                      alt={app.name}
                      className="w-20 h-20 rounded-2xl object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">{app.name}</h3>
                        <Sparkles className="w-5 h-5 text-chart-4" />
                      </div>
                      <p className="text-muted-foreground mb-3">{app.short_description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-chart-4 text-chart-4" />
                          {app.rating}
                        </span>
                        <span className="text-muted-foreground">{app.size}</span>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAppClick(app.slug);
                      }}
                      className="px-6 py-2 bg-chart-1 hover:bg-chart-1/80 text-primary-foreground rounded-lg font-medium transition-colors"
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
            <span className="text-muted-foreground">
              {filteredApps.length} {filteredApps.length === 1 ? 'app' : 'apps'}
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-chart-1 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-destructive mb-4">Error loading apps</div>
              <button 
                onClick={fetchApps}
                className="px-4 py-2 bg-chart-1 text-primary-foreground rounded-lg"
              >
                Try Again
              </button>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="text-center py-20">
              <Filter className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-muted-foreground mb-2">No apps found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
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
        {apps.length > 0 && (
          <div className="mt-16 grid grid-cols-3 gap-8 pt-16 border-t border-border">
            <div className="text-center">
              <div className="text-3xl font-bold text-chart-1 mb-2">
                {apps.length}
              </div>
              <div className="text-muted-foreground">Total Apps</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-chart-1 mb-2">
                {apps.reduce((sum, app) => sum + (app.downloads || 0), 0).toLocaleString()}
              </div>
              <div className="text-muted-foreground">Total Downloads</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-chart-1 mb-2">
                {apps.length > 0 ? (apps.reduce((sum, app) => sum + (app.rating || 0), 0) / apps.length).toFixed(1) : '0.0'}
              </div>
              <div className="text-muted-foreground">Avg Rating</div>
            </div>
          </div>
        )}
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
          background: hsl(var(--muted));
          border-radius: 3px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground));
        }
      `}</style>
    </div>
  );
}