import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DashboardScreen } from '../screens/DashboardScreen';
import { DocumentsScreen } from '../screens/DocumentsScreen';
import { PetitionsScreen } from '../screens/PetitionsScreen';
import { DeadlinesScreen } from '../screens/DeadlinesScreen';
import { ChatScreen } from '../screens/ChatScreen';

const Tab = createBottomTabNavigator();

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#6b7280',
        headerStyle: { backgroundColor: '#fff' },
        headerTitleStyle: { fontWeight: '600', color: '#111827' },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Início' }}
      />
      <Tab.Screen
        name="Documents"
        component={DocumentsScreen}
        options={{ title: 'Documentos' }}
      />
      <Tab.Screen
        name="Petitions"
        component={PetitionsScreen}
        options={{ title: 'Petições' }}
      />
      <Tab.Screen
        name="Deadlines"
        component={DeadlinesScreen}
        options={{ title: 'Prazos' }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{ title: 'Assistente' }}
      />
    </Tab.Navigator>
  );
}
