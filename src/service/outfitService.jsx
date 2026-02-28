import { db } from "./firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, deleteDoc, query, collection, where, getDocs } from "firebase/firestore";

export const fetchOutfitsForMonth = async (userId, year, month) => {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

  const q = query(
    collection(db, "calendar_outfits"),
    where("userId", "==", userId),
    where("date", ">=", startDate),
    where("date", "<=", endDate)
  );

  const querySnapshot = await getDocs(q);
  const days = [];
  querySnapshot.forEach((doc) => days.push(doc.data()));
  return days;
};

export const saveOutfit = async (userId, date, outfit) => {
  const docId = `${userId}_${date}`;
  const docRef = doc(db, "calendar_outfits", docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    data.outfits.push(outfit);
    data.updatedAt = new Date().toISOString();
    await updateDoc(docRef, data);
  } else {
    await setDoc(docRef, {
      id: docId,
      userId,
      date,
      outfits: [outfit],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
};

export const updateOutfit = async (userId, date, outfitId, updates) => {
  const docId = `${userId}_${date}`;
  const docRef = doc(db, "calendar_outfits", docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    const idx = data.outfits.findIndex(o => o.outfitId === outfitId);
    if (idx !== -1) {
      data.outfits[idx] = { ...data.outfits[idx], ...updates, updatedAt: new Date().toISOString() };
      data.updatedAt = new Date().toISOString();
      await updateDoc(docRef, data);
    }
  }
};

export const deleteOutfit = async (userId, date, outfitId) => {
  const docId = `${userId}_${date}`;
  const docRef = doc(db, "calendar_outfits", docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    data.outfits = data.outfits.filter(o => o.outfitId !== outfitId);
    data.updatedAt = new Date().toISOString();

    if (data.outfits.length === 0) {
      await deleteDoc(docRef);
    } else {
      await updateDoc(docRef, data);
    }
  }
};
