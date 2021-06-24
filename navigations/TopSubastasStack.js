import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import TopSubastas from '../screens/TopSubastas'

const Stack = createStackNavigator()

export default function TopSubastasStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="top-subastas"
                component={TopSubastas}
                options={{title:"Las Mejores Subastas"}}
            />
        </Stack.Navigator>
    )
}
