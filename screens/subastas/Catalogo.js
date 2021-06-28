import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native'
import { size } from 'lodash'
import firebase from 'firebase/app'

import Loading from '../../components/Loading'
import ListItems from '../../components/subastas/ListItems'
import { getMoreItemsCatalogo, getItemsCatalogo } from '../../utils/actions'


export default function Catalogo({ navigation }) {
    const [user, setUser] = useState(null)
    const [startItem, setStartItem] = useState(null)
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(false)

    const limitItems = 7

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
            userInfo ? setUser(true) : setUser(false)
        })
    }, [])

    useFocusEffect(
        useCallback(() => {
            async function getData() {
                setLoading(true)
                const response = await getItemsCatalogo(limitItems)
                if (response.statusResponse) {
                    setStartItem(response.startItem)
                    setItems(response.items)
                }
                setLoading(false)
            }
            getData()
        }, [])
    )

    const handleLoadMore = async() => {
        if (!startItem) {
            return
        }

        setLoading(true)
        const response = await getMoreItemsCatalogo(limitItems, startItem)
        if (response.statusResponse) {
            setStartItem(response.startItem)
            setItems([...items, ...response.items])
        }
        setLoading(false)
    }

    if (user === null) {
        return <Loading isVisible={true} text="Cargando..."/>
    }

    return (
        <View style={styles.viewBody}>
            {
                size(items) > 0 ? (
                    <ListCatalogos
                        items={items}
                        navigation={navigation}
                        handleLoadMore={handleLoadMore}
                    />
                ) : (
                    <View style={styles.notFoundView}>
                        <Text style={styles.notFoundText}>No hay productos en el catálogo.</Text>
                    </View>
                )
            }
            <Loading isVisible={loading} text="Cargando productos..."/>
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
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