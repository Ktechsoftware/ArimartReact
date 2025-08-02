import React from 'react';

const AllottedArea = () => {
  const areas = ['Koramangala', 'Indiranagar', 'Whitefield', 'HSR Layout'];

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Your Allotted Areas</h1>
      <ul className="list-disc pl-5 space-y-1 text-gray-700">
        {areas.map((area, idx) => (
          <li key={idx}>{area}</li>
        ))}
      </ul>
    </div>
  );
};

export default AllottedArea;
