import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFAQs = async () => {
      const response = await axios.get('http://localhost:5000/api/faqs');
      setFaqs(response.data);
    };
    fetchFAQs();
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Client-side validation for question and answer
  const validateInput = (input, type) => {
    const specialCharPattern = /[@#$%^&*]/;
    if (input.trim() === '') return `${type} cannot be empty`;
    if (specialCharPattern.test(input)) return `${type} contains invalid characters: @#$%^&*`;
    if (type === "Question" && (input.length < 10 || input.length > 300)) {
      return "Question must be between 10 and 300 characters long";
    }
    if (type === "Answer" && (input.length < 10 || input.length > 500)) {
      return "Answer must be between 10 and 500 characters long";
    }
    return null;
  };

  const handleAddFAQ = async () => {
    const questionError = validateInput(question, "Question");
    const answerError = validateInput(answer, "Answer");

    if (questionError || answerError) {
      setError(questionError || answerError);
    } else {
      try {
        await axios.post('http://localhost:5000/api/faqs', { question, answer });
        setError("");
        setQuestion("");
        setAnswer("");
        alert("FAQ added successfully");
      } catch (err) {
        alert(err.response.data.message);
      }
    }
  };

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container p-6 mx-auto" style={{ backgroundColor: '#e4e6fd', borderRadius: '25px', padding: '2rem' }}>
      <h1 className="mb-8 text-4xl font-bold text-center" style={{ color: '#7b46d4' }}>
        Frequently Asked Questions
      </h1>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search FAQs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-6 text-gray-800 border border-gray-300 rounded"
        style={{ borderRadius: '25px' }}
      />

      {/* Error message */}
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      {/* Add FAQ Form */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Enter question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-2 mb-2 text-gray-800 border border-gray-300 rounded"
          style={{ borderRadius: '25px' }}
        />
        <textarea
          placeholder="Enter answer..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full p-2 mb-2 text-gray-800 border border-gray-300 rounded"
          style={{ borderRadius: '25px' }}
        />
        <button 
          onClick={handleAddFAQ} 
          className="p-2 bg-blue-500 text-white rounded"
          style={{ borderRadius: '25px' }}
        >
          Add FAQ
        </button>
      </div>

      <div>
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => (
            <div 
              key={faq._id} 
              className="p-6 mb-4" 
              style={{ backgroundColor: 'white', borderRadius: '25px' }}
            >
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <h2 
                  className="text-xl font-semibold" 
                  style={{ color: '#7b46d4' }}
                >
                  {faq.question}
                </h2>
                <span className={`transform transition-transform duration-200 ${openIndex === index ? 'rotate-180' : 'rotate-0'}`}>
                  ▼
                </span>
              </div>
              {openIndex === index && (
                <p className="mt-2 text-gray-600">{faq.answer}</p>
              )}
            </div>
          ))
        ) : (
          <p>No FAQs found</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
