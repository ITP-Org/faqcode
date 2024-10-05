const FAQ = require('../models/faqModel');

// Get all FAQs
exports.getAllFAQs = async (req, res) => {
  const faqs = await FAQ.find();
  res.json(faqs);
};

// Add FAQ
exports.addFAQ = async (req, res) => {
  const { question, answer } = req.body;
  const newFaq = new FAQ({ question, answer });
  await newFaq.save();
  res.json({ message: 'FAQ added successfully' });
};

// Update FAQ
exports.updateFAQ = async (req, res) => {
  const { question, answer } = req.body;
  await FAQ.findByIdAndUpdate(req.params.id, { question, answer });
  res.json({ message: 'FAQ updated successfully' });
};

// Delete FAQ
exports.deleteFAQ = async (req, res) => {
  await FAQ.findByIdAndDelete(req.params.id);
  res.json({ message: 'FAQ deleted successfully' });
};
