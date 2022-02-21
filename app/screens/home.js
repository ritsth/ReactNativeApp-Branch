import React from 'react';
import {
    StyleSheet,
    useEffect, Button,Modal,
    useState, KeyboardAvoidingView,
    Text, Keyboard, RefreshControl,AsyncStorage,
    View, Alert, Image, SafeAreaView,
    TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight,
    Platform, Dimensions, ImageBackground, TextInput, ScrollView,
} from 'react-native';
//import { AsyncStorage} from '@react-native-community/async-storage';
import { NativeRouter, Route, Link } from 'react-router-native';
import axios from 'axios';
import { Divider } from 'react-native-elements/dist/divider/Divider';
import { Card, ListItem, Icon, SearchBar } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onChange } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import jwt_decode from 'jwt-decode';

import colors from '../config/colors'; 
import Posts from './posts';


const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}    
export default function HomePage({ }) {
    const navigation = useNavigation();
    //const [searchKeyword, onChangeSearchKeyword] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const Stack = createNativeStackNavigator();
    const [error, setError] = React.useState(false);
    const [modalOptions, setModalOptions] = React.useState(false);

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

    const [currentPosts, setCurrentPosts] = React.useState({
        posts: [{
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
    const [oldPosts, setOldPosts] = React.useState({
        posts_old: [{
            id: '',
            status: '',
            pub_date: '',
            post_img: '',
            type: '',
            user: '',
            user_name3: ''
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


    const [userId, setUserId] = React.useState({
        id: ''
    });
    const [token, setToken] = React.useState({
        access_token: ''
    });
    const readData = async () => {
        try {
            var refresh_token = await AsyncStorage.getItem('refresh_token');
            var access_token = await AsyncStorage.getItem('access_token');
            var decode = jwt_decode(refresh_token);
            const Id = parseInt(decode.user_id);
            setUserId({ id: Id });
            setToken({ access_token });
        } catch (e) {
            setToken({ access_token:null });
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

    const renderPost = () => {
        axiosInstance.get('allPosts/').then((res) => {
            const Data = res.data;
            setAllPosts({ all_posts: Data });
            setLoading(false);

        }).catch((err) => {
          
        });
    };
    const editPost = (e) => {
        alert("under Construction");
    };

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(1500).then(() => setRefreshing(false));
        renderPost();
    }, [setAllPosts,]);

    React.useEffect(() => {
        readData();
        renderPost();
        /*
        axiosInstance.get('posts_now/').then((res) => {
            const Data = res.data;
            setCurrentPosts({ posts: Data });
            setLoading(false);
        }).catch((err) => {
              setError(true)
           
        });

        axiosInstance.get('posts_later/').then((res) => {
            const Data = res.data;
            setOldPosts({ posts_old: Data });
            setLoading(false);
        }).catch((err) => {
            setError(true)

        });*/


    }, [setProfilePhoto, setUserData,
        setCommentData, setCurrentPosts,
        setLoading, setOldPosts, setAllPosts,

    ]);

    return (
       
        <View key='key'>
            <ScrollView keyboardShouldPersistTaps={'handled'}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >

                <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                    <SearchBar 
                        lightTheme={true}
                        round={true}
                        searchIcon={{ size: 27 }}
                        containerStyle={{
                            backgroundColor: "#F1F1F1",
                            height: 70,
                        }}
                        inputContainerStyle={{
                            backgroundColor: "lightgrey",
                            borderRadius: 50,
                            borderWidth: 1,
                            borderColor: "silver",
                            height: 40,
                            borderBottomWidth: 1,
                            marginTop: 5
                        }}
                        inputStyle={{ color: "black" }}
                        placeholder="Search for plant type . . ."
                        onChangeText={() => navigation.navigate('Search')}
                        //value={onChangeSearchKeyword}
                    />
                </TouchableOpacity>
                <ScrollView horizontal={true} keyboardShouldPersistTaps={'handled'}>
                    {loading == false ?
                        (allPosts.all_posts.map((posts) => {
                            return (<>
                                <Modal
                                    animationType="slide"
                                    transparent={true}
                                    visible={modalOptions}
                            
                                >
                                    {/*<TouchableWithoutFeedback 
                                        onPressOut={()=>setModalOptions(false)}>*/}
                                        <View style={styles.centeredView} >
                                            <View style={styles.modalView}>
                                    
                                                    <Divider 
                                                        style={{
                                                            borderWidth: 0.3,
                                                            width: 375,
                                                            borderColor: "grey",
                                                            padding: 8,
                                                            borderLeftColor: "white",
                                                            borderRightColor: "white",
                                                            borderTopColor:"white"
                                                        }} 
                                                    >
                                                        <Button 
                                                            onPress={()=>{
                                                                axiosInstance.delete(`allPosts/${posts.id}/`).then((res) => {
                                                                    setModalOptions(false);
                                                                    renderPost();
                                                                })
                                                            }}
                                                            color="red"
                                                            title='Delete'
                                                        />
                                                    </Divider>
                                                    <Divider style={{
                                                        borderWidth: 0.3,
                                                        width: 375,
                                                        borderColor: "grey",
                                                        padding: 8,
                                                        borderLeftColor: "white",
                                                        borderRightColor: "white",
                                                        borderBottomColor: "white",
                                                        borderTopWidth: 0.1,
                                                        
                                                    }} >
                                                    <Button
                                                        color="black"
                                                        onPress={editPost}
                                                        title='Edit'
                                                    />
                                                    </Divider>

                                            </View>
                                        </View>

                                        <View style={{
                                            bottom:"38%",
                                            alignItems: "center",

                                        }} >
                                            <View style={{
                                                margin: 20,
                                                borderRadius: 15,
                                                backgroundColor: "white",
                                                opacity:1,
                                                padding: 5,
                                                alignItems: "center",
                                                shadowColor: "black",
                                                shadowOffset: {
                                                    width: 0,
                                                    height: 2
                                                },
                                                shadowRadius: 50,
                                                elevation: 1
                                            }}>
                                                <Divider style={{
                                                    borderWidth: 0.3,
                                                    width: 375,
                                                    borderColor: "grey",
                                                    padding: 7,
                                                    borderLeftColor: "white",
                                                    borderRightColor: "white",
                                                    borderTopWidth: 0.1,
                                                    borderBottomColor: "white"
                                                }} >
                                                    <Button
                                                        color="black"
                                                        onPress={() => setModalOptions(!modalOptions)}
                                                        title='Cancel'
                                                    />
                                                </Divider>
                                            </View>
                                        </View>
                                    {/*</TouchableWithoutFeedback>*/}


                                </Modal>
                                
                                {userId.id == posts.user ? (
                                    <TouchableOpacity 
                                        style={{
                                            top:37,
                                            left:"58%",
                                            //alignSelf:"flex-end",
                                            zIndex:1

                                        }} onPress={() =>setModalOptions(true)}
                                    >
                                        <Text>
                                    
                                            <MaterialCommunityIcons
                                                name="format-list-bulleted"
                                                size={25}
                                            />
                                        </Text>
                                    </TouchableOpacity>

                                ) : (null)}  

                                <Posts 
                                    key={posts.id}
                                    posts={posts}
                                />
                            </>)
                        })) :
                        (<Text style={{
                            alignSelf: 'center',
                            justifyContent: 'center',
                        }}
                        >LOADING ...</Text>)}
                </ScrollView>
                      
                
            </ScrollView>
    
       </View>
    
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",

    },
    modalView: {

        margin:20,
        borderRadius:15,
        backgroundColor: "white",
        opacity:0.95,
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