import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button,Input } from 'react-native-elements'
import { isEmpty } from 'lodash'

import { updatePrecioBase } from '../../utils/actions'

export default function ChangeDireccionForm({ id,itemUuid, precioBase, setModalVisible, toastRef}) {
    const [newPrecioBase, setNewPrecioBase] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const onSubmit = async() => {
        if (!validateForm()) {
            return
        }

        const categoria =calcularCategoria(newPrecioBase)
        setLoading(true)
        const result = await updatePrecioBase(id,itemUuid,newPrecioBase,categoria)  
        setLoading(false)

        if (!result.statusResponse) {
            setError("Error al establecer el precio base, intenta más tarde.")
            return
        }
        toastRef.current.show("Se ha establecido el precio base.", 3000)
        setModalVisible(false)
    }

    const validateForm = () => {
        setError(null)

        if(isEmpty(newPrecioBase)) {
            setError("Debes ingresar un precio base.")
            return false
        }

        return true
    }

    const calcularCategoria = (precioB) => {
        let p = "";
        if (precioB < 10000) {
        p = "COMUN";
        return p;
        } else if (precioB < 50000) {
        p = "ESPECIAL";
        return p;
        } else if (precioB < 100000) {
        p = "PLATA";
        return p;
        } else if (precioB <= 500000) {
        p = "ORO";
        return p;
        } else if (precioB > 500000) {
        p = "PLATINO";
        console.log("el valor de p al final es:",p)
        return p;
        }
    };

    return (
        <View style={styles.view}>
            <Input
                placeholder="Ingresa el Precio Base"
                containerStyle={styles.input}
                defaultValue={precioBase}
                onChange={(e) => setNewPrecioBase(e.nativeEvent.text)}
                errorMessage={error}
                leftIcon={{
                    type: "material-community",
                    name: "currency-usd",
                    color: "#c2c2c2"
                }}
            />
            <Button
                title="Establecer Precio Base"
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
