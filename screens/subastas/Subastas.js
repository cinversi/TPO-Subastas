import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native'
import { size } from 'lodash'
import firebase from 'firebase/app'

import Loading from '../../components/Loading'
import ListSubastas from '../../components/subastas/ListSubastas'
import { getCurrentUser, getDocumentById, getMoreSubastas,getSubastas, getSubastasComun,getSubastasEspecial,getSubastasPlata,getSubastasOro,getSubastasPlatino } from '../../utils/actions'


export default function Subastas({ navigation }) {
    const [user, setUser] = useState(null)
    const [startSubasta, setStartSubasta] = useState(null)
    const [subastas, setSubastas] = useState([])
    const [loading, setLoading] = useState(false)
    const [usuario, setUsuario] = useState()
    const [usuarioCategoria, setUsuarioCategoria] = useState()
    const [currentUser, setcurrentUser] = useState(false)
    const limitSubastas = 25

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
            userInfo ? (setUser(true) && setcurrentUser(true)) : setUser(false)
        })
    }, [])

    console.log("user",user)
    console.log("currentuser",currentUser)

    useFocusEffect(
        useCallback(() => {
            async function getData() {
                setLoading(true)
                const response = await getDocumentById("users", getCurrentUser().uid);
                setUsuario(response.document)
                setUsuarioCategoria(response.document.categoria)
                setLoading(false)
            }
            getData()
        }, [])
    )

    useFocusEffect(
        useCallback(() => {
            async function getDataCategorias() {
                setLoading(true)
                if(user==false){
                    const response = await getSubastas(limitSubastas)
                    if (response.statusResponse) {
                        setStartSubasta(response.startSubasta)
                        setSubastas(response.subastas)
                    }
                }else if(usuarioCategoria=="COMUN"){
                    const response = await getSubastasComun(limitSubastas)
                    if (response.statusResponse) {
                        setStartSubasta(response.startSubasta)
                        setSubastas(response.subastas)
                    }
                }else if(usuarioCategoria=="ESPECIAL"){
                    const response = await getSubastasEspecial(limitSubastas)
                    if (response.statusResponse) {
                        setStartSubasta(response.startSubasta)
                        setSubastas(response.subastas)
                    }
                }else if(usuarioCategoria=="PLATA"){
                    const response = await getSubastasPlata(limitSubastas)
                    if (response.statusResponse) {
                        setStartSubasta(response.startSubasta)
                        setSubastas(response.subastas)
                    }
                }else if(usuarioCategoria=="ORO"){
                    const response = await getSubastasOro(limitSubastas)
                    console.log("entre a este if")
                    if (response.statusResponse) {
                        setStartSubasta(response.startSubasta)
                        setSubastas(response.subastas)
                    }
                }else if(usuarioCategoria=="PLATINO"){
                    const response = await getSubastasPlatino(limitSubastas)
                    if (response.statusResponse) {
                        setStartSubasta(response.startSubasta)
                        setSubastas(response.subastas)
                    }
                }
                setLoading(false)
            }
            getDataCategorias()
        }, [])
    )

    const handleLoadMore = async() => {
        if (!startSubasta) {
            return
        }

        setLoading(true)
        const response = await getMoreSubastas(limitSubastas, startSubasta)
        if (response.statusResponse) {
            setStartSubasta(response.startSubasta)
            setSubastas([...subastas, ...response.subastas])
        }
        setLoading(false)
    }

    if (user === null) {
        return <Loading isVisible={true} text="Cargando..."/>
    }

    return (
        <View style={styles.viewBody}>
            {
                size(subastas) > 0 ? (
                    <ListSubastas
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
            <Loading isVisible={loading} text="Cargando subastas..."/>
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