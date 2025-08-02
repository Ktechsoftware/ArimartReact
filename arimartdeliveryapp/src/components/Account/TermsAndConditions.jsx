import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Terms & Conditions</h1>
      <ol className="list-decimal pl-5 space-y-2 text-gray-700 text-sm">
        <li>Follow all traffic and safety rules during deliveries.</li>
        <li>Handle orders responsibly and professionally.</li>
        <li>Misconduct may lead to account suspension.</li>
        <li>Payouts are based on completed and approved deliveries.</li>
        <li>Sharing login credentials is strictly prohibited.</li>
      </ol>
    </div>
  );
};

export default TermsAndConditions;
