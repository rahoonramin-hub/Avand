// utils/checkAccess.ts
import { signOutUser } from "@/services/firebaseAuth";
import firestore from "@react-native-firebase/firestore";

export async function checkUserAccess(
  uid: string
): Promise<{ ok: true } | { ok: false; reason: "blocked" | "expired" }> {
  const doc = await firestore().collection("users").doc(uid).get();
  if (!doc.exists()) return { ok: true }; // کاربر جدید، هنوز پروفایل نداره

  const data = doc.data();
  if (data?.blocked) {
    await signOutUser();
    return { ok: false, reason: "blocked" };
  }

  const expiresAt = data?.subscription?.expiresAt?.toDate?.();
  if (expiresAt && expiresAt.getTime() < Date.now()) {
    await signOutUser();
    return { ok: false, reason: "expired" };
  }

  return { ok: true };
}