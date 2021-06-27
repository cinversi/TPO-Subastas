import React, { useState, useEffect } from 'react'
import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import { Avatar, Button, Icon, Input, Image } from 'react-native-elements'
import { map, size, filter, isEmpty } from 'lodash' 
import CountryPicker from 'react-native-country-picker-modal'
import MapView from 'react-native-maps'
import uuid from 'random-uuid-v4'
import { DateTimePickerModal } from 'react-native-modal-datetime-picker'
import CurrencyPicker from "react-native-currency-picker"

import { formatPhone, getCurrentLocation, loadImageFromGallery, validateEmail } from '../../utils/helpers'
import { addDocumentWithoutId, getCurrentUser, uploadImage } from '../../utils/actions'
import Modal from '../../components/Modal'

const widthScreen = Dimensions.get("window").width

export default function AddSubastaForm({ toastRef, setLoading, navigation }) {
    const [formData, setFormData] = useState(defaultFormValues())
    const [errorName, setErrorName] = useState(null)
    const [errorDescription, setErrorDescription] = useState(null)
    const [errorEmail, setErrorEmail] = useState(null)
    const [errorAddress, setErrorAddress] = useState(null)
    const [errorPhone, setErrorPhone] = useState(null)
    const [errorPrecioBase, setErrorPrecioBase] = useState(null)
    const [imagesSelected, setImagesSelected] = useState([])
    const [isVisibleMap, setIsVisibleMap] = useState(false)
    const [locationSubasta, setLocationSubasta] = useState(null)
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
    const [inputs, setInputs] = useState([{key: '',nombreItem: '',descripcion: '',cantidad: '',artista:'',fechaObra:'',historiaObra:''}])
    const [pujas,setPujas]=useState(null)
    const [fechaSubasta,setFecha]=useState(null)
    const [horaSubasta,setHora]=useState(null)
    const [horaFin,setHoraFin]=useState(null)
    const [isHourPickerVisible, setHourPickerVisibility] = useState(false)


    const addHandler = ()=>{
        const _inputs = [...inputs];
        _inputs.push({key: '',nombreItem: '',descripcion: '',cantidad: '',artista:'',fechaObra:'',historiaObra:''});
        setInputs(_inputs);
      }
 
      const deleteHandler = (key)=>{
        const _inputs = inputs.filter((input,index) => index != key);
        setInputs(_inputs);
      }
 
      const inputHandler = (text, key)=>{
        const _inputs = [...inputs];
        _inputs[key].nombreItem = text;
        _inputs[key].key   = key;
        setInputs(_inputs);
        
      }    
 
      const inputHandlerDescripcion = (text, key)=>{
        const _inputs = [...inputs];
        _inputs[key].descripcion = text;
        _inputs[key].key   = key;
        setInputs(_inputs);
        
      }
 
      const inputHandlerCantidad = (text, key)=>{
        const _inputs = [...inputs];
        _inputs[key].cantidad = text;
        _inputs[key].key   = key;
        setInputs(_inputs);
        
      }

      const inputHandlerArtista = (text, key)=>{
        const _inputs = [...inputs];
        _inputs[key].artista = text;
        _inputs[key].key   = key;
        setInputs(_inputs);        
      }
 
      const inputHandlerFechaObra= (text, key)=>{
        const _inputs = [...inputs];
        _inputs[key].fechaObra = text;
        _inputs[key].key   = key;
        setInputs(_inputs);        
      }
 
      const inputHandlerHistoriaObra= (text, key)=>{
        const _inputs = [...inputs];
        _inputs[key].historiaObra = text;
        _inputs[key].key   = key;
        setInputs(_inputs);        
      }

    const addSubasta = async() => {
        if (!validForm()) {
            return
        }

        setLoading(true)
        const responseUploadImages = await uploadImages()
        const subasta = {
            name: formData.name,
            address: formData.address,
            description: formData.description,
            callingCode: formData.callingCode,
            phone: formData.phone,
            location: locationSubasta,
            email: formData.email,
            images: responseUploadImages,
            catalogo:inputs,
            listadoPujas:pujas,
            precioBase: formData.precioBase,
            moneda:'ARS',
            precioFinal: 0,
            rating: 0,
            ratingTotal: 0,
            quantityVoting: 0,
            createAt: new Date(),
            rematador: getCurrentUser().uid,
            fechaSubastar:fechaSubasta,
            horaSubastar:horaSubasta,
            horaFinSubasta:horaFin,
            categoria: calcularCategoria(formData.precioBase)
        }
        
        const responseAddDocument = await addDocumentWithoutId("subastas", subasta)
        setLoading(false)

        if (!responseAddDocument.statusResponse) {
            toastRef.current.show("Error al grabar la subasta, por favor intenta más tarde.", 3000)
            return
        }

        navigation.navigate("subastas")
    }

    const uploadImages = async() => {
        const imagesUrl = []
        await Promise.all(
            map(imagesSelected, async(image) => {
                const response = await uploadImage(image, "subastas", uuid())
                if (response.statusResponse) {
                   imagesUrl.push(response.url)
                }
            })
        )
        return imagesUrl
    }

    const validForm = () => {
        clearErrors()
        let isValid = true

        if (isEmpty(formData.name)) {
            setErrorName("Debes ingresar el nombre de la subasta.")
            isValid = false
        }

        if (isEmpty(formData.address)) {
            setErrorAddress("Debes ingresar la dirección de la subasta.")
            isValid = false
        }

        if (!validateEmail(formData.email)) {
            setErrorEmail("Debes ingresar un email de la subasta válido.")
            isValid = false
        }

        if (size(formData.phone) < 10) {
            setErrorPhone("Debes ingresar un teléfono de la subasta válido.")
            isValid = false
        }

        if (isEmpty(formData.description)) {
            setErrorDescription("Debes ingresar una descripción de la subasta.")
            isValid = false
        }

        if (isEmpty(formData.precioBase)) {
            setErrorPrecioBase("Debes ingresar un precio base de la subasta.")
            isValid = false
        }

        if(isNaN(formData.precioBase)) {
            setErrorDNI("Debes ingresar un precio base válido.")
            isValid = false
        }

        if (!locationSubasta) {
            toastRef.current.show("Debes localizar a la subasta en el mapa.", 3000)
            isValid = false
        } else if(size(imagesSelected) === 0) {
            toastRef.current.show("Debes agregar al menos una imagen a la subasta.", 3000)
            isValid = false
        }

        return isValid
    }

    const showDatePicker = () => {
        setDatePickerVisibility(true)
    }
    const hideDatePicker = () => {
        setDatePickerVisibility(false)
    }
    const handleConfirm = (date) => {
        console.warn("A date has been picked: ", date)
        hideDatePicker()
        getParsedDate(date)
    }
    
    function getParsedDate(date){
        const oldDate = new Date(date)
        const day = oldDate.getDate()
        const month = oldDate.getMonth() + 1;
        const year = oldDate.getFullYear()
        const hour = oldDate.getHours() + 3;
        const minutes = oldDate.getUTCMinutes()

        const fecha = day + '-' + month + '-' + year
        const hora = hour + ':' + minutes
        setFecha(fecha)
        setHora(hora)
    }

    const showHourPicker = () => {
        setHourPickerVisibility(true)
    }
    const hideHourPicker = () => {
        setHourPickerVisibility(false)
    }
    const handleHourConfirm = (h) => {
        console.warn("A hour has been picked: ", h)
        hideHourPicker()
        getParsedHour(h)
    }
    
    function getParsedHour(h){
        const oldHour = new Date(h)
        const hour = oldHour.getHours() + 3;
        const minutes = oldHour.getUTCMinutes()

        const hora = hour + ':' + minutes
        setHoraFin(hora)
    }
    
    const calcularCategoria = (precioB) => {
        let p=""
        if (precioB < 10000) {
            p="COMUN"
            return p
        }
        else if(precioB < 50000){
            p="ESPECIAL"
            return p
        }
        else if(precioB < 100000){
            p="PLATA"
            return p
        }
        else if(precioB <= 500000){
            p="ORO"
            return p
        }
        else if(precioB > 500000){
            p="PLATINO"
            return p
        }
    }

    const clearErrors = () => {
        setErrorAddress(null)
        setErrorDescription(null)
        setErrorEmail(null)
        setErrorName(null)
        setErrorPhone(null)
        setErrorPrecioBase(null)
    }

    return (
        <ScrollView style={styles.viewContainer}>
            <ImageSubasta
                imageSubasta={imagesSelected[0]}
            />
            <FormAdd
                formData={formData}
                setFormData={setFormData}
                errorName={errorName}
                errorDescription={errorDescription}
                errorEmail={errorEmail}
                errorAddress={errorAddress}
                errorPhone={errorPhone}
                errorPrecioBase={errorPrecioBase}
                setIsVisibleMap={setIsVisibleMap}
                locationSubasta={locationSubasta}
            />
            {inputs.map((input, key)=>(
            <View style={styles.viewForm}>
            <Text style={{fontSize: 15, marginBottom:10,fontWeight:'bold'}}>Descripcion del Catálogo:</Text>
            <Input 
                placeholder={"Nombre del producto"} 
                value={input.value}  
                onChangeText={(text)=>inputHandler(text,key)}
                />
            <Input 
                placeholder={"Descripcion del producto"} 
                value={input.value}  
                onChangeText={(text)=>inputHandlerDescripcion(text,key)}
                />
            <Input 
                placeholder={"Cantidad de productos"} 
                value={input.value}  
                onChangeText={(text)=>inputHandlerCantidad(text,key)}
                />
            <Input 
                placeholder={"Artista de la obra (opcional)"} 
                value={input.value}  
                onChangeText={(text)=>inputHandlerArtista(text,key)}
                />
            <Input 
                placeholder={"Fecha de la obra (opcional)"} 
                value={input.value}  
                onChangeText={(text)=>inputHandlerFechaObra(text,key)}
                />
            <Input 
                placeholder={"Historia de la obra (opcional)"} 
                value={input.value}  
                onChangeText={(text)=>inputHandlerHistoriaObra(text,key)}
                />
            <TouchableOpacity onPress = {()=> deleteHandler(key)}>
            <Text style={{color: "red", textAlign:"center",fontSize: 13, marginBottom:10 }}>Borrar producto del catalogo</Text>
            </TouchableOpacity> 
            </View>
            ))}
            <Icon
                type="material-community"
                name="plus"
                color="rgba(111, 202, 186, 1)"
                reverse
                containerStyle={styles.btnContainer}
                onPress={addHandler} 
            />
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
            <UploadImage
                toastRef={toastRef}
                imagesSelected={imagesSelected}
                setImagesSelected={setImagesSelected}
            />
            <Button
                title="Crear Subasta"
                onPress={addSubasta}
                buttonStyle={styles.btnAddSubasta}
            />
            <MapSubasta
                isVisibleMap={isVisibleMap}
                setIsVisibleMap={setIsVisibleMap}
                setLocationSubasta={setLocationSubasta}
                toastRef={toastRef}
            />
        </ScrollView>
    )
}

