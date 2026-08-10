const ContactMessage = require("../models/ContactMessage");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/contact
const createContactMessage = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
    } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and message are required",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email
      .trim()
      .toLowerCase();
    const cleanPhone = phone
      ? phone.trim()
      : "";
    const cleanSubject = subject
      ? subject.trim()
      : "";
    const cleanMessage = message.trim();

    if (cleanName.length < 2) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid name",
      });
    }

    if (!EMAIL_PATTERN.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid email address",
      });
    }

    if (cleanMessage.length < 5) {
      return res.status(400).json({
        success: false,
        message:
          "Message must contain at least 5 characters",
      });
    }

    const contactMessage =
      await ContactMessage.create({
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        subject: cleanSubject,
        message: cleanMessage,
        status: "new",
      });

    return res.status(201).json({
      success: true,
      message:
        "Thank you! Your message has been received.",
      contactMessage: {
        id: contactMessage._id,
        name: contactMessage.name,
        email: contactMessage.email,
        status: contactMessage.status,
        createdAt:
          contactMessage.createdAt,
      },
    });
  } catch (error) {
    console.error(
      "Create contact message error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to send your message",
    });
  }
};

// GET /api/contact
const getContactMessages = async (
  req,
  res
) => {
  try {
    const messages =
      await ContactMessage.find().sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.error(
      "Get contact messages error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch contact messages",
    });
  }
};

// GET /api/contact/:id
const getContactMessageById =
  async (req, res) => {
    try {
      const contactMessage =
        await ContactMessage.findById(
          req.params.id
        );

      if (!contactMessage) {
        return res.status(404).json({
          success: false,
          message:
            "Contact message not found",
        });
      }

      return res.status(200).json({
        success: true,
        contactMessage,
      });
    } catch (error) {
      console.error(
        "Get contact message error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch contact message",
      });
    }
  };

// PUT /api/contact/:id/status
const updateContactMessageStatus =
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowedStatuses = [
        "new",
        "read",
        "replied",
      ];

      if (
        !allowedStatuses.includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid message status",
        });
      }

      const contactMessage =
        await ContactMessage.findByIdAndUpdate(
          req.params.id,
          { status },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!contactMessage) {
        return res.status(404).json({
          success: false,
          message:
            "Contact message not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Message status updated successfully",
        contactMessage,
      });
    } catch (error) {
      console.error(
        "Update contact status error:",
        error.message
      );

      return res.status(400).json({
        success: false,
        message:
          "Failed to update message status",
      });
    }
  };

// DELETE /api/contact/:id
const deleteContactMessage =
  async (req, res) => {
    try {
      const contactMessage =
        await ContactMessage.findByIdAndDelete(
          req.params.id
        );

      if (!contactMessage) {
        return res.status(404).json({
          success: false,
          message:
            "Contact message not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Contact message deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete contact message error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete contact message",
      });
    }
  };

module.exports = {
  createContactMessage,
  getContactMessages,
  getContactMessageById,
  updateContactMessageStatus,
  deleteContactMessage,
};