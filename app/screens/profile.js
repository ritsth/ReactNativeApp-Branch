import React from 'react';
import {
    StyleSheet, Modal,
    useEffect, Button, RefreshControl,
    useState, KeyboardAvoidingView,
    Text, Keyboard,AsyncStorage,
    View, Alert, Image, SafeAreaView,
    TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight,
    Platform, Dimensions, ImageBackground, TextInput, ScrollView,
} from 'react-native';
import { useDimensions, useDeviceOrientation } from '@react-native-community/hooks';
import { NativeRouter, Route, Link } from 'react-router-native';
import axios from 'axios';
import { Card, ListItem, Icon, SearchBar } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContainer, useNavigation, useRoute, } from '@react-navigation/native';
import { Divider } from 'react-native-elements/dist/divider/Divider';
import jwt_decode from 'jwt-decode';
import Gradient from "javascript-color-gradient";
import * as ImagePicker from 'expo-image-picker';

import colors from '../config/colors';
import Posts from './posts';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}  

export default function ProfilePage({route }) {
    const { userid } = route.params; 
    const navigation = useNavigation();

    const [profileVisible, setProfileVisible] = React.useState(false);
    const [refreshing, setRefreshing] = React.useState(false);
    const [image, setImage] = React.useState(null);

    const [error, setError] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    const [profilePhoto, setProfilePhoto] = React.useState({
        profile: [{
            id: '',
            user: '',
            Profile_photo: ''
        }],
    });
    const [userData, setUserData] = React.useState({
        user: [{
            id: '',
            username: '',
            first_name: '',
            last_name: '',
            date_joined: '',
            email: '',
        }],
    });
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
    const [commentData, setCommentData] = React.useState({
        comments: [{
            comment_text: '',
            pub_date: '',
            user: '', user_name1: '',
            id: '',
            post: ''
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
            const user = await AsyncStorage.getItem('@username');
            setUser({ username: user });
            var refresh_token = await AsyncStorage.getItem('refresh_token');
            var access_token = await AsyncStorage.getItem('access_token');
            var decode = jwt_decode(refresh_token);
            const Id = parseInt(decode.user_id);
            setUserId({ id: Id });
            setToken({ access_token });
            /*var userId = await AsyncStorage.setItem('current_user_id', decode.user_id);*/
        } catch (e) {
            alert(e);
        }
    };
    const baseURL = 'https://branchappxzy.herokuapp.com/';
    const axiosInstance = axios.create({
        baseURL: baseURL,
        timeout: 5000,
        headers: {
            Authorization: token.access_token
                ? 'JWT ' + token.access_token
                : null,
             'Content-Type': 'application/json',
            accept: 'application/json',
        },
    });

    const render = () => {
        axiosInstance.get(`/profile_photo/${userid}`).then((res) => {
            const Data = res.data;
            setProfilePhoto({ profile: Data });
            setLoading(false);
        }).catch((err) => {
            setError(true)
        });

        axiosInstance.get('allPosts/').then((res) => {
            const Data = res.data;
            setAllPosts({ all_posts: Data });
            setLoading(false);
        }).catch((err) => {
            setError(true)
        });

        axiosInstance.get(`users/${userid}`).then((res) => {
            const Data = res.data;
            setUserData({ user: Data });
            setLoading(false);
        }).catch((err) => {
            setError(true)
        });
    };

    React.useEffect(() => {
        readData();
        render();
        render();
        
    }, [setProfilePhoto, setUserData,
        /*setCommentData,*/
        setLoading, setAllPosts,
    ]);

    const date_joined = (new Date(userData.user.date_joined)).toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/, '$1 $2, $3'); 

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(1500).then(() => setRefreshing(false));
        render()
    }, [setAllPosts,]);

    const pickImage = async () => {
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.cancelled) {
            setImage(result.uri);
            const w = JSON.stringify(image);
            axiosInstance.post(`/profile_photo`, {
                Profile_photo:image
            }, config).then((res) => {
               
            }).catch((err) => {
                alert(err)
            });

           
        }
    };

    return (

        <>
            {userid == userId.id ? (
                <View style={{
                    backgroundColor: colors.secondary,
                    padding:32
                }}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={profileVisible}

                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <ScrollView onScrollEndDrag={() => setProfileVisible(false)}>
                                    <Divider
                                        style={{
                                            borderWidth: 0.3,
                                            width: 400,
                                            borderColor: "grey",
                                            padding: 10,
                                            borderLeftColor: "white",
                                            borderRightColor: "white",
                                            borderTopColor: "white"
                                        }}
                                    >
                                        <Button
                                            title='Login from another account'
                                        />
                                    </Divider>
                                    <Divider style={{
                                        borderWidth: 0.3,
                                        width:400,
                                        borderColor: "grey",
                                        padding:10,
                                        borderLeftColor: "white",
                                        borderRightColor: "white",
                                        borderTopWidth: 0.1,

                                    }} >
                                        <Button
                                            title='Create new account'
                                        />
                                    </Divider>
                                    <Divider style={{
                                        borderWidth: 0.3,
                                        width:400,
                                        borderColor: "grey",
                                        padding:10,
                                        borderLeftColor: "white",
                                        borderRightColor: "white",
                                        borderTopWidth: 0.1,

                                    }} >
                                        <Button
                                            color="red"
                                            title='Logout'
                                        />
                                    </Divider>
                                    <Divider style={{
                                        borderWidth: 0.3,
                                        width:400,
                                        borderColor: "grey",
                                        padding:10,
                                        borderLeftColor: "white",
                                        borderRightColor: "white",
                                        borderBottomColor: "white",
                                        borderTopWidth: 0.1,

                                    }} >
                                        <Button
                                            color="red"
                                            title='Delete Account'
                                        />
                                    </Divider>
                                </ScrollView>
                            </View> 
                        </View>
                   
                    </Modal>

                    <TouchableOpacity
                        style={{
                            top: 30,
                            position: "absolute",
                            left: 20,
                            color: colors.white,
                            fontWeight: 'bold',
                            fontSize: 20,
                        }}
                        onPress={() => setProfileVisible(true)}>
                        <Text
                            style={{
                                color: colors.white,
                                fontWeight: 'bold',
                                fontSize: 22,
                            }}>
                            <MaterialCommunityIcons
                                name="account-circle"
                                color="white"
                                size={23}
                                />
                            {userData.user.username}<MaterialCommunityIcons
                                name="chevron-down"
                                color="white"
                                size={23}
                            />

                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Notification')}
                        style={{
                            top: 30,
                            position: "absolute",
                            left: 366,
                        }}>

                        <Text>
                            <MaterialCommunityIcons
                                name="bell"
                                color={colors.white}
                                size={25}
                            />
                        </Text>
                    </TouchableOpacity>

                </View>
            ) : (null)}

            {image && <>
                <Image source={{ uri: image }}
                    style={{
                        width: 70,
                        height: 70,
                    }}
                /></>}
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <View style={{
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor:colors.secondary,
                    paddingBottom: 0,
                    color: colors.white,
                }}>
                    {/* <Image
                        source={{
                            uri: loading == false ?
                                (`${profilePhoto.profile.Profile_photo}`) :
                                ('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png')
                        }}
                        style={{ display:"none" }}
                    />*/}
                    <Image
                        source={{
                            uri: loading == false ?
                                (`${profilePhoto.profile.Profile_photo}`) :
                                ('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png')
                        }}
                        style={styles.userPhoto}
                    />
                    {userid == userId.id ? (
                        <TouchableHighlight onPress={pickImage}
                            style={{
                                position: "absolute",
                                bottom: 260,
                                left: 240,
                                backgroundColor: colors.secondary,
                                borderRadius: 30,
                                padding: 5,
                                shadowRadius: 7,
                                shadowOpacity: 0.4,
                            }}
                        >
                            <MaterialCommunityIcons
                                name="camera"
                                size={30}
                                color={colors.white}
                            />
                        </TouchableHighlight>)
                        : (null)}
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: "600",
                            marginLeft:15,
                            marginBottom: 5,
                            alignSelf: 'center',
                            color:colors.white,
                        }}
                    >
                        {userData.user.first_name} {userData.user.last_name}
                    </Text>
                    <Text onPress={() => Alert.alert("edit bio")}
                        style={{
                            fontSize: 18,
                            marginBottom: 5,
                            alignSelf: 'center',
                            color: colors.white,
                            opacity:0.8
                        }}
                    >
                        <MaterialCommunityIcons
                            
                            name="pen"
                            size={23}
                        />
                        &nbsp;An beginner programmer. here .
                    </Text>


                    <View style={{
                        flexDirection: "row",
                        marginTop: 15,
                        opacity: 0.8,

                    }}>
                        <TouchableHighlight 
                            onPress={() => Alert.alert("copied")}>
                            <View
                                style={{
                                    flexDirection: "column",
                                    borderRightWidth: 0,
                                    padding: 0,
                                    width: 200,
                                    //backgroundColor: "rgba(0,0,0,0.3)",
                                }}
                            >
                                <Text
                                    style={{
                                        color: "white",
                                        alignSelf: "center"
                                    }}>

                                    <MaterialCommunityIcons
                                        name="email-variant"
                                        size={22}
                                    />
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 15,
                                        color: "white",
                                        alignSelf: "center"
                                    }}>

                                    {userData.user.email}
                                </Text>
                            </View>
                        </TouchableHighlight>

                        <TouchableHighlight>
                            <View
                                style={{
                                    flexDirection: "column",
                                    padding: 0,
                                    width: 200,
                                    //backgroundColor: "rgba(0,0,0,0.3)",
                                }}
                            >
                                <Text
                                    style={{
                                        color: "white",
                                        alignSelf: "center"
                                    }}>

                                    <MaterialCommunityIcons
                                        name="clock"
                                        size={22}
                                    />
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 15,
                                        color: "white",
                                        alignSelf: "center"
                                    }}>

                                    {date_joined}
                                </Text>
                            </View>
                        </TouchableHighlight>

                        {/*

                            
                            
                        <View style={{
                            flexDirection: "column",
                            borderWidth: 1,
                            padding: 5,
                            width: 140
                        }}>
                            <Text
                                style={{
                                    color: "lightgrey",
                                    alignSelf: "center"
                                }}>

                                <MaterialCommunityIcons
                                    name="clock"
                                    size={25}
                                />
                            </Text>
                            <Text
                                style={{
                                    fontSize: 18,
                                    color: "lightgrey",
                                    alignSelf: "center"
                                }}>

                                Nov 15, 2021
                                        </Text>
                        </View>*/}
                    </View>

                    <TouchableOpacity onPress={() => Alert.alert("Add your plants")}>
                        <View 
                            style={{
                                backgroundColor: "white",
                                borderRadius: 30,
                                width: 220,
                                alignSelf: "center",
                                margin: 40,
                            }}
                        >
                            <Text
                                style={{
                                    color: colors.secondary,
                                    fontWeight: "bold",
                                    fontSize: 20,
                                    alignSelf: "center",
                                    padding: 12

                                }}
                            >
                                Connect your Plant
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            
                <ScrollView horizontal={true} >
                    {loading == false ?
                        (allPosts.all_posts.map((posts) => {
                            return (
                                <Posts
                                    key={posts.id}
                                    posts={posts}
                                />
                            )
                        })) :
                        (<Text style={{
                            alignSelf: 'center',
                            justifyContent: 'center',
                        }}
                        >LOADING ...</Text>)}
                </ScrollView>

            </ScrollView>

  
    </>);
}

const styles = StyleSheet.create({
    userPhoto: {
        width: 140,
        height:140,
        borderRadius:70,
        margin: 10,
        marginTop:0,
        borderWidth:2,
        borderColor:'white'
    },

    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',

    },
    modalView: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: "white",
        opacity: 0.95,
        padding: 5,
        alignItems: "center",
        shadowColor: "black",
        shadowOpacity: 1,
        shadowRadius: 150,
    },
});