import React, {Component} from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Profile from "../screens/Profile";
import Logout from '../screens/Logout';
import StackNavigator from './StackNavigator';


const Drawer = createDrawerNavigator();

export default class DrawerNavigator extends Component {
    render() {
        return(
            <Drawer.Navigator
            initialRouteName="Home">
                <Drawer.Screen name="Home" component={StackNavigator} />
                <Drawer.Screen name="Profile" component={Profile} />
                <Drawer.Screen name="Logout" component={Logout} />
            </Drawer.Navigator>
        )
    }
    
}


