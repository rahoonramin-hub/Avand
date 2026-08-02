// components/ui/ModalButton.tsx
//
// دکمه‌ی اصلی مشترک همه‌ی مودال‌ها — تخت، رنگی، گرد — دقیقاً هم‌سبک دکمه‌های
// CONTINUE / CHECK در خود اپ (طبق عکس‌های مرجع).

import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native'

interface ModalButtonProps {
  label: string
  color: string
  onPress: () => void
  disabled?: boolean
  loading?: boolean
  textColor?: string
  icon?: React.ReactNode
}

export default function ModalButton({
  label,
  color,
  onPress,
  disabled,
  loading,
  textColor = '#12131a',
  icon,
}: ModalButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: color },
        (disabled || loading) && styles.disabled,
        pressed && !disabled && !loading && styles.pressed,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {icon}
          <Text style={[styles.txt, { color: textColor }]}>{label}</Text>
        </>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    gap: 8,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
    fontSize: 15,
    fontWeight: '800',
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.85,
  },
})