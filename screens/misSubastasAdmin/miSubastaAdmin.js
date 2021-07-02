import React, { useState, useCallback, useRef } from 'react'
import { View } from 'react-native'
import { Alert, Dimensions, StyleSheet, Text, ScrollView } from 'react-native'
import { ListItem, Button } from 'react-native-elements'
import { size } from 'lodash'
import { useFocusEffect } from '@react-navigation/native'
import firebase from 'firebase/app'
import Toast from 'react-native-easy-toast'
import { DateTimePickerModal } from "react-native-modal-datetime-picker";

import CarouselImages from '../../components/CarouselImages'
import Loading from '../../components/Loading'
import ListItemsMiSubastaAdmin from '../../components/subastas/ListItemsMiSubastaAdmin'
import { addMoreInfoSubasta, getDocumentById, getCurrentUser,setNotificationMessage,sendPushNotification} from '../../utils/actions'

const widthScreen = Dimensions.get("window").width

export default function miSubastaAdmin({ navigation, route }) {
    const { id, name } = route.params
    const toastRef = useRef()
    const [subasta, setSubasta] = useState(null)
    const [activeSlide, setActiveSlide] = useState(0)
    const [userLogged, setUserLogged] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [catItems, setCatItems] = useState([])
    const [fechaSubastar, setFecha] = useState(null);
    const [horaSubastar, setHora] = useState(null);
    const [horaFinSubasta, setHoraFinSubasta] = useState(null);
    const [isHourPickerVisible, setHourPickerVisibility] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

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

    const addMoreInfo = async() => {
        if (!validForm()) {
            return
        }
        setLoading(true)
        
        const responseAddMoreInfo = await addMoreInfoSubasta(id, fechaSubastar, horaSubastar,horaFinSubasta)
        if (!responseAddMoreInfo.statusResponse) {
            setLoading(false)
            toastRef.current.show("Error al agregar los datos a la subasta", 3000)
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
            'Los productos cargados fueron aprobados para ser subastados',
            {data:'Data de prueba'}
        )

        const response = await sendPushNotification(messageNotificaction)

        if (response){
            Alert.alert("Se ha aprobado la subasta y se ha notificado al usuario.")
        }else{
            Alert.alert("Ocurrió un problema al aprobar la subasta y notificar al usuario")
        }
        navigation.navigate("mis-subastas")
    } 

    //const sendNotificationMessage = async() => {
            
    //}
    
    const validForm = () => {
        clearErrors()
        let isValid = true
 
        return isValid
    }
 
    const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = (date) => {
    console.warn("A date has been picked: ", date);
    hideDatePicker();
    getParsedDate(date);
  };

  function getParsedDate(date) {
    const oldDate = new Date(date);
    const day = oldDate.getDate();
    const month = oldDate.getMonth() + 1;
    const year = oldDate.getFullYear();
    const hour = oldDate.getHours() + 3;
    const minutes = oldDate.getUTCMinutes();

    const fecha = day + "-" + month + "-" + year;
    const hora = hour + ":" + minutes;
    setFecha(fecha);
    setHora(hora);
  }

  const showHourPicker = () => {
    setHourPickerVisibility(true);
  };
  const hideHourPicker = () => {
    setHourPickerVisibility(false);
  };
  const handleHourConfirm = (h) => {
    console.warn("A hour has been picked: ", h);
    hideHourPicker();
    getParsedHour(h);
  };

  function getParsedHour(h) {
    const oldHour = new Date(h);
    const hour = oldHour.getHours() + 3;
    const minutes = oldHour.getUTCMinutes();

    const hora = hour + ":" + minutes;
    setHoraFinSubasta(hora);
  }

    const clearErrors = () => {
        setFecha(null)
        setHora(null)
        setHoraFinSubasta(null)
        setHourPickerVisibility(false)
        setDatePickerVisibility(false)
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
            />
            <ListItem
                style={styles.containerListItem}
            ></ListItem>
            <Text style={styles.catalogoTitle}>Catálogo</Text>
            {
                size(catItems) > 0 ? (
                    <ListItemsMiSubastaAdmin
                        catItems={catItems}
                        id={id}
                        navigation={navigation}
                        handleLoadMore={() => {}}
                    />
                ) : (
                    <View style={styles.notFoundView}>
                        <Text style={styles.notFoundText}>No hay productos cargados.</Text>
                    </View>
                )
            }
            <View style={styles.viewForm}>
            <Text style={styles.CompletarTitle}>Completar los siguientes campos: </Text>
            <Text>   Se deben completar los siguientes campos para</Text>
            <Text>   proceder a la activación de la subasta: </Text>
            </View>
            <View>
                    <Button
                    title="Ingresar Fecha y Hora de Inicio"
                    onPress={showDatePicker}
                    buttonStyle={styles.btnAddFecha}
                    />
                    <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="datetime"
                    locale="es-AR"
                    timeZoneOffsetInMinutes={0}
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                    />
                    <Button
                    title="Ingresar Hora de Finalización"
                    onPress={showHourPicker}
                    buttonStyle={styles.btnAddHora}
                    />
                    <DateTimePickerModal
                    isVisible={isHourPickerVisible}
                    mode="time"
                    locale="es-AR"
                    timeZoneOffsetInMinutes={0}
                    onConfirm={handleHourConfirm}
                    onCancel={hideHourPicker}
                    />
                </View>
            <Button
                title="Aceptar subasta"
                onPress={addMoreInfo}
                buttonStyle={styles.btnActivarSubasta}
            />
            <Toast ref={toastRef} position="center" opacity={0.9}/>
            <Loading isVisible={loading} text="Por favor espere..."/>
        </ScrollView>
    )
}

function TitleSubasta({ name, description, categoria }) {
    return (
        <View style={styles.viewSubastaTitle}>
            <View style={styles.viewSubastaContainer}>
                <Text style={styles.nameSubasta}>{name}</Text>
            </View>
            <Text style={styles.descriptionSubasta}>{description}</Text>
            <Text style={styles.categoriaSubasta}>Categoría {categoria}</Text>

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
        color:"#442484"
    },
    CompletarTitle: {
        fontSize: 20,
        fontWeight: "bold",
        padding: 10,
        color:"#cf4666"
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
    viewFavorite: {
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: "#fff",
        borderBottomLeftRadius: 100,
        padding: 5,
        paddingLeft: 15
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
    inputPrecioBase: {
        width: "80%",
        marginTop:10
    },
    btnAddFecha: {
        margin: 10,
        backgroundColor: "#b05777",
    },
    btnAddHora: {
        margin: 10,
        backgroundColor: "#b05777",
    },
    btnActivarSubasta: {
        margin: 20,
        backgroundColor: "#442484",
    }
})