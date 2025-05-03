import nodemailer from "nodemailer";
import Contact from "../models/Contact.js";

const CreateContact = async (req, res) => {
  try {
    const { name, email, clientMessage } = req.body;
    const timestamp = new Date(); // Get the current date and time

    // Format timestamp in 12-hour format with AM/PM
    const formattedTimestamp = timestamp.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Save the contact message with timestamp
    const newContact = new Contact({ name, email, clientMessage, timestamp });
    await newContact.save();

    // Set up NodeMailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: `"Website Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "New Message Received",
      html: `
        <h2>New Message Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${clientMessage}</p>
        <p><strong>Sent On:</strong> ${formattedTimestamp}</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
      } else {
        console.log("Email sent: ", info.response);
      }
    });

    res.status(201).json(newContact);
  } catch (error) {
    console.error("Error Sending Message: ", error);
    res.status(500).json({ message: "Error Sending Message" });
  }
};

const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ timestamp: -1 }); // Latest messages first
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contacts: ", error);
    res.status(500).json({ message: "Error fetching contacts" });
  }
};

const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    console.error("Error fetching contact by ID: ", error);
    res.status(500).json({ message: "Error fetching contact" });
  }
};

const updateContact = async (req, res) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    console.error("Error updating contact: ", error);
    res.status(500).json({ message: "Error updating contact" });
  }
};

const deleteContact = async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);
    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact: ", error);
    res.status(500).json({ message: "Error deleting contact" });
  }
};

export {
  CreateContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
};
