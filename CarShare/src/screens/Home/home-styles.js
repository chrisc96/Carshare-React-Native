import {StyleSheet} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

export default styles = StyleSheet.create({
    home: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontFamily: 'cursive',
        fontSize: 40,
        color: '#FFFAE5'
    },
    subTitle: {
        fontFamily: 'monospace',
        color: '#FFFAE5'
    },
    buttons: {
        width: '70%',
        marginTop: 30
    },
    button: {
        paddingVertical: 8
    },
    logoImg: {
        width: 180,
        height: 180,
        marginBottom: 10
    }
});
