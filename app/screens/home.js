import React from 'react';
import {
    StyleSheet,
    useEffect, Button,
    useState, KeyboardAvoidingView,
    Text, Keyboard, AsyncStorage, RefreshControl,
    View, Alert, Image, SafeAreaView,
    TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight,
    Platform, Dimensions, ImageBackground, TextInput, ScrollView,
} from 'react-native';
import { NativeRouter, Route, Link } from 'react-router-native';
import axios from 'axios';
import { Card, ListItem, Icon, SearchBar } from 'react-native-elements';
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
    const [searchKeyword, onChangeSearchKeyword] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const Stack = createNativeStackNavigator();
    const [error, setError] = React.useState(false);

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

    const pointerEvents = (e) => {
        e.preventDefault();
        navigation.navigate('Search')    
    };

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
            //var decode = jwt_decode(refresh_token);
            //const Id = parseInt(decode.user_id);
            setToken({ access_token });
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
        axiosInstance.get('allPosts/').then((res) => {
            const Data = res.data;
            setAllPosts({ all_posts: Data });
            setLoading(false);

        }).catch((err) => {
            setError(true)

        });
    };

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(1500).then(() => setRefreshing(false));
        render()
    }, [setAllPosts,]);

    React.useEffect(() => {
        readData();
        render();
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
       
        <SafeAreaView >
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
    
       </SafeAreaView>
    
    );
}

const styles = StyleSheet.create({
  
});