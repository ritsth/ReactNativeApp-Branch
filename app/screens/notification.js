import React from 'react';
import {
    StyleSheet,
    useEffect, Button,
    useState, KeyboardAvoidingView,
    Text, Keyboard,AsyncStorage,
    View, Alert, Image, SafeAreaView,
    TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight,
    Platform, Dimensions, ImageBackground, TextInput, ScrollView,
} from 'react-native';
import { NativeRouter, Route, Link } from 'react-router-native';
import axios from 'axios';
import { Card, ListItem, Icon, SearchBar } from 'react-native-elements';
import { NavigationContainer, useNavigation,} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import jwt_decode from 'jwt-decode';

import colors from '../config/colors';


export default function NotificationPage(props) {
    const [error, setError] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const Stack = createNativeStackNavigator ();

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


    React.useEffect(() => {
        /*
        axiosinstance.get('users/').then((res) => {
            const Data = res.data;
            setUserData({ user: Data });
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
        });*/


    }, [setProfilePhoto, setUserData,
        setCommentData, setCurrentPosts,
        setLoading, setOldPosts, setAllPosts,

    ]);

    return (
        <View>
           
                <Text >
                    ff
            </Text>
        </View>

    );
}

const styles = StyleSheet.create({

});