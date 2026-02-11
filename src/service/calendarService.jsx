import { db } from "./firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, deleteDoc, query, collection, where, getDocs } from "firebase/firestore";

// Fetch events for a specific date
export const fetchEventsByDate = async (userId, date) => {
  const docRef = doc(db, "calendar_events", `${userId}_${date}`);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

// Fetch events for a month
export const fetchEventsForMonth = async (userId, year, month) => {
  // Query all documents for user where date starts with "YYYY-MM"
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

  const q = query(
    collection(db, "calendar_events"),
    where("userId", "==", userId),
    where("date", ">=", startDate),
    where("date", "<=", endDate)
  );

  const querySnapshot = await getDocs(q);
  const events = [];
  querySnapshot.forEach((doc) => {
    events.push(doc.data());
  });
  return events;
};

// Create or update event
export const saveEvent = async (userId, date, event) => {
  const docId = `${userId}_${date}`;
  const docRef = doc(db, "calendar_events", docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // Add event to existing day
    const data = docSnap.data();
    data.events.push(event);
    data.updatedAt = new Date().toISOString();
    await updateDoc(docRef, data);
  } else {
    // Create new day with event
    await setDoc(docRef, {
      id: docId,
      userId,
      date,
      events: [event],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
};

// Update existing event
export const updateEvent = async (userId, date, eventId, updates) => {
  const docId = `${userId}_${date}`;
  const docRef = doc(db, "calendar_events", docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    const eventIndex = data.events.findIndex(e => e.eventId === eventId);
    if (eventIndex !== -1) {
      data.events[eventIndex] = { ...data.events[eventIndex], ...updates, updatedAt: new Date().toISOString() };
      data.updatedAt = new Date().toISOString();
      await updateDoc(docRef, data);
    }
  }
};

// Delete event
export const deleteEvent = async (userId, date, eventId) => {
  const docId = `${userId}_${date}`;
  const docRef = doc(db, "calendar_events", docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    data.events = data.events.filter(e => e.eventId !== eventId);
    data.updatedAt = new Date().toISOString();

    if (data.events.length === 0) {
      // Delete document if no events remain
      await deleteDoc(docRef);
    } else {
      await updateDoc(docRef, data);
    }
  }
};
