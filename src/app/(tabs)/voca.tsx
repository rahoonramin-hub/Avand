// app/(tabs)/voca.tsx
import AddWordModal from '@/components/addWordModal'
import FlashcardPractice from '@/components/Flashcardpractice'
import MatchingPractice from '@/components/MatchingPractice'
import MessageModal from '@/components/messageModal'
import SetPickerModal from '@/components/SetPickerModal'
import TextInputModal from '@/components/TextInputModal'
import { colors, SET_PALETTE } from '@/constants/colors'
// NOTE: مسیر و نوع export فایل images بر اساس الگوی سایر فایل‌های constants حدس زده شده.
// اگر export شما به صورت default است، این خط را به `import images from '@/constants/images'` تغییر بده.
import { images } from '@/constants/images'
import { UserSet } from '@/constants/interface'
import { updateDocument } from '@/services/firestoreServices'
import { useAddSetStore, useUserStore } from '@/stores/useUserStore'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'


// ─── Practice Features ────────────────────────────────────────────────────────

const FEATURES = [
  { id: 1, name: 'AI',         tag: 'AI',        des: 'یادگیری لغات به کمک هوش مصنوعی.', img: images.ai,        color: '#a78bfa', bg: 'rgba(167,139,250,0.10)', soon: true  },
  { id: 2, name: 'Flashcards', tag: 'Study',      des: 'حفظ بهتر با فلش کارت ها.',         img: images.flashcard, color: '#1cb0f6', bg: 'rgba(28,176,246,0.10)',  soon: false },
  { id: 3, name: 'Matching',   tag: 'Game',       des: 'آموزش با بازی!',                   img: images.matching,  color: '#58cc02', bg: 'rgba(88,204,2,0.10)',    soon: false },
  { id: 4, name: 'Quiz',       tag: 'Challenge',  des: 'خودت را امتحان کن!',               img: images.queiz,     color: '#ff9600', bg: 'rgba(255,150,0,0.10)',   soon: true  },
]

// ─── Component ────────────────────────────────────────────────────────────────

type AppView = 'main' | 'setDetail' | 'flashcard' | 'matching'
type PracticeType = 'flashcard' | 'matching' | null

interface MessageModalState {
  visible: boolean
  title: string
  des: string
  btnText: string
  color: string
}

