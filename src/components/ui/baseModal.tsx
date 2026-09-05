// components/ui/BaseModal.tsx
//
// پوسته‌ی مشترک همه‌ی مودال‌های اپ.
// همیشه از وسط صفحه با fade + scale ظاهر می‌شود — هیچ مودالی از پایین بالا نمی‌آید.
// هر مودال دیگری (MessageModal, TextInputModal, AddWordModal, SetPickerModal, …)
// باید محتوای خودش را به‌عنوان children به این کامپوننت بدهد تا شکل و رفتار همه یکی باشد.

import { colors } from '@/constants/colors'
import { Ionicons } from '@expo/vector-icons'
import { ReactNode, useEffect, useRef } from 'react'
import {
  Animated,
  DimensionValue,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

interface BaseModalProps {
  /** اگر کامپوننت والد خودش با شرط {x && <Modal/>} کنترل می‌کند، این را true بگذار (پیش‌فرض) */
  visible?: boolean
  onClose: () => void
  /** رنگ بوردر کارت — هر مودال می‌تواند رنگ خودش را بدهد (خطا، موفقیت، رنگ ست و…) */
  accentColor?: string
  showCloseButton?: boolean
  maxWidth?: DimensionValue
  /** اگر محتوا فرم/کیبورد دارد true بگذار تا KeyboardAvoidingView فعال شود */
  avoidKeyboard?: boolean
  children: ReactNode
}

export default function BaseModal({
  visible = true,
  onClose,
  accentColor = colors.dark.border,
  showCloseButton = true,
  maxWidth = 400,
  avoidKeyboard = false,
  children,
}: BaseModalProps) {
  const opacity = useRef(new Animated.Value(0)).current
  const scale = useRef(new Animated.Value(0.92)).current

  useEffect(() => {
    if (!visible) return
    opacity.setValue(0)
    scale.setValue(0.92)
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 8, tension: 90 }),
    ]).start()
  }, [visible])

  const content = (
    <Animated.View
      style={[
        styles.frame,
        { borderColor: accentColor, maxWidth, width: '100%', opacity, transform: [{ scale }] },
      ]}
    >
      {showCloseButton && (
        <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={10}>
          <Ionicons name="close" size={18} color={colors.dark.txt2} />
        </Pressable>
      )}
      {children}
    </Animated.View>
  )

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            {avoidKeyboard ? (
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardView}
              >
                {content}
              </KeyboardAvoidingView>
            ) : (
              content
            )}
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 22,
  },
  keyboardView: {
    width: '100%',
    alignItems: 'center',
  },
  frame: {
    backgroundColor: colors.dark.surface,
    borderRadius: 22,
    borderWidth: 2,
    borderBottomWidth: 2,
    padding: 22,
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.dark.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
})