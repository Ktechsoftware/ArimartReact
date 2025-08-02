import React from 'react';

const FAQ = () => {
  const faqs = [
    {
      question: "How are delivery areas assigned?",
      answer: "Based on your location and availability."
    },
    {
      question: "What if the customer is unreachable?",
      answer: "Wait 10 minutes, then report in the app or call support."
    },
    {
      question: "How do I track my payouts?",
      answer: "Check your Wallet section in the app."
    }
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Frequently Asked Questions</h1>
      {faqs.map((faq, idx) => (
        <div key={idx} className="mb-4">
          <p className="font-medium text-gray-800">{faq.question}</p>
          <p className="text-sm text-gray-600">{faq.answer}</p>
        </div>
      ))}
    </div>
  );
};

export default FAQ;
