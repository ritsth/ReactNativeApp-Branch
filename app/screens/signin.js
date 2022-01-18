import React from 'react';
import {
    StyleSheet,
    useEffect,
    useState, KeyboardAvoidingView,
    Text, Button, Keyboard,
    View, Alert, Image, SafeAreaView,
    TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight,
    Platform, Dimensions, ImageBackground, TextInput
} from 'react-native';
import { useDimensions, useDeviceOrientation } from '@react-native-community/hooks';
import { NativeRouter, Route, Link } from 'react-router-native';
import axios from 'axios';

import colors from '../config/colors';

export default function SigninPage(props) {

    const [username, onChangeUsername] = React.useState(null);
    const [password, onChangePassword] = React.useState(null);
    const [firstname, onChangeFirstname] = React.useState(null);
    const [lastname, onChangeLastname] = React.useState(null);
    const [email, onChangeEmail] = React.useState(null);
    const [confirmpassword, onChangeConfirmPassword] = React.useState(null);
    const history = useHistory();

    const [user, setUser] = React.useState({
        username: '',
    });
    const [userId, setUserId] = React.useState({
        id: ''
    });
    const [token, setToken] = React.useState({
        access_token: ''
    })
    const readData = async () => {
        try {
            var refresh_token = await AsyncStorage.getItem('refresh_token');
            var access_token = await AsyncStorage.getItem('access_token');
            setToken({ access_token })
        } catch (e) {
            alert(e);
            alert('Failed to fetch the data from storage');
        }
    }
    const baseURL = 'https://branchappxzy.herokuapp.com/';
    const axiosInstance = axios.create({
        baseURL: baseURL,
        timeout: 7000,
        headers: {
            Authorization: token.access_token
                ? 'JWT ' + token.access_token
                : null,
            'Content-Type': 'application/json',
            accept: 'application/json',
        },
    });
    React.useEffect(() => {
        readData()

    }, []);

    const handleSubmit = (event) => {
        axiosInstance
            .post('users/', {
                username: username,
                first_name: first_name,
                last_name: last_name,
                email: email,
                password:password
            })
            .then((res) => {
                history.push('/login');
            })
            .catch(err => {
                alert(err)
            });
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView >
                <ImageBackground style={styles.bgImage} resizeMode="contain"
                    source={{ uri: 'https://i.pinimg.com/564x/34/4c/ae/344caefd02f3689d50c53f779eacf1f4.jpg' }}>
                    <View style={styles.options}>
                    <Link to="/"
                        style={{
                            marginLeft: 17,
                            backgroundColor: colors.primary,
                            width: 70,
                            height: 70
                        }}
                        underlayColor={colors.Linkunderlay}>
                        <Text style={styles.optionText}
                        >Back</Text>
                    </Link>
                    <Link to="/feed"
                        style={{
                            marginLeft:240,
                            backgroundColor: colors.secondary,
                            width: 70,
                            height: 70
                        }}
                        underlayColor={colors.Linkunderlay}>
                        <Text style={styles.optionText}>
                            Skip
                        </Text>
                    </Link>
                </View>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={styles.container}
                    >
                        <View style={styles.inner}>
                            <Text style={styles.header}>Sign up</Text>
                            <View style={styles.line1 }>
                                <TextInput
                             
                                    autoFocus={true}
                                    textContentType="name"
                                    style={styles.inputLine1}
                                    onChangeText={onChangeFirstname}
                                    placeholder="Firstname"
                                />
                                <TextInput
                                    textContentType="name"
                                    style={styles.inputLine1}
                                    onChangeText={onChangeLastname}
                                    placeholder="Lastname"
                                />
                            </View>

                            <TextInput
                                textContentType="username"
                                placeholder="Username"
                                style={styles.textInput}
                                onChangeText={onChangeUsername}
                            />
                            <TextInput
                                placeholder="Email"
                                textContentType="emailAddress"
                                style={styles.textInput}
                                onChangeText={onChangeEmail}
                            />
                            
                            <View style={styles.line2}>
                                <TextInput
                                    textContentType="password"
                                    style={styles.inputLine2}
                                    onChangeText={onChangePassword}
                                    placeholder="Password"
                                />
                                <TextInput
                                    textContentType="password"
                                    style={styles.inputLine2}
                                    onChangeText={onChangeConfirmPassword}
                                    placeholder="Confirm Password"
                             />
                            </View>
                            <View style={styles.btnContainer}>
                                <Button title="Submit" onPress={handleSubmit} />
                            </View>

                        </View>
                    </KeyboardAvoidingView>
                </ImageBackground>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    inner: {
        padding: 24,
        flex: 1,
        justifyContent: "space-around"
    },
    header: {
        fontSize: 36,
        marginBottom: 48,
        bottom:180,
    },
    textInput: {
        height: 40,
        borderColor:colors.black,
        borderBottomWidth: 1,
        marginBottom: 36,
        fontSize: 17,
        bottom:140,
    },
    btnContainer: {
        backgroundColor: colors.white,
        marginTop: 1,
        bottom: 25,
        right:20,
    },


    options: {
        flex: 1,
        flexDirection: "row",
    },
    line1: {
        flex: 1,
        flexDirection: "row",
    },
    line2: {
        flex: 1,
        flexDirection: "row",

    },
    inputLine1: {
        fontSize: 18,
        height: 25,
        borderColor: colors.black,
        borderBottomWidth: 1,
        margin: 4,
        marginBottom:36,
        bottom:200,
        width:195,
    },
    inputLine2: {
        fontSize: 18,
        height: 40,
        borderColor: colors.black,
        borderBottomWidth: 1,
        margin: 4,
        bottom: 150,
        width:195,

    },
    bgImage: {
        width: 455,
        height: 880

    },
    optionText: {
        alignSelf: "center",
        marginTop: "40%",
        fontSize: 15,
        fontFamily: "Helvetica",
        fontWeight: "bold",
        color: colors.black
    }
});