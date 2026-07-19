import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
} from 'firebase/firestore'
import { CrowdManagementSnapshot, Incident } from './types'

/**
 * Recommended Firestore Security Rules:
 *
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     // Telemetry data can be read by anyone, but only written by authorized staff
 *     match /telemetry/{document=**} {
 *       allow read: if true;
 *       allow write: if request.auth != null && request.auth.token.role == 'admin';
 *     }
 *     // Incidents can be read by staff, and written by authenticated personnel
 *     match /incidents/{document=**} {
 *       allow read: if request.auth != null;
 *       allow write: if request.auth != null;
 *     }
 *   }
 * }
 */

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase only if not already initialized (Next.js HMR safe)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
export const db = getFirestore(app)

/**
 * Pushes a new crowd snapshot to Firestore telemetry collection.
 * @param {CrowdManagementSnapshot} snapshot - The crowd density data.
 */
export async function pushCrowdSnapshot(
  snapshot: CrowdManagementSnapshot
): Promise<void> {
  try {
    await addDoc(collection(db, 'telemetry'), snapshot)
  } catch (error) {
    console.error('Failed to push crowd snapshot to Firestore', error)
  }
}

/**
 * Subscribes to live crowd telemetry data in real-time.
 * @param {(snapshots: CrowdManagementSnapshot[]) => void} callback - Fired when data changes.
 * @returns {() => void} Unsubscribe function.
 */
export function subscribeToLiveTelemetry(
  callback: (snapshots: CrowdManagementSnapshot[]) => void
): () => void {
  try {
    const q = query(
      collection(db, 'telemetry'),
      orderBy('timestamp', 'desc'),
      limit(50)
    )
    return onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(
          (doc) => doc.data() as CrowdManagementSnapshot
        )
        callback(data)
      },
      (error) => {
        console.error('Live telemetry subscription error', error)
      }
    )
  } catch (error) {
    console.error('Failed to initialize live telemetry subscription', error)
    return () => {} // Return a no-op unsubscribe function
  }
}

/**
 * Reports a new incident to Firestore.
 * @param {Incident} incident - The incident object to save.
 */
export async function reportIncident(incident: Incident): Promise<void> {
  try {
    await addDoc(collection(db, 'incidents'), incident)
  } catch (error) {
    console.error('Failed to report incident to Firestore', error)
  }
}

/**
 * Subscribes to active incidents in real-time.
 * @param {(incidents: Incident[]) => void} callback - Fired when incidents change.
 * @returns {() => void} Unsubscribe function.
 */
export function subscribeToIncidents(
  callback: (incidents: Incident[]) => void
): () => void {
  try {
    const q = query(
      collection(db, 'incidents'),
      orderBy('timestamp', 'desc'),
      limit(100)
    )
    return onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => doc.data() as Incident)
        callback(data)
      },
      (error) => {
        console.error('Incident subscription error', error)
      }
    )
  } catch (error) {
    console.error('Failed to initialize incident subscription', error)
    return () => {} // Return a no-op unsubscribe function
  }
}
