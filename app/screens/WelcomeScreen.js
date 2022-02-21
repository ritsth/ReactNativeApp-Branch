import React from 'react';
import {
    StyleSheet, Text, Button,AsyncStorage,
    View, Alert, Image, SafeAreaView,
    TouchableOpacity, TouchableWithoutFeedback,
    TouchableHighlight, Platform, Dimensions,
    ImageBackground, Linking
} from 'react-native';
import { useDimensions, useDeviceOrientation } from '@react-native-community/hooks';
import { NativeRouter, Route, Link,useHistory } from 'react-router-native';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

import colors from '../config/colors';


const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;
const mathLogo=((screenWidth+screenHeight)/10);
const mathFont=((screenWidth+screenHeight)/100);
const mathFontLogins=((screenWidth+screenHeight)/46);

export default function Welcome (props) {
    const history = useHistory();
    const handle = () => { alert(' button Pressed!') }
    const { landscape } = useDeviceOrientation();

    const [token, setToken] = React.useState({
        access_token: ''
    })
    const [userId, setUserId] = React.useState({
        id: 0
    });    
    const readData = async () => {
        try {
            
            //var refresh_token = await AsyncStorage.getItem('refresh_token');
            var access_token = await AsyncStorage.getItem('access_token');
            //var decode = jwt_decode(refresh_token);
            //var id = parseInt(decode.user_id);
            //setUserId({id});
            access_token != null?(
                setToken({ access_token })               
            ):(null)

        } catch (e) {
            alert(e+'  '+'Failed to fetch the data from storage');
            setToken({access_token:null});
        }
           
    }
    React.useEffect(() => {
        readData();
        
    }, []);

    pushFeed=()=>{
        history.push('/feed');
    }
    return (<>
        {token.access_token == '' ?(
        <View style={styles.container}>
            <ImageBackground style={styles.bgImage} //resizeMode="cover"
                source={{ uri: 'https://i.pinimg.com/564x/35/b9/cb/35b9cbd5b61a78f15aefbe63d339ac18.jpg' }}>
                <Image source={require('../assets/logo1.png')}
                    style={{
                        margin: 13,
                        marginTop: 80,
                        flexDirection: "row",
                        alignSelf: "center",
                        width:mathLogo,
                        height:mathLogo
                    }}
                />
                <Text
                    style={{
                        fontSize:mathFont,
                        flex: 1,
                        flexDirection: "column",
                        alignSelf: "center",
                        marginLeft:10
                    }}>
                   Share your plant world here
                </Text>
                <Link to="/login"
                    style={{
                        justifyContent:"center",
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
                        justifyContent:"center",
                        width: "100%",
                        height: "10%",
                        backgroundColor: colors.secondary
                    }}
                    underlayColor={colors.Linkunderlay}>

                    <Text style={styles.logins}
                    >Sign in</Text>

                </Link>

            </ImageBackground>

        </View>):
        (pushFeed())}
    </>);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bgImage: {
        flex: 1,
        justifyContent: "center",
        width: "100%",
        height:"100%"

    },
    logins: {
        fontSize: mathFontLogins,
        fontFamily: "Helvetica",
        fontWeight: "bold",
        alignSelf: "center",
        color: colors.TextLavender,

    },

});