function MapSubasta({ isVisibleMap, setIsVisibleMap, setLocationSubasta, toastRef }) {
    const [newRegion, setNewRegion] = useState(null)

    useEffect(() => {
        (async() => {
            const response = await getCurrentLocation()
            if (response.status) {
                setNewRegion(response.location)
            }
        })()
    }, [])

    const confirmLocation = () => {
        setLocationSubasta(newRegion)
        toastRef.current.show("Localización guardada correctamente.", 3000)
        setIsVisibleMap(false)
    }

    return (
        <Modal isVisible={isVisibleMap} setVisible={setIsVisibleMap}>
            <View>
                {
                    newRegion && (
                        <MapView
                            style={styles.mapStyle}
                            initialRegion={newRegion}
                            showsUserLocation={true}
                            onRegionChange={(region) => setNewRegion(region)}
                        >
                            <MapView.Marker
                                coordinate={{
                                    latitude: newRegion.latitude,
                                    longitude: newRegion.longitude
                                }}
                                draggable
                            />
                        </MapView>
                    ) 
                }
                <View style={styles.viewMapBtn}>
                    <Button
                        title="Guardar Ubicación"
                        containerStyle={styles.viewMapBtnContainerSave}
                        buttonStyle={styles.viewMapBtnSave}
                        onPress={confirmLocation}
                    />
                    <Button
                        title="Cancelar Ubicación"
                        containerStyle={styles.viewMapBtnContainerCancel}
                        buttonStyle={styles.viewMapBtnCancel}
                        onPress={() => setIsVisibleMap(false)}
                    />
                </View>
            </View>
        </Modal>
    )
}

