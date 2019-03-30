import React, { Component } from 'react'
import {
    AsyncStorage,
    TextInput,
    StyleSheet,
    View,
    FlatList,
    ScrollView,
    Image, 
    Platform, WebView,
    Dimensions, AppRegistry, TouchableWithoutFeedback, TouchableNativeFeedback, TouchableOpacity, BackHandler, Linking 
} from 'react-native'
import { Function, STRING, array } from '../../Utils'
import { API, getURL } from '../../Services/API'
import {Alert, Colors, Metrics, Toolbar, TextView, Loading } from '../../Components'

import { TabNavigator, StackNavigator, NavigationActions } from 'react-navigation';
import moment from 'moment'
import { Parameter } from '../../Services/Parameter'
import { JSONPostFile } from '../../Services/JsonService'
import { _OS } from '../../Assets';
const finish = NavigationActions.back({ key: "" });
const TouchableComponent = Platform.OS == 'ios' ? TouchableWithoutFeedback : TouchableNativeFeedback
const Scale = (value) => {
    const { width } = Dimensions.get('window')
    const guidelineBaseWidth = 350;

    return width / guidelineBaseWidth * value
}
export default class Tour extends Component {
    constructor(props) {
        super(props);
        this.state = {
            webViewHeight: 100,
            canGoBack : null,
            loading: false,
        }
    }

    //called when HTML was loaded and injected JS executed
    _updateWebViewHeight = (event) => {
        //jsEvaluationValue contains result of injected JS
        this.setState({webViewHeight: parseInt(event.jsEvaluationValue), canGoBack :event.canGoBack, loading : event.loading});
    }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        BackHandler.addEventListener('hardwareBackPress', () => this.backAndroid())
console.log(params)
       
    }
   
    backAndroid() {
        !this.state.canGoBack ? this.props.navigation.dispatch(finish): this.refs['WEBVIEW_REF'].goBack();
        return true
    }


      onMessage = (event) => {
        const data = event.data
        if (data !== undefined && data !== null) {
            Linking.openURL(data);
          }
      }

    render() {

        const {params} = this.props.navigation.state;
        
        return (
            <View style={styles.frame} >
                <Toolbar
                    arrow_back
                    onPress={() => this.backAndroid()}
                    View={
                        <TextView
                            style={styles.lableTitle}
                            text={"TOUR"}
                        />
                    }
                />
                <View style={{width : Metrics.screenWidth, height : Metrics.screenHeight }}>
                        
                        <WebView
                        ref={'WEBVIEW_REF'}
                        style={{width : Metrics.screenWidth, height: this.state.webViewHeight}}
                    source={{uri: 'http://padicititour.com'}}
                    
                    injectedJavaScript="document.body.scrollHeight;"
                    startInLoadingState={true}
                    onLoadStart={(e) => { console.log(`isLoading: ${e.nativeEvent.loading}`);}}
                    scalesPageToFit={true}
                    javaScriptEnabled={true}
                    scrollEnabled={_OS(true, false)}
                    automaticallyAdjustContentInsets={true}
                    onNavigationStateChange={this._updateWebViewHeight}
                    // onNavigationStateChange={this.onNavigationStateChange}
                  /> 
                </View>
                <Loading
                    text={'Harap tunggu sedang menyiapkan halaman'}
                    visible={this.state.loading}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    frame: {
        flex: 1,
        backgroundColor: Colors.whitesmoke
    },
    lableTitle: {
        fontSize: Scale(18), color: Colors.white
    },
    titlePassanger: {
        fontSize: Scale(16),
        bottom: Scale(8),
        color: Colors.blue
    }
});
AppRegistry.registerComponent("padiciti", () => Tour);
