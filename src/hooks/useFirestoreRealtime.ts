
import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  onSnapshot, 
  query, 
  where, 
  orderBy,
  QueryConstraint 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { FirestoreDocument } from '../services/firestoreService';

/**
 * Hook to listen to real-time updates from a Firestore document
 */
export function useFirestoreDocument<T>(
  collectionPath: string,
  docId: string | undefined
): {
  data: FirestoreDocument<T> | null;
  loading: boolean;
  error: Error | null;
} {
  const [data, setData] = useState<FirestoreDocument<T> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!docId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Create a reference to the document
    const documentRef = doc(db, collectionPath, docId);
    
    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      documentRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() } as FirestoreDocument<T>);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error listening to document:', err);
        setError(err);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [collectionPath, docId]);

  return { data, loading, error };
}

/**
 * Hook to listen to real-time updates from a Firestore collection
 */
export function useFirestoreCollection<T>(
  collectionPath: string,
  constraints: { field: string; operator: string; value: any }[] = [],
  sortField?: string,
  sortDirection?: 'asc' | 'desc'
): {
  data: FirestoreDocument<T>[];
  loading: boolean;
  error: Error | null;
} {
  const [data, setData] = useState<FirestoreDocument<T>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    
    // Create the query constraints
    const queryConstraints: QueryConstraint[] = [];
    
    // Add filters
    constraints.forEach(constraint => {
      queryConstraints.push(
        where(constraint.field, constraint.operator as any, constraint.value)
      );
    });
    
    // Add sorting
    if (sortField) {
      queryConstraints.push(orderBy(sortField, sortDirection || 'asc'));
    }
    
    // Create the query
    const collectionRef = collection(db, collectionPath);
    const q = query(collectionRef, ...queryConstraints);
    
    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const documents: FirestoreDocument<T>[] = [];
        querySnapshot.forEach(doc => {
          documents.push({ id: doc.id, ...doc.data() } as FirestoreDocument<T>);
        });
        setData(documents);
        setLoading(false);
      },
      (err) => {
        console.error('Error listening to collection:', err);
        setError(err);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [collectionPath, JSON.stringify(constraints), sortField, sortDirection]);

  return { data, loading, error };
}
