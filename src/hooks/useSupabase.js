// src/hooks/useSupabase.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Generic hook for fetching data
export const useSupabaseQuery = (table, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let query = supabase.from(table).select(options.select || '*');

        // Apply filters
        if (options.filters) {
          Object.entries(options.filters).forEach(([key, value]) => {
            query = query.eq(key, value);
          });
        }

        // Apply ordering
        if (options.orderBy) {
          query = query.order(options.orderBy.column, {
            ascending: options.orderBy.ascending ?? true,
          });
        }

        // Apply limit
        if (options.limit) {
          query = query.limit(options.limit);
        }

        const { data: result, error: queryError } = await query;

        if (queryError) throw queryError;

        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [table, JSON.stringify(options)]);

  return { data, loading, error };
};

// Hook for projects
export const useProjects = (filters = {}) => {
  return useSupabaseQuery('projects', {
    orderBy: { column: 'created_at', ascending: false },
    filters,
  });
};

// Hook for featured projects
export const useFeaturedProjects = () => {
  return useSupabaseQuery('projects', {
    filters: { featured: true },
    orderBy: { column: 'created_at', ascending: false },
  });
};

// Hook for single project
export const useProject = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const { data: result, error: queryError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();

        if (queryError) throw queryError;

        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProject();
  }, [id]);

  return { data, loading, error };
};

// Hook for apps
export const useApps = (filters = {}) => {
  return useSupabaseQuery('apps', {
    filters: { published: true, ...filters },
    orderBy: { column: 'last_updated', ascending: false },
  });
};

// Hook for featured apps
export const useFeaturedApps = () => {
  return useSupabaseQuery('apps', {
    filters: { published: true, featured: true },
    orderBy: { column: 'last_updated', ascending: false },
  });
};

// Hook for single app
export const useApp = (slug) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApp = async () => {
      try {
        setLoading(true);
        const { data: result, error: queryError } = await supabase
          .from('apps')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single();

        if (queryError) throw queryError;

        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchApp();
  }, [slug]);

  return { data, loading, error };
};

// Hook for app releases
export const useAppReleases = (appId) => {
  return useSupabaseQuery('app_releases', {
    filters: { app_id: appId, published: true },
    orderBy: { column: 'created_at', ascending: false },
  });
};

// Hook for blog posts
export const useBlogPosts = (filters = {}) => {
  return useSupabaseQuery('blog_posts', {
    filters: { published: true, ...filters },
    orderBy: { column: 'publish_date', ascending: false },
  });
};

// Hook for single blog post
export const useBlogPost = (slug) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const { data: result, error: queryError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single();

        if (queryError) throw queryError;

        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchPost();
  }, [slug]);

  return { data, loading, error };
};

// Hook for services
export const useServices = () => {
  return useSupabaseQuery('services', {
    filters: { active: true },
    orderBy: { column: 'display_order', ascending: true },
  });
};

// Hook for testimonials
export const useTestimonials = () => {
  return useSupabaseQuery('testimonials', {
    orderBy: { column: 'display_order', ascending: true },
  });
};

// Hook for featured testimonials
export const useFeaturedTestimonials = () => {
  return useSupabaseQuery('testimonials', {
    filters: { featured: true },
    orderBy: { column: 'display_order', ascending: true },
  });
};

// Hook for tracking app downloads
export const useTrackDownload = () => {
  const trackDownload = async (appId, releaseId) => {
    try {
      // Insert analytics record
      await supabase.from('app_analytics').insert({
        app_id: appId,
        release_id: releaseId,
      });

      // Increment download count on app
      const { data: app } = await supabase
        .from('apps')
        .select('downloads')
        .eq('id', appId)
        .single();

      if (app) {
        await supabase
          .from('apps')
          .update({ downloads: (app.downloads || 0) + 1 })
          .eq('id', appId);
      }

      // Increment download count on release
      const { data: release } = await supabase
        .from('app_releases')
        .select('downloads')
        .eq('id', releaseId)
        .single();

      if (release) {
        await supabase
          .from('app_releases')
          .update({ downloads: (release.downloads || 0) + 1 })
          .eq('id', releaseId);
      }

      return { success: true };
    } catch (error) {
      console.error('Error tracking download:', error);
      return { success: false, error };
    }
  };

  return { trackDownload };
};