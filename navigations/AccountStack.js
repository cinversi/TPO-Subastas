import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Account from '../screens/account/Account'
import Login from '../screens/account/Login'
import Register from '../screens/account/Register'
import RecoverPassword from '../screens/account/RecoverPassword'
import GeneratePassword from '../screens/account/GeneratePassword'
import AccountOptions from '../components/account/AccountOptions'
import PaymentsOptions from '../screens/account/PaymentOptions'
import AddPayment from '../screens/account/AddPayment'
import UserActivityInfo from '../screens/account/UserActivityInfo'

const Stack = createStackNavigator()

export default function AccountStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="account"
                component={Account}
                options={{ title: "Cuenta" }}
            />
            <Stack.Screen
                name="login"
                component={Login}
                options={{ title: "Iniciar Sesión" }}
            />
            <Stack.Screen
                name="register"
                component={Register}
                options={{ title: "Registrar Usuario" }}
            />
            <Stack.Screen
                name="recover-password"
                component={RecoverPassword}
                options={{ title: "Recuperar Contraseña" }}
            />
            <Stack.Screen
                name="generate-password"
                component={GeneratePassword}
                options={{ title: "Genera tu Contraseña" }}
            />
            <Stack.Screen
                name="account-options"
                component={AccountOptions}
                options={{ title: "Datos personales" }}
            />
            <Stack.Screen
                name="payment-options"
                component={PaymentsOptions}
                options={{ title: "Medios de pago" }}
            />
            <Stack.Screen
                name="add-payment"
                component={AddPayment}
                options={{ title: "Agregar Medio de Pago" }}
            />
            <Stack.Screen
                name="user-activity-info"
                component={UserActivityInfo}
                options={{ title: "Información de Actividad" }}
            />
        </Stack.Navigator>
    )
}