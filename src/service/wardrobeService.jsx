import { db } from "./firebaseConfig";
import { doc, setDoc, updateDoc, deleteDoc, query, collection, where, getDocs } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

// ---- CLOTHING CATEGORIES ----

const DEFAULT_CATEGORIES = [
  { name: "Shirts", sortOrder: 0 },
  { name: "Pants", sortOrder: 1 },
  { name: "Shoes", sortOrder: 2 },
];

export const fetchCategories = async (userId) => {
  const q = query(
    collection(db, "clothing_categories"),
    where("userId", "==", userId)
  );
  const snapshot = await getDocs(q);
  const categories = [];
  snapshot.forEach((doc) => categories.push(doc.data()));
  // Sort client-side to avoid needing a composite index
  categories.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  return categories;
};

export const initializeDefaultCategories = async (userId) => {
  const existing = await fetchCategories(userId);
  if (existing.length > 0) return existing;

  const created = [];
  for (const cat of DEFAULT_CATEGORIES) {
    const id = uuidv4();
    const categoryDoc = {
      id,
      userId,
      name: cat.name,
      sortOrder: cat.sortOrder,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, "clothing_categories", id), categoryDoc);
    created.push(categoryDoc);
  }
  return created;
};

export const createCategory = async (userId, name, sortOrder) => {
  const id = uuidv4();
  const categoryDoc = {
    id,
    userId,
    name,
    sortOrder,
    createdAt: new Date().toISOString(),
  };
  await setDoc(doc(db, "clothing_categories", id), categoryDoc);
  return categoryDoc;
};

export const updateCategory = async (categoryId, updates) => {
  const docRef = doc(db, "clothing_categories", categoryId);
  await updateDoc(docRef, updates);
};

export const deleteCategory = async (categoryId) => {
  await deleteDoc(doc(db, "clothing_categories", categoryId));
};

// ---- WARDROBE ITEMS ----

export const fetchWardrobeItems = async (userId) => {
  const q = query(
    collection(db, "wardrobe_items"),
    where("userId", "==", userId)
  );
  const snapshot = await getDocs(q);
  const items = [];
  snapshot.forEach((doc) => items.push(doc.data()));
  return items;
};

export const saveWardrobeItem = async (item) => {
  await setDoc(doc(db, "wardrobe_items", item.id), item);
};

export const updateWardrobeItem = async (itemId, updates) => {
  const docRef = doc(db, "wardrobe_items", itemId);
  await updateDoc(docRef, { ...updates, updatedAt: new Date().toISOString() });
};

export const deleteWardrobeItem = async (itemId) => {
  await deleteDoc(doc(db, "wardrobe_items", itemId));
};
