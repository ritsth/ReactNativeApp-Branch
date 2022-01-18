import React from 'react';
import {
    StyleSheet, Text, Button,
    View, Alert, Image, SafeAreaView,
    TouchableOpacity, TouchableWithoutFeedback,
    TouchableHighlight, Platform, Dimensions,
    ImageBackground, Linking
} from 'react-native';
import { useDimensions, useDeviceOrientation } from '@react-native-community/hooks';
import { NativeRouter, Route, Link } from 'react-router-native';

import colors from '../config/colors';

export default function Welcome (props) {
    const handle = () => { alert(' button Pressed!') }
    const { landscape } = useDeviceOrientation();
    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground style={styles.bgImage} resizeMode="contain"
                source={{ uri: 'https://i.pinimg.com/736x/35/b9/cb/35b9cbd5b61a78f15aefbe63d339ac18.jpg' }}>
                <Image source={require('../assets/logo1.png')}
                    style={{
                        margin: 13,
                        marginTop: 40,
                        flexDirection: "row",
                        alignSelf: "center",
                        width: 120,
                        height: 120
                    }}
                />
                <Text
                    style={{
                        flex: 1,
                        flexDirection: "column",
                        alignSelf: "center",
                        marginLeft:10
                    }}>
                   Share your plant world here
                </Text>
                <Link to="/login"
                    style={{
                        alignSelf: "flex-end",
                        width: "100%",
                        height: "10%",
                        backgroundColor: colors.primary
                    }}
                    underlayColor={colors.Linkunderlay}>

                    <Text style={styles.logins}>
                        Login
                    </Text>
            
                </Link>
                <Link to="/signin"
                    style={{
                        alignSelf: "flex-end",
                        width: "100%",
                        height: "10%",
                        backgroundColor: colors.secondary
                    }}
                    underlayColor={colors.Linkunderlay}>

                    <Text style={styles.logins}
                    >Sign in</Text>

                </Link>

            </ImageBackground>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bgImage: {
        flex: 1,
        justifyContent: "center",
        width: 435,
        height:650

    },
    logins: {
        fontSize: 26,
        fontFamily: "Helvetica",
        fontWeight: "bold",
        marginTop: 20,
        alignSelf: "center",
        marginRight:25,
        color: colors.TextLavender,

    },

});