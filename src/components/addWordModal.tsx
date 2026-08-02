// components/addWordModal.tsx
import { colors } from '@/constants/colors'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import BaseModal from './ui/baseModal'
import ModalButton from './ui/modalButton'

// ─── Types ──────────────────────────────────────────────────────────────────

interface PaletteLike {
  accent: string
  border: string
  glow: string
}

interface ParsedPair {
  word: string
  meaning: string
}

interface AddWordModalProps {
  visible: boolean
  setName: string
  palette: PaletteLike
  saving: boolean
  onClose: () => void
  /** یک یا چند لغت را یک‌جا برمی‌گرداند تا والد با یک نوشتن، همه را ذخیره کند */
  onSubmit: (pairs: Record<string, string>) => void
}

type Mode = 'single' | 'bulk'

// خطوطی مثل «apple - سیب» یا «apple: سیب» یا «apple = سیب» را پارس می‌کند
function parseBulkText(text: string): { pairs: ParsedPair[]; invalidLines: number } {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const pairs: ParsedPair[] = []
  let invalidLines = 0

  for (const line of lines) {
    const match = line.match(/^(.+?)\s*[-:=–—]\s*(.+)$/)
    if (match) {
      const word = match[1].trim()
      const meaning = match[2].trim()
      if (word && meaning) pairs.push({ word, meaning })
      else invalidLines++
    } else {
      invalidLines++
    }
  }
  return { pairs, invalidLines }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AddWordModal({
  visible,
  setName,
  palette,
  saving,
  onClose,
  onSubmit,
}: AddWordModalProps) {
  const [mode, setMode] = useState<Mode>('single')

  // ── Single mode ──
  const [word, setWord] = useState('')
  const [meaning, setMeaning] = useState('')

  // ── Bulk mode ──
  const [bulkText, setBulkText] = useState('')
  const { pairs, invalidLines } = parseBulkText(bulkText)

  const resetAll = () => {
    setWord('')
    setMeaning('')
    setBulkText('')
    setMode('single')
  }

  const handleClose = () => {
    resetAll()
    onClose()
  }

  const handleSubmitSingle = () => {
    if (!word.trim() || !meaning.trim()) return
    onSubmit({ [word.trim()]: meaning.trim() })
    setWord('')
    setMeaning('')
  }

  const handleSubmitBulk = () => {
    if (pairs.length === 0) return
    const map: Record<string, string> = {}
    pairs.forEach(p => { map[p.word] = p.meaning })
    onSubmit(map)
    setBulkText('')
  }

  return (
    <BaseModal visible={visible} onClose={handleClose} accentColor={palette.accent} avoidKeyboard maxWidth={420}>
      <Text style={styles.title}>افزودن لغت</Text>
      <Text style={styles.subtitle} numberOfLines={1}>به مجموعه‌ی «{setName}»</Text>

      {/* ── Mode switch ── */}
      <View style={styles.modeSwitch}>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'single' && { backgroundColor: palette.accent }]}
          onPress={() => setMode('single')}
          activeOpacity={0.85}
        >
          <Text style={[styles.modeBtnTxt, mode === 'single' && styles.modeBtnTxtActive]}>تک لغت</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'bulk' && { backgroundColor: palette.accent }]}
          onPress={() => setMode('bulk')}
          activeOpacity={0.85}
        >
          <Text style={[styles.modeBtnTxt, mode === 'bulk' && styles.modeBtnTxtActive]}>چند لغت هم‌زمان</Text>
        </TouchableOpacity>
      </View>

      {mode === 'single' ? (
        <View style={styles.singleForm}>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>لغت (انگلیسی)</Text>
            <TextInput
              style={[styles.input, { borderColor: palette.border }]}
              placeholder="apple"
              placeholderTextColor="#5a5a6e"
              value={word}
              onChangeText={setWord}
              autoFocus
              returnKeyType="next"
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>معنی</Text>
            <TextInput
              style={[styles.input, { borderColor: palette.border }]}
              placeholder="سیب"
              placeholderTextColor="#5a5a6e"
              value={meaning}
              onChangeText={setMeaning}
              returnKeyType="done"
              onSubmitEditing={handleSubmitSingle}
            />
          </View>
          <ModalButton
            label="افزودن لغت"
            color={palette.accent}
            onPress={handleSubmitSingle}
            disabled={!word.trim() || !meaning.trim()}
            loading={saving}
            icon={<Ionicons name="add" size={18} color="#12131a" />}
          />
        </View>
      ) : (
        <View style={styles.bulkForm}>
          <Text style={styles.bulkHint}>
            هر خط یک لغت — به این شکل: <Text style={{ fontWeight: '800', color: colors.dark.txt }}>apple - سیب</Text>
          </Text>
          <TextInput
            style={[styles.bulkInput, { borderColor: palette.border }]}
            placeholder={'apple - سیب\nbook - کتاب\nwater - آب'}
            placeholderTextColor="#5a5a6e"
            value={bulkText}
            onChangeText={setBulkText}
            multiline
            textAlignVertical="top"
          />

          {bulkText.trim().length > 0 && (
            <View style={styles.bulkSummaryRow}>
              <Text style={[styles.bulkSummaryTxt, { color: palette.accent }]}>
                {pairs.length} لغت آماده‌ی افزودن
              </Text>
              {invalidLines > 0 && (
                <Text style={styles.bulkSummaryWarn}>{invalidLines} خط قابل‌تشخیص نیست</Text>
              )}
            </View>
          )}

          {pairs.length > 0 && (
            <ScrollView
              style={styles.bulkPreview}
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {pairs.map((p, i) => (
                <View key={`${p.word}-${i}`} style={styles.bulkPreviewRow}>
                  <Text style={styles.bulkPreviewWord} numberOfLines={1}>{p.word}</Text>
                  <Ionicons name="arrow-back" size={12} color={colors.dark.txt2} />
                  <Text style={[styles.bulkPreviewMeaning, { color: palette.accent }]} numberOfLines={1}>
                    {p.meaning}
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}

          <ModalButton
            label={`افزودن ${pairs.length > 0 ? `${pairs.length} ` : ''}لغت`}
            color={palette.accent}
            onPress={handleSubmitBulk}
            disabled={pairs.length === 0}
            loading={saving}
            icon={<Ionicons name="albums-outline" size={18} color="#12131a" />}
          />
        </View>
      )}
    </BaseModal>
  )
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.dark.txt,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: colors.dark.txt2,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 16,
  },

  // Mode switch
  modeSwitch: {
    flexDirection: 'row',
    backgroundColor: colors.dark.surface2,
    borderRadius: 14,
    padding: 4,
    marginBottom: 18,
  },
  modeBtn: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeBtnTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.dark.txt2,
  },
  modeBtnTxtActive: {
    color: '#12131a',
  },

  // Single form
  singleForm: {
    gap: 14,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.dark.txt2,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: colors.dark.bg,
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: '600',
    color: colors.dark.txt,
  },

  // Bulk form
  bulkForm: {
    gap: 10,
  },
  bulkHint: {
    fontSize: 12,
    color: colors.dark.txt2,
    lineHeight: 18,
  },
  bulkInput: {
    minHeight: 110,
    maxHeight: 140,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: colors.dark.bg,
    padding: 14,
    fontSize: 14,
    fontWeight: '500',
    color: colors.dark.txt,
  },
  bulkSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bulkSummaryTxt: {
    fontSize: 12,
    fontWeight: '800',
  },
  bulkSummaryWarn: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ff9600',
  },
  bulkPreview: {
    maxHeight: 130,
  },
  bulkPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.surface2,
  },
  bulkPreviewWord: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: colors.dark.txt,
  },
  bulkPreviewMeaning: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
  },
})