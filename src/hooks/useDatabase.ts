
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient, MutateOptions } from '@tanstack/react-query';
import * as FirestoreService from '../services/firestoreService';
import { useFirestoreDocument, useFirestoreCollection } from './useFirestoreRealtime';

// Generic hook for Firestore operations
export function useFirestore<T extends object>(collectionPath: string) {
  const queryClient = useQueryClient();
  
  // Create a document
  const createMutation = useMutation({
    mutationFn: ({ data, id }: { data: T; id?: string }) => 
      FirestoreService.createDocument<T>(collectionPath, data, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [collectionPath] });
    }
  });
  
  // Update a document
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<T> }) => 
      FirestoreService.updateDocument<T>(collectionPath, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [collectionPath] });
    }
  });
  
  // Delete a document
  const deleteMutation = useMutation({
    mutationFn: (id: string) => FirestoreService.deleteDocument(collectionPath, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [collectionPath] });
    }
  });
  
  // Get a document by ID - standard fetch version
  const useDocument = (id: string | undefined) => {
    return useQuery({
      queryKey: [collectionPath, id],
      queryFn: () => FirestoreService.getDocument<T>(collectionPath, id!),
      enabled: !!id
    });
  };
  
  // Query documents - standard fetch version
  const useDocuments = (
    conditions: { field: string; operator: string; value: any }[] = [],
    orderByField?: string,
    orderDirection?: 'asc' | 'desc'
  ) => {
    return useQuery({
      queryKey: [collectionPath, conditions, orderByField, orderDirection],
      queryFn: () => FirestoreService.queryDocuments<T>(
        collectionPath, 
        conditions, 
        orderByField, 
        orderDirection
      )
    });
  };

  // Real-time hooks
  const useRealtimeDocument = (id: string | undefined) => {
    return useFirestoreDocument<T>(collectionPath, id);
  };

  const useRealtimeCollection = (
    conditions: { field: string; operator: string; value: any }[] = [],
    orderByField?: string,
    orderDirection?: 'asc' | 'desc'
  ) => {
    return useFirestoreCollection<T>(collectionPath, conditions, orderByField, orderDirection);
  };
  
  return {
    createDocument: (data: T, id?: string, options?: MutateOptions<string, Error, { data: T; id?: string }, unknown>) => 
      createMutation.mutate({ data, id }, options),
    updateDocument: updateMutation.mutate,
    deleteDocument: deleteMutation.mutate,
    useDocument,
    useDocuments,
    useRealtimeDocument,
    useRealtimeCollection,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
}
