// components/setPickerModal.tsx

import { colors } from '@/constants/colors'
import { UserSet } from '@/constants/interface'
import { Ionicons } from '@expo/vector-icons'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import BaseModal from './ui/baseModal'

interface SetPaletteEntry {
  accent: string
  border: string
  bg: string
  glow: string
  icon: string
}

interface SetPickerModalProps {
  title: string
  subtitle?: string
  icon?: keyof typeof Ionicons.glyphMap
  accentColor: string
  sets: UserSet[]
  palette: SetPaletteEntry[]
  onSelect: (index: number) => void
  onClose: () => void
}

export default function SetPickerModal({
  title,
  subtitle = 'کدام مجموعه را می‌خواهی تمرین کنی؟',
  icon = 'layers',
  accentColor,
  sets,
  palette,
  onSelect,
  onClose,
}: SetPickerModalProps) {
  return (
    <BaseModal onClose={onClose} accentColor={accentColor} maxWidth={420}>
      <View style={styles.iconRow}>
        <View style={[styles.iconBox, { backgroundColor: accentColor + '1f' }]}>
          <Ionicons name={icon} size={24} color={accentColor} />
        </View>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <ScrollView style={{ maxHeight: 360 }} showsVerticalScrollIndicator={false}>
        {sets.map((s, idx) => {
          const p = palette[idx % palette.length]
          const wCount = Object.keys(s.words ?? {}).length
          const empty = wCount === 0

          return (
            <Pressable
              key={idx}
              style={({ pressed }) => [
                styles.row,
                empty && { opacity: 0.38 },
                pressed && !empty && { backgroundColor: colors.dark.surface2 },
              ]}
              onPress={() => !empty && onSelect(idx)}
              disabled={empty}
            >
              <View style={[styles.rowIcon, { backgroundColor: p.bg, borderColor: p.border }]}>
                <Text style={{ fontSize: 20 }}>{p.icon}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.rowName} numberOfLines={1}>{s.n}</Text>
                <Text style={styles.rowCount}>
                  {empty ? 'بدون لغت — ابتدا لغت اضافه کن' : `${wCount} لغت`}
                </Text>
              </View>

              {!empty && <Ionicons name="chevron-forward" size={16} color={p.accent} />}
            </Pressable>
          )
        })}
        <View style={{ height: 4 }} />
      </ScrollView>
    </BaseModal>
  )
}

const styles = StyleSheet.create({
  iconRow: {
    alignItems: 'center',
    marginBottom: 14,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.dark.txt,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.dark.txt2,
    textAlign: 'center',
    marginBottom: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
    borderRadius: 10,
  },
  rowIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.dark.txt,
    marginBottom: 2,
  },
  rowCount: {
    fontSize: 12,
    color: colors.dark.txt2,
    fontWeight: '500',
  },
})