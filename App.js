/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { NativeBaseProvider } from 'native-base';
import { SafeAreaView, Platform, useWindowDimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from './src/components/AuthScreen';
import HomeScreen from './src/components/HomeScreen';
import LeaveScreen from './src/components/LeaveScreen';
import PermissionScreen from './src/components/PermissionScreen';
import MissPunchScreen from './src/components/MissPunchScreen';
import OnDutyScreen from './src/components/OnDutyScreen';
import CompOffScreen from './src/components/CompOffScreen';
import { SCREENS } from './src/appConstants';
import store from './src/store';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isNavStateRestored, setIsNavStateReady] = useState(false);
  const [initialState, setInitialState] = useState();

  const NAVIGATION_PERSISTENCE_KEY = 'NAVIGATION_STATE';

  useEffect(() => {
    const restoreState = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (Platform.OS !== 'web' && initialUrl === undefined) {
          const savedState = await AsyncStorage.getItem(NAVIGATION_PERSISTENCE_KEY);
          const state = savedState ? JSON.parse(savedState) : undefined;
          if (state !== undefined) {
            setInitialState(state);
          }
        }
      } finally {
        setIsNavStateReady(true);
      }
    };

    if (!isNavStateRestored) {
      restoreState();
    }
  }, [isNavStateRestored]);

  const { height, width } = useWindowDimensions();

  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <SafeAreaView
          style={{
            height,
            width,
          }}
        >
          <NavigationContainer
            initialState={initialState}
            onStateChange={(state) => {
              AsyncStorage.setItem(NAVIGATION_PERSISTENCE_KEY, JSON.stringify(state));
            }}
          >
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                headerTitle: '',
                headerBackVisible: false,
              }}
              initialRouteName={SCREENS.AUTH.name}
            >
              <Stack.Screen name={SCREENS.AUTH.name} component={AuthScreen} />
              <Stack.Screen name={SCREENS.HOMESCREEN.name} component={HomeScreen} />
              <Stack.Screen name={SCREENS.LEAVESCREEN.name} component={LeaveScreen} />
              <Stack.Screen name={SCREENS.PERMISSIONSCREEN.name} component={PermissionScreen} />
              <Stack.Screen name={SCREENS.MISSPUNCHSCREEN.name} component={MissPunchScreen} />
              <Stack.Screen name={SCREENS.ONDUTYSCREEN.name} component={OnDutyScreen} />
              <Stack.Screen name={SCREENS.COMPOFFSCREEN.name} component={CompOffScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </NativeBaseProvider>
    </Provider>
  );
}
