import React, { useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { Button, Icon, Input } from 'react-native-elements'
import { isEmpty, isNumber, size } from 'lodash'
import { useNavigation } from '@react-navigation/native'

import { validateEmail } from '../../utils/helpers'
import { registerUser } from '../../utils/actions'
import Loading from '../Loading'

export default function RegisterForm() {
    const [formData, setFormData] = useState(defaultFormValues())
    const [errorEmail, setErrorEmail] = useState("")
    const [errorNombre, setErrorNombre] = useState("")
    const [errorApellido, setErrorApellido] = useState("")
    const [errorDNI, setErrorDNI] = useState("")
    const [errorDireccion, setErrorDireccion] = useState("")
    const [loading, setLoading] = useState(false)

    const navigation = useNavigation()

    const onChange = (e,type) =>{
        setFormData({...formData, [type]:e.nativeEvent.text})
    }

    const doRegisterUser = async() => {
        if (!validateData()){
            return;
        }

        setLoading(true)
        const result = await registerUser(formData.email, "123456",formData.nombre,formData.apellido,formData.dni,formData.direccion,"comun")
        setLoading(false)

        if (!result.statusResponse){
            setErrorEmail(result.error)
            return
        }
        Alert.alert("Confirmación", "Será redirigido a una nueva pantalla para generar su contraseña.")
        navigation.navigate("generate-password")
    }

    const validateData = () => {
        setErrorEmail("")
        setErrorNombre("")
        setErrorApellido("")
        setErrorDNI("")
        setErrorDireccion("")
        let isValid = true
        
        if(!validateEmail(formData.email)) {
            setErrorEmail("Debes ingresar un email válido.")
            isValid = false
        }
        
        if(isEmpty(formData.nombre)) {
            setErrorNombre("Debes ingresar un nombre válido.")
            isValid = false
        }
        
        if(isEmpty(formData.apellido)) {
            setErrorApellido("Debes ingresar un apellido válido.")
            isValid = false
        }
        
        if(isEmpty(formData.dni)) {
            setErrorDNI("Debes ingresar un dni válido.")
            isValid = false
        }

        if(isNaN(formData.dni)) {
            setErrorDNI("Debes un dni válido.")
            isValid = false
        }

        if(size(formData.dni) < 6) {
            setErrorDNI("El dni debe contener al menos seis números.")
            isValid = false
        }

        if(size(formData.dni) > 8) {
            setErrorDNI("El dni debe contener menos de ocho números.")
            isValid = false
        }
        
        if(isEmpty(formData.direccion)) {
            setErrorDireccion("Debes ingresar una dirección válida.")
            isValid = false
        }
        return isValid
    }

    return (
        <View style={styles.form}>       
            <Input
                containerStyle={styles.input}
                placeholder="Ingresa tu nombre..."
                onChange={(e) => onChange(e, "nombre")}
                errorMessage={errorNombre}
                defaultValue={formData.nombre}
            />
            <Input
                containerStyle={styles.input}
                placeholder="Ingresa tu apellido..."
                onChange={(e) => onChange(e, "apellido")}
                errorMessage={errorApellido}
                defaultValue={formData.apellido}
            />
            <Input
                containerStyle={styles.input}
                placeholder="Ingresa tu DNI..."
                onChange={(e) => onChange(e, "dni")}
                errorMessage={errorDNI}
                defaultValue={formData.dni}
            />
            <Input
                containerStyle={styles.input}
                placeholder="Ingresa tu direccion..."
                onChange={(e) => onChange(e, "direccion")}
                errorMessage={errorDireccion}
                defaultValue={formData.direccion}
            />
            <Input
                containerStyle={styles.input}
                placeholder="Ingresa tu email..."
                onChange={(e)=> onChange(e,"email")}
                keyboardType="email-address"
                errorMessage={errorEmail}
                defaultValue={formData.email}
             />
             <Button
                title="Registrar nuevo usuario"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={()=> doRegisterUser()}
             />
             <Loading isVisible={loading} text="Creando cuenta..."/>
        </View>
    )
}

const defaultFormValues = () =>{
    return { email: "", nombre:"", apellido: "", dni: "", direccion: ""}
}

const styles = StyleSheet.create({
    form: {
        marginTop: 30
    },
    input: {
        width: "100%"
    },  
    btnContainer: {
        marginTop: 20,
        width: "95%",
        alignSelf: "center"
    },
    btn: {
        backgroundColor: "#442484"
    },
    icon: {
        color: "#c1c1c1"
    }
})