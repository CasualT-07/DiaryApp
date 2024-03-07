import React, {Component} from "react";
import { StyleSheet, Text, View, Platform, TouchableOpacity } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { FlatList } from "react-native-gesture-handler";
import EntryCard from "./EntryCard";
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

import {getAuth} from 'firebase/auth';
import {onValue, ref} from 'firebase/database';
import db from '../config';
import Entry from "./Entry";

SplashScreen.preventAutoHideAsync();

let customFonts = {
    "ProtestRiot" : require('../assets/fonts/ProtestRiot-Regular.ttf')
}

export default class Home extends Component {
    constructor() {
        super();
        this.state = {
            fontsLoaded: false,
            username: '',
            entries: [],
            light_theme: null,
            color: '',
        }
    }

    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({fontsLoaded: true})
    }

    async fetchUser() {
        let username, entries, theme, color;
        const auth = getAuth();
        const userId = auth.currentUser.uid;

        onValue(ref(db, '/users/' + userId), (snapshot) => {
            username = snapshot.val().username;
            entries = snapshot.val().entries;
            theme = snapshot.val().current_theme;
            color = snapshot.val().color;
            
            this.setState({username: username, light_theme: theme == 'light' ? true : false, color: color})

            if(entries) {
                const entriesArray = Object.entries(entries).map(([key, val]) => ({ [key]: val }))
                this.setState({entries: entriesArray})
            }
            
         })
    }

    componentDidMount() {
        this._loadFontsAsync();
        this.fetchUser();
        console.log('home')
    }

    renderEntries = () => {
        if (this.state.entries[0]) {
            //console.log('home screen')
            return(
                <FlatList
                data={this.state.entries}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
                />
            )

        } else {
            return (
                <TouchableOpacity style={styles.newEntryBar} onPress={() => this.props.navigation.navigate('CreateEntry')}>
                    <Text style={styles.newEntryText}>Create your first Entry!</Text>
                </TouchableOpacity>
            )
            
        }
    }

    renderItem = ({item: entry}) => {
        return <EntryCard entry={entry} navigation={this.props.navigation} />
    }
    
    keyExtractor = (item, index) => index.toString();

    render() {
        if (this.state.fontsLoaded && this.state.username) {
            SplashScreen.hideAsync();
            return(
                <View style={this.state.light_theme ? styles.containerLight : styles.container}>
                    <SafeAreaView style={styles.droidSafeArea}/>
                    
                    <View style={styles.welcomeContainer}>
                        <Ionicons name={"book"} size={RFValue(30)} color={this.state.light_theme ? "black" : "white"} style={{padding:RFValue(10)}}/>
                        <Text style={this.state.light_theme? styles.welcomeTextLight : styles.welcomeText}>Welcome {this.state.username}</Text>
                    </View>
                    
                    {this.renderEntries()}

                    <TouchableOpacity onPress={() => this.props.navigation.navigate('CreateEntry')} style={styles.addEntryButton}>
                        <Ionicons name={"add-circle-sharp"} color={this.state.color} size={RFValue(60)}/>
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
    },
    containerLight: {
        flex: 1,
        backgroundColor: 'white',
    },
    welcomeContainer: {
        flex: .2,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center'
    },
    welcomeText: {
        color: 'white',
        fontSize: RFValue(20),
        fontFamily: 'ProtestRiot',
    },
    welcomeTextLight: {
        color: 'black',
        fontSize: RFValue(20),
        fontFamily: 'ProtestRiot',
    },
    newEntryBar: {
        backgroundColor: '#a9a9a9',
        borderRadius: RFValue(20),
        margin: RFValue(13),
        padding: RFValue(15),
    },
    newEntryText: {
        color: 'white',
        fontSize: RFValue(18),
        fontFamily: 'ProtestRiot',
        alignSelf: 'center',
    },
    addEntryButton: {
        //alignSelf: 'flex-end',
        position: 'absolute',
        right: '2%',
        bottom: '5%'

    },
})