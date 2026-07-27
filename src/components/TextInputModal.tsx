import { colors } from '@/constants/colors';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View
} from 'react-native';

// اصلاح تایپ‌ها بر اساس نیاز شما
interface TextInputModalProps {
  title: string;
  color: string;
  placeholder: string;
  IsMultiline?: boolean;
  btnText?: string;
  onPress: (text: string) => void;
  onClose: () => void;
}

export default function TextInputModal({
  title, color, placeholder, IsMultiline, btnText = 'Submit', onPress, onClose
}: TextInputModalProps) {
  const [textValue, setTextValue] = useState<string>('');

  return (
    <Modal transparent animationType="fade" visible={true}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -100}
              style={styles.keyboardView}
            >
              <View style={[styles.frame, { borderBottomColor: color }]}>
                <Text style={styles.title}>{title}</Text>
                
                <TextInput
                  style={[styles.input, { borderColor: color, height: IsMultiline ? 100 : 50 }]}
                  placeholder={placeholder}
                  placeholderTextColor={colors.dark.txt2}
                  multiline={IsMultiline}
                  textAlignVertical="top"
                  value={textValue}
                  onChangeText={setTextValue}
                />

                <Pressable
                  style={[styles.btn, { backgroundColor: color }]}
                  onPress={() => onPress(textValue)}
                >
                  <Text style={styles.btnText}>{btnText}</Text>
                </Pressable>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    width: '90%',
  },
  frame: {
    backgroundColor: colors.dark.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderBottomWidth: 6,
    gap: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark.txt,
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.dark.bg,
    borderRadius: 10,
    borderWidth: 2,
    color: colors.dark.txt,
    padding: 10,
    fontSize: 16,
  },
  btn: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  }
});