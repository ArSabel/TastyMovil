import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, Easing, StyleSheet, Dimensions } from 'react-native';
import tw from 'twrnc';

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

const { width, height } = Dimensions.get('window');

export const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationComplete }) => {
  // Animación para la opacidad
  const fadeAnim = useRef(new Animated.Value(0)).current;
  // Animación para el tamaño
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  // Animación para la rotación
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Secuencia de animaciones
    Animated.sequence([
      // Fade in y escala
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.ease,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.elastic(1),
        }),
      ]),
      // Rotación
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.ease,
      }),
    ]).start(() => {
      // Esperar un momento antes de completar
      setTimeout(onAnimationComplete, 500);
    });
  }, []);

  // Interpolación para la rotación
  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[tw`flex-1 justify-center items-center bg-white`, styles.container]}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { rotate: spin },
          ],
        }}
      >
        <Image
          source={require('../assets/splash-icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  logo: {
    width: width * 0.7,
    height: width * 0.7,
  },
});