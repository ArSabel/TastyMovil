import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import tw from 'twrnc';
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
} from '../screens';

const Tab = createBottomTabNavigator();

interface TabIconProps {
  focused: boolean;
  color: string;
  size: number;
}

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
        component={SectionsScreen}
        options={{
          tabBarLabel: 'Menú',
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
          tabBarLabel: 'Ubicaciones',
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
        component={CartScreen}
        options={{
          tabBarLabel: 'Carrito',
        }}
      />
      
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Mi Cuenta',
        }}
      />
    </Tab.Navigator>
  );
};