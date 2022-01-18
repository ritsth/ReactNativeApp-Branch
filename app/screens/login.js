import React from 'react';
import {
    StyleSheet, 
    Text, Button, AsyncStorage,
    View, Alert, Image, SafeAreaView, KeyboardAvoidingView,
    TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight,
    Platform, Dimensions, ImageBackground, TextInput, Keyboard
} from 'react-native';
import { NativeRouter, Route, Link, useHistory } from 'react-router-native';
import { useNavigation, useLinkTo, } from '@react-navigation/native';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

import colors from '../config/colors';

export default function LoginPage(props) {
    const [username, onChangeUsername] = React.useState(null);
    const [password, onChangePassword] = React.useState(null);
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
            alert(e);;
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

    const handleSubmit = async (event) => {
        axiosInstance
            .post('token/', {
                username: username,
                password: password,
            })
            .then(async (res) => {
                try {
                    var access_token = await AsyncStorage.setItem('access_token', res.data.access);
                    var refresh_token = await AsyncStorage.setItem('refresh_token', res.data.refresh);
                    var username_data = await AsyncStorage.setItem('@username', username);
                    /*var decode = jwt_decode(refresh_token);
                    await AsyncStorage.setItem('current_user_id', decode.user_id);*/
                    axios.defaults.headers['Authorization'] =
                        'JWT ' + access_token;
                    alert('Data successfully saved');
                    history.push('/feed')
                } catch (e) {
                    alert(e)
                }

                //console.log(res);

            })
    }; 




    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
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
                                marginLeft: 240,
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
                                <Text style={styles.header}>Login</Text>

                                <TextInput 
                                    autoFocus={true}
                                    textContentType="username"
                                    placeholder="Username"
                                    style={styles.textInput}
                                    onChangeText={onChangeUsername}
                                />
                                <TextInput 
                                    textContentType="password"
                                    placeholder="Password"
                                    style={styles.textInput}
                                    onChangeText={onChangePassword}
                                />
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
    options: {
        flex: 1,
        flexDirection: "row",
  
    },

    inner: {
        padding: 24,
        flex: 1,
        justifyContent: "space-around"
    },
    header: {
        fontSize: 36,
        marginBottom: 50,
        bottom:70,
    },
    textInput: {
        fontSize:17,
        height: 40,
        borderColor: colors.black,
        borderBottomWidth: 1,
        marginBottom: 36,
        bottom: 100,
        margin: 30,
        width: 400,
    },
    btnContainer: {
        alignSelf: "center",
        backgroundColor: colors.white,
        marginTop: 12,
        right: 20,
        bottom: 80,
        width:500,
    },

    container: {
        flex: 1,
    },
    bgImage: {
        flex: 1,
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