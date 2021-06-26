import React, {useState, useRef, useEffect} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ListItem, Icon } from 'react-native-elements'
import { map } from 'lodash';
import Toast from 'react-native-easy-toast'
import { getCurrentUser } from '../../utils/actions'
import { useNavigation } from '@react-navigation/native'

import Modal from '../Modal';
import ChangeDisplayNameForm from '../../components/account/ChangeDisplayNameForm';
import ChangeEmailForm from '../../components/account/ChangeEmailForm';
import ChangePasswordForm from '../../components/account/ChangePasswordForm';
import ChangeDireccionForm from '../../components/account/ChangeDireccionForm';
import InfoUser from '../../components/account/InfoUser'
import Loading from '../../components/Loading'

export default function AccountOptions() {
    const [showModal, setShowModal] = useState(false)
    const [renderComponent, setRenderComponent] = useState(null)
    const [loading, setLoading] = useState(false)
    const [loadingText, setLoadingText] = useState("")
    const [reloadUser, setReloadUser] = useState(false)
    const [user, setUser] = useState()
    const toastRef = useRef()
    const navigation = useNavigation()
    useEffect(() => {
        setUser(getCurrentUser())
        setReloadUser(false)
    }, [reloadUser])

    const generateOptions = () => {
        return [
            {
                title : "Cambiar Nombre y Apellido",
                iconNameLeft: "account-circle",
                iconColorLeft: "#a7bfd3",
                iconNameRight: "chevron-right",
                iconColorRight: "#a7bfd3",
                onPress: () => selectedComponent("displayName")
            },
            {
                title : "Cambiar Email",
                iconNameLeft: "at",
                iconColorLeft: "#a7bfd3",
                iconNameRight: "chevron-right",
                iconColorRight: "#a7bfd3",
                onPress: () => selectedComponent("email")
            },
            {
                title : "Cambiar Contraseña",
                iconNameLeft: "lock-reset",
                iconColorLeft: "#a7bfd3",
                iconNameRight: "chevron-right",
                iconColorRight: "#a7bfd3",
                onPress: () => selectedComponent("password")
            },
            {
                title : "Cambiar Direccion",
                iconNameLeft: "map-marker",
                iconColorLeft: "#a7bfd3",
                iconNameRight: "chevron-right",
                iconColorRight: "#a7bfd3",
                onPress: () => selectedComponent("direccion")
            },
        ]
    }

    const selectedComponent = (key) => {
        switch (key) {
            case "displayName":
                setRenderComponent(
                    <ChangeDisplayNameForm
                        displayName={user.displayName}
                        setShowModal={setShowModal}
                        toastRef={toastRef}
                        setRelodUser={setReloadUser}
                    />
                )
                break;
            case "email":
                setRenderComponent(
                    <ChangeEmailForm
                        email={user.email}
                        setShowModal={setShowModal}
                        toastRef={toastRef}
                        setRelodUser={setReloadUser}
                    />
                )
                break;
            case "password":
                setRenderComponent(
                    <ChangePasswordForm
                        setShowModal={setShowModal}
                        toastRef={toastRef}
                    />
                )
                break;
            case "direccion":
                setRenderComponent(
                    <ChangeDireccionForm
                        setShowModal={setShowModal}
                        toastRef={toastRef}
                    />
                )
                break;
        }
        setShowModal(true)
    }

    const menuOptions = generateOptions();

    return (
        <View style={styles.container}>
            {
                user && (
                    <View>
                        <InfoUser 
                            user={user} 
                            setLoading={setLoading} 
                            setLoadingText={setLoadingText}
                            />
                    </View>
                ) 
            }
            {
                map(menuOptions, (menu, index) => (
                    <ListItem
                        key={index}
                        style={styles.menuItem}
                        onPress={menu.onPress}
                    >
                        <Icon
                            type="material-community"
                            name={menu.iconNameLeft}
                            color={menu.iconColorLeft}
                        />
                        <ListItem.Content>
                            <ListItem.Title>{menu.title}</ListItem.Title>
                        </ListItem.Content>
                        <Icon
                            type="material-community"
                            name={menu.iconNameRight}
                            color={menu.iconColorRight}
                        />
                    </ListItem>
                ))
            }
            <Modal isVisible={showModal} setVisible={setShowModal}>
                {
                    renderComponent
                }
            </Modal>
            <Toast ref={toastRef} position="center" opacity={0.9}/>
            <Loading isVisible={loading} text={loadingText}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        minHeight:"100%",
        backgroundColor:"#f9f9f9"
    },
    menuItem: {
        borderBottomWidth: 1,
        borderBottomColor: "#a7bfd3"
    }
})