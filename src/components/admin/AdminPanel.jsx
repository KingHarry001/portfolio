// src/components/AdminPanel.jsx - COMPLETE VERSION
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { usersAPI } from "../../api/supabase";
import {
  Shield,
  User,
  Search,
  Check,
  X,
  Mail,
  Calendar,
  Crown,
} from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabase";

export default function AdminPanel() {
  const { user, isLoaded } = useUser();
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    if (isLoaded) {
      checkAdminAndLoad();
    }
  }, [isLoaded, user]);

  // In AdminPanel.jsx, add this useEffect
  useEffect(() => {
    if (user) {
      // Sync user with Clerk metadata when component loads
      syncUserWithClerkMetadata();
    }
  }, [user]);

  const syncUserWithClerkMetadata = async () => {
    try {
      console.log("Syncing user with Clerk metadata...");

      const clerkMetadata = user.publicMetadata || {};
      const role =
        clerkMetadata.role === "admin" || clerkMetadata.isAdmin
          ? "admin"
          : "user";

      await usersAPI.createOrUpdate({
        clerk_id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
        image_url: user.imageUrl,
        clerk_metadata: clerkMetadata,
        role: role,
      });

      console.log("Sync complete, reloading admin status...");
      await checkAdminAndLoad(); // Re-check admin status
    } catch (error) {
      console.error("Failed to sync with Clerk metadata:", error);
    }
  };

  const checkAdminAndLoad = async () => {
    console.log("=== ADMIN CHECK START ===");
    console.log("User ID:", user?.id);
    console.log("User loaded:", isLoaded);

    if (!user) {
      console.log("No user found, denying access");
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    try {
      console.log("Calling usersAPI.isAdmin with ID:", user.id);
      const adminStatus = await usersAPI.isAdmin(user.id);
      console.log("Admin status returned:", adminStatus);

      setIsAdmin(adminStatus);

      if (adminStatus) {
        console.log("User is admin, loading users...");
        await loadUsers();
      } else {
        console.log("User is NOT admin");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      console.error("Error details:", error.message);
      setIsAdmin(false);
      setLoading(false);
    }
    console.log("=== ADMIN CHECK END ===");
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const toggleAdmin = async (userId, currentRole, userName) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    const action = newRole === "admin" ? "make admin" : "remove admin";

    if (!window.confirm(`Are you sure you want to ${action} for ${userName}?`))
      return;

    try {
      const { error } = await supabase
        .from("users")
        .update({
          role: newRole,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;

      toast.success(`${userName} is now ${newRole}`);
      await loadUsers();
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error(`Failed to update role: ${error.message}`);
    }
  };

  const deleteUser = async (userId, userName) => {
    if (
      !window.confirm(
        `Delete user ${userName}? This will also delete all their reviews.`
      )
    )
      return;

    try {
      // First delete user's reviews
      const { error: reviewsError } = await supabase
        .from("reviews")
        .delete()
        .eq("user_id", userId);

      if (reviewsError) throw reviewsError;

      // Then delete the user
      const { error: userError } = await supabase
        .from("users")
        .delete()
        .eq("id", userId);

      if (userError) throw userError;

      toast.success(`User ${userName} deleted`);
      await loadUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(`Failed to delete user: ${error.message}`);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.clerk_id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Access Denied Screen
  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="relative">
            <Shield className="w-20 h-20 text-red-500/50 mx-auto mb-6" />
            <X className="w-12 h-12 text-red-500 absolute top-4 left-1/2 transform -translate-x-1/2" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Access Denied
          </h1>
          <p className="text-gray-400 mb-6">
            You need administrator privileges to access the user management
            panel.
          </p>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-sm text-gray-300 text-left">
            <p className="mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" />
              <span>Admin-only area</span>
            </p>
            <p>Contact an existing administrator to request access.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white">User Management</h3>
          <p className="text-gray-400">Manage user accounts and permissions</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadUsers}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins Only</option>
            <option value="user">Users Only</option>
          </select>

          <div className="text-sm text-gray-400 flex items-center justify-end">
            <Shield className="w-4 h-4 text-purple-400 mr-2" />
            <span>Admin Panel Access</span>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800/50">
                <th className="p-4 text-left">
                  <span className="text-sm font-medium text-gray-300">
                    User
                  </span>
                </th>
                <th className="p-4 text-left">
                  <span className="text-sm font-medium text-gray-300">
                    Contact
                  </span>
                </th>
                <th className="p-4 text-left">
                  <span className="text-sm font-medium text-gray-300">
                    Role
                  </span>
                </th>
                <th className="p-4 text-left">
                  <span className="text-sm font-medium text-gray-300">
                    Joined
                  </span>
                </th>
                <th className="p-4 text-left">
                  <span className="text-sm font-medium text-gray-300">
                    Actions
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center">
                    <User className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No users found</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((userItem) => (
                  <tr
                    key={userItem.id}
                    className="hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={userItem.image_url || "/default-avatar.png"}
                            alt={userItem.name}
                            className="w-10 h-10 rounded-full bg-gray-700"
                          />
                          {userItem.role === "admin" && (
                            <Crown className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 fill-yellow-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {userItem.name || "Unnamed User"}
                          </p>
                          <p className="text-xs text-gray-400 truncate max-w-[150px]">
                            ID: {userItem.clerk_id?.substring(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-300 truncate max-w-[200px]">
                            {userItem.email || "No email"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          userItem.role === "admin"
                            ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                            : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {userItem.role || "user"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-300">
                          {new Date(userItem.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            toggleAdmin(
                              userItem.id,
                              userItem.role,
                              userItem.name || "this user"
                            )
                          }
                          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                            userItem.role === "admin"
                              ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                              : "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
                          }`}
                        >
                          {userItem.role === "admin"
                            ? "Remove Admin"
                            : "Make Admin"}
                        </button>
                        <button
                          onClick={() =>
                            deleteUser(
                              userItem.id,
                              userItem.name || "this user"
                            )
                          }
                          className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded text-sm font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="p-4 border-t border-gray-700 bg-gray-800/20">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center gap-4">
              <span>
                Total:{" "}
                <span className="text-white font-medium">{users.length}</span>{" "}
                users
              </span>
              <span>
                Admins:{" "}
                <span className="text-purple-400 font-medium">
                  {users.filter((u) => u.role === "admin").length}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" />
              <span>Admin Controls</span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Info Card */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-500/20 rounded-lg">
            <Shield className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-2">
              Administrator Information
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Admins can manage user roles and permissions</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Admins can delete any user account</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Admins can delete any review on the platform</span>
              </li>
              <li className="flex items-center gap-2">
                <X className="w-4 h-4 text-red-400" />
                <span>User deletion also removes all their reviews</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