function ImageSubasta({ imageSubasta }) {
    return (
        <View style={styles.viewPhoto}>
            <Image
                style={{ width: widthScreen, height: 200}}
                source={
                    imageSubasta
                        ? { uri: imageSubasta}
                        : require("../../assets/no-image.png")
                }
            />
        </View>
    )
}

function UploadImage({ toastRef, imagesSelected, setImagesSelected }) {
    const imageSelect = async() => {
        const response = await loadImageFromGallery([4, 3])
        if (!response.status) {
            toastRef.current.show("No has seleccionado ninguna imagen.", 3000)
            return
        }
        setImagesSelected([...imagesSelected, response.image])
    }

    const removeImage = (image) => {
        Alert.alert(
            "Eliminar Imagen",
            "¿Estas seguro que quieres eliminar la imagen?",
            [
                {
                    text: "No",
                    style: "cancel"                    
                },
                {
                    text: "Sí",
                    onPress: () => {
                        setImagesSelected(
                            filter(imagesSelected, (imageUrl) => imageUrl !== image)
                        )
                    }
                }
            ],
            { cancelable: false }
        )
    }

    return (
        <ScrollView
            horizontal
            style={styles.viewImages}
        >
            {
                size(imagesSelected) < 10 && (
                    <Icon
                        type="material-community"
                        name="camera"
                        color="#7a7a7a"
                        containerStyle={styles.containerIcon}
                        onPress={imageSelect}
                    />
                )
            }
            {
                map(imagesSelected, (imageSubasta, index) => (
                    <Avatar
                        key={index}
                        style={styles.miniatureStyle}
                        source={{ uri: imageSubasta }}
                        onPress={() => removeImage(imageSubasta)}
                    />
                ))
            }

        </ScrollView>
    )
}

