// src/api/supabase.js
import { supabase, uploadFile, deleteFile } from '../lib/supabase';

// ==================== PROJECTS API ====================
export const projectsAPI = {
  getAll: async (filters = {}) => {
    let query = supabase
      .from('projects')
      .select('*');

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.featured !== undefined) {
      query = query.eq('featured', filters.featured);
    }

    // Only show published for public
    if (!filters.showDrafts) {
      query = query.eq('published', true);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  create: async (projectData, userId) => {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        ...projectData,
        user_id: userId,
        created_by: userId
      })
      .select()
      .single();

    if (error) throw error;

    // Log action
    await auditLog('create', 'projects', data.id, userId, projectData);
    
    return data;
  },

  update: async (id, projectData, userId) => {
    const { data, error } = await supabase
      .from('projects')
      .update({
        ...projectData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    await auditLog('update', 'projects', id, userId, projectData);
    
    return data;
  },

  delete: async (id, userId) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;

    await auditLog('delete', 'projects', id, userId, null);
    
    return true;
  },
};

// Audit logging
async function auditLog(action, tableName, recordId, userId, changes) {
  await supabase.from('audit_logs').insert({
    user_id: userId,
    action,
    table_name: tableName,
    record_id: recordId,
    changes
  });
}
// ==================== APPS API ====================

export const appsAPI = {
  // Get all apps
  getAll: async (filters = {}) => {
    let query = supabase.from('apps').select('*');

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.published !== undefined) {
      query = query.eq('published', filters.published);
    }

    if (filters.featured !== undefined) {
      query = query.eq('featured', filters.featured);
    }

    const { data, error } = await query.order('last_updated', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get single app by slug
  getBySlug: async (slug) => {
    const { data, error } = await supabase
      .from('apps')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  },

  // Create app
  create: async (appData) => {
    const { data, error } = await supabase
      .from('apps')
      .insert(appData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update app
  update: async (id, appData) => {
    const { data, error } = await supabase
      .from('apps')
      .update({ ...appData, last_updated: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete app
  delete: async (id) => {
    const { error } = await supabase
      .from('apps')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  // Increment download count
  incrementDownloads: async (id) => {
    const { data: app } = await supabase
      .from('apps')
      .select('downloads')
      .eq('id', id)
      .single();

    const { data, error } = await supabase
      .from('apps')
      .update({ downloads: (app.downloads || 0) + 1 })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ==================== APP RELEASES API ====================

export const releasesAPI = {
  // Get releases for an app
  getByAppId: async (appId) => {
    const { data, error } = await supabase
      .from('app_releases')
      .select('*')
      .eq('app_id', appId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get latest release
  getLatest: async (appId) => {
    const { data, error } = await supabase
      .from('app_releases')
      .select('*')
      .eq('app_id', appId)
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;
    return data;
  },

  // Create release
  create: async (releaseData) => {
    const { data, error } = await supabase
      .from('app_releases')
      .insert(releaseData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update release
  update: async (id, releaseData) => {
    const { data, error } = await supabase
      .from('app_releases')
      .update(releaseData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete release
  delete: async (id) => {
    const { error } = await supabase
      .from('app_releases')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  // Increment download count
  incrementDownloads: async (id) => {
    const { data: release } = await supabase
      .from('app_releases')
      .select('downloads')
      .eq('id', id)
      .single();

    const { data, error } = await supabase
      .from('app_releases')
      .update({ downloads: (release.downloads || 0) + 1 })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ==================== BLOG POSTS API ====================

export const blogAPI = {
  // Get all posts
  getAll: async (filters = {}) => {
    let query = supabase.from('blog_posts').select('*');

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.published !== undefined) {
      query = query.eq('published', filters.published);
    }

    const { data, error } = await query.order('publish_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get single post by slug
  getBySlug: async (slug) => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  },

  // Create post
  create: async (postData) => {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(postData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update post
  update: async (id, postData) => {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(postData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete post
  delete: async (id) => {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },
};

// ==================== SERVICES API ====================

export const servicesAPI = {
  // Get all services
  getAll: async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Get active services
  getActive: async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Create service
  create: async (serviceData) => {
    const { data, error } = await supabase
      .from('services')
      .insert(serviceData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update service
  update: async (id, serviceData) => {
    const { data, error } = await supabase
      .from('services')
      .update(serviceData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete service
  delete: async (id) => {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },
};

// ==================== TESTIMONIALS API ====================

export const testimonialsAPI = {
  // Get all testimonials
  getAll: async () => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Get featured testimonials
  getFeatured: async () => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('featured', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Create testimonial
  create: async (testimonialData) => {
    const { data, error } = await supabase
      .from('testimonials')
      .insert(testimonialData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update testimonial
  update: async (id, testimonialData) => {
    const { data, error } = await supabase
      .from('testimonials')
      .update(testimonialData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete testimonial
  delete: async (id) => {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },
};