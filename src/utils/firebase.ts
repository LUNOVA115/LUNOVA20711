import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
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

// Initialize Firestore with custom databaseId from the configuration
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

export { db, collection, doc, setDoc, getDocs, updateDoc, deleteDoc, writeBatch, onSnapshot };
