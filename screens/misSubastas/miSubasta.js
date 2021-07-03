import React, { useState, useCallback, useRef } from 'react'
import { View } from 'react-native'
import { Alert, Dimensions, StyleSheet, Text, ScrollView } from 'react-native'
import { ListItem, Button } from 'react-native-elements'
import { size} from 'lodash'
import { useFocusEffect } from '@react-navigation/native'
import firebase from 'firebase/app'
import Toast from 'react-native-easy-toast'

import CarouselImages from '../../components/CarouselImages'
import Loading from '../../components/Loading'
import ListItemsMiSubasta from '../../components/subastas/ListItemsMiSubasta'

import { getCurrentUser, getDocumentById, AceptarSubastaRematadorUpdate, RechazarSubastaRematadorUpdate, setNotificationMessage, sendPushNotification } from '../../utils/actions'

const widthScreen = Dimensions.get("window").width

export default function miSubasta({ navigation, route }) {
    const { id, name } = route.params
    const toastRef = useRef()
    
    const [subasta, setSubasta] = useState(null)
    const [activeSlide, setActiveSlide] = useState(0)
    const [userLogged, setUserLogged] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [catItems, setCatItems] = useState([])

    firebase.auth().onAuthStateChanged(user => {
        user ? setUserLogged(true) : setUserLogged(false)
        setCurrentUser(user)
    })

    navigation.setOptions({ title: name })

    useFocusEffect(
        useCallback(() => {
            (async() => {
                const response = await getDocumentById("subastas", id)
                if (response.statusResponse) {
                    setSubasta(response.document)
                    setCatItems(response.document.catalogo)
                } else {
                    setSubasta({})
                    Alert.alert("Ocurrió un problema cargando la subasta, intente más tarde.")
                }
            })()
        }, [])
    )

    if (!subasta) {
        return <Loading isVisible={true} text="Cargando..."/>
    }

    const AceptarSubastaRematador = async() => {
        
        setLoading(true)
        const responseAddMoreInfo = await AceptarSubastaRematadorUpdate(id)
        if (!responseAddMoreInfo.statusResponse) {
            setLoading(false)
            toastRef.current.show("Error al aceptar la subasta", 3000)
            return
        }

        setLoading(true)
        const resultToken = await getDocumentById("users",getCurrentUser().uid)
            if(!resultToken.statusResponse){
                setLoading(false)
                Alert.alert("No se pudo obtener el token del usuario")
                return
        }
        
        const messageNotificaction = setNotificationMessage(
            resultToken.document.token,
            'App Subastas',
            'El usuario ha aceptado los terminos y activo la subasta',
            {data:'Data de prueba'}
        )

        const response = await sendPushNotification(messageNotificaction)

        if (response){
            Alert.alert("Se ha activado la subasta.")
        }else{
            Alert.alert("Ocurrió un problema al aceptar la subasta")
        }
        navigation.navigate("mis-subastas")
    } 

    const RechazarSubastaRematador = async() => {
        console.log("entra")
        console.log(id)
        setLoading(true)
        const responseRechazar= await RechazarSubastaRematadorUpdate(id)
        if (!responseRechazar.statusResponse) {
            setLoading(false)
            toastRef.current.show("Error al rechazar la subasta", 3000)
            return
        }
        setLoading(true)
        const resultToken = await getDocumentById("users",getCurrentUser().uid)
            if(!resultToken.statusResponse){
                setLoading(false)
                Alert.alert("No se pudo obtener el token del usuario")
                return
        }
        
        const messageNotificaction = setNotificationMessage(
            resultToken.document.token,
            'App Subastas',
            'La propuesta de subasta fue rechazada por el subastador',
            {data:'Data de prueba'}
        )

        const response = await sendPushNotification(messageNotificaction)

        if (response){
            Alert.alert("Se ha rechazado la subasta.")
        }else{
            Alert.alert("Ocurrió un problema al rechazar la subasta.")
        }
        navigation.navigate("mis-subastas")
    }
    
    return (
        <ScrollView style={styles.viewBody}>
            <CarouselImages
                images={subasta.images}
                height={250}
                width={widthScreen}
                activeSlide={activeSlide}
                setActiveSlide={setActiveSlide}
            />
            <TitleSubasta
                name={subasta.name}
                description={subasta.description}
                categoria={subasta.categoria}
                moneda={subasta.moneda}
                fechaSubastar={subasta.fechaSubastar}
                horaSubastar={subasta.horaSubastar}
            />
            <ListItem
                style={styles.containerListItem}
            ></ListItem>
            <Text style={styles.catalogoTitle}>Catálogo</Text>
            {
                size(catItems) > 0 ? (
                    <ListItemsMiSubasta
                        catItems={catItems}
                        navigation={navigation}
                        handleLoadMore={() => {}}
                        subasta={subasta}
                    />
                ) : (
                    <View style={styles.notFoundView}>
                        <Text style={styles.notFoundText}>No hay productos cargados.</Text>
                    </View>
                )
            }
            {
                subasta.statusSubasta == 'APROBADA' ? (
                    <View>
                        <Button
                            title="Aceptar Condiciones y Subastar"
                            onPress={AceptarSubastaRematador}
                            buttonStyle={styles.btnActivarSubasta}
                            icon={{
                                type: "material-community",
                                name: "check-circle-outline",
                                color: "#ffff"
                            }}
                        />
                        <Button
                            title="Rechazar condiciones"
                            onPress={RechazarSubastaRematador}
                            buttonStyle={styles.btnRechazarSubasta}
                            icon={{
                                type: "material-community",
                                name: "close-circle-outline",
                                color: "#ffff"
                            }}
                        />
                    </View>
                ):null
            }
            <Toast ref={toastRef} position="center" opacity={0.9}/>
            <Loading isVisible={loading} text="Por favor espere..."/>
        </ScrollView>
    )
}

