import React from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Image } from 'react-native-elements'

export default function ListSubastas({ subastas, navigation, handleLoadMore }) {
    return (
        <View>
            <FlatList
                data={subastas}
                keyExtractor={(item, index) => index.toString()}
                onEndReachedThreshold={0.5}
                onEndReached={handleLoadMore}
                renderItem={(subasta) => (
                    <Subasta subasta={subasta} navigation={navigation}/>
                )}
            />
        </View>
    )
}

function Subasta({ subasta, navigation, handleLoadMore }) {
    const { id, images, name, categoria, fechaSubastar } = subasta.item
    const imageSubasta = images[0]

    const goSubasta = () => {
        navigation.navigate("subasta", { id, name })
    } 

    return (
        <TouchableOpacity onPress={goSubasta}>
            <View style={styles.viewSubasta}>
                <View style={styles.viewSubastaImage}>
                    <Image
                        resizeMode="cover"
                        PlaceholderContent={<ActivityIndicator color="#fff"/>}
                        source={{ uri: imageSubasta }}
                        style={styles.imageSubasta}
                    />
                </View>
                <View>
                    <Text style={styles.subastaTitle}>{name}</Text>
                    <Text style={styles.subastaInformation}>Categoría: {categoria}</Text>
                    <Text style={styles.subastaInformation}>Fecha: {fechaSubastar}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    viewSubasta: {
        flexDirection: "row",
        margin: 10
    },
    viewSubastaImage: {
        marginRight: 15
    },
    imageSubasta: {
        width: 90,
        height: 90
    },
    subastaTitle: {
        fontWeight: "bold"
    },
    subastaInformation: {
        paddingTop: 2,
        color: "grey"
    }
})