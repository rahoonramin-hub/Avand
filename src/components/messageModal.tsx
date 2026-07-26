// components/messageModal.tsx

import React from 'react';
import { View, Text,Image, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { colors } from '../constants/colors';
import { popUpTypes } from '../constants/interface';


export default function MessageModal({
  title,
  des,
  image,
  btnText,
  onPress,
}: popUpTypes) {

  return (
    <View style={styles.container}>
        <View style={styles.frame}>
            {image?<Image source={image} resizeMode='contain'/>: <Text style={{fontSize:25}}>🚀</Text>}
            <Text style={styles.title}>{title}</Text>
            <Text style={[styles.des]}>{des}</Text>
            <Pressable
                style={styles.btn}
                onPress={onPress}
            >
                {btnText}
            </Pressable>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#00000099",
        alignItems: 'center',
        justifyContent: 'center'
    },
    image:{
        width: 20,
        height: 20,
    },
    title:{
        fontSize: 20,
        fontWeight: '700',
        color: colors.dark.txt,
    },
    des:{
        fontSize: 14,
        color: colors.dark.txt2,
    },
    btn:{
        color: colors.dark.txt,
        borderWidth:2,
        borderRadius: 10,
        borderBottomWidth: 4,   
        borderColor: colors.hardness.medium.border,
        backgroundColor: colors.hardness.medium.fill ,
        padding: 8,
        paddingVertical: 12,
    },
    frame:{
        maxWidth: "80%",
        borderColor: colors.hardness.medium.border,
        borderRadius: 12,
        borderWidth: 2,
        backgroundColor: colors.dark.surface,
        padding: 10,
        gap: 10,
        alignItems: 'center',
        justifyContent: 'center'
    }

});
