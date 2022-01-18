/*
import React from 'react';
import {
    StyleSheet, Modal,
    useEffect, Button,
    useState, KeyboardAvoidingView,
    Text, Keyboard, AsyncStorage,
    View, Alert, Image, SafeAreaView,
    TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight,
    Platform, Dimensions, ImageBackground, TextInput, ScrollView,
} from 'react-native';
import { useDimensions, useDeviceOrientation } from '@react-native-community/hooks';
import { NativeRouter, Route, Link } from 'react-router-native';
import axios from 'axios';
import { Card, ListItem, Icon, SearchBar } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContainer, useNavigation, } from '@react-navigation/native';
import { Divider } from 'react-native-elements/dist/divider/Divider';
import jwt_decode from 'jwt-decode';

import colors from '../config/colors';
import Posts from './posts';



export default function ProfilePage(props) {
    const navigation = useNavigation();
    const [error, setError] = React.useState(false);
    const [loading, setLoading] = React.useState(true);



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
            setToken({ access_token })
            /*var userId = await AsyncStorage.setItem('current_user_id', decode.user_id);*/
        } catch (e) {
            alert(e);
            alert('Failed to fetch the data from storage');
        }
    }
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

    React.useEffect(() => {
        readData()

    }, []);

    //return ();

}
*/