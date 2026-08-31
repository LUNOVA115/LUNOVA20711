import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  setLogLevel,
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  writeBatch,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// Mute harmless background connection retry logs
setLogLevel('silent');

// Initialize Firestore with custom databaseId from the configuration
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

/**
 * Sanitizes an object before writing to Firestore by removing any `undefined` values,
 * which Firestore rejects with a fatal exception.
 */
export function sanitizeForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return null as any;
  }
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => sanitizeForFirestore(item)) as any;
  }
  if (typeof data === 'object' && !(data instanceof Date)) {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        cleaned[key] = sanitizeForFirestore(value);
      }
    }
    return cleaned as any;
  }
  return data;
}

export { db, collection, doc, setDoc, getDocs, updateDoc, deleteDoc, writeBatch, onSnapshot };

