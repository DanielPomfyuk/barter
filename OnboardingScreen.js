import * as React from 'react';
import { StatusBar, Animated, Text, Image, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import DATA from './assets/login_screen_data.js'
import colours from './colours.js'
const { width, height } = Dimensions.get('screen');

const Indicator = ({ scrollX }) => {
  return (
    <View style={{ position: 'absolute', bottom: 75, flexDirection: 'row' }}>
      {DATA.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        
        const scale = scrollX.interpolate({
          inputRange,
          outputRange: [0.8, 1.4, 0.8],
          exterpolate: 'clamp'
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.6, 0.9, 0.6],
          exterpolate: 'clamp'
        });

        return (<Animated.View
          key={`indicator-${i}`}
          style={[styles.indicatorDot,{
            opacity,
            transform: [{scale}]
          }]}
        />
        );
      })}
    </View>
  );
};

const Backdrop = () => {
  return <Animated.View
    style={[StyleSheet.absoluteFillObject, { backgroundColor: colours.BACKGROUND }]}
  />
}

const Square = ({ scrollX }) => {
  const YOLO = Animated.modulo(Animated.divide(
    Animated.modulo(scrollX, width),
    new Animated.Value(width)
  ), 1)

  const rotate = YOLO.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['35deg', '0deg', '35deg']
  })

  const translateX = YOLO.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -height, 0]
  })

  return <Animated.View
    style={[styles.square,{transform: [{rotate},{translateX}]}]}
  />
}

const Button = ({ text }) => {
  return (<TouchableOpacity style={styles.button}><Text style={styles.buttonText}>{text}</Text></TouchableOpacity>)
}

export default function OnboardingScreen() {
  const scrollx = React.useRef(new Animated.Value(0)).current;
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Backdrop />
      <Square scrollX={scrollx} />
      <Animated.FlatList
        data={DATA}
        keyExtractor={item => item.key}
        horizontal
        contentContainerStyle={{ paddingBottom: 100 }}
        scrollEventThrottle={32}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollx } } }],
          { useNativeDriver: false }
        )}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        renderItem={({ item }) => {
          return <View style={{ width, alignItems: 'center', padding: 20 }}>
            <View style={{ flex: 0.7, justifyContent: 'center' }}>
              <Image source={item.image} style={{ width: width / 2, height: height / 2, resizeMode: 'contain' }} />
            </View>
            <View style={{ flex: 0.3 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        }}
      />
      <View style={{ position: 'absolute', bottom: height / 8, flexDirection: 'row' }}>
        <Button text={"Log In"} />
        <Button text={"Sign Up"} />
      </View>
      <Indicator scrollX={scrollx} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    borderRadius: 86,
    width: width / 3,
    height: width / 6,
    borderWidth: 2,
    margin: 10,
    borderColor: colours.SQUARE,
    alignItems: "center",
    justifyContent: 'center'
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 18,
    color: colours.SQUARE,
    textAlign: 'center'
  },
  indicatorDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    margin: 10,
  },
  square: {
    width: height,
    height: height,
    backgroundColor: colours.SQUARE,
    borderRadius: 86,
    position: 'absolute',
    top: -height * 0.6,
    left: -height * 0.3
  },
  title:{ 
    fontWeight: '800', 
    fontSize: 28, 
    marginBottom: 10, 
    color: colours.SQUARE 
  },
  description:{ 
    fontWeight: '300',
    color: colours.SQUARE 
  }
});
