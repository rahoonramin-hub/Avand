// components/textInputModal.tsx
import { colors } from '@/constants/colors'
import { useState } from 'react'
import { StyleSheet, Text, TextInput } from 'react-native'
import BaseModal from './ui/baseModal'
import ModalButton from './ui/modalButton'

interface TextInputModalProps {
  title: string
  color: string
  placeholder: string
  IsMultiline?: boolean
  btnText?: string
  onPress: (text: string) => void
  onClose: () => void
}

export default function TextInputModal({
  title, color, placeholder, IsMultiline, btnText = 'Submit', onPress, onClose,
}: TextInputModalProps) {
  const [textValue, setTextValue] = useState<string>('')

  return (
    <BaseModal onClose={onClose} accentColor={color} avoidKeyboard>
      <Text style={styles.title}>{title}</Text>

      <TextInput
        style={[styles.input, { borderColor: color, height: IsMultiline ? 100 : 50 }]}
        placeholder={placeholder}
        placeholderTextColor={colors.dark.txt2}
        multiline={IsMultiline}
        textAlignVertical="top"
        value={textValue}
        onChangeText={setTextValue}
        autoFocus
      />

      <ModalButton label={btnText} color={color} onPress={() => onPress(textValue)} />
    </BaseModal>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.dark.txt,
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    backgroundColor: colors.dark.bg,
    borderRadius: 12,
    borderWidth: 2,
    color: colors.dark.txt,
    padding: 12,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 16,
  },
})