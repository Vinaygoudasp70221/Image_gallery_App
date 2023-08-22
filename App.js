import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from'./Screens/HomeScreen';

const stack=createStackNavigator();

const App = () => {
  return (
    <>
      <NavigationContainer>
        <stack.Navigator initialRouteName='Home'>
            <stack.Screen name="Home" component={HomeScreen}></stack.Screen>
        </stack.Navigator>
      </NavigationContainer>
    </>
  )
}

export default App
