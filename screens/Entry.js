import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import db from '../config';
import {getAuth} from 'firebase/auth';
import {onValue, ref} from 'firebase/database';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

let customFonts = {
    "ProtestRiot" : require('../assets/fonts/ProtestRiot-Regular.ttf')
}

export default class Entry extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fontsLoaded: false,
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

    render() {
        if (this.state.fontsLoaded) {
            SplashScreen.hideAsync();

            return(
                <View style={this.state.light_theme? styles.containerLight : styles.container}>
                    <Text style={this.state.light_theme ? styles.dateTextLight : styles.dateText}>{this.props.route.params.entry.date}</Text>
                    <Text style={this.state.light_theme ? styles.timeTextLight : styles.timeText}>{this.props.route.params.entry.time}</Text>
                    <Text style={this.state.light_theme ? styles.titleTextLight : styles.titleText}>{this.props.route.params.entry.title}</Text>
                    <Text style={this.state.light_theme ? styles.contentTextLight : styles.contentText}>{this.props.route.params.entry.content}</Text>
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
        backgroundColor: 'white',
    },
    dateText: {
        color: 'white',
        fontSize: RFValue(25),
        marginLeft: RFValue(10),
        marginTop: RFValue(10),
        fontFamily: 'ProtestRiot',
    },
    dateTextLight: {
        color: 'black',
        fontSize: RFValue(25),
        marginLeft: RFValue(10),
        marginTop: RFValue(10),
        fontFamily: 'ProtestRiot',
    },
    timeText: {
        color: 'white',
        fontSize: RFValue(25),
        marginLeft: RFValue(10),
        marginBottom: RFValue(10),
        fontFamily: 'ProtestRiot',
    },
    timeTextLight: {
        color: 'black',
        fontSize: RFValue(25),
        marginLeft: RFValue(10),
        marginBottom: RFValue(10),
        fontFamily: 'ProtestRiot',
    },
    titleText: {
        color:'white',
        fontSize: RFValue(20),
        marginLeft: RFValue(10),
        fontFamily: 'ProtestRiot',
    },
    titleTextLight: {
        color:'black',
        fontSize: RFValue(20),
        marginLeft: RFValue(10),
        fontFamily: 'ProtestRiot',
    },
    contentText: {
        color:'white',
        fontSize: RFValue(20),
        marginLeft: RFValue(10),
        marginTop: RFValue(25),
        fontFamily: 'ProtestRiot',
    },
    contentTextLight: {
        color:'black',
        fontSize: RFValue(20),
        marginLeft: RFValue(10),
        marginTop: RFValue(25),
        fontFamily: 'ProtestRiot',
    },

})