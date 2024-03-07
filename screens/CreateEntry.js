import React, {Component, useRef} from "react";
import { StatusBar } from "expo-status-bar";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, TextInput, View } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import {ref, onValue, set} from 'firebase/database';
import {getAuth} from 'firebase/auth';
import db from '../config';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

let customFonts = {
    "ProtestRiot" : require('../assets/fonts/ProtestRiot-Regular.ttf')
}

export default class CreateEntry extends Component {
    constructor() {
        super();
        this.state = {
            fontsLoaded: false,
            title: '',
            content: '',  
            light_theme: null,
        }
    }

    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({fontsLoaded: true})
    }

    async fetchUser() {
        let theme;
        const auth = getAuth();
        const userId = auth.currentUser.uid;

        onValue(ref(db, '/users/' + userId), (snapshot) => {
            theme = snapshot.val().current_theme;
            this.setState({light_theme: theme == 'light' ? true : false})
         })
    }

    componentDidMount() {
        this._loadFontsAsync();
        this.fetchUser();
       
    }

    submit = () => {
        const auth = getAuth();
        const userId = auth.currentUser.uid;

        let date = new Date().toString().substring(0,15)
        let time = new Date().toString().substring(16, 24)
        let key = (date + time).replace(/\s+/g, "").replaceAll(':', "")

        if (this.state.title || this.state.content) {
            let entryData = {
                date: date,
                time: time,
                title: this.state.title,
                content: this.state.content,
            }

            const dbRef = ref(db, '/users/' + userId + '/entries/' + key);
            set(dbRef, entryData);

            this.props.navigation.navigate('MyHome')
        } else {
            this.props.navigation.navigate('MyHome')
            console.log(key)
        }
    }

    render() {
        if(this.state.fontsLoaded) {
            SplashScreen.hideAsync();
            return(
            <View style={this.state.light_theme ? styles.containerLight : styles.container}>
                <SafeAreaView style={styles.droidSafeArea}/>  
                <ScrollView style={styles.scrollView}>
                <TextInput
                    style={this.state.light_theme ? styles.titleTextInputLight : styles.titleTextInput}
                    onChangeText = {(text) => this.setState({title: text})}
                    placeholder = {'Title'}
                    placeholderTextColor={'#a9a9a9'}
                />

                <TextInput
                    style={this.state.light_theme? styles.contentTextInputLight : styles.contentTextInput}
                    onChangeText = {(text) => this.setState({content: text})}
                    placeholder = {'Dear Diary...'}
                    placeholderTextColor={'#a9a9a9'}
                    multiline
                    numberOfLines={1}
                />
                </ScrollView>

                <TouchableOpacity style={styles.submitButton} onPress={() => this.submit()}>
                    <Text style={styles.submitText}>Done</Text>
                </TouchableOpacity>
                
            </View>
            )
        }
        
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    containerLight: {
        flex: 1,
        backgroundColor: 'white'
    },
    droidSafeArea: {
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : RFValue(35)
    },
    titleTextInput: {
        color: 'white',
        fontSize: RFValue(30),
        fontFamily: 'ProtestRiot',
        padding: RFValue(10),
    },
    titleTextInputLight: {
        color: 'black',
        fontSize: RFValue(30),
        fontFamily: 'ProtestRiot',
        padding: RFValue(10),
    },
    contentTextInput: {
        color: 'white',
        fontSize: RFValue(20),
        fontFamily: 'ProtestRiot',
        padding: RFValue(10),
        alignSelf: 'flex-start',
        width: '80%'
    },
    contentTextInputLight: {
        color: 'black',
        fontSize: RFValue(20),
        fontFamily: 'ProtestRiot',
        padding: RFValue(10),
        alignSelf: 'flex-start',
        width: '80%'
    },
    scrollView: {
        height: RFValue(100),        
    },
    submitButton: {
        backgroundColor: '#de22aa',
        borderRadius: RFValue(20),
        margin: RFValue(13),
        padding: RFValue(10),
        // position: 'absolute',
        // width: '50%',
        // alignSelf: 'center',
        // bottom: '5%'
    },
    submitText: {
        fontFamily: 'ProtestRiot',
        color: 'white',
        alignSelf: 'center',
        fontSize: RFValue(15)
    }
})