function FormAdd({ 
    formData, 
    setFormData, 
    errorName, 
    errorDescription, 
    errorEmail, 
    errorAddress, 
    errorPrecioBase,
    errorPhone, 
    setIsVisibleMap,
    locationSubasta
}) {
    const [country, setCountry] = useState("AR")
    const [callingCode, setCallingCode] = useState("54")
    const [phone, setPhone] = useState("")

    const onChange = (e, type) => {
        setFormData({ ...formData, [type] : e.nativeEvent.text })
    }

    return (
        <View style={styles.viewForm}>
            <Input
                placeholder="Nombre de la subasta"
                defaultValue={formData.name}
                onChange={(e) => onChange(e, "name")}
                errorMessage={errorName}
            />
            <Input
                placeholder="Dirección de la subasta"
                defaultValue={formData.address}
                onChange={(e) => onChange(e, "address")}
                errorMessage={errorAddress}
                rightIcon={{
                    type: "material-community",
                    name: "google-maps",
                    color: locationSubasta ? "#442484" : "#c2c2c2",
                    onPress: () => setIsVisibleMap(true)
                }}
            />
            <Input
                keyboardType="email-address"
                placeholder="Email de la subasta"
                defaultValue={formData.email}
                onChange={(e) => onChange(e, "email")}
                errorMessage={errorEmail}
            />
            <View style={styles.phoneView}>
                <CountryPicker
                    withFlag
                    withCallingCode
                    withFilter
                    withCallingCodeButton
                    containerStyle={styles.countryPicker}
                    countryCode={country}
                    onSelect={(country) => {
                        setFormData({ 
                            ...formData, 
                            "country": country.cca2, 
                            "callingCode": country.callingCode[0]
                        })
                    }}
                />
                <Input
                    placeholder="WhatsApp de la subasta"
                    keyboardType="phone-pad"
                    containerStyle={styles.inputPhone}
                    defaultValue={formData.phone}
                    onChange={(e) => onChange(e, "phone")}
                    errorMessage={errorPhone}
                />
            </View>
            <View style={styles.phoneView}>
                <CurrencyPicker
                    enable={true}
                    darkMode={false}
                    currencyCode={"ARS"}
                    showFlag={true}
                    showCurrencyName={false}
                    showCurrencyCode={true}
                    onSelectCurrency={(data) => { console.log("DATA", data) }}
                    onOpen={() => {console.log("Open")}}
                    onClose={() => {console.log("Close")}}
                    showNativeSymbol={true}
                    showSymbol={false}
                    containerStyle={{
                        container: {},
                        flagWidth: 25,
                        currencyCodeStyle: {},
                        currencyNameStyle: {},
                        symbolStyle: {},
                        symbolNativeStyle: {}
                    }}
                    modalStyle={{
                        container: {},
                        searchStyle: {},
                        tileStyle: {},
                        itemStyle: {
                            itemContainer: {},
                            flagWidth: 25,
                            currencyCodeStyle: {},
                            currencyNameStyle: {},
                            symbolStyle: {},
                            symbolNativeStyle: {}
                        }
                    }}
                    title={"Currency"}
                    searchPlaceholder={"Search"}
                    showCloseButton={true}
                    showModalTitle={true}
                    />               
                <Input
                    placeholder="Precio base"
                    containerStyle={styles.inputPhone}
                    defaultValue={formData.precioBase}
                    onChange={(e) => onChange(e, "precioBase")}
                    errorMessage={errorPrecioBase}
                />
            </View>
            <Input
                placeholder="Descripción de la subasta"
                multiline
                containerStyle={styles.textArea}
                defaultValue={formData.description}
                onChange={(e) => onChange(e, "description")}
                errorMessage={errorDescription}
            />
        </View>
    )
}

