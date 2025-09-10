import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import tw from 'twrnc';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  Menu,
  Users,
  MapPin,
  Phone,
  ShoppingCart,
  User,
  Home,
} from 'lucide-react-native';

import {
  SectionsScreen,
  AboutScreen,
  LocationsScreen,
  ContactScreen,
  CartScreen,
  ProfileScreen,
  HomeScreen,
  ProductsScreen,
  MyOrdersScreen,
  OrderDetailsScreen,
  CameraScreen,
  AllCategoriesScreen,
  AllFeaturedProductsScreen,
} from '../screens';
import { RootStackParamList } from './AppNavigator';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

interface TabIconProps {
  focused: boolean;
  color: string;
  size: number;
}

// Navegador de pila para la pestaña Home/Menu
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Sections" component={SectionsScreen} />
      <Stack.Screen name="Products" component={ProductsScreen} />
      <Stack.Screen name="AllCategories" component={AllCategoriesScreen} />
      <Stack.Screen name="AllFeaturedProducts" component={AllFeaturedProductsScreen} />
    </Stack.Navigator>
  );
};

// Navegador de pila para la pestaña Cart
const CartStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
      <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
    </Stack.Navigator>
  );
};

// Navegador de pila para la pestaña Profile
const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Camera" component={CameraScreen} />
    </Stack.Navigator>
  );
};

const getTabBarIcon = (routeName: string) => {
  return ({ focused, color, size }: TabIconProps) => {
    let IconComponent;
    
    switch (routeName) {
      case 'Menu':
        IconComponent = Home;
        break;
      case 'About':
        IconComponent = Users;
        break;
      case 'Locations':
        IconComponent = MapPin;
        break;
      case 'Contact':
        IconComponent = Phone;
        break;
      case 'Cart':
        IconComponent = ShoppingCart;
        break;
      case 'Profile':
        IconComponent = User;
        break;
      default:
        IconComponent = Menu;
    }
    
    return (
      <View style={tw`items-center justify-center ${focused ? 'bg-blue-100' : ''} rounded-full p-1`}>
        <IconComponent size={size} color={color} />
      </View>
    );
  };
};

export const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: getTabBarIcon(route.name),
        tabBarActiveTintColor: '#3B82F6', // blue-500
        tabBarInactiveTintColor: '#6b7280', // gray-500
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb', // gray-200
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Menu"
        component={HomeStack}
        options={{
          tabBarLabel: 'Inicio',
        }}
      />
      
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{
          tabBarLabel: 'Nosotros',
        }}
      />
      
      <Tab.Screen
        name="Locations"
        component={LocationsScreen}
        options={{
          tabBarLabel: 'Ubicación',
        }}
      />
      
      <Tab.Screen
        name="Contact"
        component={ContactScreen}
        options={{
          tabBarLabel: 'Contacto',
        }}
      />
      
      <Tab.Screen
        name="Cart"
        component={CartStack}
        options={{
          tabBarLabel: 'Carrito',
        }}
      />
      
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Cuenta',
        }}
      />
    </Tab.Navigator>
  );
};