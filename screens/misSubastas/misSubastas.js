import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native'
import { size } from 'lodash'
import firebase from 'firebase/app'

import Loading from '../../components/Loading'
import ListMisSubastas from '../../components/misSubastas/ListMisSubastas'
import ListMisSubastasAdmin from '../../components/misSubastasAdmin/ListMisSubastasAdmin'

import { getCurrentUser, getDocumentById, getMoreMisSubastas, getMisSubastas, getMisSubastasAdmin, getMoreMisSubastasAdmin } from '../../utils/actions'

export default function Subastas({ navigation }) {
    const [user, setUser] = useState(null)
    const [startSubasta, setStartSubasta] = useState(null)
    const [subastas, setSubastas] = useState([])
    const [loading, setLoading] = useState(false)
    const [userIsAdmin, setUserIsAdmin] = useState(false)
    const [startSubastaAdmin, setStartSubastaAdmin] = useState(null)
    const[subastasAdmin,setSubastasAdmin] = useState([])
    const limitSubastas = 7
    const limitSubastasAdmin = 7

    const clearErrors = () => {
        setUserIsAdmin(false)
    }

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
            userInfo ? setUser(true) : setUser(false)
        })
    }, [])

    useFocusEffect(
        useCallback(() => {
            async function getData() {
                clearErrors()
                const response = await getDocumentById("users", getCurrentUser().uid)
                if(response.document.role === 'admin'){
                    setUserIsAdmin(true)
                }
            }
            getData()
        }, [])
    )

    useFocusEffect(
        useCallback(() => {
            async function getData() {
                setLoading(true)
                const response = await getMisSubastas(limitSubastas)
                if (response.statusResponse) {
                    setStartSubasta(response.startSubasta)
                    setSubastas(response.subastas)
                }
                setLoading(false)
            }
            getData()
        }, [])
    )

    const handleLoadMore = async() => {
        if (!startSubasta) {
            return
        }

        setLoading(true)
        const uid = getCurrentUser().uid
        const response = await getMoreMisSubastas(limitSubastas, startSubasta,uid)
        if (response.statusResponse) {
            setStartSubasta(response.startSubasta)
            setSubastas([...subastas, ...response.subastas])
        }
        setLoading(false)
    }


    useFocusEffect(
        useCallback(() => {
            async function getDataAdmin() {
                setLoading(true)
                const result = await getMisSubastasAdmin(limitSubastasAdmin)
                if (result.statusResponse) {
                    setStartSubastaAdmin(result.startSubastaAdmin)
                    setSubastasAdmin(result.subastasAdmin)
                }
                setLoading(false)
            }
            getDataAdmin()
        }, [])
    )
    
    const handleLoadMoreAdmin = async() => {
        if (!startSubastaAdmin) {
            return
        }
    
        setLoading(true)
        const uid = getCurrentUser().uid
        const result = await getMoreMisSubastasAdmin(limitSubastasAdmin, startSubastaAdmin,uid)
        if (result.btnContainerstatusResponse) {
            setStartSubastaAdmin(result.startSubastaAdmin)
            setSubastasAdmin([...subastasAdmin, ...response.subastasAdmin])
        }
        setLoading(false)
    }


    if (user === null) {
        return <Loading isVisible={true} text="Cargando..."/>
    }

    return (
        userIsAdmin ? (
                <View style={styles.viewBody}>
                {
                    size(subastasAdmin) > 0 ? (
                        <ListMisSubastasAdmin
                            subastas={subastasAdmin}
                            navigation={navigation}
                            handleLoadMore={handleLoadMoreAdmin}
                        />
                    ) : (
                        <View style={styles.notFoundView}>
                            <Text style={styles.notFoundText}>No hay subastas cargadas para evaluar</Text>
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
                            onPress={() => navigation.navigate("add-subasta")}
                        />
                    )
                }
                <Loading isVisible={loading} text="Cargando subastas..."/>
            </View>
        ):(
            <View style={styles.viewBody}>
                {
                    size(subastas) > 0 ? (
                        <ListMisSubastas
                            subastas={subastas}
                            navigation={navigation}
                            handleLoadMore={handleLoadMore}
                        />
                    ) : (
                        <View style={styles.notFoundView}>
                            <Text style={styles.notFoundText}>No hay subastas registradas.</Text>
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
                            onPress={() => navigation.navigate("add-subasta")}
                        />
                    )
                }
                <Loading isVisible={loading} text="Cargando subastas..."/>
            </View>
        )
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