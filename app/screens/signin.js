import React from 'react';
import {
    StyleSheet,
    useEffect,
    useState, KeyboardAvoidingView,
    Text, Button, Keyboard,AsyncStorage,
    View, Alert, Image, SafeAreaView,
    TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight,
    Platform, Dimensions, ImageBackground, TextInput
} from 'react-native';
//import { AsyncStorage} from '@react-native-community/async-storage';
import { useDimensions, useDeviceOrientation } from '@react-native-community/hooks';
import { NativeRouter, Route, Link,useHistory } from 'react-router-native';
import axios from 'axios';

import colors from '../config/colors';


const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;
const mathBox=((screenWidth+screenHeight)/20);
const mathFontInputs=((screenWidth+screenHeight)/70);
const mathFont=((screenWidth+screenHeight)/80);
const mathFontLogin=((screenWidth+screenHeight)/40);

export default function SigninPage(props) {

    const [username, onChangeUsername] = React.useState(null);
    const [password, onChangePassword] = React.useState(null);
    const [firstname, onChangeFirstname] = React.useState(null);
    const [lastname, onChangeLastname] = React.useState(null);
    const [email, onChangeEmail] = React.useState(null);
    const [confirmpassword, onChangeConfirmPassword] = React.useState(null);
    const history = useHistory();
    
    /*
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
    */

    const baseURL = 'https://branchappxzy.herokuapp.com/';
    const axiosInstance = axios.create({
        baseURL: baseURL,
        timeout: 7000,
        /*
        headers: {
            Authorization: token.access_token
                ? 'JWT ' + token.access_token
                : null,
            'Content-Type': 'application/json',
            accept: 'application/json',
        },*/
    });
    React.useEffect(() => {
        //readData()

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
    
    const handlePushLogin=()=>{
        history.push('/login');
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View >
                <ImageBackground style={styles.bgImage} //resizeMode="contain"
                    source={{ uri: 'https://i.pinimg.com/564x/34/4c/ae/344caefd02f3689d50c53f779eacf1f4.jpg' }}>
                    <View style={styles.options}>
                    <Link to="/"
                        style={{
                            marginTop:"10%",
                            marginRight:`30%`,
                            backgroundColor: colors.primary,
                            width: mathBox,
                            height:mathBox,
                            justifyContent:"center",
                        }}
                        underlayColor={colors.Linkunderlay}>
                        <Text style={styles.optionText}
                        >Back</Text>
                    </Link>
                    <Link to="/feed"
                        style={{
                            marginTop:"10%",
                            marginLeft:`30%`,
                            backgroundColor: colors.secondary,
                            width: mathBox,
                            height:mathBox,
                            justifyContent:"center",
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
                                <Button title="Signin" onPress={handleSubmit} />
                            </View>
                            <Text
                                    style={{
                                        alignSelf:"center",
                                    }}
                                >
                                    <Button color="black" 
                                    title="Already have an account?"/>
                                    
                                    <Button title="Click here" 
                                    onPress={handlePushLogin} />                              
                                </Text>
                        </View>
                    </KeyboardAvoidingView>
                </ImageBackground>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    inner: {
        padding:"10%",
        flex: 1,
        justifyContent: "space-around"
    },
    header: {
        fontSize:mathFontLogin,
        //marginBottom: 48,
        //bottom:180,
    },
    textInput: {
        height: 30,
        borderColor:colors.black,
        borderBottomWidth: 1,
        //marginBottom: 36,
        fontSize: mathFontInputs,
        width:"100%"
        //bottom:140,
    },
    btnContainer: {
        backgroundColor: colors.white,
        alignSelf: "center",
        width:"100%",
        fontSize:mathFontInputs
        //marginTop: 1,
        //bottom: 25,
        //right:20,
    },


    options: {
        justifyContent:"center",
        flexDirection: "row",
    },
    line1: {
        //flex: 1,
        flexDirection: "row",
    },
    line2: {
        //flex: 1,
        flexDirection: "row",

    },
    inputLine1: {
        fontSize: mathFontInputs,
        height:30,
        borderColor: colors.black,
        borderBottomWidth: 1,
        margin: "1%",
        //marginBottom:36,
        //bottom:200,
        width:"50%",
    },
    inputLine2: {
        fontSize:mathFontInputs,
        height: 30,
        borderColor: colors.black,
        borderBottomWidth: 1,
        margin:"1%",
        //bottom: 150,
        width:"50%",

    },
    bgImage: {
        width:"100%",
        height:"100%"

    },
    optionText: {
        alignSelf: "center",
        fontSize:mathFont,
        fontFamily: "Helvetica",
        fontWeight: "bold",
        color: colors.black
    }
});