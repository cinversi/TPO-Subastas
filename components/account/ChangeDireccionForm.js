import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button,Input } from 'react-native-elements'
import { isEmpty } from 'lodash'

import { updateDireccion } from '../../utils/actions'

export default function ChangeDireccionForm({ direccion, setShowModal, toastRef, setRelodUser}) {
    const [newDireccion, setNewDireccion] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const onSubmit = async() => {
        if (!validateForm()) {
            return
        }

        setLoading(true)
        const result = await updateDireccion(newDireccion)  
        setLoading(false)

        if (!result.statusResponse) {
            setError("Error al actualizar dirección, intenta más tarde.")
            return
        }

        setRelodUser(true)
        toastRef.current.show("Se ha actualizado la dirección.", 3000)
        setShowModal(false)
    }

    const validateForm = () => {
        setError(null)

        if(isEmpty(newDireccion)) {
            setError("Debes ingresar una dirección.")
            return false
        }

        return true
    }

    return (
        <View style={styles.view}>
            <Input
                placeholder="Ingresa dirección"
                containerStyle={styles.input}
                defaultValue={direccion}
                onChange={(e) => setNewDireccion(e.nativeEvent.text)}
                errorMessage={error}
                rightIcon={{
                    type: "material-community",
                    name: "map-marker",
                    color: "#c2c2c2"
                }}
            />
            <Button
                title="Cambiar Dirección"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={loading}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        paddingVertical: 10
    },
    input: {
        marginBottom: 10
    },
    btnContainer: {
        width: "95%"
    },
    btn: {
        backgroundColor: "#442484"
    }
})
