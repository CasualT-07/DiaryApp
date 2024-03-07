import React, {Component} from "react";
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { getAuth } from 'firebase/auth';
import {ref, onValue } from 'firebase/database';
import db from '../config';
import { RFValue } from "react-native-responsive-fontsize";
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

let customFonts = {
    "ProtestRiot" : require('../assets/fonts/ProtestRiot-Regular.ttf')
}

export default class EntryCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            entry_id: Object.keys(this.props.entry),
            entry_data: this.props.entry,
            fontsLoaded: false,
            light_theme: null,
            color: '',
        }
    }

    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({fontsLoaded: true})
    }

    async fetchUser() {
        let theme, color;
        const auth = getAuth();
        const userId = auth.currentUser.uid;

        onValue(ref(db, '/users/' + userId), (snapshot) => {
            theme = snapshot.val().current_theme;
            color = snapshot.val().color;
            this.setState({light_theme: theme == 'light' ? true : false, color: color})
         })
    }

    componentDidMount() {
        this._loadFontsAsync();
        this.fetchUser();
        console.log('entry')
    }

    render() {
        if(this.state.fontsLoaded) {
            SplashScreen.hideAsync();

            let content = this.state.entry_data[this.state.entry_id].content;
            let preview = content.slice(0, content.indexOf("\\n")).substring(0,30)
            //console.log(preview)

            return(
                <TouchableOpacity style={[styles.cardContainer, {backgroundColor: this.state.color}]} onPress={() => this.props.navigation.navigate('Entry', {entry: this.state.entry_data[this.state.entry_id]})}>
                    <Text style={styles.dateText}>{this.state.entry_data[this.state.entry_id].date}</Text>
                    <Text style={styles.timeText}>{this.state.entry_data[this.state.entry_id].time}</Text>
                    <Text style={styles.titleText}>{this.state.entry_data[this.state.entry_id].title}</Text>
                    <Text style={styles.previewText}>{preview}</Text>  
                </TouchableOpacity>
            )
        }
      
    }
}

const styles = StyleSheet.create({
    cardContainer: {
        flex: 1,
        margin: RFValue(13),
        //backgroundColor: this.state.color,
        //backgroundColor: 'white',
        borderRadius: RFValue(20),
        padding: RFValue(8),
        paddingBottom: RFValue(20),   
    },
    titleText: {
        marginLeft: RFValue(10),
        color: 'white',
        fontSize: RFValue(22),
        fontFamily: 'ProtestRiot',
    },
    dateText: {
        marginLeft: RFValue(10),
        color: 'white',
        fontSize: RFValue(25),
        fontFamily: 'ProtestRiot',
    },
    timeText: {
        marginLeft: RFValue(10),
        color: 'white',
        fontSize: RFValue(25),
        fontFamily: 'ProtestRiot',
    },
    previewText: {
        marginLeft: RFValue(20),
        marginTop: RFValue(10),
        color: 'white',
        fontSize: RFValue(15),
        fontFamily: 'ProtestRiot',
    }

})