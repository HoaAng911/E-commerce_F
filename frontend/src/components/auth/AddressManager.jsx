import React from 'react';
import { MapPin } from 'lucide-react';

const AddressManager = ({ addresses }) => {
  if (!addresses || addresses.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 border-2 border-gray-300 border-dashed rounded">
        <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
        <p>Chưa có địa chỉ nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {addresses.map((address, index) => (
        <div key={index} className="flex items-start gap-3 p-4 border border-gray-200 rounded">
          <div className="flex items-center justify-center w-6 h-6 text-sm font-medium text-white bg-black rounded shrink-0">
            {index + 1}
          </div>
          <p className="text-sm text-gray-900">{address}</p>
        </div>
      ))}
    </div>
  );
};

export default AddressManager;