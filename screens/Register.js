import React, {Component} from "react";
import { StyleSheet, Text, View, Platform, TextInput, TouchableOpacity, Alert } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
import { ref, set } from 'firebase/database';
import db from '../config'

SplashScreen.preventAutoHideAsync();

let customFonts = {
    "ProtestRiot" : require('../assets/fonts/ProtestRiot-Regular.ttf')
}

export default class RegisterScreen extends Component {
    constructor() {
        super();
        this.state = {
            fontsLoaded: false,
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
        }
    }

    registerUser = (email, password, confirmPassword) => {
        if (password == confirmPassword) {
            const auth = getAuth();
            createUserWithEmailAndPassword(auth,email,password)
                .then((userCredential) => {
                    Alert.alert('User registered!');
                    console.log(userCredential.user.uid);
                    this.props.navigation.replace('Login');
                    
                    const dbRef = ref(db , '/users/' + userCredential.user.uid);

                    set(dbRef, {
                        email: userCredential.user.email,
                        current_theme: 'dark',
                        username: this.state.username,
                        entries: [],
                        color: '#c828af',
                        colorLabel: 'Pink'
                    })
                })
                .catch((error) => {
                    Alert.alert(error.message);
                })
        } else {
            Alert.alert("Passwords do not match")
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
            const {email, password, confirmPassword} = this.state;

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
                    />

                    <TextInput
                        style={styles.textInput}
                        onChangeText = {(text) => this.setState({username: text})}
                        placeholder = {'Enter Your First Name'}
                        placeholderTextColor={'#FFFFFF'}
                    />

                    <TextInput
                        style={styles.textInput}
                        onChangeText={(text) => this.setState({password: text})}
                        placeholder = {'Enter Password'}
                        placeholderTextColor={'#FFFFFF'}
                        secureTextEntry  
                    />

                    <TextInput
                        style={styles.textInput}
                        onChangeText={(text) => this.setState({confirmPassword: text})}
                        placeholder = {'Confirm Password'}
                        placeholderTextColor={'#FFFFFF'}
                        secureTextEntry  
                    />

                    <TouchableOpacity style={styles.button}
                        onPress={() => {
                            this.registerUser(this.state.email, this.state.password, this.state.confirmPassword);
                            this.props.navigation.navigate('Login')
                        }}>
                        <Text style={styles.text}>Register</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.login} onPress={() => this.props.navigation.navigate('Login')}>
                        <Text style={styles.loginText}>Login?</Text>
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
    text: {
        color: 'black',
        fontFamily: 'ProtestRiot',
        alignSelf: 'center',
        fontSize: RFValue(20)
    },
    titleText: {
        color: 'white',
        fontSize: RFValue(25),
        fontFamily: 'ProtestRiot',
    },
    textInput:{
        fontFamily: 'ProtestRiot',
        padding: RFValue(5),
        borderWidth: RFValue(1),
        borderColor: 'white',
        borderRadius: RFValue(10),
        marginTop: RFValue(10),
        color: 'white'
    },
    titleContainer: {
        flex: .5,
        flexDirection: 'row'
    },
    login: {
        marginTop: RFValue(10),
        alignItems: 'center'
    },
    button: {
        backgroundColor: 'white',
        width: RFValue(250),
		height: RFValue(50),
        justifyContent: 'center',
        borderRadius: RFValue(10),
        marginTop: RFValue(18)
    },
    loginText: {
        color: 'white',
        fontFamily: 'ProtestRiot',
    }
})