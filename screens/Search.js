import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native'
import { SearchBar, ListItem, Icon, Image } from 'react-native-elements'
import { isEmpty, size } from 'lodash'

import { searchSubastas } from '../utils/actions'

export default function Search({ navigation }) {
    const [search, setSearch] = useState("")
    const [subastas, setSubastas] = useState([])

    useEffect(() => {
        if (isEmpty(search)) {
            return
        }

        async function getData() {
            const response = await searchSubastas(search)
            if (response.statusResponse) {
                setSubastas(response.subastas)
            }
        }
        getData();
    }, [search])

    return (
        <View>
            <SearchBar
                placeholder="Ingresa nombre del subasta..."
                onChangeText={(e) => setSearch(e)}
                containerStyle={styles.searchBar}
                value={search}
            />
            {
                size(subastas) > 0 ? (
                    <FlatList
                        data={subastas}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={(subasta) => 
                            <Subasta
                                subasta={subasta}
                                navigation={navigation}
                            />
                        }
                    />
                ) : (
                    isEmpty(search) ? (
                        <Text style={styles.noFound}>
                            Ingrese las primeras letras del nombre de la subasta.
                        </Text>
                    ) : (
                        <Text style={styles.noFound}>
                            No hay subastas que coincidan con el critertio de búsqueda.
                        </Text>
                    )
                )
            }
        </View>
    )
}

function Subasta ({ subasta, navigation }) {
    const { id, name, images } = subasta.item

    return (
        <ListItem
            style={styles.menuItem}
            onPress={() => navigation.navigate("subastas", {
                screen: "subasta",
                params: { id, name }
            })}
        >
            <Image
                resizeMode="cover"
                PlaceholderContent={<ActivityIndicator color="#fff"/>}
                source={{ uri: images[0] }}
                style={styles.imageSubasta}
            />
            <ListItem.Content>
                <ListItem.Title>{name}</ListItem.Title>
            </ListItem.Content>
            <Icon
                type="material-community"
                name="chevron-right"
            />
        </ListItem>
    )
}

const styles = StyleSheet.create({
    searchBar: {
        marginBottom: 20,
        backgroundColor: "#fff"
    },
    imageSubasta: {
        width: 90,
        height: 90
    },
    noFound: {
        alignSelf: "center",
        width: "90%"
    },
    menuItem: {
        margin: 10
    }
})