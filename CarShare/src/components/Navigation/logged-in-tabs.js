import React from 'react';
import { Icon } from 'react-native-elements';
import { createBottomTabNavigator } from 'react-navigation';

import FindARideStack from './find-a-ride-stack';
import MyListingsStack from './my-listings-stack';
import RidesTakingStack from './rides-taking-stack';
import PostARideStack from './post-a-ride-stack';
import ProfileStack from './profile-stack';
import { tabNavActive } from '../../config/commonStyles'

export const LoggedInTabs = createBottomTabNavigator({
    FindARide: {
        screen: FindARideStack,
        navigationOptions: () => ({
            title: 'Find a ride',
            tabBarIcon: ({ focused, tintColour }) => (
                <Icon name="search" color={focused ? tabNavActive : tintColour} size={25} />
            )
        })
    },
    PostARide: {
        screen: PostARideStack,
        navigationOptions: () => ({
            title: 'Post a ride',
            tabBarIcon: ({ focused, tintColour }) => (
                <Icon name="add" color={focused ? tabNavActive : tintColour} size={25} />
            )
        })
    },
    MyListings: {
        screen: MyListingsStack,
        navigationOptions: () => ({
            title: 'My listings',
            tabBarIcon: ({ focused, tintColour }) => (
                <Icon name="folder" color={focused ? tabNavActive : tintColour} size={25} />
            )
        })
    },
    RidesImTaking: {
        screen: RidesTakingStack,
        navigationOptions: () => ({
            title: 'My Rides',
            tabBarIcon: ({ focused, tintColour }) => (
                <Icon name="people" color={focused ? tabNavActive : tintColour} size={25} />
            )
        })
    },
    Profile: {
        screen: ProfileStack,
        navigationOptions: () => ({
            tabBarIcon: ({ focused, tintColour }) => (
                <Icon name="person" color={focused ? tabNavActive : tintColour} size={25} />
            )
        })
    },
},
    {
        tabBarOptions: {
            activeTintColor: tabNavActive
        }
    });

export default LoggedInTabs