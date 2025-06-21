import React, { useState } from 'react';
import { AdminApiService } from '../../utils';
import toast from 'react-hot-toast';

export const Admin: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(false);

  const handleInitializeDatabase = async () => {
    setIsInitializing(true);
    try {
      const result = await AdminApiService.initializeDatabase();
      toast.success(result.message);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to initialize database: ${errorMessage}`);
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Database Administration</h1>

      <div className="space-y-4">
        <button
          onClick={handleInitializeDatabase}
          disabled={isInitializing}
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          {isInitializing ? 'Initializing...' : 'Initialize Database'}
        </button>
      </div>
    </div>
  );
};
