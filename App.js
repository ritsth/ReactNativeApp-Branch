import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, Button, View, Alert, Image, SafeAreaView, TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight, Platform, Dimensions, ImageBackground } from 'react-native';
import { useDimensions, useDeviceOrientation } from '@react-native-community/hooks';
import Welcome from './app/screens/WelcomeScreen';
import LoginPage from './app/screens/login';
import SigninPage from './app/screens/signin';
import Feed from './app/screens/feed';
import { NativeRouter, Route, Link } from 'react-router-native';
import { nativeHistory } from 'react-router-native';
import NotificationPage from './app/screens/notification';
import ProfilePage from './app/screens/profile';


export default function App() {

    return (<>
        <NativeRouter>  
            <Route exact path="/" component={Welcome} />
            <Route path="/login" component={LoginPage} />
            <Route path="/signin" component={SigninPage} />
            <Route path="/feed" component={Feed} />
            <Route path="/profile" component={ProfilePage} />
            <Route path="/notification" component={NotificationPage} />

        </NativeRouter>
    </>);
}


