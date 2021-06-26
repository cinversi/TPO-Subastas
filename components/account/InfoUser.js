import React, { useState,useCallback } from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'
import { Avatar } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native'
import { getDocumentById, updateProfile, uploadImage } from '../../utils/actions'
import { loadImageFromGallery } from '../../utils/helpers'
import Loading from '../../components/Loading'

export default function InfoUser({ user, setLoading, setLoadingText }) {
    const [photoUrl, setPhotoUrl] = useState(user.photoURL)
    const [usuario, setUsuario] = useState(null)
    
    useFocusEffect(
        useCallback(() => {
            async function getData() {
                const response = await getDocumentById("users", user.uid)
                setUsuario(response.document)
            }
            getData()
        }, [])
    )

    const changePhoto = async() => {
        const result = await loadImageFromGallery([1, 1])
        if (!result.status) {
            return
        }
        setLoadingText("Actualizando imagen...")
        setLoading(true)
        const resultUploadImage = await uploadImage(result.image, "avatars", user.uid)
        if (!resultUploadImage.statusResponse) {
            setLoading(false)
            Alert.alert("Ha ocurrido un error al almacenar la foto de perfil.")
            return
        }
        const resultUpdateProfie = await updateProfile({ photoURL: resultUploadImage.url })
        setLoading(false)
        if (resultUpdateProfie.statusResponse) {
            setPhotoUrl(resultUploadImage.url)
        } else {
            Alert.alert("Ha ocurrido un error al actualizar la foto de perfil.")
        }
    }

    if (usuario === null) {
        return <Loading isVisible={true} text="Cargando..."/>
    }

    return (
        <View style={styles.container}>
            <Avatar
                rounded
                size="large"
                onPress={changePhoto}
                source={
                    photoUrl 
                        ? { uri: photoUrl }
                        : require("../../assets/avatar-default.jpg")
                }
            />
            <View style={styles.infoUser}>
                <Text style={styles.displayName}>
                    {
                        usuario.nombre
                    }
                </Text>
                <Text>{usuario.email}</Text>
                <Text>{usuario.categoria}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "#f9f9f9",
        paddingVertical: 30
    },
    infoUser: {
        marginLeft: 20
    },
    displayName: {
        fontWeight: "bold",
        paddingBottom: 5
    }
})