import { useEffect, useState } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Project, OperationType, FirestoreErrorInfo } from '../types';

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const path = 'projects';
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const d = doc.data();
        
        // Helper to safely get a string date from potentially null Firestore Timestamps
        const safeDate = (ts: any) => {
          if (!ts) return new Date().toISOString();
          try {
            if (typeof ts.toDate === 'function') return ts.toDate().toISOString();
            if (ts instanceof Date) return ts.toISOString();
            if (typeof ts === 'string') return ts;
            return new Date().toISOString();
          } catch (e) {
            return new Date().toISOString();
          }
        };

        return {
          ...d,
          id: doc.id,
          createdAt: safeDate(d.createdAt),
          updatedAt: safeDate(d.updatedAt),
          runningDate: d.runningDate || new Date().toISOString(),
        };
      }) as Project[];
      setProjects(data);
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    const path = 'projects';
    try {
      await addDoc(collection(db, path), {
        ...project,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: auth.currentUser?.uid
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    const path = `projects/${id}`;
    try {
      await updateDoc(doc(db, 'projects', id), {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const deleteProject = async (id: string) => {
    const path = `projects/${id}`;
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  return { projects, loading, error, addProject, updateProject, deleteProject };
}
