import React from 'react';

const SuccessMessage = ({ successMessage }) => (
  successMessage && (
    <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
      {successMessage}
    </div>
  )
);

export default SuccessMessage;