const Voca = () => {
  const { user, loading } = useUserStore()
  let sets: UserSet[] = (user as any)?.sets ?? []

  // تب‌بار پایین با position: absolute روی محتوا قرار می‌گیرد؛
  // ارتفاعش را می‌گیریم تا لیست‌ها و دکمه‌ی شناور زیرش گم نشوند.

  const insets = useSafeAreaInsets()
  const tabBarHeight = insets.bottom + 50 // 60 = ارتفاع تقریبی تب‌بار خودت، بر اساس استایل واقعی‌اش تنظیم کن
  

  // ── View state ─────────────────────────────────────────────────────────────
  const [view, setView]       = useState<AppView>('main')
  const [setIdx, setSetIdx]   = useState<number | null>(null)
  const [practiceType, setPracticeType] = useState<PracticeType>(null)

  // ── UI state ───────────────────────────────────────────────────────────────
  const [search, setSearch]               = useState('')
  const showAddSet = useAddSetStore(state => state.showAddSet)
  const setShowAddSet = useAddSetStore(state => state.setShowAddSet)
  const [showAddWordModal, setShowAddWordModal] = useState<boolean>(false)

  const [showSetPicker, setShowSetPicker] = useState(false)

  // مودال پیام یکپارچه — برای «به زودی»، خطاها و پیام «هیچ مجموعه‌ای وجود ندارد»
  const [messageModal, setMessageModal] = useState<MessageModalState>({
    visible: false,
    title: '',
    des: '',
    btnText: 'باشه',
    color: colors.sky,
  })
  const showMessage = (title: string, des: string, btnText = 'باشه', color: string = colors.sky) =>
    setMessageModal({ visible: true, title, des, btnText, color })
  const closeMessage = () => setMessageModal(m => ({ ...m, visible: false }))

  // ── Form state ─────────────────────────────────────────────────────────────
  const [saving, setSaving] = useState(false)

  const filteredSets = sets.filter(s =>
    s.n.toLowerCase().includes(search.toLowerCase())
  )

  // ── Navigation helpers ─────────────────────────────────────────────────────
  const openSetDetail = (idx: number) => {
    setSetIdx(idx)
    setView('setDetail')
  }

  const openFlashcard = (idx: number) => {
    setSetIdx(idx)
    setView('flashcard')
  }

  const openMatching = (idx: number) => {
    setSetIdx(idx)
    setView('matching')
  }

  const goToMain = () => {
    setSetIdx(null)
    setPracticeType(null)
    setShowAddWordModal(false)
    setView('main')
  }

  // ── Feature press handler ──────────────────────────────────────────────────
  const handleFeaturePress = (feature: typeof FEATURES[0]) => {
    if (feature.id === 2 || feature.id === 3) {
      // Flashcards یا Matching → فعال هستند
      if (sets.length === 0) {
        showMessage('مجموعه‌ای وجود ندارد', 'ابتدا یک مجموعه لغت بساز تا بتوانی تمرین کنی.')
        return
      }
      setPracticeType(feature.id === 2 ? 'flashcard' : 'matching')
      setShowSetPicker(true)
    } else {
      // Coming soon
      showMessage(feature.name, 'ما روی این ویژگی کار می‌کنیم. به زودی در دسترس خواهد بود!', 'باشه')
    }
  }

  // ── Add Set ────────────────────────────────────────────────────────────────
  const handleAddSet = async (name: string) => {
    if (!name.trim()||!user) return
    setSaving(true)
    try {
      const newSet: UserSet = {
        n:     name.trim(),
        at:    new Date().toISOString(),
        by:    user.id,
        words: {},
      }
      const updated = [...sets, newSet]
      await updateDocument('users', user.id, { sets: updated })
      useUserStore.setState(state => ({
        user: state.user ? ({ ...state.user, sets: updated } as any) : state.user,
      }))
      setShowAddSet(false)
    } catch {
      showMessage('خطا', 'ساخت مجموعه ممکن نشد. دوباره تلاش کن.', 'باشه', colors.pink)
    } finally {
      setSaving(false)
    }
  }

  // ── Add Word(s) ────────────────────────────────────────────────────────────
  // هم برای افزودن یک لغت و هم چند لغت هم‌زمان استفاده می‌شود — همیشه با یک نوشتنِ
  // فایراستور، تا از درخواست‌های تکراری برای حالت چندلغتی جلوگیری شود.
  const handleAddWords = async (pairs: Record<string, string>) => {
    if (setIdx === null || !user || Object.keys(pairs).length === 0) return
    setSaving(true)
    try {
      const updated = sets.map((s, i) =>
        i === setIdx
          ? { ...s, words: { ...s.words, ...pairs } }
          : s
      )
      await updateDocument('users', user.id, { sets: updated })
      useUserStore.setState(state => ({
        user: state.user ? ({ ...state.user, sets: updated } as any) : state.user,
      }))
    } catch {
      showMessage('خطا', 'اضافه کردن لغت ممکن نشد. دوباره تلاش کن.', 'باشه', colors.pink)
    } finally {
      setSaving(false)
    }
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#58cc02" />
        <Text style={styles.loadingTxt}>Loading your sets…</Text>
      </View>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // ── Flashcard View ───────────────────────────────────────────────────────────
  // ─────────────────────────────────────────────────────────────────────────────

  if (view === 'flashcard' && setIdx !== null) {
    const set = sets[setIdx]
    if (!set) { goToMain(); return null }

    const palette     = SET_PALETTE[setIdx % SET_PALETTE.length]
    const flashWords  = Object.entries(set.words ?? {}).map(([word, meaning]) => ({ word, meaning }))

    return (
      <>
        <Modal visible={view === 'flashcard'} animationType='fade' onRequestClose={goToMain}>
          <FlashcardPractice
            words={flashWords}
            setName={set.n}
            accentColor={palette.accent}
            onClose={goToMain}
            onSwitchSet={() => { setPracticeType('flashcard'); setShowSetPicker(true) }}
          />
        </Modal>  
        {showSetPicker && (
          <SetPickerModal
            title="انتخاب مجموعه"
            icon="layers"
            accentColor="#1cb0f6"
            sets={sets}
            palette={SET_PALETTE}
            onSelect={(idx) => { setShowSetPicker(false); openFlashcard(idx) }}
            onClose={() => setShowSetPicker(false)}
          />
        )}
      </>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // ── Matching View ────────────────────────────────────────────────────────────
  // ─────────────────────────────────────────────────────────────────────────────

  if (view === 'matching' && setIdx !== null) {
    const set = sets[setIdx]
    if (!set) { goToMain(); return null }

    const palette     = SET_PALETTE[setIdx % SET_PALETTE.length]
    const matchWords  = Object.entries(set.words ?? {}).map(([word, meaning]) => ({ word, meaning }))

    return (
      <>
        <Modal visible={view === 'matching'} animationType='fade' onRequestClose={goToMain}>
          <MatchingPractice
            words={matchWords}
            setName={set.n}
            accentColor={palette.accent}
            onClose={goToMain}
            onSwitchSet={() => { setPracticeType('matching'); setShowSetPicker(true) }}
          />
        </Modal>
        {showSetPicker && (
          <SetPickerModal
            title="انتخاب مجموعه"
            icon="shuffle"
            accentColor="#58cc02"
            sets={sets}
            palette={SET_PALETTE}
            onSelect={(idx) => { setShowSetPicker(false); openMatching(idx) }}
            onClose={() => setShowSetPicker(false)}
          />
        )}
      </>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // ── Set Detail View ──────────────────────────────────────────────────────────
  // ─────────────────────────────────────────────────────────────────────────────

  if (view === 'setDetail' && setIdx !== null) {
    const set = sets[setIdx]
    if (!set) { goToMain(); return null }

    const palette      = SET_PALETTE[setIdx % SET_PALETTE.length]
    const wordEntries  = Object.entries(set.words ?? {})

    // برای فشردن Flashcard/Matching (و هر ویژگی‌ای که در آینده به FEATURES اضافه شود)
    // مستقیماً روی همین ست، بدون نیاز به SetPickerModal که در این صفحه اضافی است.
    const handlePracticeTilePress = (feature: typeof FEATURES[0]) => {
      if (feature.soon) {
        showMessage(feature.name, 'ما روی این ویژگی کار می‌کنیم. به زودی در دسترس خواهد بود!', 'باشه')
        return
      }
      if (feature.id === 2) openFlashcard(setIdx!)
      else if (feature.id === 3) openMatching(setIdx!)
    }

    return (
      <Modal visible={view === 'setDetail'} onRequestClose={goToMain} animationType='fade'>
        <View style={styles.container}>

          {/* ── Header ── */}
          <SafeAreaView
            style={[styles.detailHeader, { borderBottomColor: palette.border }]}
            edges={['top', 'left', 'right']}
          >
            <TouchableOpacity style={styles.backBtn} onPress={goToMain}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>

            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.detailTitle} numberOfLines={1}>{set.n}</Text>
              <Text style={styles.detailSub}>{wordEntries.length} words</Text>
            </View>

            <View style={[styles.countBadge, { backgroundColor: palette.glow, borderColor: palette.border }]}>
              <Text style={[styles.countBadgeTxt, { color: palette.accent }]}>{wordEntries.length}</Text>
            </View>
          </SafeAreaView>

          {/* ── Practice Modes ── */}
          {wordEntries.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.practiceTilesRow}
              contentContainerStyle={styles.practiceTilesRowContent}
            >
              {FEATURES.map(f =>{if (!f.soon) return (
                <TouchableOpacity
                  key={f.id}
                  style={[styles.practiceTile, { backgroundColor: f.bg, borderColor: f.color + '35' }]}
                  onPress={() => handlePracticeTilePress(f)}
                  activeOpacity={0.82}
                >
                  {f.soon && (
                    <View style={styles.practiceTileSoonBadge}>
                      <Text style={styles.practiceTileSoonTxt}>Soon</Text>
                    </View>
                  )}
                  <View style={[styles.practiceTileIcon, { backgroundColor: f.color + '22' }]}>
                    <Image source={f.img} style={styles.practiceTileImg} resizeMode="contain" />
                  </View>
                  <Text style={[styles.practiceTileTitle, { color: f.color }]} numberOfLines={1}>
                    {f.name}
                  </Text>
                </TouchableOpacity>
              )})}
            </ScrollView>
          )}

          {/* ── Word List ── */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={[styles.wordListPad, { paddingBottom: tabBarHeight + 90 }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {wordEntries.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>📭</Text>
                <Text style={styles.emptyTitle}>No words yet</Text>
                <Text style={styles.emptySub}>برای افزودن اولین لغت، روی دکمه‌ی + پایین صفحه بزن</Text>
              </View>
            ) : (
              wordEntries.map(([word, meaning], i) => (
                <View
                  key={word}
                  style={[styles.wordCard, { borderColor: palette.border, backgroundColor: palette.glow }]}
                >
                  <View style={styles.wordCardLeft}>
                    <Text style={styles.wordIndex}>{i + 1}</Text>
                    <Text style={styles.wordEn}>{word}</Text>
                  </View>
                  <View style={[styles.wordDivider, { backgroundColor: palette.accent + '40' }]} />
                  <View style={styles.wordCardRight}>
                    <Text style={[styles.wordFa, { color: palette.accent }]}>{meaning}</Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          {/* ── Add Word FAB ── */}
          <TouchableOpacity
            style={[styles.addWordFab, { backgroundColor: palette.accent, bottom: tabBarHeight + 18 }]}
            onPress={() => setShowAddWordModal(true)}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={26} color="#111" />
          </TouchableOpacity>

          <AddWordModal
            visible={showAddWordModal}
            setName={set.n}
            palette={palette}
            saving={saving}
            onClose={() => setShowAddWordModal(false)}
            onSubmit={handleAddWords}
          />

        </View>
      </Modal>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // ── Main View ────────────────────────────────────────────────────────────────
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>

      {/* ── Top Bar ── */}
      <SafeAreaView style={styles.topBar} edges={['top', 'left', 'right']}>
        <View>
          <Text style={styles.pageTitle}>My Vocabulary</Text>
          <Text style={styles.pageSub}>
            {sets.length} sets · {sets.reduce((acc, s) => acc + Object.keys(s.words ?? {}).length, 0)} words
          </Text>
        </View>
        <TouchableOpacity style={styles.addSetBtn} onPress={() => setShowAddSet(true)} activeOpacity={0.85}>
          <Ionicons name="add" size={22} color="#111" />
        </TouchableOpacity>
      </SafeAreaView>

      {/* ── Search ── */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={15} color="#555" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search sets…"
          placeholderTextColor="#555"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={16} color="#555" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: tabBarHeight + 40 }}>

        {/* ── Sets Grid ── */}
        {filteredSets.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>{search ? '🔍' : '🗂️'}</Text>
            <Text style={styles.emptyTitle}>{search ? 'No results' : 'No sets yet'}</Text>
            <Text style={styles.emptySub}>
              {search ? 'Try a different search' : 'Tap + to create your first set'}
            </Text>
          </View>
        ) : (
          <View style={styles.setsGrid}>
            {filteredSets.map((item, idx) => {
              const realIdx = sets.indexOf(item)
              const p       = SET_PALETTE[realIdx % SET_PALETTE.length]
              const wCount  = Object.keys(item.words ?? {}).length

              return (
                <TouchableOpacity
                  key={idx}
                  style={[styles.setCard, { backgroundColor: p.bg, borderColor: p.border }]}
                  onPress={() => openSetDetail(realIdx)}
                  activeOpacity={0.82}
                >
                  <View style={[styles.setStripe, { backgroundColor: p.accent }]} />
                  <View style={styles.setCardBody}>
                    <View style={[styles.setIconCircle, { backgroundColor: p.accent + '1a', borderColor: p.border }]}>
                      <Text style={{ fontSize: 22 }}>{p.icon}</Text>
                    </View>
                    <Text style={styles.setName} numberOfLines={2}>{item.n}</Text>
                    <View style={styles.setFooter}>
                      <View style={[styles.setWordPill, { backgroundColor: p.accent + '20' }]}>
                        <Text style={[styles.setWordPillTxt, { color: p.accent }]}>{wCount} words</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={14} color={p.accent} />
                    </View>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        )}

        {/* ── Practice Section ── */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionLine} />
          <Text style={styles.sectionTitle}>Practice</Text>
          <View style={styles.sectionLine} />
        </View>

        <View style={styles.featuresGrid}>
          {FEATURES.map(f => ( 
            <TouchableOpacity
              key={f.id}
              style={[styles.featureCard, { borderColor: f.color + '28' }]}
              onPress={() => handleFeaturePress(f)}
              activeOpacity={0.82}
            >

              <View style={[styles.featureIconBox, { backgroundColor: f.bg }]}>
                <Image source={f.img} style={styles.featureIconImg} resizeMode="contain" />
              </View>

              <View style={[styles.featureTag, { backgroundColor: f.bg }]}>
                <Text style={[styles.featureTagTxt, { color: f.color }]}>{f.tag}</Text>
              </View>

              <Text style={styles.featureName}>{f.name}</Text>
              <Text style={styles.featureDes}>{f.des}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      {/* ── Add Set Modal ── */}
      {showAddSet && (
        <TextInputModal
          title="مجموعه جدید"
          color={SET_PALETTE[sets.length % SET_PALETTE.length].accent}
          placeholder="مثلاً: لغات روزمره، سفر…"
          btnText={saving ? '...' : 'ساخت مجموعه'}
          onPress={handleAddSet}
          onClose={() => setShowAddSet(false)}
        />
      )}

      {/* ── Set Picker Modal (برای Flashcard / Matching از بخش Practice) ── */}
      {showSetPicker && (
        <SetPickerModal
          title={practiceType === 'matching' ? 'انتخاب مجموعه برای Matching' : 'انتخاب مجموعه'}
          icon={practiceType === 'matching' ? 'shuffle' : 'layers'}
          accentColor={practiceType === 'matching' ? '#58cc02' : '#1cb0f6'}
          sets={sets}
          palette={SET_PALETTE}
          onSelect={(idx) => {
            setShowSetPicker(false)
            if (practiceType === 'matching') openMatching(idx)
            else openFlashcard(idx)
          }}
          onClose={() => setShowSetPicker(false)}
        />
      )}

      {/* ── Message Modal (Coming soon / خطاها / بدون مجموعه) ── */}
      {messageModal.visible && (
          <MessageModal
            title={messageModal.title}
            des={messageModal.des}
            btnText={messageModal.btnText}
            color={messageModal.color}
            onPress={closeMessage}
            onClose={closeMessage}
          />
      )}

    </View>
  )
}

export default Voca

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.bg,
  },
  center: {
    flex: 1,
    backgroundColor: colors.dark.bg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingTxt: {
    color: colors.dark.txt2,
    fontSize: 14,
    fontWeight: '500',
  },

  // ─── Top Bar ────────────────────────────────────────────────────────────────
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 14,
    backgroundColor: colors.dark.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.dark.txt,
    letterSpacing: -0.3,
  },
  pageSub: {
    fontSize: 12,
    color: colors.dark.txt2,
    fontWeight: '500',
    marginTop: 2,
  },
  addSetBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#58cc02',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#58cc02',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },

  // ─── Search ─────────────────────────────────────────────────────────────────
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.surface2,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  searchInput: {
    flex: 1,
    color: colors.dark.txt,
    fontSize: 14,
    fontWeight: '500',
    paddingVertical: 0,
  },

  // ─── Sets Grid ───────────────────────────────────────────────────────────────
  setsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 12,
    paddingBottom: 8,
  },
  setCard: {
    width: '47%',
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  setStripe: {
    height: 4,
    width: '100%',
  },
  setCardBody: {
    padding: 14,
  },
  setIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 10,
  },
  setName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.dark.txt,
    marginBottom: 12,
    lineHeight: 20,
  },
  setFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  setWordPill: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  setWordPillTxt: {
    fontSize: 11,
    fontWeight: '700',
  },

  // ─── Section Header ──────────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 16,
    gap: 12,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.dark.border,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.dark.txt2,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  // ─── Feature Cards ────────────────────────────────────────────────────────────
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 12,
    marginBottom: 60,
  },
  featureCard: {
    width: '47%',
    backgroundColor: colors.dark.surface,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    position: 'relative',
  },
  soonBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: colors.dark.surface2,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  soonBadgeTxt: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.dark.txt2,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  featureIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  featureIconImg: {
    width: 26,
    height: 26,
  },
  featureTag: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 6,
  },
  featureTagTxt: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  featureName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.dark.txt,
    marginBottom: 4,
  },
  featureDes: {
    fontSize: 11,
    color: colors.dark.txt2,
    lineHeight: 15,
  },

  // ─── Empty State ─────────────────────────────────────────────────────────────
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.dark.txt,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: colors.dark.txt2,
    textAlign: 'center',
    lineHeight: 20,
  },

  // ─── Detail Header ────────────────────────────────────────────────────────────
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.dark.surface,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.dark.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.dark.txt,
  },
  detailSub: {
    fontSize: 12,
    color: colors.dark.txt2,
    fontWeight: '500',
    marginTop: 2,
  },
  countBadge: {
    minWidth: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  countBadgeTxt: {
    fontSize: 15,
    fontWeight: '800',
  },

  // ─── Practice Tiles (compact, extensible row) ─────────────────────────────────
  practiceTilesRow: {
    flexGrow: 0,
    marginTop: 12,
    marginBottom: 4,
  },
  practiceTilesRowContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  practiceTile: {
    width: 98,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
  },
  practiceTileIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  practiceTileImg: {
    width: 22,
    height: 22,
  },
  practiceTileTitle: {
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
  practiceTileSoonBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  practiceTileSoonTxt: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.dark.txt2,
  },

  // ─── Word Cards ───────────────────────────────────────────────────────────────
  wordListPad: {
    padding: 16,
  },
  wordCard: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    overflow: 'hidden',
    minHeight: 58,
  },
  wordCardLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },
  wordIndex: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.dark.txt2,
    width: 18,
    textAlign: 'center',
  },
  wordEn: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.dark.txt,
    flex: 1,
  },
  wordDivider: {
    width: 1.5,
    marginVertical: 12,
  },
  wordCardRight: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 14,
    alignItems: 'flex-end',
  },
  wordFa: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'right',
  },

  // ─── Add Word FAB ─────────────────────────────────────────────────────────────
  addWordFab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },

  // ─── Shared ───────────────────────────────────────────────────────────────────
  btnDisabled: {
    opacity: 0.4,
  },
})