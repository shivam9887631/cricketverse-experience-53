
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export default function useRequireAuth(redirectUrl = '/login') {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to access this page",
        variant: "destructive",
      });
      navigate(redirectUrl);
    }
  }, [currentUser, loading, navigate, redirectUrl, toast]);

  return { currentUser, loading };
}
