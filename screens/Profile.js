import React, {Component, Fragment} from "react";
import { StyleSheet, Text, View, Platform, TouchableOpacity, Switch, TextInput, Alert } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import DropDownPicker from "react-native-dropdown-picker";
import {getAuth} from 'firebase/auth';
import {onValue, ref, update} from 'firebase/database';
import db from '../config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

SplashScreen.preventAutoHideAsync();

let customFonts = {
    "ProtestRiot" : require('../assets/fonts/ProtestRiot-Regular.ttf')
}

export default class Profile extends Component {
    constructor() {
        super();
        this.state = {
            fontsLoaded: false,
            username: '',
            light_theme: false,
            color: '',
            colorLabel: '',
            dropDownHeight: 40,
            editUsername: false,
        }
    }

    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({fontsLoaded: true})
    }

    async fetchUser() {
        let theme, username, colorLabel, color, light_theme;
        const auth = getAuth();
        const userId = auth.currentUser.uid;

        onValue(ref(db, '/users/' + userId), (snapshot) => {
            username = snapshot.val().username;
            theme = snapshot.val().current_theme;
            color = snapshot.val().color; 
            colorLabel = snapshot.val().colorLabel;
            light_theme = theme == 'light' ? true: false

            this.setState({
                username : username,
                light_theme: light_theme,
                color: color,
                colorLabel: colorLabel,
            })
        })
    }

    componentDidMount() {
        this._loadFontsAsync();
        this.fetchUser();
        
    }

    toggleSwitch() {
        const previous_state = this.state.light_theme;
        const theme = this.state.light_theme ? 'dark' : 'light';

        const auth = getAuth();
        const user = auth.currentUser;

        if(user) {
            var updates = {};
            updates['users/' + user.uid + '/current_theme'] = theme;

            //console.log(updates);
            const dbRef = ref(db, '/');
            update(dbRef, updates);

            this.setState({light_theme: !previous_state})
            //console.log(theme);
        }
    }

    updateColor = async (item) =>  {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {

            this.setState({color: item.value, colorLabel: item.label});

            var updates = {};
            updates['users/' + user.uid + '/color'] = item.value;
            updates['users/' + user.uid + '/colorLabel'] = item.label;
            
            const dbRef = ref(db, '/');
            update(dbRef, updates);
        }
    }

    updateUsername = async (name) => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            var updates = {};
            updates['users/' + user.uid + '/username'] = name;

            const dbRef = ref(db, '/');
            update(dbRef, updates)
        }
    }

    displayUsername = () => {
        if (this.state.editUsername) {
            var newName = '';
            return(
                <Fragment>
                    <TextInput
                    style={styles.editUsername}
                    onChangeText={(text) => {newName = text}}
                    placeholder={'Enter Name'}
                    placeholderTextColor={'#a9a9a9'}
                    autoFocus
                    />

                    <TouchableOpacity onPress={() => {
                        if(newName) {
                            this.updateUsername(newName); this.setState({editUsername: false})
                        } else {
                            Alert.alert('Please Enter Name')
                        }
                    }}>
                        <Ionicons name="checkmark" size={RFValue(20)} color={'white'}/>
                    </TouchableOpacity>

                </Fragment>
            )
        } else {
            return(
                <Text style={this.state.light_theme ? styles.nameTextLight: styles.nameText}>{this.state.username}</Text>
            )
        }
    }

    render() {
        if (this.state.fontsLoaded && this.state.username) {
            SplashScreen.hideAsync();
            
            return(
                <View style={this.state.light_theme ? styles.containerLight : styles.container}>
                    <SafeAreaView style={styles.droidSafeArea}/>

                    <View style={this.state.light_theme ? styles.itemContainerLight : styles.itemContainer}>

                        <View style={[styles.profilePicture, {backgroundColor: this.state.color}]}>
                            <Text style={styles.pfpText}>{this.state.username[0].toUpperCase()}</Text>
                        </View>

                        {this.displayUsername()}
                        
                        <TouchableOpacity onPress={() => this.setState({editUsername: true})} style={{padding: RFValue(20)}}>
                            <Ionicons name={'pencil-outline'} size={RFValue(20)} color={'white'}/>
                        </TouchableOpacity>

                    </View>

                    <View style={this.state.light_theme ? styles.itemContainerLight : styles.itemContainer}>
                        <Text style={this.state.light_theme ? styles.nameTextLight: styles.nameText}>Theme (dark/light)</Text>

                        <Switch
                            style={{transform: [{scaleX: 1.3}, {scaleY: 1.3}], padding: RFValue(10)}}
                            trackColor={{false: 'white', true: 'black'}}
                            thumbColor={'white'}
                            ios_backgroundColor='#3e3e3e'
                            onValueChange={() => this.toggleSwitch()}
                            value={this.state.light_theme}
                        /> 
                    </View>

                    <View style={this.state.light_theme ? styles.itemContainerLight : styles.itemContainer}>
                        <Text style={this.state.light_theme ? styles.nameTextLight: styles.nameText}>Colour</Text>
                        <DropDownPicker
                            items={[
                                {label: "Pink", value: "#c828af"},
                                {label: "Cyan", value: "#00b7eb"},
                                {label: "Green", value: "#32cd32"},
                                {label: "Gray", value: "gray"},
                            ]}

                            defaultValue={this.state.color}

                            theme={this.state.light_theme ? "LIGHT" : "DARK"}

                            open={this.state.dropDownHeight == 170 ? true : false}

                            onOpen={() => {
                                this.setState({dropDownHeight: 170})
                            }}

                            onClose={() => {
                                this.setState({dropDownHeight: 40})
                            }}

                            style={styles.dropDownPicker}

                            placeholder={this.state.colorLabel}
                            
                            textStyle={{color: this.state.light_theme ? '#555555' : 'white'}}

                            onSelectItem={(item) => {this.updateColor(item)}}
                        />
                    </View>
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
    itemContainer: {
        flex: .1,
        flexDirection: 'row',
        backgroundColor: 'gray',
        borderRadius: RFValue(20),
        margin: RFValue(5),
        alignItems: 'center',
        //justifyContent: 'center',
    },
    itemContainerLight: {
        flex: .1,
        flexDirection: 'row',
        backgroundColor: '#d3d3d3',
        borderRadius: RFValue(20),
        margin: RFValue(5),
        alignItems: 'center',
        //justifyContent: 'center',
    },
    profilePicture: {
        //backgroundColor: 'blue',
        height: RFValue(50),
        width: RFValue(50),
        borderRadius: RFValue(25),
        justifyContent: 'center',
        marginLeft: RFValue(5),
    },
    pfpText: {
        color: 'white',
        fontSize: RFValue(25),
        alignSelf: 'center',
        fontFamily: 'ProtestRiot',
    },
    nameText: {
        color: 'white',
        fontFamily: 'ProtestRiot',
        marginLeft: RFValue(10),
        fontSize: RFValue(20)
    },
    nameTextLight: {
        color: '#555555',
        fontFamily: 'ProtestRiot',
        marginLeft: RFValue(10),
        fontSize: RFValue(20)
    },
    dropDownPicker: {
        width: '50%',
        margin: RFValue(20)
    },
    editUsername: {
        fontFamily: 'ProtestRiot',
        padding: RFValue(5),
        fontSize: RFValue(20),
        color: 'white'
    }
})