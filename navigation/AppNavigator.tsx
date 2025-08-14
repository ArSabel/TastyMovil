import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import {
  LoginScreen,
  RegisterScreen,
  HomeScreen,
  SectionsScreen,
  ProductsScreen,
  CartScreen,
  OrderDetailsScreen,
  MyOrdersScreen
} from '../screens';
import { View, ActivityIndicator } from 'react-native';
import tw from 'twrnc';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Sections: undefined;
  Products: {
    sectionId: number;
    sectionName: string;
  };
  Cart: undefined;
  MyOrders: undefined;
  OrderDetails: {
    facturaId: number;
    numeroFactura: string;
    total: number;
  };
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
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
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
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen 
        name="Sections" 
        component={SectionsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="Products" 
        component={ProductsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="Cart" 
        component={CartScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="MyOrders" 
        component={MyOrdersScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="OrderDetails" 
        component={OrderDetailsScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
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