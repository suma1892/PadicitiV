import React, {Component} from "react";
import {
    AppRegistry,
    View,
    Modal,
} from "react-native";
import { DotsLoader } from 'react-native-indicator'
import { Colors, Scale } from "../Assets"
import Text from './TextView'

export default class Loading extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    render() {
        // const { navigate } = this.props.navigation;
        return (
            <Modal
                visible={this.props.visible}
                transparent
                animationType={'fade'}
                onRequestClose={() => null}>
                <View style={{...s.overlay}}>
                    <View style={{...s.frame}}>
                        <DotsLoader size={10} color={Colors.blue} betweenSpace={5} />
                        <Text style={{...s.text}}>{this.props.text}</Text>
                    </View>
                </View>
            </Modal>
        );
    }
}

const s = {
    overlay: {
        backgroundColor: Colors.overlay,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    frame: {
        backgroundColor: Colors.white,
        borderRadius: Scale(3),
        paddingHorizontal: Scale(16),
        paddingVertical: Scale(16)
    },
    text:{
        fontSize: Scale(13),
        marginTop: Scale(16)
    }
}


AppRegistry.registerComponent('primesystem', () => Loading)
