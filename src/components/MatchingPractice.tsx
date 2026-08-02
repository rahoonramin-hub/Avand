// components/MatchingPractice.tsx

import { colors } from '@/constants/colors'
import { Ionicons } from '@expo/vector-icons'
import React, { useMemo, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface MatchWord {
  word: string
  meaning: string
}

interface MatchingPracticeProps {
  words: MatchWord[]
  setName: string
  accentColor: string
  onClose: () => void
  onSwitchSet: () => void
}

interface Tile {
  key: string // word اصلی که برای مچ کردن استفاده می‌شود
  label: string // متنی که روی کاشی نمایش داده می‌شود
  side: 'left' | 'right'
}

// ─── Constants ──────────────────────────────────────────────────────────────

const ROUND_SIZE = 6 // تعداد جفت‌کلمه در هر راند برای اینکه صفحه شلوغ نشود

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function MatchingPractice({
  words,
  setName,
  accentColor,
  onClose,
  onSwitchSet,
}: MatchingPracticeProps) {
  const rounds = useMemo(() => chunk(words, ROUND_SIZE), [words])

  const [roundIdx, setRoundIdx] = useState(0)
  const currentRoundWords = rounds[roundIdx] ?? []

  const [leftTiles, setLeftTiles] = useState<Tile[]>([])
  const [rightTiles, setRightTiles] = useState<Tile[]>([])
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [selectedRight, setSelectedRight] = useState<string | null>(null)
  const [wrongKeys, setWrongKeys] = useState<{ left?: string; right?: string }>({})
  const [mistakes, setMistakes] = useState(0)
  const [locked, setLocked] = useState(false)
  const [finished, setFinished] = useState(false)

  // ── ساخت کاشی‌های راند جاری ────────────────────────────────────────────────
  const buildRound = React.useCallback((roundWords: MatchWord[]) => {
    setLeftTiles(shuffle(roundWords.map(w => ({ key: w.word, label: w.word, side: 'left' as const }))))
    setRightTiles(shuffle(roundWords.map(w => ({ key: w.word, label: w.meaning, side: 'right' as const }))))
    setMatched(new Set())
    setSelectedLeft(null)
    setSelectedRight(null)
    setWrongKeys({})
  }, [])

  React.useEffect(() => {
    buildRound(currentRoundWords)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIdx])

  // ── انتخاب کاشی ─────────────────────────────────────────────────────────────
  const handlePressTile = (tile: Tile) => {
    if (locked || matched.has(tile.key)) return

    if (tile.side === 'left') {
      setSelectedLeft(tile.key)
      if (selectedRight) checkPair(tile.key, selectedRight)
    } else {
      setSelectedRight(tile.key)
      if (selectedLeft) checkPair(selectedLeft, tile.key)
    }
  }

  const checkPair = (leftKey: string, rightKey: string) => {
    setLocked(true)
    if (leftKey === rightKey) {
      setTimeout(() => {
        setMatched(prev => {
          const next = new Set(prev)
          next.add(leftKey)
          // پایان راند؟
          if (next.size === currentRoundWords.length) {
            setTimeout(() => {
              if (roundIdx + 1 < rounds.length) {
                setRoundIdx(r => r + 1)
              } else {
                setFinished(true)
              }
            }, 500)
          }
          return next
        })
        setSelectedLeft(null)
        setSelectedRight(null)
        setLocked(false)
      }, 260)
    } else {
      setMistakes(m => m + 1)
      setWrongKeys({ left: leftKey, right: rightKey })
      setTimeout(() => {
        setWrongKeys({})
        setSelectedLeft(null)
        setSelectedRight(null)
        setLocked(false)
      }, 500)
    }
  }

  const handleRestart = () => {
    setRoundIdx(0)
    setMistakes(0)
    setFinished(false)
    buildRound(rounds[0] ?? [])
  }

  const totalPairs = words.length
  const doneSoFar = roundIdx * ROUND_SIZE + matched.size

  // ─────────────────────────────────────────────────────────────────────────
  // ── Results screen ───────────────────────────────────────────────────────
  // ─────────────────────────────────────────────────────────────────────────

  if (finished) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right', 'bottom']}>
          <View style={styles.resultsWrap}>
            <Text style={styles.resultsEmoji}>🧩</Text>
            <Text style={styles.resultsTitle}>تکمیل شد!</Text>
            <Text style={styles.resultsSub}>
              {totalPairs-mistakes} لغت را درست حدث زدی
            </Text>

            <View style={[styles.resultsStatCard, { borderColor: accentColor + '55' }]}>
              <Text style={[styles.resultsStatNum, { color: accentColor }]}>{mistakes}</Text>
              <Text style={styles.resultsStatLabel}>اشتباه در کل بازی</Text>
            </View>

            <View style={{ height: 28 }} />

            <TouchableOpacity
              style={[styles.resultsBtnPrimary, { backgroundColor: accentColor }]}
              onPress={handleRestart}
              activeOpacity={0.85}
            >
              <Ionicons name="refresh" size={18} color="#111" />
              <Text style={styles.resultsBtnPrimaryTxt}>دوباره بازی کن</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resultsBtnSecondary} onPress={onClose} activeOpacity={0.85}>
              <Ionicons name="exit-outline" size={18} color={colors.dark.txt} />
              <Text style={styles.resultsBtnSecondaryTxt}>خروج و بازگشت</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.switchSetLink} onPress={onSwitchSet}>
              <Text style={styles.switchSetLinkTxt}>تعویض مجموعه</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ── Game screen ──────────────────────────────────────────────────────────
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <View>
          {/* ── Header ── */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerIconBtn} onPress={onClose}>
              <Ionicons name="close" size={22} color={colors.dark.txt} />
            </TouchableOpacity>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.headerTitle} numberOfLines={1}>{setName}</Text>
              <Text style={styles.headerSub}>{doneSoFar} / {totalPairs} لغت</Text>
            </View>
            <TouchableOpacity style={styles.headerIconBtn} onPress={onSwitchSet}>
              <Ionicons name="settings-outline" size={20} color={colors.dark.txt} />
            </TouchableOpacity>
          </View>

          {/* ── Progress bar ── */}
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: totalPairs ? `${(doneSoFar / totalPairs) * 100}%` : '0%', backgroundColor: accentColor },
              ]}
            />
          </View>
          {/* ── Mistakes ── */}
          <View style={styles.mistakesRow}>
            <Ionicons name="close-circle-outline" size={14} color={colors.dark.txt2} />
            <Text style={styles.mistakesTxt}>{mistakes} اشتباه</Text>
          </View>
        </View>
        
        {/* -- margin -- */}
        <View style={styles.margin} />
        {/* ── Board ── */}
        <View style={styles.board}>
          <View style={styles.column}>
            {leftTiles.map(tile => {
              const isMatched = matched.has(tile.key)
              const isSelected = selectedLeft === tile.key
              const isWrong = wrongKeys.left === tile.key
              return (
                <TouchableOpacity
                  key={`L-${tile.key}`}
                  disabled={isMatched}
                  onPress={() => handlePressTile(tile)}
                  activeOpacity={0.8}
                  style={[
                    styles.tile,
                    isMatched && styles.tileMatched,
                    isSelected && !isWrong && { borderColor: accentColor, backgroundColor: accentColor + '18' },
                    isWrong && styles.tileWrong,
                  ]}
                >
                  <Text
                    style={[
                      styles.tileTxt,
                      isMatched && styles.tileTxtMatched,
                      isSelected && !isWrong && { color: accentColor },
                    ]}
                    numberOfLines={2}
                  >
                    {tile.label}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>

          <View style={styles.column}>
            {rightTiles.map(tile => {
              const isMatched = matched.has(tile.key)
              const isSelected = selectedRight === tile.key
              const isWrong = wrongKeys.right === tile.key
              return (
                <TouchableOpacity
                  key={`R-${tile.key}`}
                  disabled={isMatched}
                  onPress={() => handlePressTile(tile)}
                  activeOpacity={0.8}
                  style={[
                    styles.tile,
                    isMatched && styles.tileMatched,
                    isSelected && !isWrong && { borderColor: accentColor, backgroundColor: accentColor + '18' },
                    isWrong && styles.tileWrong,
                  ]}
                >
                  <Text
                    style={[
                      styles.tileTxt,
                      styles.tileTxtFa,
                      isMatched && styles.tileTxtMatched,
                      isSelected && !isWrong && { color: accentColor },
                    ]}
                    numberOfLines={2}
                  >
                    {tile.label}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
        {/* -- margin -- */}
        <View style={styles.margin} />

      </SafeAreaView>
    </View>
  )
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.bg,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.dark.txt,
    maxWidth: 180,
  },
  headerSub: {
    fontSize: 11,
    color: colors.dark.txt2,
    marginTop: 2,
  },

  progressTrack: {
    height: 6,
    marginHorizontal: 16,
    borderRadius: 3,
    backgroundColor: colors.dark.surface2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },

  mistakesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'center',
    marginTop: 10,
  },
  mistakesTxt: {
    fontSize: 12,
    color: colors.dark.txt2,
    fontWeight: '600',
  },
  margin:{
    flex:1
  },
  board: {
    flex: 5,
    alignItems:'flex-start',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 12,
  },
  column: {
    flex: 1,
    gap: 10,
  },
  tile: {
    minHeight: 64,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.dark.border,
    backgroundColor: colors.dark.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  tileTxt: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark.txt,
    textAlign: 'center',
  },
  tileTxtFa: {
    writingDirection: 'rtl',
  },
  tileMatched: {
    borderColor: '#2dd4bf55',
    backgroundColor: '#2dd4bf14',
    opacity: 0.5,
  },
  tileTxtMatched: {
    color: '#2dd4bf',
  },
  tileWrong: {
    borderColor: '#ff5b5b',
    backgroundColor: '#ff5b5b1a',
  },

  // Results
  resultsWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  resultsEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.dark.txt,
    textAlign: 'center',
    marginBottom: 6,
  },
  resultsSub: {
    fontSize: 14,
    color: colors.dark.txt2,
    textAlign: 'center',
    marginBottom: 20,
  },
  resultsStatCard: {
    width: 160,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    backgroundColor: colors.dark.surface,
  },
  resultsStatNum: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
  },
  resultsStatLabel: {
    fontSize: 11,
    color: colors.dark.txt2,
    fontWeight: '600',
    textAlign: 'center',
  },
  resultsBtnPrimary: {
    flexDirection: 'row',
    gap: 8,
    height: 52,
    minWidth: 260,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  resultsBtnPrimaryTxt: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111',
  },
  resultsBtnSecondary: {
    flexDirection: 'row',
    gap: 8,
    height: 52,
    minWidth: 260,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: colors.dark.border,
  },
  resultsBtnSecondaryTxt: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.dark.txt,
  },
  switchSetLink: {
    marginTop: 6,
    padding: 8,
  },
  switchSetLinkTxt: {
    fontSize: 13,
    color: colors.dark.txt2,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
})
