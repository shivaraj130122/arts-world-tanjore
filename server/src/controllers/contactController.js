const ContactMessage = require("../models/ContactMessage");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createContactMessage = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
    } = req.body;

    // Required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone ? phone.trim() : "";
    const cleanSubject = subject ? subject.trim() : "";
    const cleanMessage = message.trim();

    // Basic validation
    if (cleanName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid name",
      });
    }

    if (!EMAIL_PATTERN.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    if (cleanMessage.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Message must contain at least 5 characters",
      });
    }

    const contactMessage = await ContactMessage.create({
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
        createdAt: contactMessage.createdAt,
      },
    });
  } catch (error) {
    console.error(
      "Create contact message error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to send your message",
    });
  }
};

module.exports = {
  createContactMessage,
};