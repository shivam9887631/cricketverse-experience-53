
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  DocumentData,
  QueryDocumentSnapshot,
  DocumentReference,
  CollectionReference
} from 'firebase/firestore';
import { db } from '../lib/firebase';

// Generic types for Firestore operations
export type FirestoreDocument<T> = T & { id: string };

// Helper functions for Firestore operations
export const createDocument = async <T extends DocumentData>(
  collectionPath: string, 
  data: T, 
  id?: string
): Promise<string> => {
  try {
    const docRef = id 
      ? doc(db, collectionPath, id) 
      : doc(collection(db, collectionPath));
    
    await setDoc(docRef, data);
    return docRef.id;
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};

export const getDocument = async <T>(
  collectionPath: string, 
  docId: string
): Promise<FirestoreDocument<T> | null> => {
  try {
    const docRef = doc(db, collectionPath, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as FirestoreDocument<T>;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting document:', error);
    throw error;
  }
};

export const updateDocument = async <T extends DocumentData>(
  collectionPath: string, 
  docId: string, 
  data: Partial<T>
): Promise<void> => {
  try {
    const docRef = doc(db, collectionPath, docId);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

export const deleteDocument = async (
  collectionPath: string, 
  docId: string
): Promise<void> => {
  try {
    const docRef = doc(db, collectionPath, docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

export const queryDocuments = async <T>(
  collectionPath: string,
  conditions: { field: string; operator: string; value: any }[] = [],
  orderByField?: string,
  orderDirection?: 'asc' | 'desc'
): Promise<FirestoreDocument<T>[]> => {
  try {
    const collectionRef = collection(db, collectionPath);
    
    let q = query(collectionRef);
    
    // Add conditions
    conditions.forEach(condition => {
      q = query(q, where(condition.field, condition.operator as any, condition.value));
    });
    
    // Add ordering if specified
    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection || 'asc'));
    }
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FirestoreDocument<T>[];
  } catch (error) {
    console.error('Error querying documents:', error);
    throw error;
  }
};