const defaultFormValues = () => {
    return {
        name: "",
        description: "",
        email: "",
        phone: "",
        address: "",
        country: "AR",
        callingCode: "54",
        precioBase:""
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        height: "100%"
    },
    viewForm: {
        marginHorizontal: 10,
    },
    textArea: {
        height: 70,
        width: "100%"
    },
    phoneView: {
        width: "80%",
        flexDirection: "row"
    },
    inputPhone: {
        width: "80%"
    },
    btnAddSubasta: {
        margin: 20,
        backgroundColor: "#442484"
    },
    btnAddFecha: {
        margin: 10,
        backgroundColor: "#b05777"
    },
    btnAddHora: {
        margin: 10,
        backgroundColor: "#b05777"
    },
    btnContainer: {
        bottom: 10,
        marginRight: 10,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.5
    },
    viewImages: {
        flexDirection: "row",
        marginHorizontal: 20,
        marginTop: 30,
    },
    containerIcon: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        height: 70,
        width: 79,
        backgroundColor: "#e3e3e3"
    },
    miniatureStyle: {
        width: 70,
        height: 70,
        marginRight: 10
    },
    viewPhoto: {
        alignItems: "center",
        height: 200,
        marginBottom: 20
    },
    mapStyle: {
        width: "100%",
        height: 550
    },
    viewMapBtn: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10
    },
    viewMapBtnContainerCancel: {
        paddingLeft: 5
    },
    viewMapBtnContainerSave: {
        paddingRight: 5,
    },
    viewMapBtnCancel: {
        backgroundColor: "#a65273"
    },
    viewMapBtnSave: {
        backgroundColor: "#442484"
    }
})