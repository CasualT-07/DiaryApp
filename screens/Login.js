import React, {Component} from "react";
import { StyleSheet, Text, View, Platform, TouchableOpacity, TextInput, Alert } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import db from '../config';

SplashScreen.preventAutoHideAsync();

let customFonts = {
    "ProtestRiot" : require('../assets/fonts/ProtestRiot-Regular.ttf')
}

export default class Login extends Component {
    constructor() {
        super();
        this.state = {
            fontsLoaded: false,
            email: '',
            password: '',
            userSignedIn: false
        }
    }

    signIn = async (email, password) => {
        const auth = getAuth();

        if (email, password) {
            signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    this.props.navigation.replace('Dashboard');
                })
                .catch((error) => {
                    Alert.alert(error.message)
                })
        } else {
            Alert.alert('All fields are required!')
        }
         
    }

    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({fontsLoaded: true})
    }

    componentDidMount() {
        this._loadFontsAsync();
    }

    render() {

        if (this.state.fontsLoaded) {
            SplashScreen.hideAsync();
            const {email, password} = this.state;

            return(
                <View style={styles.container}>
                    <SafeAreaView style={styles.droidSafeArea}/>

                    <View style={styles.titleContainer}>
                        <Ionicons name={"book"} size={RFValue(30)} color={"white"} style={{padding:RFValue(10)}}/>
                        <Text style={styles.titleText}>Diary App</Text>
                    </View>

                    <TextInput
                        style={styles.textInput}
                        onChangeText = {(text) => this.setState({email: text})}
                        placeholder = {'Enter Email'}
                        placeholderTextColor={'#FFFFFF'}
                        autoFocus
                    />

                    <TextInput
                        style={styles.textInput}
                        onChangeText={(text) => this.setState({password: text})}
                        placeholder = {'Enter Password'}
                        placeholderTextColor={'#FFFFFF'}
                        secureTextEntry  
                    />

                    <TouchableOpacity style={styles.button}
                        onPress={() => this.signIn(this.state.email, this.state.password)}>
                        <Text style={styles.text}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.newUser} onPress={() => this.props.navigation.navigate('Register')}>
                        <Text style={styles.newUserText}>New User?</Text>
                    </TouchableOpacity>
                </View>
            )
        }
        
    }
    
}

const styles = StyleSheet.create({
    droidSafeArea: {
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : RFValue(35)
    },
    container: {
        flex: 1,
        backgroundColor: 'black',
        padding: 50,
        justifyContent: 'center'
    },
    button: {
        backgroundColor: 'white',
        width: RFValue(250),
		height: RFValue(50),
        justifyContent: 'center',
        borderRadius: RFValue(10),
        marginTop: RFValue(18),
    },
    text: {
        color: 'black',
        alignSelf: 'center',
        fontFamily: 'ProtestRiot',
        fontSize: RFValue(20),
    },
    titleContainer: {
        flex: .5,
        flexDirection: 'row',
        
    },
    titleText: {
        color: 'white',
        fontSize: RFValue(25),
        fontFamily: 'ProtestRiot',
    },
    textInput: {
        fontFamily: 'ProtestRiot',
        padding: RFValue(5),
        borderWidth: RFValue(1),
        borderColor: 'white',
        borderRadius: RFValue(10),
        marginTop: RFValue(10),
        color: 'white'
    },
    newUser: {
        marginTop: RFValue(10),
        alignItems: 'center'
    },
    newUserText: {
        color: 'white',
        fontFamily: 'ProtestRiot',
    }
})