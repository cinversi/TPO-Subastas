import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native'
import { size } from 'lodash'
import firebase from 'firebase/app'

import Loading from '../../components/Loading'
import ListPaymentOptions from '../../components/account/ListPaymentOptions'
import { getCurrentUser, getDocumentById } from '../../utils/actions'


export default function PaymentsOptions({ navigation }) {
    const [user, setUser] = useState(null)
    const [startPayment, setStartPayment] = useState(null)
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
            userInfo ? setUser(true) : setUser(false)
        })
    }, [])

    useFocusEffect(
        useCallback(() => {
            async function getData() {
                setLoading(true)
                const currentUser = getCurrentUser().uid;
                const response = await getDocumentById("users", currentUser);
                setPayments(response.document.medioPago)
                setLoading(false)
            }
            getData()
        }, [])
    )

    if (user === null) {
        return <Loading isVisible={true} text="Cargando..."/>
    }

    return (
        <View style={styles.viewBody}>
            {
                size(payments) > 0 ? (
                    <ListPaymentOptions
                        payments={payments}
                        navigation={navigation}
                        handleLoadMore={() => {}}
                    />
                ) : (
                    <View style={styles.notFoundView}>
                        <Text style={styles.notFoundText}>No hay medios de pago registrados.</Text>
                    </View>
                )
            }
            {
                user && (
                    <Icon
                        type="material-community"
                        name="plus"
                        color="#442484"
                        reverse
                        containerStyle={styles.btnContainer}
                        onPress={() => navigation.navigate("add-payment")}
                    />
                )
            }
            <Loading isVisible={loading} text="Cargando medios de pago..."/>
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
    },
    btnContainer: {
        position: "absolute",
        bottom: 10,
        right: 10,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.5
    },
    notFoundView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    notFoundText: {
        fontSize: 18,
        fontWeight: "bold"
    }
})