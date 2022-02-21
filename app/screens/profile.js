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
import { NativeRouter, Route, Link, useHistory } from 'react-router-native';
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

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;
const mathUserImgBox=((screenWidth+screenHeight)*0.99);
const mathLeft=((screenWidth+screenHeight)*1/21);
const mathBottom=((screenWidth+screenHeight)*1/20);
const mathImgPicker=((screenWidth+screenHeight)*1/40);
const ITEM_WIDTH = Math.round(screenWidth * 0.35);
const ITEM_HEIGHT = Math.round(ITEM_WIDTH *1);
const mathFontLogins=((screenWidth+screenHeight)/80);

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}  

export default function ProfilePage({route}) {
    const { userid,allow} = route.params; 
    const navigation = useNavigation();
    const history=useHistory();
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
        access_token: '',
        
    });
    const[refreshToken,setRefreshToken]=React.useState({
        refresh_token:""
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
            setToken({ access_token});
            setRefreshToken({refresh_token})
        } catch (e) {
            alert(e+'Failed to fetch the data from storage');
            setToken({access_token:null});
        }
    };
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

    const checkUser=async()=>{
        var refresh_token = await AsyncStorage.getItem('refresh_token');
        var decode = jwt_decode(refresh_token);
        var id = parseInt(decode.user_id);
        navigation.setParams({userid:id});  
    };

    const render =async () => {
        var refresh_token = await AsyncStorage.getItem('refresh_token');
        var decode = jwt_decode(refresh_token);
        var id = parseInt(decode.user_id);

        axiosInstance.get(`/profile_photo/${userid==0?(id):(userid)}`).then((res) => {
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

        axiosInstance.get(`users/${userid==0?(id):(userid)}`).then((res) => {
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
        {userid === 0 ?(checkUser()):(null)}
        
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
        var refresh_token = await AsyncStorage.getItem('refresh_token');
        var decode = jwt_decode(refresh_token);
        var id = parseInt(decode.user_id);
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };

        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],  
            quality: 1,
            
        });

        var data = new FormData();
        data.append('Profile_photo',
          { 
            uri:result.uri,
            type: result.type,
            name:Platform.OS === 'ios' ? (result.uri.replace('file://', '')):(result.uri),
          });   
        if (!result.cancelled) {
            setImage(result.uri);
            profilePhoto.profile == null?(
                await axiosInstance.post(`/profile_photo/`,data,config)
                .then((res) => {
                    render();
                    alert("Profile photo uploaded");
                 
                })
                .catch((err) => {
                    alert(JSON.stringify(err.response.data))
                })

            ):(
                await axiosInstance.put(`/profile_photo/${userid==0?(id):(userid)}/`,data,config)
                .then((res) => {
                    render();
                    alert("Profile photo updated");
                })
                .catch((err) => {
                    alert(JSON.stringify(err.response.data))
                })
            )


           
        }
    };

    const handlePushLogin=()=>{
        history.push('/login');
    };
    const handlePushSignin=()=>{
        history.push('/signin');
    };
    const logout=async()=>{
        
        try{
            //axiosInstance.defaults.headers['Authorization'] = null;            
            //await axiosInstance.post('logout/blacklist/', {
                //refresh_token:refreshToken.refresh_token,
            //});
            //await AsyncStorage.clear();
            await AsyncStorage.removeItem('@username');
            await AsyncStorage.removeItem('access_token');
            history.push('/login');            
        } catch(e){
            alert(e.response.data)
        }

    };

    return (

        <>
            {token.access_token == null && allow!='positive'?(
                <ImageBackground style={{
                    width:"100%",
                    height:"100%",
                    justifyContent:"center",
                }} 
                source={{uri:"https://i.pinimg.com/564x/34/4c/ae/344caefd02f3689d50c53f779eacf1f4.jpg"}}>
                    <View
                        style={{
                            //backgroundColor:colors.secondary,
                        }}
                    >
                        <Text
                            style={{
                                alignSelf:'center',
                                fontSize:mathFontLogins,
                            }}
                        
                        >
                            <Button title="Login" onPress={handlePushLogin} />  
                            <Button color="black" title="first to access your account"/>
                        </Text>
                        <Text
                            style={{
                                alignSelf:'center',
                            }}>
                                <Button color="black" title="Don't have an account?"/>
                                <Button title="Click here" onPress={handlePushSignin} />  
                        </Text>
                    </View>
                </ImageBackground>

            ):(<>
            {userid == userId.id ? (
                <View 
                style={{
                    backgroundColor: colors.secondary,
                    padding:32,
                    height:"13%"
                    
                }}>
                    <Modal 
                        animationType="slide"
                        transparent={true}
                        visible={profileVisible}

                    >
                        <TouchableWithoutFeedback 
                            onPressOut={()=>setProfileVisible(false)}>
                            <View style={styles.centeredView} > 
                                <View style={styles.modalView}>
                                    <ScrollView 
                                        onScrollEndDrag={() => 
                                        setProfileVisible(false)}>
                                        <Divider
                                            style={{
                                                borderWidth: 0.3,
                                                width: 400,
                                                borderColor: "grey",
                                                padding: 10,
                                                borderLeftColor: "white",
                                                borderRightColor: "white",
                                                borderTopColor: "white",
                                                alignSelf:"center"
                                            }}
                                        >
                                            <Button
                                                title='Login from another account'
                                                onPress={handlePushLogin}
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
                                            alignSelf:"center"

                                        }} >
                                            <Button
                                                title='Create new account'
                                                onPress={handlePushSignin}
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
                                            alignSelf:"center"

                                        }} >
                                            <Button
                                                color="red"
                                                title='Logout'
                                                onPress={logout}
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
                                            alignSelf:"center"

                                        }} >
                                            <Button
                                                color="red"
                                                title='Delete Account'
                                            />
                                        </Divider>
                                    </ScrollView>
                                </View> 
                            </View>
                        </TouchableWithoutFeedback>
                   
                    </Modal>

                    <TouchableOpacity
                        style={{
                            top: 50,
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
                            top: 53,
                            position: "absolute",
                            left: "105%",
                        }}>

                        <Text>
                            <MaterialCommunityIcons
                                name="bell"
                                color={colors.white}
                                size={24}
                            />
                        </Text>
                    </TouchableOpacity>

                </View>

            ) : (null)}

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
                                uri: profilePhoto.profile.Profile_photo != null?
                                    (`${profilePhoto.profile.Profile_photo}`) :
                                    ('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png')
                            }}
                            style={styles.userPhoto}
                        />
                        {userid == userId.id ? (
                            <TouchableHighlight onPress={pickImage}
                                style={{
                                    //position: "absolute",
                                    bottom:mathBottom,
                                    left:mathLeft,
                                    backgroundColor: colors.secondary,
                                    borderRadius: 30,
                                    padding:"1.2%",
                                    shadowRadius: 7,
                                    shadowOpacity: 0.4,
                                }}
                            >
                                <MaterialCommunityIcons
                                    name="camera"
                                    size={mathImgPicker}
                                    color={colors.white}
                                />
                            </TouchableHighlight>)
                            : (null)}
                        <View style={{bottom:"9%",}}>
                        <Text
                            style={{
                                marginTop:userid == userId.id ? (0):(40),
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
                        <Text onPress={userid == userId.id ?(
                            () => Alert.alert("edit bio")):(null)}
                            style={{
                                fontSize: 18,
                                //marginBottom: 5,
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
                        </Text></View>


                        <View style={{
                            bottom:"5%",
                            flexDirection: "row",
                            //marginTop: 3,
                            opacity: 0.8,
                            marginBottom:userid != userId.id ? (25):(0),

                        }}>
                            <TouchableHighlight 
                                onPress={() => Alert.alert("copied")}>
                                <View
                                    style={{
                                        flexDirection: "column",
                                        borderRightWidth: 0,
                                        padding: 0,
                                        margin:"6%",
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
                                        margin:"6%"
                                        //backgroundColor: "rgba(0,0,0,0.3)",
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "white",
                                            alignSelf: "center",
                                            marginTop:3
                                        }}>

                                        <MaterialCommunityIcons
                                            name="clock"
                                            size={22}
                                        />
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 14.5,
                                            color: "white",
                                            alignSelf: "center",
                                            //marginTop:4
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
                        
                        <TouchableOpacity 
                         style={{
                            backgroundColor: "white",
                            borderRadius: 30,
                            paddingLeft:"18%",
                            paddingRight:"18%",
                            alignSelf: "center",
                            bottom:userid == userId.id ?("0%"):("4%"),
                            marginBottom:userid == userId.id ?("20%"):("18%"),
                            marginTop:userid == userId.id ?(10):(0)
                        }}
                        
                        onPress={() => navigation.navigate('/addPlant')}>
                            <View 
                         
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

                            (allPosts.all_posts.filter(filter=>filter.user==userid).map((posts) => {
                                if (posts != null){
                                return (
                                    <Posts
                                        key={posts.id}
                                        posts={posts}
                                    />
                                )}
                                else{
                                    <Button title='NO POSTS YET !!'
                                    size={mathFontLogins}
                                    />
                                }
                            })) :
                            (<Text style={{
                                alignSelf: 'center',
                                justifyContent: 'center',
                            }}
                            >LOADING ...</Text>)}
                    </ScrollView>

                </ScrollView>
            </>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    userPhoto: {
        width:ITEM_WIDTH,
        height:ITEM_HEIGHT,
        borderRadius:mathUserImgBox,
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
        shadowColor: "black",
        shadowOpacity: 1,
        shadowRadius: 150,
    },
});