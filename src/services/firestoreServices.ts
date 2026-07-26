// services/firestoreServices.ts
import firestore from "@react-native-firebase/firestore";

/**
 * دریافت سند بر اساس ID
 * اگر اینترنت قطع باشد، داده‌ها از کش محلی برگردانده می‌شوند.
 */
export async function getDocumentById<T>(collectionName: string, docId: string): Promise<T | null> {
  try {
    const doc = await firestore().collection(collectionName).doc(docId).get({
      source: 'default', // ابتدا سعی می‌کند از سرور بگیرد، اگر نبود از کش می‌خواند
    });

    if (doc.exists()) {
      return doc.data() as T;
    }
    return null;
  } catch (error) {
    console.error("خطا در دریافت مستندات از فایراستور:", error);
    throw error;
  }
}

/**
 * به‌روزرسانی سند
 * تغییرات در حافظه لوکال اعمال شده و در پس‌زمینه با سرور Sync می‌شود.
 */
export async function updateDocument<T>(collectionName: string, docId: string, data: Partial<T>): Promise<void> {
  try {
    await firestore().collection(collectionName).doc(docId).update(data as any);
  } catch (error) {
    console.error("خطا در به‌روزرسانی مستندات:", error);
    throw error;
  }
}