import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    WebView,
    Dimensions, AppRegistry, BackHandler, Linking
} from 'react-native'
import { Colors, Metrics, Toolbar, TextView, Loading } from '../../Components'
import { Function, STRING, array, navigateTo } from '../../Utils'
import { NavigationActions } from 'react-navigation';
import { _OS } from '../../Assets';

const finish = NavigationActions.back({ key: "" });
const Scale = (value) => {
    const { width } = Dimensions.get('window')
    const guidelineBaseWidth = 350;

    return width / guidelineBaseWidth * value
}
export default class PaymentPLN extends Component {
    constructor(props) {
        super(props);
        this.state = {
            webViewHeight: 100,
            canGoBack: null,
            loading: false,
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => this.backAndroid())
    }

    _updateWebViewHeight = (event) => {
        this.setState({ webViewHeight: parseInt(event.jsEvaluationValue), canGoBack: event.canGoBack, loading: event.loading });
    }

    backAndroid() {
        navigateTo('HomeScreen' ,this.props.dispatch,this.props.navigation,null )
        // !this.state.canGoBack ? this.props.navigation.dispatch(finish) : this.refs['WEBVIEW_REF'].goBack();
        return true
    }

    onMessage = (event) => {
        const data = event.data
        if (data !== undefined && data !== null) {
            Linking.openURL(data);
        }
    }

    render() {
        const { params } = this.props.navigation.state;
        return (
            <View style={styles.frame} >
                <Toolbar
                    arrow_back
                    onPress={() => this.backAndroid()}
                    View={
                        <TextView style={styles.lableTitle} text={"Review & Payment"}/>
                    }
                />
                <WebView
                        ref={'WEBVIEW_REF'}
                        source={{
                            uri: params.DataJson.padipayReqUrl,
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            },
                            body: "padipaySignature=" + params.DataJson.padipaySignature +
                                "&merchantCode=" + params.DataJson.merchantCode +
                                "&merchantPass=" + params.DataJson.merchantPass +
                                "&invoiceCode=" + params.DataJson.invoiceCode +
                                "&amount=" + params.DataJson.amount +
                                "&transactionTime=" + params.DataJson.transactionTime +
                                "&expirationTime=" + params.DataJson.expirationTime +
                                "&merchantReturnUrl=" + params.DataJson.merchantReturnUrl +
                                "&languageVer=" + 'ID'
                        }}

                        style={{ width: Metrics.screenWidth, height: this.state.webViewHeight }}
                        injectedJavaScript="document.body.scrollHeight;"
                        startInLoadingState={true}
                        onLoadStart={(e) => { console.log(`isLoading: ${e.nativeEvent.loading}`); }}
                        scalesPageToFit={true}
                        javaScriptEnabled={true}
                        scrollEnabled={_OS(true, false)}
                        automaticallyAdjustContentInsets={true}
                        onNavigationStateChange={this._updateWebViewHeight}
                    />
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
AppRegistry.registerComponent("padiciti", () => PaymentPLN);
