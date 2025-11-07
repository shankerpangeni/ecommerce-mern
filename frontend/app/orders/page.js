import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';

const page = () => {
  return (
    <ProtectedRoute>
        <div>
      This is order page.
    </div>
    </ProtectedRoute>
    
  )
}

export default page
