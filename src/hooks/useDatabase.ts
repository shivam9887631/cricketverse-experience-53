
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as FirestoreService from '../services/firestoreService';

// Generic hook for Firestore operations
export function useFirestore<T extends object>(collectionPath: string) {
  const queryClient = useQueryClient();
  
  // Create a document
  const createMutation = useMutation({
    mutationFn: (data: T) => FirestoreService.createDocument<T>(collectionPath, data),
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
  
  // Get a document by ID
  const useDocument = (id: string | undefined) => {
    return useQuery({
      queryKey: [collectionPath, id],
      queryFn: () => FirestoreService.getDocument<T>(collectionPath, id!),
      enabled: !!id
    });
  };
  
  // Query documents
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
  
  return {
    createDocument: createMutation.mutate,
    updateDocument: updateMutation.mutate,
    deleteDocument: deleteMutation.mutate,
    useDocument,
    useDocuments,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
}
