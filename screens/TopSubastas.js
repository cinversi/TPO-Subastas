import React, { useState, useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'

import Loading from '../components/Loading'
import ListTopSubastas from '../components/ranking/ListTopSubastas'
import { getTopSubastas } from '../utils/actions'

export default function TopSubastas({ navigation }) {
    const [subastas, setSubastas] = useState(null)
    const [loading, setLoading] = useState(false)

    useFocusEffect(
        useCallback(() => {
            async function getData() {
                setLoading(true)
                const response = await getTopSubastas(10)
                if (response.statusResponse) {
                    setSubastas(response.subastas)
                }
                setLoading(false)
            }
            getData()
        }, [])
    )

    return (
        <View>
            <ListTopSubastas
                subastas={subastas}
                navigation={navigation}
            />
            <Loading isVisible={loading} text="Por favor espere..."/>
        </View>
    )
}

const styles = StyleSheet.create({})