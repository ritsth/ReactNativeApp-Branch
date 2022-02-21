import React from 'react';
import {
    StyleSheet,
    useEffect, Button, Modal,
    useState, KeyboardAvoidingView,
    Text, Keyboard,AsyncStorage,
    View, Alert, Image, SafeAreaView,
    TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight,
    Platform, Dimensions, ImageBackground, TextInput, ScrollView,
} from 'react-native';

import { NativeRouter, Route, Link } from 'react-router-native';
import axios from 'axios';
import { Card, ListItem, Icon, SearchBar } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import jwt_decode from 'jwt-decode';
import { Divider } from 'react-native-elements/dist/divider/Divider';


import colors from '../config/colors';
import { useNavigation } from '@react-navigation/native';


export default function Comments({rerender, comment, height, width, fontSize, fontSize2, fontSize3, margin, marginBottom, lines, bottom }) {
    const navigation = useNavigation()
    const pub_date = (new Date(comment.pub_date)).toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/, '$1 $2, $3'); 
    const [error, setError] = React.useState(false);
    const [loading, setLoading] = React.useState(true);


    const [profilePhoto, setProfilePhoto] = React.useState({
        data: [{
            user: '',
            Profile_photo: '',
        }]
    })
    const [allPosts, setAllPosts] = React.useState({
        all_posts: [{
            id: '',
            status: '',
            pub_date: '',
            post_img: '',
            type: '',
            user: '',
            user_name3: '',
            type_name: ''
        }],
    });

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
            //const user = await AsyncStorage.getItem('@username');
            //setUser({ username: user });
            var refresh_token = await AsyncStorage.getItem('refresh_token');
            var access_token = await AsyncStorage.getItem('access_token');
            var decode = jwt_decode(refresh_token);
            const Id = parseInt(decode.user_id);
            setUserId({id:Id});
            setToken({ access_token });
        } catch (e) {
            alert(e+"  "+'failed to fetch data');
            setToken({access_token:null});
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
        readData();
        axiosInstance.get(`profile_photo/${comment.user}/`).then((res) => {
            const Data = res.data;
            setProfilePhoto({ data: Data });
            setLoading(false);
        }).catch((err) => {
            if (err = 'Request failed with status code 500') {
                setError(true)
            }
        });

        // Anything in here is fired on component mount.
    
                
    }, [setProfilePhoto, setAllPosts,
        setLoading,setError

    ]);

    const linkToOthers = () => {
        navigation.navigate('OthersProfile', {
            userid: comment.user,
            name: comment.user_name1,
            allow:'positive'
        })

    }

    return (
        <SafeAreaView key={comment.id}>

            <View
                style={{
                    marginTop: 10,
                    flexDirection: 'row',
                    margin: margin,
                    marginBottom: marginBottom
                    
                }}>
                <TouchableOpacity onPress={linkToOthers}>
                    <Image
                        source={{
                            uri: loading == false ?
                                (`${profilePhoto.data.Profile_photo}`) :
                                ('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png')
                        }}
                        style={{
                            width: width,
                            height: height,
                            borderRadius: 50,
                            marginRight: 8,
                        }}
                    />
                </TouchableOpacity>
                <Text style={{
                    fontSize: fontSize,
                    fontWeight: "700",
                    marginRight: 10,

                }}>
                    {comment.user_name1}
                </Text>

                <Text
                    style={{
                        fontSize: fontSize2,
                        opacity: 0.4,

                    }}>
                    {pub_date}
                </Text>

            </View>

            <Text numberOfLines={lines} 
                style={{
                    fontSize: fontSize3,
                    marginLeft: 0,
                    bottom:bottom,
                    position: 'relative',
                    marginLeft: 60,


                }}>
                {comment.comment_text}
            </Text>

            { /*<Text style={{
                        alignSelf: 'center',
                        marginTop: 130,
                        opacity: 0.5,
                    }}
                    >No Comments yet! Be first to comment.</Text>*/}                
                
        </SafeAreaView>
    );
}  

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",

    },
    modalView: {
        margin: 20,
        borderRadius: 15,
        backgroundColor: "white",
        opacity: 0.95,
        padding: 5,
        alignItems: "center",
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 1,
        shadowRadius: 100,
        elevation: 17
    },
});