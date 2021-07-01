import React, { useState, useEffect } from "react";
import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { Avatar, Button, Icon, Input, Image } from "react-native-elements";
import { map, size, filter, isEmpty } from "lodash";
import uuid from "random-uuid-v4";
import CurrencyPicker from "react-native-currency-picker";
import { Checkbox } from 'react-native-paper'
import { loadImageFromGallery } from "../../utils/helpers";
import { addDocumentWithoutId, getCurrentUser, uploadImage} from "../../utils/actions";

const widthScreen = Dimensions.get("window").width;

export default function AddSubastaForm({ toastRef, setLoading, navigation }) {
  const [formData, setFormData] = useState(defaultFormValues());
  const [errorName, setErrorName] = useState(null);
  const [errorDescription, setErrorDescription] = useState(null);
  const [errorCheckbox, setErrorCheckbox] = useState("");
  const [imagesSelected, setImagesSelected] = useState([]);
  const [inputs, setInputs] = useState([
    {
      key: "",
      nombreItem: "",
      descripcion: "",
      cantidad: "",
      artista: "",
      fechaObra: "",
      historiaObra: "",
      itemUuid: "",
    },
  ]);
  const [dataMoneda, setDataMoneda] = useState("");
  const [checked, setChecked] = useState(false)

  const addHandler = () => {
    const _inputs = [...inputs];
    _inputs.push({
      key: "",
      nombreItem: "",
      descripcion: "",
      cantidad: "",
      artista: "",
      fechaObra: "",
      historiaObra: "",
      itemUuid: uuid()
        });
    setInputs(_inputs);
  };

  const deleteHandler = (key) => {
    const _inputs = inputs.filter((input, index) => index != key);
    setInputs(_inputs);
  };

  const inputHandler = (text, key) => {
    const _inputs = [...inputs];
    _inputs[key].nombreItem = text;
    _inputs[key].itemUuid = uuid()
    _inputs[key].key = key;
    setInputs(_inputs);
  };

  const inputHandlerDescripcion = (text, key) => {
    const _inputs = [...inputs];
    _inputs[key].descripcion = text;
    _inputs[key].key = key;
    setInputs(_inputs);
  };

  const inputHandlerCantidad = (text, key) => {
    const _inputs = [...inputs];
    _inputs[key].cantidad = text;
    _inputs[key].key = key;
    setInputs(_inputs);
  };

  const inputHandlerArtista = (text, key) => {
    const _inputs = [...inputs];
    _inputs[key].artista = text;
    _inputs[key].key = key;
    setInputs(_inputs);
  };

  const inputHandlerFechaObra = (text, key) => {
    const _inputs = [...inputs];
    _inputs[key].fechaObra = text;
    _inputs[key].key = key;
    setInputs(_inputs);
  };

  const inputHandlerHistoriaObra = (text, key) => {
    const _inputs = [...inputs];
    _inputs[key].historiaObra = text;
    _inputs[key].key = key;
    setInputs(_inputs);
  };

  const inputHandlerImagen = (text, key) => {
    const _inputs = [...inputs];
    _inputs[key].images = text;
    _inputs[key].key = key;
    setInputs(_inputs);
  };

  const addSubasta = async () => {
    if (!validForm()) {
      return;
    }

    setLoading(true);
    const responseUploadImages = await uploadImages();
    const subasta = {
      name: formData.name,
      description: formData.description,
      images: responseUploadImages,
      catalogo: inputs,
      listadoPujas: [],
      //precioBase: formData.precioBase,
      moneda: dataMoneda ? dataMoneda : 'ARS',
      createAt: new Date(),
      rematador: getCurrentUser().uid,
      categoria: "",//calcularCategoria(formData.precioBase),
      statusSubasta:'pending'
    };

    const responseAddDocument = await addDocumentWithoutId("subastas", subasta);
    setLoading(false);

    if (!responseAddDocument.statusResponse) {
      toastRef.current.show(
        "Error al grabar la subasta, por favor intenta más tarde.",
        3000
      );
      return;
    }

    navigation.navigate("mis-subastas");
  };

  const uploadImages = async () => {
    const imagesUrl = [];
    await Promise.all(
      map(imagesSelected, async (image) => {
        const response = await uploadImage(image, "subastas", uuid());
        if (response.statusResponse) {
          imagesUrl.push(response.url);
        }
      })
    );
    return imagesUrl;
  };

  const validForm = () => {
    clearErrors();
    let isValid = true;

    if (isEmpty(formData.name)) {
      setErrorName("Debes ingresar el nombre de la subasta.");
      isValid = false;
    }

    if (isEmpty(formData.description)) {
      setErrorDescription("Debes ingresar una descripción de la subasta.");
      isValid = false;
    }

    if(checked==false) {
      setErrorCheckbox("Debes aceptar las condiciones.")
      isValid = false
    }

    return isValid;
  };

  const clearErrors = () => {
    setErrorDescription(null);
    setErrorName(null);
    setErrorCheckbox(null);
  };

  return (
    <ScrollView style={styles.viewContainer}>
      <ImageSubasta imageSubasta={imagesSelected[0]} />
      <FormAdd
        formData={formData}
        setFormData={setFormData}
        errorName={errorName}
        errorDescription={errorDescription}
        // errorPrecioBase={errorPrecioBase}
        setDataMoneda={setDataMoneda}
      />
      {inputs.map((input, key) => (
        <View style={styles.viewForm}>
          <Text style={{ fontSize: 15, marginBottom: 10, fontWeight: "bold", marginTop:10}}>
            Descripcion del Catálogo:
          </Text>
          <Input
            placeholder={"Nombre del producto"}
            value={input.value}
            onChangeText={(text) => inputHandler(text, key)}
          />
          <Input
            placeholder={"Descripcion del producto"}
            value={input.value}
            onChangeText={(text) => inputHandlerDescripcion(text, key)}
          />
          <Input
            placeholder={"Cantidad de productos"}
            value={input.value}
            onChangeText={(text) => inputHandlerCantidad(text, key)}
          />
          <Input
            placeholder={"Artista de la obra (opcional)"}
            value={input.value}
            onChangeText={(text) => inputHandlerArtista(text, key)}
          />
          <Input
            placeholder={"Fecha de la obra (opcional)"}
            value={input.value}
            onChangeText={(text) => inputHandlerFechaObra(text, key)}
          />
          <Input
            placeholder={"Historia de la obra (opcional)"}
            value={input.value}
            onChangeText={(text) => inputHandlerHistoriaObra(text, key)}
          />
          <UploadImage
            toastRef={toastRef}
            imagesSelected={imagesSelected}
            setImagesSelected={setImagesSelected}
            />
          <TouchableOpacity onPress={() => deleteHandler(key)}>
            <Text
              style={{
                color: "red",
                textAlign: "center",
                fontSize: 13,
                marginBottom: 10,
              }}
            >
              Borrar producto del catalogo
            </Text>
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
                <Checkbox.Item label="Declaro que los bienes a subastar son de mi pertenencia y no poseo ningun impedimento para subastarlos"
                status={checked ? 'checked' : 'unchecked'}
                onPress={() => {
                    setChecked(!checked);
                }}/>                
             <Input errorMessage={errorCheckbox} />
             </View>
      <Button
        title="Agregar productos a subastar"
        onPress={addSubasta}
        buttonStyle={styles.btnAddSubasta}
      />
    </ScrollView>
  );
}

function ImageSubasta({ imageSubasta }) {
  return (
    <View style={styles.viewPhoto}>
      <Image
        style={{ width: widthScreen, height: 200 }}
        source={
          imageSubasta
            ? { uri: imageSubasta }
            : require("../../assets/no-image.png")
        }
      />
    </View>
  );
}

function UploadImage({ toastRef, imagesSelected, setImagesSelected }) {
  const imageSelect = async () => {
    const response = await loadImageFromGallery([4, 3]);
    if (!response.status) {
      toastRef.current.show("No has seleccionado ninguna imagen.", 3000);
      return;
    }
    setImagesSelected([...imagesSelected, response.image]);
  };

  const removeImage = (image) => {
    Alert.alert(
      "Eliminar Imagen",
      "¿Estas seguro que quieres eliminar la imagen?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Sí",
          onPress: () => {
            setImagesSelected(
              filter(imagesSelected, (imageUrl) => imageUrl !== image)
            );
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView horizontal style={styles.viewImages}>
      {size(imagesSelected) < 10 && (
        <Icon
          type="material-community"
          name="camera"
          color="#7a7a7a"
          containerStyle={styles.containerIcon}
          onPress={imageSelect}
        />
      )}
      {map(imagesSelected, (imageSubasta, index) => (
        <Avatar
          key={index}
          style={styles.miniatureStyle}
          source={{ uri: imageSubasta }}
          onPress={() => removeImage(imageSubasta)}
        />
      ))}
    </ScrollView>
  );
}

function FormAdd({
  formData,
  setFormData,
  errorName,
  errorDescription,
  setDataMoneda,
}) {
  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text });
  };


  return (
    <View style={styles.viewForm}>
      <Input
        placeholder="Nombre de la subasta"
        defaultValue={formData.name}
        onChange={(e) => onChange(e, "name")}
        errorMessage={errorName}
      />
      <Input
          placeholder="Descripción de la subasta"
          multiline
          containerStyle={styles.textArea}
          defaultValue={formData.description}
          onChange={(e) => onChange(e, "description")}
          errorMessage={errorDescription}
        />
      <Text>Selecciona la moneda deseada: </Text>
      <View style={styles.currencyView}>
        <CurrencyPicker
          enable={true}
          darkMode={false}
          currencyCode={"ARS"}
          showFlag={true}
          showCurrencyName={false}
          showCurrencyCode={true}
          onSelectCurrency={(data) => {
            setDataMoneda(data["code"]);
          }}
          onOpen={() => {
            console.log("Open");
          }}
          onClose={() => {
            console.log("Close");
          }}
          showNativeSymbol={true}
          showSymbol={false}
          containerStyle={{
            container: {},
            flagWidth: 25,
            currencyCodeStyle: {},
            currencyNameStyle: {},
            symbolStyle: {},
            symbolNativeStyle: {},
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
              symbolNativeStyle: {},
            },
          }}
          title={"Currency"}
          searchPlaceholder={"Search"}
          showCloseButton={true}
          showModalTitle={true}
        />
      </View>
    </View>
  );
}

const defaultFormValues = () => {
  return {
    name: "",
    description: ""
  };
};

const styles = StyleSheet.create({
  viewContainer: {
    height: "100%",
  },
  viewForm: {
    marginHorizontal: 10,
  },
  textArea: {
    height: 70,
    width: "100%",
  },
  currencyView: {
    width: "80%",
    flexDirection: "row",
  },
  btnAddSubasta: {
    margin: 20,
    backgroundColor: "#442484",
  },
  btnContainer: {
    bottom: 10,
    marginRight: 10,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
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
    backgroundColor: "#e3e3e3",
  },
  miniatureStyle: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
  viewPhoto: {
    alignItems: "center",
    height: 200,
    marginBottom: 20,
  },
  mapStyle: {
    width: "100%",
    height: 550,
  },
  viewMapBtn: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  viewMapBtnContainerCancel: {
    paddingLeft: 5,
  },
  viewMapBtnContainerSave: {
    paddingRight: 5,
  },
  viewMapBtnCancel: {
    backgroundColor: "#a65273",
  },
  viewMapBtnSave: {
    backgroundColor: "#442484",
  },
});
