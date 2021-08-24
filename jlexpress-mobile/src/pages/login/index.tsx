import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    AsyncStorage,
    Animated,
    Keyboard
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const qrSize = width * 0.8;

import api from '../../services/api';

type FormField = {
    username: string;
    password: string;
}

const Login = () => {

    const initialState = {
        username: 'bolinha',
        password: 'JL@31011983'
    }

    const { navigate, setOptions } = useNavigation();
    const [values, setValues] = useState<FormField>(initialState);
    const [isLogging, setIsLogging] = useState(false);
    const [offset] = useState(new Animated.ValueXY({ x: 0, y: 80 }));
    const [opacity] = useState(new Animated.Value(0));
    const [logo] = useState(new Animated.ValueXY({ x: qrSize, y: 90 }));
    const [logoMargin] = useState(new Animated.Value(25));

    useEffect(() => {

        setOptions({
            headerLeft: () => { },
            headerRight: () => { },
        });

        const keybordDidShowListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
        const keybordDidHideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide);

        Animated.parallel([
            Animated.spring(offset.y, {
                toValue: 0,
                speed: 4,
                bounciness: 20,
                useNativeDriver: true
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            }),
        ]).start();

    }, []);

    function keyboardDidShow() {
        Animated.parallel([
            Animated.timing(logo.x, {
                toValue: 230,
                duration: 200,
                useNativeDriver: false
            }),
            Animated.timing(logo.y, {
                toValue: 80,
                duration: 200,
                useNativeDriver: false
            }),
            Animated.timing(logoMargin, {
                toValue: 2,
                duration: 200,
                useNativeDriver: false
            })
        ]).start();
    }

    function keyboardDidHide() {
        Animated.parallel([
            Animated.timing(logo.x, {
                toValue: qrSize,
                duration: 200,
                useNativeDriver: false
            }),
            Animated.timing(logo.y, {
                toValue: 90,
                duration: 200,
                useNativeDriver: false
            }),
            Animated.timing(logoMargin, {
                toValue: 25,
                duration: 200,
                useNativeDriver: false
            })
        ]).start();
    }

    async function signin() {
        setIsLogging(true);

        try {
            const { data: { token } } = await api.post('/api/users/authenticate', values);
            AsyncStorage.setItem('@token', token);
            navigate('Checklist', { isToRefresh: false });
            setIsLogging(false);
        } catch (error) {

            if (error.response) {
                alert(error.response.data.message);
            }
            setIsLogging(false);
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'android' ? 'height' : 'padding'}
            style={styles.main}
        >
            <View style={[
                styles.containerImage,
            ]}>
                <Animated.Image
                    style={{
                        width: logo.x,
                        height: logo.y,
                        marginTop: logoMargin,
                        marginBottom: logoMargin
                    }}
                    source={require('../../assets/logoJLExpress.png')} />
            </View>
            <Animated.View style={[
                styles.containerFields,
                {
                    opacity: opacity,
                    transform: [
                        {
                            translateY: offset.y,
                        }
                    ]
                }
            ]}>
                <View style={styles.fieldGroup}>
                    <TextInput
                        style={styles.input}
                        value={values.username}
                        placeholder="Usuário"
                        onChangeText={(event) => {
                            setValues({
                                ...values,
                                username: event
                            });
                        }}
                    />
                </View>
                <View style={styles.fieldGroup}>
                    <TextInput
                        style={styles.input}
                        value={values.password}
                        secureTextEntry={true}
                        placeholder="Senha"
                        textContentType="password"
                        onChangeText={(event) => {
                            setValues({
                                ...values,
                                password: event
                            });
                        }}
                    />
                </View>
                <View>
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={signin}
                        disabled={isLogging}
                        activeOpacity={isLogging ? 1 : 0.7}
                    >
                        {isLogging
                            ? (
                                <Text style={styles.loginButtonText}>Processando...</Text>
                            )
                            : (
                                <Text style={styles.loginButtonText}>Entrar</Text>
                            )
                        }
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    main: {
        height: '100%',
    },
    containerImage: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerFields: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: qrSize,
        height: 60,
        backgroundColor: '#ddd',
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 24,
        color: '#f28627',
        fontSize: 16,
    },
    fieldGroup: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    loginButton: {
        width: qrSize,
        height: 60,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#39566b',
        backgroundColor: '#293d4b',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    loginButtonText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff'
    },
});

export default Login;