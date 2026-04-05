import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './firebase';

export const logGameEvent = async (eventType, eventData) => {
  try {
    const user = auth.currentUser;
    
    // Safety check: Don't crash the game if Firebase is slow to auth
    if (!user) {
      console.warn("No anonymous user logged in. Telemetry skipped.");
      return;
    }

    // Push the log to a 'game_logs' collection in Firestore
    await addDoc(collection(db, 'game_logs'), {
      userId: user.uid,
      eventType: eventType,
      timestamp: serverTimestamp(),
      ...eventData
    });
    
    console.log(`Telemetry Success: ${eventType} logged.`);
  } catch (error) {
    console.error("Error logging telemetry:", error);
  }
};