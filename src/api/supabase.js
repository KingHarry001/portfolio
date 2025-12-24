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
  async getAll() {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("display_order", { ascending: true })
      .order("category", { ascending: true });

    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(skillData) {
    // Clean the data - remove any metadata fields
    const cleanData = { ...skillData };
    const metadataFields = ["id", "created_at", "updated_at"];
    metadataFields.forEach((field) => {
      if (field in cleanData) {
        delete cleanData[field];
      }
    });

    const { data, error } = await supabase
      .from("skills")
      .insert([cleanData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, skillData) {
    // Clean the data - remove any metadata fields
    const cleanData = { ...skillData };
    const metadataFields = ["id", "created_at", "updated_at"];
    metadataFields.forEach((field) => {
      if (field in cleanData) {
        delete cleanData[field];
      }
    });

    const { data, error } = await supabase
      .from("skills")
      .update(cleanData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase.from("skills").delete().eq("id", id);

    if (error) throw error;
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
    const { error } = await supabase
      .from("certifications")
      .delete()
      .eq("id", id);
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

  // In your servicesAPI.update() function in supabase.js
  update: async (id, serviceData) => {
    const cleanData = { ...serviceData };
    delete cleanData.id;

    // Now you can add updated_at since the column exists
    cleanData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("services")
      .update(cleanData)
      .eq("id", id)
      .select();

    if (error) throw error;
    return data ? data[0] : null;
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
    // Remove any fields that don't exist in the table
    const cleanData = { ...appData };
    delete cleanData.rating; // Remove if you dropped this column
    delete cleanData.rating_count;
    delete cleanData.downloads;

    // Only include updated_at if the column exists in your table
    // First check if you want to keep this column
    const updateData = {
      ...cleanData,
      updated_at: new Date().toISOString(), // Keep this if column exists
    };

    const { data, error } = await supabase
      .from("apps")
      .update(updateData)
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
async getAll() {
    console.log("Fetching all blog posts...");
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true) // Only get published posts
      .order('publish_date', { ascending: false });
    
    if (error) {
      console.error("Error fetching blog posts:", error);
      throw error;
    }
    
    console.log("Fetched blog posts:", data?.length || 0);
    return data || [];
  },

  async getFeatured() {
    console.log("Fetching featured post...");
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .eq('featured', true)
      .order('publish_date', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      console.error("Error fetching featured post:", error);
      // If no featured post found, get the latest published post
      return this.getLatest();
    }
    
    console.log("Featured post found:", data?.title);
    return data;
  },

  async getLatest() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('publish_date', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      console.error("Error fetching latest post:", error);
      return null;
    }
    
    return data;
  },

  async getBySlug(slug) {
    console.log("Fetching blog post by slug:", slug);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();
    
    if (error) {
      console.error("Error fetching post by slug:", error);
      throw error;
    }
    
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(blogData) {
    console.log("Creating blog post with data:", blogData);

    // Make sure required fields are present
    const requiredFields = ["title", "slug", "excerpt", "content", "category"];
    for (const field of requiredFields) {
      if (!blogData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Ensure slug is unique
    const { data: existing, error: slugError } = await supabase
      .from("blog_posts")
      .select("slug")
      .eq("slug", blogData.slug)
      .maybeSingle();

    if (slugError) throw slugError;
    if (existing) {
      throw new Error(`Slug "${blogData.slug}" already exists`);
    }

    // Insert the blog post
    const { data, error } = await supabase
      .from("blog_posts")
      .insert([blogData])
      .select(); // REMOVE .single() for now
    // .single(); // Don't use .single() initially

    if (error) {
      console.error("Supabase insert error:", error);
      throw error;
    }

    console.log("Insert result:", data);

    if (!data || data.length === 0) {
      throw new Error(
        "Blog post created but no data returned. Check RLS policies."
      );
    }

    return data[0]; // Return the first item
  },

  // In blogAPI.js - update function
  async update(id, blogData) {
    console.log("Updating blog post:", id, blogData);

    // Check if slug is being changed and if it's unique
    if (blogData.slug) {
      const { data: existing, error: slugError } = await supabase
        .from("blog_posts")
        .select("id, slug")
        .eq("slug", blogData.slug)
        .neq("id", id)
        .maybeSingle();

      if (slugError) throw slugError;
      if (existing) {
        throw new Error(`Slug "${blogData.slug}" already exists`);
      }
    }

    // First, check if the blog post exists
    const { data: existingPost, error: checkError } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("id", id)
      .single();

    if (checkError) {
      console.error("Blog post not found:", id, checkError);
      throw new Error(`Blog post with ID ${id} not found`);
    }

    // Perform the update
    const { data, error } = await supabase
      .from("blog_posts")
      .update(blogData)
      .eq("id", id)
      .select(); // Get the updated data back

    if (error) {
      console.error("Supabase update error:", error);
      throw error;
    }

    console.log("Update result:", data);

    if (!data || data.length === 0) {
      // Update might have succeeded but RLS prevents returning data
      // Fetch the updated data separately
      console.log("No data returned from update, fetching separately...");
      const { data: fetchedData, error: fetchError } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) {
        console.error("Failed to fetch updated post:", fetchError);
        throw new Error("Update succeeded but cannot fetch updated data");
      }

      return fetchedData;
    }

    return data[0];
  },

  async delete(id) {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);

    if (error) throw error;
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

// ==================== RESUMES API ====================
export const resumesAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("resumes")
      .select("*")
      .order("upload_date", { ascending: false });

    if (error) throw error;
    return data;
  },

  getActive: async () => {
    const { data, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("is_active", true)
      .order("upload_date", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows
    return data;
  },

  create: async (resumeData) => {
    const { data, error } = await supabase
      .from("resumes")
      .insert(resumeData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  update: async (id, resumeData) => {
    const { data, error } = await supabase
      .from("resumes")
      .update({
        ...resumeData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  delete: async (id) => {
    // Get resume data to delete file from storage
    const { data: resume } = await supabase
      .from("resumes")
      .select("file_url")
      .eq("id", id)
      .single();

    if (resume?.file_url) {
      try {
        // Extract file path from URL
        const urlParts = resume.file_url.split("/");
        const fileName = urlParts[urlParts.length - 1];

        // Delete from storage
        await supabase.storage.from("resumes").remove([fileName]);
      } catch (storageError) {
        console.error("Error deleting file from storage:", storageError);
        // Continue with database deletion even if storage deletion fails
      }
    }

    // Delete from database
    const { error } = await supabase.from("resumes").delete().eq("id", id);

    if (error) throw error;
    return true;
  },

  setActive: async (id) => {
    // First, set all resumes to inactive
    await supabase
      .from("resumes")
      .update({ is_active: false })
      .neq("id", "00000000-0000-0000-0000-000000000000"); // Update all

    // Then set the selected one to active
    const { data, error } = await supabase
      .from("resumes")
      .update({ is_active: true, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  uploadFile: async (file) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()
      .toString(36)
      .substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("resumes").getPublicUrl(filePath);

    return {
      file_url: publicUrl,
      file_name: file.name,
      file_size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
    };
  },
};

// ==================== USERS API ====================
export const usersAPI = {
  createOrUpdate: async (userData) => {
    const { data, error } = await supabase
      .from("users")
      .upsert(
        {
          ...userData,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "clerk_id",
        }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  getCurrentUser: async (clerkId) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id", clerkId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },

  isAdmin: async (clerkId) => {
    const { data, error } = await supabase
      .from("users")
      .select("role")
      .eq("clerk_id", clerkId)
      .single();

    if (error) return false;
    return data?.role === "admin";
  },
};

// ==================== REVIEWS API ====================
// ==================== REVIEWS API ====================
export const reviewsAPI = {
  // Get all reviews (for admin panel)
  getAll: async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select(
        `
        *,
        users (
          id,
          name,
          email,
          image_url
        ),
        apps (
          id,
          name,
          slug
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get reviews by app ID
  getByAppId: async (appId, page = 1, limit = 10) => {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, error } = await supabase
      .from("reviews")
      .select(
        `
        *,
        users (
          id,
          name,
          image_url
        )
      `
      )
      .eq("app_id", appId)
      .order("created_at", { ascending: false })
      .range(start, end);

    if (error) throw error;
    return data;
  },

  // Get review statistics for an app
  getStats: async (appId) => {
    try {
      // Try to call the PostgreSQL function
      const { data, error } = await supabase.rpc("get_app_review_stats", {
        app_id_param: appId,
      });

      if (error) {
        // If function doesn't exist, calculate manually
        console.warn("Review stats function not available, calculating manually:", error.message);
        
        const { data: reviews } = await supabase
          .from("reviews")
          .select("rating")
          .eq("app_id", appId);

        if (!reviews || reviews.length === 0) {
          return {
            average_rating: 0,
            total_reviews: 0,
            rating_5: 0,
            rating_4: 0,
            rating_3: 0,
            rating_2: 0,
            rating_1: 0,
          };
        }

        const ratings = reviews.map(r => r.rating || 0);
        const total = ratings.length;
        const sum = ratings.reduce((a, b) => a + b, 0);
        const average = total > 0 ? sum / total : 0;

        const countByRating = {};
        ratings.forEach(rating => {
          countByRating[rating] = (countByRating[rating] || 0) + 1;
        });

        return {
          average_rating: Math.round(average * 10) / 10,
          total_reviews: total,
          rating_5: countByRating[5] || 0,
          rating_4: countByRating[4] || 0,
          rating_3: countByRating[3] || 0,
          rating_2: countByRating[2] || 0,
          rating_1: countByRating[1] || 0,
        };
      }

      return data?.[0] || {
        average_rating: 0,
        total_reviews: 0,
        rating_5: 0,
        rating_4: 0,
        rating_3: 0,
        rating_2: 0,
        rating_1: 0,
      };
    } catch (error) {
      console.error("Error getting review stats:", error);
      throw error;
    }
  },

  // Get a user's review for a specific app
  getUserReview: async (appId, clerkId) => {
    try {
      // First get the user ID from clerk_id
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", clerkId)
        .single();

      if (userError) {
        if (userError.code === "PGRST116") {
          // User not found in database
          return null;
        }
        throw userError;
      }

      if (!user) return null;

      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("app_id", appId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    } catch (error) {
      console.error("Error getting user review:", error);
      return null;
    }
  },

  // Create a new review
  create: async (reviewData, clerkId) => {
    try {
      // First, get or create user
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", clerkId)
        .single();

      if (userError && userError.code === "PGRST116") {
        // User not found, need to create them
        // You might want to get user info from Clerk context
        const { data: newUser, error: createError } = await supabase
          .from("users")
          .insert({
            clerk_id: clerkId,
            role: "user",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select("id")
          .single();

        if (createError) throw createError;
        reviewData.user_id = newUser.id;
      } else if (userError) {
        throw userError;
      } else {
        reviewData.user_id = user.id;
      }

      const { data, error } = await supabase
        .from("reviews")
        .insert({
          ...reviewData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  },

  // Update an existing review
  update: async (reviewId, reviewData, clerkId) => {
    try {
      // Verify user owns this review
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id, role")
        .eq("clerk_id", clerkId)
        .single();

      if (userError) throw new Error("User not found");
      if (!user) throw new Error("User not found");

      // Check if review exists and user owns it (or is admin)
      const { data: review, error: reviewError } = await supabase
        .from("reviews")
        .select("user_id")
        .eq("id", reviewId)
        .single();

      if (reviewError) throw reviewError;
      
      // Only allow update if user owns the review or is admin
      if (review.user_id !== user.id && user.role !== "admin") {
        throw new Error("You don't have permission to update this review");
      }

      const { data, error } = await supabase
        .from("reviews")
        .update({
          ...reviewData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", reviewId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating review:", error);
      throw error;
    }
  },

  // Delete a review
  delete: async (reviewId, clerkId) => {
    try {
      // First, get the user
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id, role")
        .eq("clerk_id", clerkId)
        .single();

      if (userError) {
        console.error("User not found error:", userError);
        throw new Error("User not found. Please log in again.");
      }

      if (!user) {
        throw new Error("User not found");
      }

      // Check if review exists
      const { data: review, error: reviewError } = await supabase
        .from("reviews")
        .select("user_id")
        .eq("id", reviewId)
        .single();

      if (reviewError) {
        if (reviewError.code === "PGRST116") {
          throw new Error("Review not found");
        }
        throw reviewError;
      }

      // Build the query
      let query = supabase.from("reviews").delete().eq("id", reviewId);

      // If user is not admin, they can only delete their own reviews
      if (user.role !== "admin") {
        query = query.eq("user_id", user.id);
        
        // Also verify they own this review
        if (review.user_id !== user.id) {
          throw new Error("You don't have permission to delete this review");
        }
      }

      const { error } = await query;

      if (error) throw error;
      
      // Log the deletion
      await auditLog("delete", "reviews", reviewId, user.id, null);
      
      return true;
    } catch (error) {
      console.error("Error deleting review:", error);
      throw error;
    }
  },

  // User management function (separate from reviews)
  createOrUpdateUser: async (userData) => {
    try {
      // Get Clerk user metadata if available
      let role = "user";

      // If we have access to Clerk's public metadata
      if (userData.clerk_metadata) {
        // Clerk stores roles in publicMetadata.role or publicMetadata.isAdmin
        role =
          userData.clerk_metadata.role ||
          (userData.clerk_metadata.isAdmin ? "admin" : "user");
      }

      const { data, error } = await supabase
        .from("users")
        .upsert(
          {
            clerk_id: userData.clerk_id,
            email: userData.email,
            name: userData.name,
            image_url: userData.image_url,
            role: role,
            clerk_metadata: userData.clerk_metadata,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "clerk_id",
          }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error in createOrUpdateUser:", error);
      throw error;
    }
  },

  // Get paginated reviews (for public display)
  getPaginated: async (appId = null, page = 1, limit = 10) => {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = supabase
      .from("reviews")
      .select(
        `
        *,
        users (
          id,
          name,
          image_url
        ),
        apps (
          id,
          name
        )
      `
      )
      .order("created_at", { ascending: false })
      .range(start, end);

    if (appId) {
      query = query.eq("app_id", appId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  // Get total count of reviews (for pagination)
  getCount: async (appId = null) => {
    let query = supabase.from("reviews").select("*", { count: "exact", head: true });

    if (appId) {
      query = query.eq("app_id", appId);
    }

    const { count, error } = await query;

    if (error) throw error;
    return count || 0;
  },
};