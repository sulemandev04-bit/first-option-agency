import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const submitInquiry = async (formData: object) => {
  try {
    const colRef = collection(db, 'inquiries'); // Hamesha "inquiries" table mein jayega
    const result = await addDoc(colRef, {
      ...formData,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: result.id };
  } catch (error) {
    console.error("Submission Error:", error);
    return { success: false, error };
  }
};