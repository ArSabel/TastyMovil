import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import {
  LoginScreen,
  RegisterScreen,
  ProfileScreen,
  HomeScreen,
  SectionsScreen,
  ProductsScreen,
  CartScreen,
  OrderDetailsScreen,
  MyOrdersScreen,
  CameraScreen,
  AboutScreen,
  LocationsScreen,
  ContactScreen,
} from '../screens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabNavigator } from './BottomTabNavigator';
import { View, ActivityIndicator } from 'react-native';
import tw from 'twrnc';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  Home: undefined;
  Sections: { sectionName?: string };
  Products: { sectionId: string; sectionName: string };
  Cart: undefined;
  OrderDetails: { facturaId: number; numeroFactura: string; total: number };
  MyOrders: undefined;
  Camera: undefined;
  About: undefined;
  Locations: undefined;
  Contact: undefined;
  MainTabs: undefined;
  AllCategories: undefined;
  AllFeaturedProducts: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{
          animation: 'slide_from_left',
        }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
        options={{
          animation: 'slide_from_right',
        }}
      />

    </Stack.Navigator>
  );
};

const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      {/* Las siguientes pantallas ahora están dentro de los Stack Navigators en BottomTabNavigator */}
      {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
      {/* <Stack.Screen name="Sections" component={SectionsScreen} /> */}
      {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
      {/* <Stack.Screen name="Products" component={ProductsScreen} /> */}
      {/* <Stack.Screen name="MyOrders" component={MyOrdersScreen} /> */}
      {/* <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} /> */}
      {/* <Stack.Screen name="Camera" component={CameraScreen} /> */}
    </Stack.Navigator>
  );
};

const LoadingScreen = () => {
  return (
    <View style={tw`flex-1 justify-center items-center bg-white`}>
      <ActivityIndicator size="large" color="#3B82F6" />
      <View style={tw`mt-4`}>
        <View style={tw`text-2xl font-bold text-gray-800 mb-2`}>
          {/* TastyFood logo or text could go here */}
        </View>
      </View>
    </View>
  );
};

export const AppNavigator: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};