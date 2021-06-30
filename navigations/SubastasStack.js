import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Subastas from '../screens/subastas/Subastas'
import Subasta from '../screens/subastas/Subasta'
import AddPujasSubasta from '../screens/subastas/AddPujasSubasta'

const Stack = createStackNavigator()

export default function SubastasStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="subastas"
                component={Subastas}
                options={{ title: "Subastas" }}
            />
            <Stack.Screen
                name="subasta"
                component={Subasta}
            />
            <Stack.Screen
                name="add-pujas-subasta"
                component={AddPujasSubasta}
                options={{ title: "Subasta" }}
            />
        </Stack.Navigator>
    )
}