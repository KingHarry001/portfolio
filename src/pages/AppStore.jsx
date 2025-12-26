import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Download,
  Star,
  TrendingUp,
  Sparkles,
  Filter,
  Grid3x3,
  List,
  ChevronRight,
  Command
} from "lucide-react";
import { appsAPI } from "../api/supabase";

const categories = [
  "All",
  "Productivity",
  "Health & Fitness",
  "Social",
  "Entertainment",
  "Finance",
  "Tools",
  "Education",
];

const AppCard = ({ app, viewMode, onAppClick }) => {
  const formatDownloads = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M+`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K+`;
    return num;
  };

  if (viewMode === "list") {
    return (
      <div
        onClick={() => onAppClick(app.slug)}
        className="group relative flex items-center gap-6 p-4 bg-card/40 backdrop-blur-sm border border-white/5 hover:border-chart-1/30 rounded-2xl transition-all duration-300 hover:bg-card/60 cursor-pointer"
      >
        <div className="relative">
          <img
            src={app.icon_url}
            alt={app.name}
            className="w-16 h-16 rounded-2xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-300"
          />
           {app.featured && (
             <div className="absolute -top-2 -right-2 bg-chart-1 text-white text-[10px] px-2 py-0.5 rounded-full shadow-lg">
               Feat.
             </div>
           )}
        </div>
        
        <div className="flex-1 min-w-0 py-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-lg text-foreground group-hover:text-chart-1 transition-colors">
              {app.name}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground truncate max-w-md">
            {app.short_description}
          </p>
        </div>

        <div className="flex items-center gap-6 text-sm text-muted-foreground/80 hidden md:flex">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-chart-4 text-chart-4" />
            <span className="font-medium text-foreground">{app.rating}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Download className="w-4 h-4" />
            <span>{formatDownloads(app.downloads)}</span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onAppClick(app.slug);
          }}
          className="ml-4 px-6 py-2.5 bg-muted text-foreground font-medium rounded-xl group-hover:bg-chart-1 group-hover:text-white transition-all duration-300"
        >
          Get
        </button>
      </div>
    );
  }

  // Grid View
  return (
    <div
      onClick={() => onAppClick(app.slug)}
      className="group relative flex flex-col h-full bg-card/40 backdrop-blur-md border border-white/5 hover:border-chart-1/30 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-chart-1/10 cursor-pointer"
    >
      <div className="p-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="relative">
            <img
              src={app.icon_url}
              alt={app.name}
              className="w-20 h-20 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform duration-300"
            />
            {app.featured && (
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-chart-1 to-chart-3 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg border border-white/10">
                FEATURED
              </div>
            )}
          </div>
          <div className="text-right">
             <div className="inline-flex items-center gap-1 bg-chart-4/10 px-2 py-1 rounded-lg">
                <Star className="w-3.5 h-3.5 fill-chart-4 text-chart-4" />
                <span className="text-xs font-bold text-chart-4">{app.rating}</span>
             </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          <h3 className="font-bold text-xl text-foreground mb-1 group-hover:text-chart-1 transition-colors line-clamp-1">
            {app.name}
          </h3>
          <p className="text-xs font-medium text-muted-foreground/80 mb-2 uppercase tracking-wider">
            {app.category}
          </p>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {app.short_description}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            {formatDownloads(app.downloads)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAppClick(app.slug);
            }}
            className="px-5 py-2 bg-white/5 hover:bg-chart-1 text-foreground hover:text-white rounded-xl text-sm font-semibold transition-all duration-300"
          >
            Get
          </button>
        </div>
      </div>
      
      {/* Hover Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-chart-1/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

export default function AppStore() {
  const navigate = useNavigate();

  const [apps, setApps] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
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
      console.error("Error fetching apps:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = apps;

    if (activeCategory !== "All") {
      result = result.filter((app) => app.category === activeCategory);
    }

    if (searchQuery) {
      result = result.filter(
        (app) =>
          app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.short_description
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    setFilteredApps(result);
  }, [searchQuery, activeCategory, apps]);

  const featuredApps = apps.filter((app) => app.featured);

  const handleAppClick = (slug) => {
    navigate(`/apps/${slug}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-chart-1/30">
      
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-chart-1/5 blur-[120px] rounded-full" />
        <div className="absolute top-[10%] right-[0%] w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-16">
        
        {/* Hero Header */}
        <div className="text-center mb-16 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-chart-1/10 text-chart-1 text-sm font-medium mb-6 animate-fade-in border border-chart-1/20">
            <Sparkles className="w-4 h-4" />
            <span>Discover Premium Tools</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
            App Store
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A curated collection of high-performance applications designed to enhance your workflow.
          </p>

          {/* Search Bar */}
          <div className="mt-10 max-w-2xl mx-auto relative group z-20">
            <div className="absolute inset-0 bg-chart-1/20 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden focus-within:border-chart-1/50 focus-within:ring-4 focus-within:ring-chart-1/10 transition-all">
              <div className="pl-6 text-muted-foreground">
                <Search className="w-6 h-6" />
              </div>
              <input
                type="text"
                placeholder="Search for apps, tools, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-5 bg-transparent text-lg placeholder-muted-foreground/70"
              />
            </div>
          </div>
        </div>

        {/* Categories & View Toggle */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-10">
          <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
             <div className="flex gap-2 p-1 bg-muted/30 backdrop-blur-sm rounded-2xl border border-white/5">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      activeCategory === category
                        ? "bg-background text-foreground shadow-lg shadow-black/5 ring-1 ring-black/5"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    }`}
                  >
                    {category}
                  </button>
                ))}
             </div>
          </div>

          <div className="flex items-center gap-2 p-1 bg-muted/30 rounded-xl border border-white/5">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2.5 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-background text-chart-1 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2.5 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-background text-chart-1 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Featured Section */}
        {activeCategory === "All" && featuredApps.length > 0 && !searchQuery && (
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-xl bg-orange-500/10">
                <TrendingUp className="w-6 h-6 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Featured this week</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {featuredApps.map((app) => (
                <div
                  key={app.id}
                  className="group relative overflow-hidden bg-gradient-to-br from-chart-1/10 via-card to-card border border-chart-1/20 rounded-[2rem] p-8 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-chart-1/5 hover:-translate-y-1"
                  onClick={() => handleAppClick(app.slug)}
                >
                  <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
                    <img
                      src={app.icon_url}
                      alt={app.name}
                      className="w-32 h-32 rounded-3xl object-cover shadow-2xl group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="flex-1 text-center md:text-left">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-chart-1/20 text-chart-1 text-xs font-bold mb-4">
                        <Sparkles className="w-3 h-3" />
                        Editor's Choice
                      </div>
                      <h3 className="text-3xl font-bold mb-3 text-foreground">{app.name}</h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {app.short_description}
                      </p>
                      <button className="px-8 py-3 bg-foreground text-background font-bold rounded-xl hover:bg-chart-1 hover:text-white transition-all duration-300">
                        Install Now
                      </button>
                    </div>
                  </div>
                  
                  {/* Decorative Background Blur */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-chart-1/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-chart-1/20 transition-colors duration-500" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="space-y-8">
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              {activeCategory === "All" ? "Explore All" : activeCategory}
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({filteredApps.length})
              </span>
            </h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <div className="relative w-16 h-16">
                 <div className="absolute inset-0 border-4 border-chart-1/20 rounded-full"></div>
                 <div className="absolute inset-0 border-4 border-chart-1 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-muted-foreground font-medium animate-pulse">Loading amazing apps...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-destructive/20 bg-destructive/5 rounded-3xl">
              <p className="text-destructive font-medium mb-4">{error}</p>
              <button
                onClick={fetchApps}
                className="px-6 py-2 bg-destructive text-destructive-foreground rounded-xl font-medium"
              >
                Try Again
              </button>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                <Filter className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                No apps found
              </h3>
              <p className="text-muted-foreground max-w-sm">
                We couldn't find any apps matching your current filters. Try searching for something else.
              </p>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "grid grid-cols-1 gap-4"
              }
            >
              {filteredApps.map((app) => (
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

        {/* Footer Stats */}
        {apps.length > 0 && !loading && (
          <div className="mt-24 relative overflow-hidden rounded-3xl bg-card border border-border/50 p-12">
            <div className="grid md:grid-cols-3 gap-12 text-center relative z-10">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-chart-1">
                  {apps.length}
                </div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Apps</div>
              </div>
              <div className="space-y-2 relative">
                 {/* Divider */}
                 <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-12 bg-border/50" />
                 <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-border/50" />
                 
                <div className="text-4xl font-bold text-chart-1">
                  {apps
                    .reduce((sum, app) => sum + (app.downloads || 0), 0)
                    .toLocaleString()}
                </div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Downloads</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-chart-1">
                  {apps.length > 0
                    ? (
                        apps.reduce((sum, app) => sum + (app.rating || 0), 0) /
                        apps.length
                      ).toFixed(1)
                    : "0.0"}
                </div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Average Rating</div>
              </div>
            </div>
            
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
          </div>
        )}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}