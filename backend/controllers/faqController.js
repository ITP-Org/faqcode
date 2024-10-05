const FAQ = require('../models/faqModel');

// Validation function for question and answer
const validateFAQInput = (question, answer) => {
    const errors = {};
    const specialCharPattern = /[@#$%^&*]/;

    if (!question || question.trim() === '') {
        errors.question = 'Question is required';
    } else if (specialCharPattern.test(question)) {
        errors.question = 'Question contains invalid characters: @#$%^&*';
    } else if (question.length < 10 || question.length > 300) {
        errors.question = 'Question must be between 10 and 300 characters long';
    }

    if (!answer || answer.trim() === '') {
        errors.answer = 'Answer is required';
    } else if (specialCharPattern.test(answer)) {
        errors.answer = 'Answer contains invalid characters: @#$%^&*';
    } else if (answer.length < 10 || answer.length > 500) {
        errors.answer = 'Answer must be between 10 and 500 characters long';
    }

    return errors;
};

// Get all FAQs
exports.getAllFAQs = async (req, res) => {
    const faqs = await FAQ.find();
    res.json(faqs);
};

// Add FAQ
exports.addFAQ = async (req, res) => {
    const { question, answer } = req.body;

    // Validate input
    const errors = validateFAQInput(question, answer);
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ message: 'Validation errors', errors });
    }

    const newFaq = new FAQ({ question, answer });
    await newFaq.save();
    res.json({ message: 'FAQ added successfully' });
};

// Update FAQ
exports.updateFAQ = async (req, res) => {
    const { question, answer } = req.body;

    // Validate input
    const errors = validateFAQInput(question, answer);
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ message: 'Validation errors', errors });
    }

    await FAQ.findByIdAndUpdate(req.params.id, { question, answer });
    res.json({ message: 'FAQ updated successfully' });
};

// Delete FAQ
exports.deleteFAQ = async (req, res) => {
    await FAQ.findByIdAndDelete(req.params.id);
    res.json({ message: 'FAQ deleted successfully' });
};