function TitleSubasta({ name, description, categoria, moneda, fechaSubastar, horaSubastar }) {
    return (
        <View style={styles.viewSubastaTitle}>
            <View style={styles.viewSubastaContainer}>
                <Text style={styles.nameSubasta}>{name}</Text>
            </View>
            <Text style={styles.descriptionSubasta}>{description}</Text>
            <Text style={styles.categoriaSubasta}>Categoría {categoria}</Text>
            <Text style={styles.monedaSubastaAprobada}>Moneda: ${moneda}</Text>
            <Text style={styles.infoSubastaAprobada}>Fecha: {fechaSubastar}</Text>
            <Text style={styles.infoSubastaAprobada}>Hora: {horaSubastar}hs</Text>

        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff"
    },
    viewSubastaTitle: {
        padding: 15
    },
    catalogoTitle: {
        fontSize: 20,
        fontWeight: "bold",
        padding: 10,
        color:"#442848"
    },
    viewSubastaContainer: {
        flexDirection: "row"
    },
    descriptionSubasta: {
        marginTop: 8,
        color: "gray",
        textAlign: "justify"
    },
    nameSubasta: {
        fontWeight: "bold"
    },
    monedaSubastaAprobada: {
        marginTop: 8,
        fontWeight: "bold",
        textAlign: "justify"
    },
    infoSubastaAprobada: {
        fontWeight: "bold",
        textAlign: "justify"
    },
    categoriaSubasta: {
        fontWeight: "bold",
        color:"#ffbc63",
        marginTop:10
    },
    viewSubastaInfo: {
        margin: 15,
        marginTop: 15
    },
    subastaInfoTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15
    },
    containerListItem: {
        borderBottomColor: "#a376c7",
        borderBottomWidth: 1
    },
    textArea: {
        height: 50,
        paddingHorizontal: 10
    },
    btnSend: {
        backgroundColor: "#442848"
    },
    btnSendContainer: {
        width: "95%"
    },
    textModal: {
        color: "#000",
        fontSize: 16,
        fontWeight: "bold"
    },
    modalContainer: {
        justifyContent: "center",
        alignItems: "center"
    },
    btnActivarSubasta: {
        margin: 20,
        backgroundColor: "#44a858",
    },
    btnRechazarSubasta: {
        margin: 20,
        marginTop:1,
        backgroundColor: "#cf4666",
    }
})