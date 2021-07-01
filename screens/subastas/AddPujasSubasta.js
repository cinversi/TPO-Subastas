import React, { useState, useRef,useCallback,useEffect} from 'react'
import { StyleSheet, Text, View,FlatList,Animated} from 'react-native'
import { Button, Input } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native'
import Toast from 'react-native-easy-toast'
import { isEmpty,size } from 'lodash'
 
import Loading from '../../components/Loading'
import { addDocumentWithoutId, getCurrentUser, getDocumentById, updateDocument, addNewPuja, getSubastas,addSubastaFinalizada} from '../../utils/actions'
import CountDown from 'react-native-countdown-component';
import moment from 'moment';
 
 
 
export default function AddPujasSubasta({ navigation, route }) {
    const { id,catItem } = route.params
    const toastRef = useRef() 
    const [valorUltimaPuja, setValorUltimaPuja] = useState(null)
    const [nombreUltimoPujador, setNombreUltimoPujador] = useState(null)
    const [diaHoraUltimoPuja, setDiaHoraUltimoPuja] = useState(null)
    const [puja,setPuja] = useState(null)
    const [errorPuja,setErrorPuja]=useState(null)
    const [loading, setLoading] = useState(false)
 
    const [totalDuration, setTotalDuration] = useState(0);
 
    useEffect(() => {
      // Coundown timer for a given expiry date-time
      let date = 
        moment()
          .utcOffset('-3:00')
          .format('YYYY-MM-DD hh:mm:ss');
          
      
      // Getting the current date-time
      // You can set your own date-time
      let expirydate = '2021-08-01 00:00:00';
      
      let diffr = 
        moment
          .duration(moment(expirydate)
          .diff(moment(date)));
      // Difference of the expiry date-time
      var hours = parseInt(diffr.asHours());
      var minutes = parseInt(diffr.minutes());
      var seconds = parseInt(diffr.seconds());
  
      // Converting in seconds
      var d = hours * 60 * 60 + minutes * 60 + seconds;
  
      // Settign up the duration of countdown
      setTotalDuration(d);
 
      console.log(date,expirydate,diffr,d)
    }, []);
 
 
    useFocusEffect(
        useCallback(() => {
            async function getUltimaPuja() {
                setLoading(true)
                //Caso más de una puja
                const response = await getDocumentById("subastas",id)
                //getPujas.document.listadoPujas.forEach(element => console.log(element))   
 
                  if ((size(response.document.listadoPujas))>1){                                   
                    const ultimoValorPujado=response.document.listadoPujas[(size(response.document.listadoPujas))-1].valorPujado
                    const ultimoNombrePujador=response.document.listadoPujas[(size(response.document.listadoPujas))-1].datosPujador
                    const fecha1=new Date((response.document.listadoPujas[(size(response.document.listadoPujas))-1].horarioPuja.seconds)*1000)
                    const diaPuja=fecha1.toLocaleDateString("es-AR")
                    var time_to_show = response.document.listadoPujas[(size(response.document.listadoPujas))-1].horarioPuja.seconds; // unix timestamp in seconds
                    var t = new Date(time_to_show * 1000);
                    var horasMinutosSegundosPuja = ('0' + t.getHours()).slice(-2) + ':' + ('0' + t.getMinutes()).slice(-2)+':'+('0' + t.getSeconds()).slice(-2)
                    var diaYHoraPuja=diaPuja+' '+horasMinutosSegundosPuja
                    const restNombrePujador = await getDocumentById("users",ultimoNombrePujador)
                    const datosPujador=restNombrePujador.document.nombre+' '+restNombrePujador.document.apellido
                    setNombreUltimoPujador(datosPujador)
                    setValorUltimaPuja(ultimoValorPujado)
                    setDiaHoraUltimoPuja(diaYHoraPuja)
                }
                else {
                    setNombreUltimoPujador("Anonimo")
                    setValorUltimaPuja(response.document.precioBase)
                    const fecha1=new Date((response.document.createAt.seconds)*1000)
                    const diaPuja=fecha1.toLocaleDateString("es-AR")
                    var time_to_show = response.document.createAt.seconds; // unix timestamp in seconds
                    var t = new Date(time_to_show * 1000);
                    var horasMinutosSegundosPuja = ('0' + t.getHours()).slice(-2) + ':' + ('0' + t.getMinutes()).slice(-2)+':'+('0' + t.getSeconds()).slice(-2)
                    var diaYHoraPuja=diaPuja+' '+horasMinutosSegundosPuja
                    setDiaHoraUltimoPuja("No hubo pujas hasta el momento")
                }
                setLoading(false)
            }
            getUltimaPuja()
        }, [])
    )
 
    
    const addPuja = async() => {
        if (!validForm()) {
            return
        }
        setLoading(true)
        const horarioPuja=new Date()
        const responseAddPuja = await addNewPuja(id,catItem.item.itemUuid,puja,getCurrentUser().uid,horarioPuja )
        if (!responseAddPuja.statusResponse) {
            setLoading(false)
            toastRef.current.show("Error al realizar puja", 3000)
            return
        }
        navigation.navigate("subastas") 
    } 
 
    
 
    const validForm = () => {
        clearErrors()
        let isValid = true
 
        // if(subasta.categoria=="COMUN" || subasta.categoria == "ESPECIAL" || subasta.categoria== "PLATA"){
        //     if(parseInt(puja)<parseInt(subasta.precioBase*1.01)){
        //         setErrorPuja("Debes ingresar un monto mayor al 1% del precio base")
        //         isValid=false
        // }
        // } 
 
        const pujaInt=parseInt(puja)
        const valorLimit=(parseInt(valorUltimaPuja))*1.20
        const valorUltimaPujaInt=parseInt(valorUltimaPuja)
 
        if(pujaInt<=valorUltimaPujaInt){
            setErrorPuja("El monto ingresado debe ser mayor a la ultima puja.")
            isValid = false
        }
 
        if(pujaInt>valorLimit){
            setErrorPuja("El monto ingresado no debe exceder al 20% del valor de la misma.")
            isValid = false 
        }
 
        if(isNaN(puja)){
            setErrorPuja("Debes ingresar un valor numerico para pujar.")
            isValid = false  
        }
        
        if (isEmpty(puja)) {
            setErrorPuja("Debes ingresar un valor para pujar.")
            isValid = false
        }
 
        return isValid
    }
 
    const clearErrors = () => {
        setErrorPuja(null)
    }
 
    if (catItem === null) {
        return <Loading isVisible={true} text="Cargando..."/>
    }
 
 
    const guardarSubastaFinalizada = async() => {
        const listadoPujas=response.document.listadoPujas
        const responseAddSubastaFinalizada= await addSubastaFinalizada(id,catItem.item.itemUuid,nombreUltimoPujador,valorUltimaPuja,getCurrentUser().uid,diaHoraUltimoPuja,listadoPujas)
        if (!responseAddSubastaFinalizada.statusResponse) {
            setLoading(false)
            toastRef.current.show("Error al finalizar subasta", 3000)
            return
        }
        navigation.navigate("subastas") 
    } 
 
 
 
 
    return (
        <View style={styles.viewBody}>
            <View>     
                <CountDown
                    until={totalDuration}
                    //duration of countdown in seconds
                    timetoShow={('H', 'M', 'S')}
                    //formate to show
                    onFinish={() => alert('finished')}
                    //on Finish call
                    onPress={() => alert('hello')}
                    //on Press call
                    size={20}
                />
                <Text style={styles.viewInfo}>{catItem.name}</Text>
                <Text style={styles.viewPrecioBaseText}>Precio base</Text> 
                {/* <Text style={styles.viewPrecioBase}>${catItem.precioBase}</Text> */}
                <Text style={styles.viewPrecioActualText}>Precio actual</Text>
                <Text style={styles.viewPrecioActual}>${valorUltimaPuja}</Text>
                <Text style={styles.viewUltimasPujas}>Día y horario de última puja: {diaHoraUltimoPuja}</Text>
                <Text style={styles.viewUltimasPujas}>Ultimo pujador: {nombreUltimoPujador}</Text>  
            </View>        
            <View style={styles.formReview}>
                <Input
                    placeholder="$ Ingresar valor a pujar"
                    containerStyle={styles.input}
                    onChange={(e) => setPuja(e.nativeEvent.text)}
                    errorMessage={errorPuja}
                />
                <Button
                    title="Pujar"
                    onPress={addPuja}
                    buttonStyle={styles.btn}
                    containerStyle={styles.btnContainer}
                />
            </View>
            <Toast ref={toastRef} position="center" opacity={0.9}/>
            <Loading isVisible={loading} text="Enviando puja..."/>
        </View>
    )
}
 
 
const styles = StyleSheet.create({
    viewBody: {
        flex: 1
    },
    viewPrecioBaseText:{
        fontSize:20,
        textAlign:"center",
        color:"#9c63c9",
        marginTop: 15
    },
    viewPrecioBase:{
        fontSize:20,
        textAlign:"center",
        color:"#9c63c9"
    },
    viewPrecioActualText:{
        fontSize:30,
        textAlign:"center",
        color:"#442484",
        fontWeight:"bold",
        marginTop: 15
    },
    viewPrecioActual:{
        fontSize:30,
        textAlign:"center",
        color:"#442484",
        fontWeight:"bold"
    },
    viewInfo:{
        fontSize:15,
        textAlign:"center",
        fontWeight:"bold"
    },
    viewInfoHora:{
        fontSize:15,
        textAlign:"center",
        fontWeight:"bold"
    },
    viewUltimasPujas:{
        fontSize:15,
        marginTop: 20
    },
    formReview: {
        flex: 1,
        alignItems: "center",
        margin: 10,
        marginTop: 20
    },
    input: {
        marginBottom: 10,
        marginTop:50
    },
    textArea: {
        height: 150,
        width: "100%",
        padding: 0,
        margin: 0
    },
    btnContainer: {
        flex: 1, 
        justifyContent: "flex-end",
        marginBottom: 20,
        width: "95%"
    },
    btn: {
        backgroundColor: "#442484"
    }
})
