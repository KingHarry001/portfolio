import { 
  Plus, 
  FileText, 
  Calendar, 
  Edit, 
  Trash2, 
  Tag, 
  ArrowUpRight 
} from 'lucide-react';

const BlogPostsTable = ({ blogs, onAddPost, onEditPost, onDeletePost }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-2">
            Blog Posts
          </h3>
          <p className="text-gray-400">Manage your articles, thoughts, and tutorials.</p>
        </div>
        
        <button
          onClick={onAddPost}
          className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-cyan-500/25 flex items-center gap-2 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          New Post
        </button>
      </div>

      {/* Empty State */}
      {blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-3xl border-dashed">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <FileText size={40} className="text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No posts yet</h3>
          <p className="text-gray-400 max-w-sm text-center mb-8">
            Start writing your first blog post to share your knowledge.
          </p>
          <button
            onClick={onAddPost}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Post
          </button>
        </div>
      ) : (
        /* Blog Grid */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((post) => (
            <div 
              key={post.id} 
              className="group flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="p-6 flex flex-col flex-1">
                {/* Meta Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-medium border border-cyan-500/20 flex items-center gap-1.5">
                      <Tag size={10} />
                      {post.category || "General"}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-medium border ${
                    post.published 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </div>

                {/* Content */}
                <h4 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                  {post.title}
                </h4>
                <p className="text-sm text-gray-400 line-clamp-3 mb-6 flex-1">
                  {post.excerpt || "No description provided."}
                </p>

                {/* Footer Info & Actions */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar size={12} />
                    <span>{new Date(post.publish_date || Date.now()).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Optional: View Link if slug exists */}
                    {post.slug && (
                      <a 
                        href={`/blog/${post.slug}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        title="View Live"
                      >
                        <ArrowUpRight size={16} />
                      </a>
                    )}
                    
                    <button
                      onClick={() => onEditPost(post)}
                      className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    
                    <button
                      onClick={() => onDeletePost(post.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogPostsTable;