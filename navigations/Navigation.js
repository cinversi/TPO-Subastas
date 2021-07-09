import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Icon } from 'react-native-elements'

import SubastasStack from './SubastasStack'
import AccountStack from './AccountStack'
import MisSubastasStack from './MisSubastasStack'

const Tab = createBottomTabNavigator()

export default function Navigation() {
    const screenOptions = (route, color) => {
        let iconName
        switch (route.name) {
            case "subastas":
                iconName = "gavel"
                break;
            case "mis-subastas":
                iconName = "shopping"
            break;
            case "account":
                iconName = "account-circle"
                break;
        }

        return (
            <Icon
                type="material-community"
                name={iconName}
                size={22}
                color={color}
            />
        )
    }

    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName="subastas"
                tabBarOptions={{
                    inactiveTintColor: "",
                    activeTintColor: "#442484"
                }}
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color }) => screenOptions(route, color)
                })}
            >
                <Tab.Screen
                    name="subastas"
                    component={SubastasStack}
                    options={{ title: "Subastas" }}
                />
                <Tab.Screen
                    name="mis-subastas"
                    component={MisSubastasStack}
                    options={{ title: "Mis Subastas" }}
                />
                <Tab.Screen
                    name="account"
                    component={AccountStack}
                    options={{ title: "Cuenta" }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    )
}