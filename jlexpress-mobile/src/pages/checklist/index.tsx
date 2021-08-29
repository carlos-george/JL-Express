import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Button,
    AsyncStorage,
    Image,
    ScrollView,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');
const qrSize = width * 0.8;

import CheckBox from '../../components/CheckBox';
import api from '../../services/api';

type CheckStyle = {
    top: number,
    left: number,
}

type CheckValue = {
    valueA: boolean,
    valueB: boolean,
    valueC: boolean,
}

type FieldProps = {
    [key: string]: CheckValue,
}

type CarFleet = {
    _id?: string,
    placa: string,
    imagem: string,
}

const Checklist = () => {

    const initialCarFleetState = {
        placa: '',
        modelo: '',
        imagem: '',
    }

    const initialState: FieldProps = {
        limpExter: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        limpInterna: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        pneus: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        estepe: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        cacamba: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        placa: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        trasDireitaLuz: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        trasDireitaLuzRe: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        trasDireitaLuzFreio: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        trasDireitaSeta: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        trasEsquerdaLuz: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        trasEsquerdaLuzRe: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        trasEsquerdaLuzFreio: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        trasEsquerdaSeta: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        diantPlaca: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        diantDireitaFarolAlto: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        diantDireitaFarolBaixo: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        diantDireitaNeblina: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        diantDireitaSeta: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        diantEsquerdaFarolAlto: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        diantEsquerdaFarolBaixo: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        diantEsquerdaNeblina: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        diantEsquerdaSeta: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        motorAcelerador: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        motorAguaLimpador: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        motorAguaRadiador: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        motorEmbreagem: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        motorFreio: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        motorFreioMao: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        motorOleoFreio: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        motorOleoMotor: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        motorTanquePartida: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        seguAlarme: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        seguBuzina: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        seguChaveRoda: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        seguCinto: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        seguDocumento: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        seguExtintor: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        seguLimpador: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        seguMacaco: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        seguPainel: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        seguRetroInterno: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        seguRetroDireito: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        seguRetroEsquerdo: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        seguTrava: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
        seguTriangulo: {
            valueA: false,
            valueB: false,
            valueC: false,
        },
    }

    const { navigate, setOptions } = useNavigation();

    const [placa, setPlaca] = useState('jkf9217');
    const [isLoading, setIsLoading] = useState(false);
    const [values, setValues] = useState<FieldProps>(initialState);
    const [carFleet, setCarFleet] = useState<CarFleet>(initialCarFleetState);
    const [listChecks, setListChecks] = useState<CheckStyle[]>([])

    useEffect(() => {

        setOptions({
            title: carFleet.placa.trim() !== '' ? `${carFleet.placa}` : 'Checklist',
            headerLeft: () => (
                <Button
                    key="321123"
                    onPress={signout}
                    title="Sair"
                    color="#fff"
                />
            ),
            // headerRight: () => (
            //     <TouchableWithoutFeedback onPress={sendEmailCheckList} >
            //         <Icon.Button
            //             key="123321"
            //             name="paper-plane"
            //             size={20}
            //             color="#fff"
            //             backgroundColor="transparent"
            //         />
            //     </TouchableWithoutFeedback>
            // ),
            headerRight: () => { },
        });
    }, []);

    async function sendEmailCheckList() {
        setIsLoading(true);
        const data = {
            values,
            carFleet,
            listChecks,
            fleetWidth: qrSize
        }
        api.post('/api/enviar-checklist', data).then(response => {
            const { message } = response.data;

            alert(message);
            setIsLoading(false);
        }).catch(err => {

            const { message } = err.response;
            if (message) {
                alert(message)
            }
            setIsLoading(false);
        });
    }

    async function signout() {
        await AsyncStorage.clear();
        navigate('Login')
    }

    function findCarFleet() {

        if (placa.trim().length >= 5) {
            setIsLoading(true);
            api.get(`/api/veiculos/${placa}`).then(response => {
                const { veiculo } = response.data;

                setCarFleet(veiculo);

                setIsLoading(false);
            }).catch(err => {
                const { message } = err.response.data;
                if (message) {
                    Alert.alert('Frota', message, [
                        {
                            text: 'ok',
                            onPress: () => {
                                setPlaca('');
                            },
                        }
                    ]);
                }
                setIsLoading(false);
            });
        }

    }

    return (
        <SafeAreaView>
            <ScrollView>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'android' ? 'height' : 'padding'}
                >
                    <View style={styles.main}>
                        {isLoading

                            ? (
                                <Text style={styles.loadingText}>Processando...</Text>
                            )
                            : (
                                <>
                                    <View style={styles.fleetFilter}>
                                        <View style={styles.fieldGroup}>
                                            <TextInput
                                                style={styles.input}
                                                value={placa}
                                                placeholder="Placa"
                                                onChangeText={setPlaca}
                                                placeholderTextColor="#293d4b"
                                                autoCompleteType="off"
                                                autoCorrect={false}
                                                autoCapitalize="characters"
                                                onSubmitEditing={findCarFleet}
                                            />
                                        </View>
                                        <Icon.Button
                                            style={styles.searchButton}
                                            name="search"
                                            size={30}
                                            onPress={findCarFleet}
                                        />
                                    </View>
                                    {carFleet.placa.trim() !== '' &&
                                        <>
                                            <View style={styles.headerLayout}>
                                                <Text style={styles.headerLayoutText}>
                                                    Selecione a área afetada
                                                </Text>
                                            </View>
                                            <View style={styles.layoutImgFieldSet}>
                                                <TouchableWithoutFeedback onPress={(event) => {
                                                    const x = event.nativeEvent.locationX;
                                                    const y = event.nativeEvent.locationY;
                                                    const newCheck: CheckStyle = {
                                                        top: y - 10,
                                                        left: x - 10,
                                                    };

                                                    setListChecks(prevState => [...prevState, newCheck]);
                                                }}>
                                                    <Image
                                                        style={{
                                                            width: qrSize,
                                                            height: (qrSize * 0.5),
                                                        }}
                                                        source={{ uri: `${carFleet.imagem}` }}
                                                    />
                                                </TouchableWithoutFeedback>
                                                {listChecks.map((check, index) => (
                                                    <Icon
                                                        key={index}
                                                        name="times"
                                                        size={18}
                                                        style={{
                                                            color: 'red',
                                                            position: 'absolute',
                                                            zIndex: 1000,
                                                            top: check.top,
                                                            left: check.left,
                                                        }} />
                                                ))}
                                            </View>
                                            <View style={styles.headerLayout}>
                                                <Text style={styles.headerLayoutText}>
                                                    Dados Gerais
                                                </Text>
                                            </View>
                                            <View style={styles.headerQuestions}>
                                                <Text style={styles.headerQuestionsText}>
                                                    Bom
                                                </Text>
                                                <Text style={styles.headerQuestionsText}>
                                                    Méd.
                                                </Text>
                                                <Text style={styles.headerQuestionsText}>
                                                    Ruim
                                                </Text>
                                            </View>
                                            <View style={[styles.containerAnswers, styles.answersTableLineSecond]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Limp. Externa
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.limpExter.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.limpExter.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                limpExter: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.limpExter.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.limpExter.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                limpExter: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.limpExter.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.limpExter.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                limpExter: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                            <View style={[styles.containerAnswers, styles.answersTableLineFirst]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Limp. Interna
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.limpInterna.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.limpInterna.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                limpInterna: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.limpInterna.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.limpInterna.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                limpInterna: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.limpInterna.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.limpInterna.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                limpInterna: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                            <View style={[styles.containerAnswers, styles.answersTableLineSecond]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Pneus
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.pneus.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.pneus.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                pneus: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.pneus.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.pneus.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                pneus: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.pneus.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.pneus.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                pneus: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                            <View style={[styles.containerAnswers, styles.answersTableLineFirst]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Estepe
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.estepe.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.estepe.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                estepe: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.estepe.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.estepe.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                estepe: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.estepe.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.estepe.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                estepe: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                            <View style={[styles.containerAnswers, styles.answersTableLineSecond]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Caçamba
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.cacamba.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.cacamba.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                cacamba: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.cacamba.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.cacamba.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                cacamba: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.cacamba.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.cacamba.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                cacamba: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>

                                            <View style={styles.headerLayout}>
                                                <Text style={styles.headerLayoutText}>
                                                    Luzes Traseira
                                                </Text>
                                            </View>
                                            <View style={styles.headerQuestions}>
                                                <Text style={styles.headerQuestionsTextSN}>
                                                    Sim
                                                </Text>
                                                <Text style={styles.headerQuestionsTextSN}>
                                                    Não
                                                </Text>
                                                <Text style={styles.headerQuestionsTextSN}>
                                                    N/A
                                                </Text>
                                            </View>

                                            <View style={[styles.containerAnswers, styles.answersTableLineSecond]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Placa
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.placa.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.placa.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                placa: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.placa.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.placa.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                placa: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.placa.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.placa.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                placa: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>

                                            <View style={styles.headerLayout}>
                                                <Text style={styles.headerLayoutText}>
                                                    Direita
                                                </Text>
                                            </View>
                                            <View style={styles.headerQuestions}>
                                                <Text style={styles.headerQuestionsTextSN}>
                                                    Sim
                                                </Text>
                                                <Text style={styles.headerQuestionsTextSN}>
                                                    Não
                                                </Text>
                                                <Text style={styles.headerQuestionsTextSN}>
                                                    N/A
                                                </Text>
                                            </View>

                                            <View style={[styles.containerAnswers, styles.answersTableLineSecond]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Luz
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.trasDireitaLuz.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.trasDireitaLuz.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                trasDireitaLuz: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.trasDireitaLuz.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.trasDireitaLuz.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                trasDireitaLuz: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.trasDireitaLuz.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.trasDireitaLuz.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                trasDireitaLuz: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                            <View style={[styles.containerAnswers, styles.answersTableLineFirst]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Luz de Ré
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.trasDireitaLuzRe.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.trasDireitaLuzRe.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                trasDireitaLuzRe: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.trasDireitaLuzRe.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.trasDireitaLuzRe.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                trasDireitaLuzRe: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.trasDireitaLuzRe.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.trasDireitaLuzRe.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                trasDireitaLuzRe: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                            <View style={[styles.containerAnswers, styles.answersTableLineSecond]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Luz de Freio
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.trasDireitaLuzFreio.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.trasDireitaLuzFreio.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                trasDireitaLuzFreio: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.trasDireitaLuzFreio.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.trasDireitaLuzFreio.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                trasDireitaLuzFreio: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.trasDireitaLuzFreio.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.trasDireitaLuzFreio.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                trasDireitaLuzFreio: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                            <View style={[styles.containerAnswers, styles.answersTableLineFirst]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Seta
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.trasDireitaSeta.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.trasDireitaSeta.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                trasDireitaSeta: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.trasDireitaSeta.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.trasDireitaSeta.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                trasDireitaSeta: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.trasDireitaSeta.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.trasDireitaSeta.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                trasDireitaSeta: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>

                                            <View style={styles.headerLayout}>
                                                <Text style={styles.headerLayoutText}>
                                                    Esquerda
                                                </Text>
                                            </View>
                                            <View style={styles.headerQuestions}>
                                                <Text style={styles.headerQuestionsTextSN}>
                                                    Sim
                                                </Text>
                                                <Text style={styles.headerQuestionsTextSN}>
                                                    Não
                                                </Text>
                                                <Text style={styles.headerQuestionsTextSN}>
                                                    N/A
                                                </Text>
                                            </View>

                                            <View style={[styles.containerAnswers, styles.answersTableLineSecond]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Luz
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.trasEsquerdaLuz.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.trasEsquerdaLuz.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                trasEsquerdaLuz: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.trasEsquerdaLuz.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.trasEsquerdaLuz.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                trasEsquerdaLuz: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.trasEsquerdaLuz.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.trasEsquerdaLuz.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                trasEsquerdaLuz: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                            <View style={[styles.containerAnswers, styles.answersTableLineFirst]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Luz de Ré
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.trasEsquerdaLuzRe.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.trasEsquerdaLuzRe.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                trasEsquerdaLuzRe: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.trasEsquerdaLuzRe.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.trasEsquerdaLuzRe.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                trasEsquerdaLuzRe: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.trasEsquerdaLuzRe.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.trasEsquerdaLuzRe.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                trasEsquerdaLuzRe: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                            <View style={[styles.containerAnswers, styles.answersTableLineSecond]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Luz de Freio
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.trasEsquerdaLuzFreio.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.trasEsquerdaLuzFreio.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                trasEsquerdaLuzFreio: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.trasEsquerdaLuzFreio.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.trasEsquerdaLuzFreio.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                trasEsquerdaLuzFreio: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.trasEsquerdaLuzFreio.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.trasEsquerdaLuzFreio.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                trasEsquerdaLuzFreio: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                            <View style={[styles.containerAnswers, styles.answersTableLineFirst]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Seta
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.trasEsquerdaSeta.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.trasEsquerdaSeta.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                trasEsquerdaSeta: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.trasEsquerdaSeta.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.trasEsquerdaSeta.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                trasEsquerdaSeta: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.trasEsquerdaSeta.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.trasEsquerdaSeta.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                trasEsquerdaSeta: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>

                                            <View style={styles.headerLayout}>
                                                <Text style={styles.headerLayoutText}>
                                                    Luzes Dianteiras
                                                </Text>
                                            </View>
                                            <View style={styles.headerQuestions}>
                                                <Text style={styles.headerQuestionsTextSN}>
                                                    Sim
                                                </Text>
                                                <Text style={styles.headerQuestionsTextSN}>
                                                    Não
                                                </Text>
                                                <Text style={styles.headerQuestionsTextSN}>
                                                    N/A
                                                </Text>
                                            </View>

                                            <View style={[styles.containerAnswers, styles.answersTableLineSecond]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Placa
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.diantPlaca.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.diantPlaca.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                diantPlaca: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.diantPlaca.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.diantPlaca.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                diantPlaca: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.diantPlaca.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.diantPlaca.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                diantPlaca: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>

                                            <View style={styles.headerLayout}>
                                                <Text style={styles.headerLayoutText}>
                                                    Direita
                                                </Text>
                                            </View>
                                            <View style={styles.headerQuestions}>
                                                <Text style={styles.headerQuestionsTextSN}>
                                                    Sim
                                                </Text>
                                                <Text style={styles.headerQuestionsTextSN}>
                                                    Não
                                                </Text>
                                                <Text style={styles.headerQuestionsTextSN}>
                                                    N/A
                                                </Text>
                                            </View>

                                            <View style={[styles.containerAnswers, styles.answersTableLineSecond]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Faro Alto
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.diantDireitaFarolAlto.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.diantDireitaFarolAlto.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                diantDireitaFarolAlto: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.diantDireitaFarolAlto.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.diantDireitaFarolAlto.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                diantDireitaFarolAlto: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.diantDireitaFarolAlto.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.diantDireitaFarolAlto.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                diantDireitaFarolAlto: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                            <View style={[styles.containerAnswers, styles.answersTableLineFirst]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Farol Baixo
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.diantDireitaFarolBaixo.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.diantDireitaFarolBaixo.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                diantDireitaFarolBaixo: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.diantDireitaFarolBaixo.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.diantDireitaFarolBaixo.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                diantDireitaFarolBaixo: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.diantDireitaFarolBaixo.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.diantDireitaFarolBaixo.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                diantDireitaFarolBaixo: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                            <View style={[styles.containerAnswers, styles.answersTableLineSecond]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Neblina
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.diantDireitaNeblina.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.diantDireitaNeblina.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                diantDireitaNeblina: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.diantDireitaNeblina.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.diantDireitaNeblina.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                diantDireitaNeblina: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.diantDireitaNeblina.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.diantDireitaNeblina.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                diantDireitaNeblina: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                            <View style={[styles.containerAnswers, styles.answersTableLineFirst]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Seta
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.diantDireitaSeta.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.diantDireitaSeta.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                diantDireitaSeta: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.diantDireitaSeta.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.diantDireitaSeta.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                diantDireitaSeta: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.diantDireitaSeta.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.diantDireitaSeta.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                diantDireitaSeta: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>

                                            <View style={styles.headerLayout}>
                                                <Text style={styles.headerLayoutText}>
                                                    Esquerda
                                                </Text>
                                            </View>
                                            <View style={styles.headerQuestions}>
                                                <Text style={styles.headerQuestionsTextSN}>
                                                    Sim
                                                </Text>
                                                <Text style={styles.headerQuestionsTextSN}>
                                                    Não
                                                </Text>
                                                <Text style={styles.headerQuestionsTextSN}>
                                                    N/A
                                                </Text>
                                            </View>

                                            <View style={[styles.containerAnswers, styles.answersTableLineSecond]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Farol Alto
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.diantEsquerdaFarolAlto.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.diantEsquerdaFarolAlto.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                diantEsquerdaFarolAlto: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.diantEsquerdaFarolAlto.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.diantEsquerdaFarolAlto.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                diantEsquerdaFarolAlto: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.diantEsquerdaFarolAlto.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.diantEsquerdaFarolAlto.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                diantEsquerdaFarolAlto: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                            <View style={[styles.containerAnswers, styles.answersTableLineFirst]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Farol Baixo
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.diantEsquerdaFarolBaixo.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.diantEsquerdaFarolBaixo.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                diantEsquerdaFarolBaixo: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.diantEsquerdaFarolBaixo.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.diantEsquerdaFarolBaixo.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                diantEsquerdaFarolBaixo: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.diantEsquerdaFarolBaixo.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.diantEsquerdaFarolBaixo.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                diantEsquerdaFarolBaixo: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                            <View style={[styles.containerAnswers, styles.answersTableLineSecond]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Neblina
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.diantEsquerdaNeblina.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.diantEsquerdaNeblina.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                diantEsquerdaNeblina: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.diantEsquerdaNeblina.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.diantEsquerdaNeblina.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                diantEsquerdaNeblina: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.diantEsquerdaNeblina.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.diantEsquerdaNeblina.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                diantEsquerdaNeblina: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                            <View style={[styles.containerAnswers, styles.answersTableLineFirst]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Seta
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.diantEsquerdaSeta.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.diantEsquerdaSeta.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                diantEsquerdaSeta: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.diantEsquerdaSeta.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.diantEsquerdaSeta.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                diantEsquerdaSeta: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.diantEsquerdaSeta.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.diantEsquerdaSeta.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                diantEsquerdaSeta: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>

                                            <View style={styles.headerLayout}>
                                                <Text style={styles.headerLayoutText}>
                                                    Motor
                                                </Text>
                                            </View>
                                            <View style={styles.headerQuestions}>
                                                <Text style={styles.headerQuestionsTextSN}>
                                                    Sim
                                                </Text>
                                                <Text style={styles.headerQuestionsTextSN}>
                                                    Não
                                                </Text>
                                                <Text style={styles.headerQuestionsTextSN}>
                                                    N/A
                                                </Text>
                                            </View>

                                            <View style={[styles.containerAnswers, styles.answersTableLineSecond]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Aceleador
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.motorAcelerador.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.motorAcelerador.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                motorAcelerador: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.motorAcelerador.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.motorAcelerador.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                motorAcelerador: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.motorAcelerador.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.motorAcelerador.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                motorAcelerador: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>

                                            <View style={[styles.containerAnswers, styles.answersTableLineFirst]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Água do Limpador
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.motorAguaLimpador.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.motorAguaLimpador.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                motorAguaLimpador: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.motorAguaLimpador.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.motorAguaLimpador.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                motorAguaLimpador: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.motorAguaLimpador.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.motorAguaLimpador.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                motorAguaLimpador: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>

                                            <View style={[styles.containerAnswers, styles.answersTableLineSecond]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Água do Radiador
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.motorAguaRadiador.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.motorAguaRadiador.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                motorAguaRadiador: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.motorAguaRadiador.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.motorAguaRadiador.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                motorAguaRadiador: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.motorAguaRadiador.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.motorAguaRadiador.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                motorAguaRadiador: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>

                                            <View style={[styles.containerAnswers, styles.answersTableLineFirst]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Embreagem
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.motorEmbreagem.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.motorEmbreagem.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                motorEmbreagem: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.motorEmbreagem.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.motorEmbreagem.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                motorEmbreagem: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.motorEmbreagem.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.motorEmbreagem.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                motorEmbreagem: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>

                                            <View style={[styles.containerAnswers, styles.answersTableLineSecond]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Freio
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.motorFreio.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.motorFreio.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                motorFreio: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.motorFreio.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.motorFreio.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                motorFreio: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.motorFreio.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.motorFreio.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                motorFreio: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>

                                            <View style={[styles.containerAnswers, styles.answersTableLineFirst]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Freio de Mão
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.motorFreioMao.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.motorFreioMao.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                motorFreioMao: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.motorFreioMao.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.motorFreioMao.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                motorFreioMao: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.motorFreioMao.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.motorFreioMao.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                motorFreioMao: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>

                                            <View style={[styles.containerAnswers, styles.answersTableLineSecond]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Óleo de Freio
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.motorOleoFreio.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.motorOleoFreio.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                motorOleoFreio: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.motorOleoFreio.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.motorOleoFreio.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                motorOleoFreio: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.motorOleoFreio.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.motorOleoFreio.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                motorOleoFreio: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>

                                            <View style={[styles.containerAnswers, styles.answersTableLineFirst]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Óleo do Motor
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.motorOleoMotor.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.motorOleoMotor.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                motorOleoMotor: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.motorOleoMotor.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.motorOleoMotor.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                motorOleoMotor: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.motorOleoMotor.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.motorOleoMotor.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                motorOleoMotor: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>

                                            <View style={[styles.containerAnswers, styles.answersTableLineSecond]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Tanque de Partida
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.motorTanquePartida.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.motorTanquePartida.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                motorTanquePartida: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.motorTanquePartida.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.motorTanquePartida.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                motorTanquePartida: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.motorTanquePartida.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.motorTanquePartida.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                motorTanquePartida: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>

                                            <View style={styles.headerLayout}>
                                                <Text style={styles.headerLayoutText}>
                                                    Segurança
                                                </Text>
                                            </View>
                                            <View style={styles.headerQuestions}>
                                                <Text style={styles.headerQuestionsTextSN}>
                                                    Sim
                                                </Text>
                                                <Text style={styles.headerQuestionsTextSN}>
                                                    Não
                                                </Text>
                                                <Text style={styles.headerQuestionsTextSN}>
                                                    N/A
                                                </Text>
                                            </View>

                                            <View style={[styles.containerAnswers, styles.answersTableLineSecond]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Alarme
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.seguAlarme.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.seguAlarme.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguAlarme: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.seguAlarme.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.seguAlarme.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguAlarme: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.seguAlarme.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.seguAlarme.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguAlarme: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>

                                            <View style={[styles.containerAnswers, styles.answersTableLineFirst]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Buzina
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.seguBuzina.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.seguBuzina.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguBuzina: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.seguBuzina.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.seguBuzina.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguBuzina: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.seguBuzina.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.seguBuzina.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguBuzina: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>

                                            <View style={[styles.containerAnswers, styles.answersTableLineSecond]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Chave de Roda
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.seguChaveRoda.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.seguChaveRoda.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguChaveRoda: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.seguChaveRoda.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.seguChaveRoda.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguChaveRoda: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.seguChaveRoda.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.seguChaveRoda.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguChaveRoda: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>

                                            <View style={[styles.containerAnswers, styles.answersTableLineFirst]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Cintos
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.seguCinto.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.seguCinto.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguCinto: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.seguCinto.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.seguCinto.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguCinto: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.seguCinto.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.seguCinto.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguCinto: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>

                                            <View style={[styles.containerAnswers, styles.answersTableLineSecond]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Documentos
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.seguDocumento.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.seguDocumento.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguDocumento: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.seguDocumento.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.seguDocumento.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguDocumento: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.seguDocumento.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.seguDocumento.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguDocumento: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>

                                            <View style={[styles.containerAnswers, styles.answersTableLineFirst]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Extintor
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.seguExtintor.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.seguExtintor.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguExtintor: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.seguExtintor.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.seguExtintor.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguExtintor: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.seguExtintor.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.seguExtintor.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguExtintor: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>

                                            <View style={[styles.containerAnswers, styles.answersTableLineSecond]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Limpadores
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.seguLimpador.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.seguLimpador.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguLimpador: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.seguLimpador.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.seguLimpador.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguLimpador: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.seguLimpador.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.seguLimpador.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguLimpador: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>

                                            <View style={[styles.containerAnswers, styles.answersTableLineFirst]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Macaco
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.seguMacaco.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.seguMacaco.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguMacaco: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.seguMacaco.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.seguMacaco.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguMacaco: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.seguMacaco.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.seguMacaco.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguMacaco: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>

                                            <View style={[styles.containerAnswers, styles.answersTableLineSecond]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Painel
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.seguPainel.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.seguPainel.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguPainel: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.seguPainel.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.seguPainel.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguPainel: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.seguPainel.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.seguPainel.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguPainel: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>

                                            <View style={[styles.containerAnswers, styles.answersTableLineFirst]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Retrovisor Interno
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.seguRetroInterno.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.seguRetroInterno.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguRetroInterno: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.seguRetroInterno.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.seguRetroInterno.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguRetroInterno: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.seguRetroInterno.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.seguRetroInterno.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguRetroInterno: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>

                                            <View style={[styles.containerAnswers, styles.answersTableLineSecond]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Retrovisor Direito
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.seguRetroDireito.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.seguRetroDireito.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguRetroDireito: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.seguRetroDireito.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.seguRetroDireito.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguRetroDireito: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.seguRetroDireito.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.seguRetroDireito.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguRetroDireito: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>

                                            <View style={[styles.containerAnswers, styles.answersTableLineFirst]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Retrovisor Esquerdo
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.seguRetroEsquerdo.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.seguRetroEsquerdo.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguRetroEsquerdo: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.seguRetroEsquerdo.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.seguRetroEsquerdo.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguRetroEsquerdo: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.seguRetroEsquerdo.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.seguRetroEsquerdo.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguRetroEsquerdo: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>

                                            <View style={[styles.containerAnswers, styles.answersTableLineSecond]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Travas
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.seguTrava.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.seguTrava.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguTrava: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.seguTrava.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.seguTrava.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguTrava: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.seguTrava.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.seguTrava.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguTrava: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>

                                            <View style={[styles.containerAnswers, styles.answersTableLineFirst]}>
                                                <View style={styles.answerText}>
                                                    <Text>
                                                        Triângulo
                                                    </Text>
                                                </View>
                                                <View style={styles.answerChecks}>
                                                    <CheckBox
                                                        checked={values.seguTriangulo.valueA}
                                                        onValueChange={() => {
                                                            const newValueA = !values.seguTriangulo.valueA;
                                                            const newValue = {
                                                                valueA: newValueA,
                                                                valueB: false,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguTriangulo: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.seguTriangulo.valueB}
                                                        onValueChange={() => {
                                                            const newValueB = !values.seguTriangulo.valueB;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: newValueB,
                                                                valueC: false
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguTriangulo: newValue
                                                            }));
                                                        }}
                                                    />
                                                    <CheckBox
                                                        checked={values.seguTriangulo.valueC}
                                                        onValueChange={() => {
                                                            const newValueC = !values.seguTriangulo.valueC;
                                                            const newValue = {
                                                                valueA: false,
                                                                valueB: false,
                                                                valueC: newValueC
                                                            }
                                                            setValues(prevState => ({
                                                                ...prevState,
                                                                seguTriangulo: newValue
                                                            }));
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                            <TouchableOpacity style={styles.sendButton} onPress={sendEmailCheckList}>
                                                <Text style={styles.sendButtonText}>Enviar</Text>
                                            </TouchableOpacity>
                                        </>
                                    }
                                </>
                            )
                        }
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    main: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    fleetFilter: {
        width: qrSize,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    input: {
        width: (qrSize * 0.73),
        height: 60,
        backgroundColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 24,
        color: '#f28627',
        fontSize: 16,
    },
    fieldGroup: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    searchButton: {
        flex: 1,
        width: (qrSize * 0.23),
        height: 60,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#39566b',
        backgroundColor: '#293d4b',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginButtonText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff'
    },
    loadingText: {
        fontSize: 28,
    },
    headerLayout: {
        width: qrSize,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
    },
    headerLayoutText: {
        fontSize: 22,
        color: '#293d4b',

    },
    layoutImgFieldSet: {
        marginTop: 10,
    },
    layoutImg: {
        width: qrSize,
        height: 160,
    },
    headerQuestions: {
        width: qrSize,
        backgroundColor: '#ddd',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
    },
    headerQuestionsText: {
        fontSize: 18,
        marginLeft: 10
    },
    headerQuestionsTextSN: {
        fontSize: 18,
        marginLeft: 20
    },
    containerAnswers: {
        width: qrSize,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 10,
    },
    answersTableLineFirst: {
        backgroundColor: '#dcdcdc',
    },
    answersTableLineSecond: {
        backgroundColor: '#cacaca',
    },
    answerText: {
        width: (qrSize * 0.5),
        textAlign: 'left'
    },
    answerChecks: {
        width: (qrSize * 0.45),
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingRight: 10,
    },
    sendButton: {
        width: qrSize,
        height: 60,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#39566b',
        backgroundColor: '#293d4b',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10
    },
    sendButtonText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff'
    },
});

export default Checklist;