import React, {Component} from "react";
import { StyleSheet, Text, View, Platform } from 'react-native';
import { signOut, getAuth } from "firebase/auth";

export default class Logout extends Component {
    componentDidMount() {
        const auth = getAuth();
        signOut(auth)
            .then(() => {
                this.props.navigation.replace('Login');
            })
            .catch((error) => {
                Alert.alert(error.message);
            })
    }

    render() {
        return(
            <View style={styles.container}>
                <Text>Logout</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    }
})