// src/constants/sounds.ts
// فایل‌های صوتی رو داخل src/assets/sounds/success.mp3 و failure.mp3 قرار بده
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";

setAudioModeAsync({
  playsInSilentMode: true,
  shouldPlayInBackground: false,
}).catch(() => {});

// پلیرها یک‌بار در لود ماژول ساخته میشن (createAudioPlayer سینک هست، نیازی به await نیست)
const players = {
  success: createAudioPlayer(require("@/assets/sounds/success.mp3")),
  failure: createAudioPlayer(require("@/assets/sounds/failure.mp3")),
} satisfies Record<string, AudioPlayer>;

type SoundKey = keyof typeof players;

// همیشه فقط یک صدا در حال پخشه؛ هر ایونت جدید (صدا یا لرزه) صدای قبلی رو قطع میکنه
let activePlayer: AudioPlayer | null = null;

// شمارنده‌ی نسل: هر بار playSound صدا زده میشه یک عدد جدید میگیره.
// اگه موقع resolve شدن seekTo، این عدد دیگه با نسل فعلی یکی نبود یعنی
// یک call جدیدتر این call رو منقضی کرده و نباید play() اجرا بشه.
// این دقیقاً جلوی race condition بین دو صدای پشت‌سرهم رو میگیره.
let playGeneration = 0;

function stopActivePlayer() {
  if (activePlayer) {
    try {
      activePlayer.pause();
      // seekTo اینجا عمداً await نمیشه؛ چون فقط برای ریست‌کردن موقعیت پلیر قبلیه
      // و نیازی نیست جلوی ادامه‌ی کد رو بگیره.
      activePlayer.seekTo(0).catch(() => {});
    } catch {
      // مشکلی نیست
    }
    activePlayer = null;
  }
}

async function playSound(key: SoundKey, haptic: () => Promise<void>) {
  const myGeneration = ++playGeneration;

  stopActivePlayer();
  haptic().catch(() => {});

  const player = players[key];
  try {
    await player.seekTo(0);

    // اگه در همین فاصله یک playSound دیگه صدا زده شده (نسل عوض شده)،
    // یعنی این call منقضی شده و نباید play() رو اجرا کنه —
    // وگرنه دقیقاً همون overlap/عدم‌ترتیب رخ میده.
    if (myGeneration !== playGeneration) return;

    player.play();
    activePlayer = player;
  } catch {
    // خطای پخش - بی‌صدا رد شو
  }
}

function interruptAndRun(fn: () => Promise<void>) {
  stopActivePlayer();
  // برای هاپتیک‌های ساده هم نسل رو جلو می‌بریم تا اگه بلافاصله بعدش
  // playSound صدا زده بشه، این interrupt به‌عنوان "آخرین درخواست" حساب نشه
  // و صدای واقعی بتونه به‌درستی پخش بشه.
  playGeneration++;
  fn().catch(() => {});
}

/**
 * یک‌بار موقع استارت اپ (مثلاً در root layout) صدا زده بشه.
 * پلیرها رو به‌صورت بی‌صدا و خیلی کوتاه play/pause می‌کنه تا هم بافر صوتی
 * فایل‌ها از قبل دیکد بشه و هم audio session سیستم گرم بشه — این جلوی
 * تأخیر یا عدم‌پخش در اولین استفاده‌ی واقعی (cold start) رو می‌گیره.
 */
export function primeSounds() {
  Object.values(players).forEach((p) => {
    try {
      p.volume = 0;
      p.play();
      setTimeout(() => {
        try {
          p.pause();
          p.seekTo(0).catch(() => {});
          p.volume = 1;
        } catch {
          // مشکلی نیست
        }
      }, 50);
    } catch {
      // مشکلی نیست
    }
  });
}

export const Feedback = {
  success: () => {
    playSound("success", () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
  },
  failure: () => {
    playSound("failure", () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
  },
  light: () => {
    interruptAndRun(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
  },
  hard: () => {
    interruptAndRun(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy));
  },
  selection: () => {
    interruptAndRun(() => Haptics.selectionAsync());
  },
};