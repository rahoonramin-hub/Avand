// types/assets.d.ts
// اعلان تایپ برای asset هایی که به‌صورت پیش‌فرض توسط Expo/TypeScript شناخته نمی‌شوند.
// بدون این فایل، import/require فایل‌های .lottie با ارور
// "Cannot find module ... or its corresponding type declarations" مواجه می‌شود،
// چون با moduleResolution: "bundler" رزولوشن require هم دقیقاً مثل import انجام می‌شود.

declare module "*.lottie" {
  const value: number;
  export default value;
}