import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerNavigator from './navigation/DrawerNavigator';
import Login from './screens/Login';
import RegisterScreen from './screens/Register';

const Stack = createStackNavigator();

const StackNav = () => {
  return(
    <Stack.Navigator
    initialRouteName='Login'
    screenOptions={{
      headerShown: false,
      gestureEnabled: false,
    }}>
      <Stack.Screen name="Dashboard" component={DrawerNavigator}/>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  )
}

export default function App() {
  return(
    <NavigationContainer>
      <StackNav/>
    </NavigationContainer>
  )
}

