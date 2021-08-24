import React from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

type CheckBoxProps = {
    checked: boolean,
    onValueChange: () => void,
}

const CheckBox: React.FC<CheckBoxProps> = ({ checked, onValueChange }: CheckBoxProps) => {

    return (
        <TouchableWithoutFeedback onPress={onValueChange}>
            <View style={[styles.main, checked ? styles.checked : styles.notChecked]}>
                {checked &&
                    <Icon
                        style={styles.check}
                        name="check"
                        size={10}
                    />
                }
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    main: {
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
    },
    checked: {
        backgroundColor: '#f28627'
    },
    notChecked: {
        backgroundColor: '#fff',
        borderColor: '#f28627',
        borderWidth: 1,
    },
    check: {
        color: '#fff'
    }
});

export default CheckBox;