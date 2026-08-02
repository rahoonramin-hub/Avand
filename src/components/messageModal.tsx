// components/messageModal.tsx

import { colors } from '@/constants/colors'
import { popUpTypes } from '@/constants/interface'
import { Image, Text, View } from 'react-native'
import BaseModal from './ui/baseModal'
import ModalButton from './ui/modalButton'

export default function MessageModal({
  title,
  des,
  image,
  btnText = 'باشه',
  color = colors.sky,
  onPress,
  onClose,
}: popUpTypes) {
  // اگر onClose جداگانه داده نشده، بستن مودال همان کاری‌ست که دکمه‌ی اصلی انجام می‌دهد
  const handleClose = onClose ?? onPress

  return (
    <BaseModal onClose={handleClose} accentColor={color}>
      <View style={styles.body}>
        {image ? (
          <Image source={image} resizeMode="contain" style={styles.image} />
        ) : (
          <Text style={styles.emoji}>🚀</Text>
        )}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.des}>{des}</Text>

        <View style={{ width: '100%', marginTop: 6 }}>
          <ModalButton label={btnText} color={color} onPress={onPress} />
        </View>
      </View>
    </BaseModal>
  )
}

const styles = {
  body: {
    alignItems: 'center' as const,
    gap: 10,
  },
  image: {
    width: 64,
    height: 64,
  },
  emoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 19,
    fontWeight: '800' as const,
    color: colors.dark.txt,
    textAlign: 'center' as const,
  },
  des: {
    fontSize: 14,
    color: colors.dark.txt2,
    textAlign: 'center' as const,
    lineHeight: 20,
  },
}