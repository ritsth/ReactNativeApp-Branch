import React from 'react';
import {
    StyleSheet, 
    Text, Button, AsyncStorage,
    View, Alert, Image, SafeAreaView, KeyboardAvoidingView,
    TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight,
    Platform, Dimensions, ImageBackground, TextInput, Keyboard
} from 'react-native';
import { useDimensions, useDeviceOrientation } from '@react-native-community/hooks';
import { NativeRouter, Route, Link, useHistory } from 'react-router-native';
import { useNavigation, useLinkTo, } from '@react-navigation/native';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

import colors from '../config/colors';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;
const mathBox=((screenWidth+screenHeight)/20);
const mathFontInputs=((screenWidth+screenHeight)/70);
const mathFont=((screenWidth+screenHeight)/80);
const mathFontLogin=((screenWidth+screenHeight)/40);
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

    const handlePushSignin=()=>{
        history.push('/signin');
    }

    const handleSubmit = (event) => {
        try{
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
                    
                    //var decode = jwt_decode(res.data.refresh);
                    //const Id = parseInt(decode.user_id);
                    //var y=await AsyncStorage.setItem('current_user_id',1);
                    axios.defaults.headers['Authorization'] =
                        'JWT ' + access_token;
                    alert('Data successfully saved');
                    history.push('/feed')
                } catch (e) {
                    alert(e)
                }

            })
        } catch(e){
                alert(e);
            }
    }; 

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
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
                                    <Button title="Login" onPress={handleSubmit} />
                                    
                                </View>
                                <Text
                                    style={{
                                        alignSelf:"center",
                                    }}
                                >
                                    <Button color="black" 
                                    title="Don't have an account?"/>
                                    
                                    <Button title="Click here" 
                                    onPress={handlePushSignin} />                              
                                </Text>
                            </View>
                    
                    </KeyboardAvoidingView>

                </ImageBackground>
            </View>
        </TouchableWithoutFeedback>
        );
}

const styles = StyleSheet.create({
    options: {
        justifyContent:"center",
        flexDirection: "row",
  
    },

    inner: {
        padding:"10%",
        flex: 1,
        justifyContent: "space-around"
    },
    header: {
        fontSize:mathFontLogin,
        fontWeight:"500"
    },
    textInput: {
        fontSize:mathFontInputs,
        height: 30,
        borderColor: colors.black,
        borderBottomWidth: 1,
        width:"100%",
    },
    btnContainer: {
        alignSelf: "center",
        backgroundColor:colors.white,
        width:"100%",
        fontSize:mathFontInputs
    },

    container: {
        flex: 1,
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