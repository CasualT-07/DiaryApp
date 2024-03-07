import { createStackNavigator } from "@react-navigation/stack";
import React from 'react';
import CreateEntry from '../screens/CreateEntry';
import Home from '../screens/Home';
import Entry from '../screens/Entry';

const Stack = createStackNavigator();

const StackNavigator = () => {
    return(
        <Stack.Navigator
        initialRouteName="MyHome"
        screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="CreateEntry" component={CreateEntry}/>
            <Stack.Screen name="MyHome" component={Home}/>
            <Stack.Screen name="Entry" component={Entry}/>
        </Stack.Navigator>
    )
}

export default StackNavigator;