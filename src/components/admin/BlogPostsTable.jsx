import { Plus, FileText, Calendar, Edit, Trash2 } from 'lucide-react';

const BlogPostsTable = ({ blogs, onAddPost, onEditPost, onDeletePost }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-white">Blog Posts</h3>
        <button
          onClick={onAddPost}
          className="px-3 py-3 border border-gray-300 dark:border-gray-600 hover:border-orange-600 dark:hover:border-orange-500 rounded-[10px] hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
            aria-label="Add to cart"
          >
            <svg
              className="w-4 h-4 text-gray-600 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
        </button>
      </div>

      <div className="space-y-4">
        {blogs.map((post) => (
          <div key={post.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-bold text-white text-lg">{post.title}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    post.published 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-2">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.publish_date || Date.now()).toLocaleDateString()}
                  </span>
                  <span>{post.category}</span>
                </div>
              </div>
              
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => onEditPost(post)}
                  className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => onDeletePost(post.id)}
                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPostsTable;