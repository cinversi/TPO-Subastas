import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Subastas from '../screens/subastas/Subastas'
import AddSubasta from '../screens/subastas/AddSubasta'
import Subasta from '../screens/subastas/Subasta'
import AddReviewSubasta from '../screens/subastas/AddReviewSubasta'

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
                name="add-subasta"
                component={AddSubasta}
                options={{ title: "Crear Subasta" }}
            />
            <Stack.Screen
                name="subasta"
                component={Subasta}
            />
            <Stack.Screen
                name="add-review-subasta"
                component={AddReviewSubasta}
                options={{ title: "Subasta" }}
            />
        </Stack.Navigator>
    )
}