
import React from 'react';
import { useParams } from 'react-router-dom';
import MatchDatabaseIntegration from '@/components/match/MatchDatabaseIntegration';

const MatchDetails = () => {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return <div className="container mx-auto py-8">Match ID not found</div>;
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Match Details</h1>
      <MatchDatabaseIntegration />
    </div>
  );
};

export default MatchDetails;
