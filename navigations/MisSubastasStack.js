import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import misSubastas from '../screens/misSubastas/misSubastas'
import AddSubasta from '../screens/subastas/AddSubasta'
import miSubasta from '../screens/misSubastas/miSubasta'
import miSubastaAdmin from '../screens/misSubastasAdmin/miSubastaAdmin'
const Stack = createStackNavigator()

export default function MisSubastasStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="mis-subastas"
                component={misSubastas}
                options={{ title: "Mis Subastas" }}
            />
            <Stack.Screen
                name="add-subasta"
                component={AddSubasta}
                options={{ title: "Crear Subasta" }}
            />
            <Stack.Screen
                name="miSubasta"
                component={miSubasta}
            />
            <Stack.Screen
                name="miSubastaAdmin"
                component={miSubastaAdmin}
                options={{ title: "Mis Subastas Admin" }}
            />
        </Stack.Navigator>
    )
}