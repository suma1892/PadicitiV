import React, {Component} from "react";
import {
    AppRegistry,
    ActivityIndicator,
    View,
    Modal,Text
} from "react-native";
import {DotsLoader} from 'react-native-indicator';
import { Colors } from "./index";

export default class LoadingFull extends Component {
    constructor(props) {
        super(props);
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
                <View
                    style={{
                    flex: 1,
                    backgroundColor : Colors.white,
                    justifyContent : 'center',
                    alignItems : 'center'
                }}>
                   
                        <DotsLoader
                            size={12}
                            color={Colors.blue}
                            betweenSpace={5} />

                            <Text style = {{fontSize : 18, color:Colors.black, marginTop : 15}}>
                           &nbsp; {this.props.title}
                            </Text>
                            <Text style = {{fontSize : 12, color:Colors.warm_grey, marginTop : 5}}>
                           &nbsp; {this.props.sub_title}
                            </Text>

                </View>
            </Modal>
        );
    }
}

AppRegistry.registerComponent('primesystem', () => Loading);