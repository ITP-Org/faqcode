import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null); // Use null to start with no FAQ open
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/faqs');
        setFaqs(response.data);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    };
    fetchFAQs();
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Function to generate an HTML report
  const generateReport = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FAQ Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f4f4f4;
            color: #333;
          }
          h1 {
            color: #7b46d4;
            text-align: center;
            font-size: 24px;
          }
          .faq {
            background-color: white;
            padding: 20px;
            margin: 10px 0;
            border-radius: 10px;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
          }
          .faq h2 {
            color: #7b46d4;
            font-size: 18px;
          }
          .faq p {
            font-size: 14px;
            color: #555;
          }
        </style>
      </head>
      <body>
        <h1>Frequently Asked Questions Report</h1>
        ${faqs.map((faq, index) => `
          <div class="faq">
            <h2>FAQ ${index + 1}: ${faq.question}</h2>
            <p>${faq.answer}</p>
          </div>
        `).join('')}
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'faq_report.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Cleanup
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

      {/* Button to generate report */}
      <button 
        onClick={generateReport} 
        className="mb-6 p-2 bg-blue-500 text-white rounded"
        style={{ borderRadius: '25px' }}
      >
        Generate FAQ Report
      </button>

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
