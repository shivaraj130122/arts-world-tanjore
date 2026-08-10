const User = require("../models/User");

// GET /api/admin/profile
const getAdminProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Admin authentication successful",
      admin: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error(
      "Admin profile error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load admin profile",
    });
  }
};

// GET /api/admin/stats
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers =
      await User.countDocuments();

    const activeUsers =
      await User.countDocuments({
        isActive: true,
      });

    const adminUsers =
      await User.countDocuments({
        role: "admin",
      });

    // Password is never returned.
    const users = await User.find()
      .select(
        "_id name email role isActive createdAt"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,

      stats: {
        totalUsers,
        activeUsers,
        adminUsers,
      },

      users,
    });
  } catch (error) {
    console.error(
      "Dashboard stats error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load dashboard statistics",
    });
  }
};

// PATCH /api/admin/users/:id/status
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message:
          "isActive must be true or false",
      });
    }

    // Prevent admin from changing their own status.
    if (req.user._id.toString() === id) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot change your own account status",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isActive = isActive;

    await user.save();

    return res.status(200).json({
      success: true,
      message: isActive
        ? "User account activated successfully"
        : "User account deactivated successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error(
      "Update user status error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update user account status",
    });
  }
};

// PATCH /api/admin/users/:id/role
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message:
          "Role must be either user or admin",
      });
    }

    // Prevent admin from changing their own role.
    if (req.user._id.toString() === id) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot change your own administrator role",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent removing the last administrator.
    if (
      user.role === "admin" &&
      role === "user"
    ) {
      const adminCount =
        await User.countDocuments({
          role: "admin",
        });

      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message:
            "Cannot remove the last administrator",
        });
      }
    }

    user.role = role;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        role === "admin"
          ? "User promoted to administrator successfully"
          : "Administrator role removed successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error(
      "Update user role error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update user role",
    });
  }
};

module.exports = {
  getAdminProfile,
  getDashboardStats,
  updateUserStatus,
  updateUserRole,
};