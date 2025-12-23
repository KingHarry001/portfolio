// src/api/supabase.js - COMPLETE VERSION
import { supabase, uploadFile, deleteFile } from "../lib/supabase";

// ==================== PROJECTS API ====================
export const projectsAPI = {
  getAll: async (filters = {}) => {
    let query = supabase.from("projects").select("*");

    if (filters.category) {
      query = query.eq("category", filters.category);
    }

    if (filters.featured !== undefined) {
      query = query.eq("featured", filters.featured);
    }

    if (!filters.showDrafts) {
      query = query.eq("published", true);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });
    if (error) throw error;
    return data;
  },

  create: async (projectData, userId) => {
    const { data, error } = await supabase
      .from("projects")
      .insert({
        ...projectData,
        user_id: userId,
        created_by: userId,
      })
      .select()
      .single();

    if (error) throw error;
    await auditLog("create", "projects", data.id, userId, projectData);
    return data;
  },

  update: async (id, projectData, userId) => {
    const { data, error } = await supabase
      .from("projects")
      .update({
        ...projectData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    await auditLog("update", "projects", id, userId, projectData);
    return data;
  },

  delete: async (id, userId) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw error;
    await auditLog("delete", "projects", id, userId, null);
    return true;
  },
};

// ==================== SKILLS API ====================
export const skillsAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("category", { ascending: true })
      .order("display_order", { ascending: true });

    if (error) throw error;
    return data;
  },

  getByCategory: async (category) => {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .eq("category", category)
      .order("display_order", { ascending: true });

    if (error) throw error;
    return data;
  },

  create: async (skillData) => {
    const { data, error } = await supabase
      .from("skills")
      .insert(skillData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  update: async (id, skillData) => {
    const { data, error } = await supabase
      .from("skills")
      .update(skillData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  delete: async (id) => {
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) throw error;
    return true;
  },
};

// ==================== CERTIFICATIONS API ====================
export const certificationsAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .order("year", { ascending: false });

    if (error) throw error;
    return data;
  },

  create: async (certData) => {
    const { data, error } = await supabase
      .from("certifications")
      .insert(certData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  update: async (id, certData) => {
    const { data, error } = await supabase
      .from("certifications")
      .update(certData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  delete: async (id) => {
    const { error } = await supabase.from("certifications").delete().eq("id", id);
    if (error) throw error;
    return true;
  },
};

// ==================== SERVICES API ====================
export const servicesAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;
    return data;
  },

  getActive: async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("active", true)
      .order("display_order", { ascending: true });

    if (error) throw error;
    return data;
  },

  create: async (serviceData) => {
    const { data, error } = await supabase
      .from("services")
      .insert(serviceData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  update: async (id, serviceData) => {
    const { data, error } = await supabase
      .from("services")
      .update(serviceData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  delete: async (id) => {
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) throw error;
    return true;
  },
};

// ==================== TESTIMONIALS API ====================
export const testimonialsAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;
    return data;
  },

  getFeatured: async () => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("featured", true)
      .order("display_order", { ascending: true });

    if (error) throw error;
    return data;
  },

  create: async (testimonialData) => {
    const { data, error } = await supabase
      .from("testimonials")
      .insert(testimonialData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  update: async (id, testimonialData) => {
    const { data, error } = await supabase
      .from("testimonials")
      .update(testimonialData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  delete: async (id) => {
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) throw error;
    return true;
  },
};

// ==================== APPS API ====================
export const appsAPI = {
  getAll: async (filters = {}) => {
    let query = supabase.from("apps").select("*");

    if (filters.category) {
      query = query.eq("category", filters.category);
    }

    if (filters.published !== undefined) {
      query = query.eq("published", filters.published);
    }

    if (filters.featured !== undefined) {
      query = query.eq("featured", filters.featured);
    }

    const { data, error } = await query.order("last_updated", {
      ascending: false,
    });

    if (error) throw error;
    return data;
  },

  getBySlug: async (slug) => {
    const { data, error } = await supabase
      .from("apps")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return data;
  },

  create: async (appData) => {
    const { data, error } = await supabase
      .from("apps")
      .insert(appData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  update: async (id, appData) => {
    const { data, error } = await supabase
      .from("apps")
      .update({ ...appData, last_updated: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  delete: async (id) => {
    const { error } = await supabase.from("apps").delete().eq("id", id);
    if (error) throw error;
    return true;
  },

  incrementDownloads: async (id) => {
    const { data: app } = await supabase
      .from("apps")
      .select("downloads")
      .eq("id", id)
      .single();

    const { data, error } = await supabase
      .from("apps")
      .update({ downloads: (app.downloads || 0) + 1 })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ==================== BLOG POSTS API ====================
export const blogAPI = {
  getAll: async (filters = {}) => {
    let query = supabase.from("blog_posts").select("*");

    if (filters.category) {
      query = query.eq("category", filters.category);
    }

    if (filters.published !== undefined) {
      query = query.eq("published", filters.published);
    }

    const { data, error } = await query.order("publish_date", {
      ascending: false,
    });

    if (error) throw error;
    return data;
  },

  getBySlug: async (slug) => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return data;
  },

  create: async (postData) => {
    const { data, error } = await supabase
      .from("blog_posts")
      .insert(postData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  update: async (id, postData) => {
    const { data, error } = await supabase
      .from("blog_posts")
      .update(postData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  delete: async (id) => {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) throw error;
    return true;
  },
};

// Audit logging helper
async function auditLog(action, tableName, recordId, userId, changes) {
  await supabase.from("audit_logs").insert({
    user_id: userId,
    action,
    table_name: tableName,
    record_id: recordId,
    changes,
  });
}