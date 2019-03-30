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
export default class PaymentIJDK extends Component {
    constructor(props) {
        super(props);
        this.state = {
            webViewHeight: 100,
            canGoBack: null,
            loading: false,
            dataSource:[]
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => this.backAndroid())

        let { navigation } = this.props
        let { state } = navigation
        let {pax_list, response, TampEmail} = state.params
        let jsonParam = JSON.parse(response)
        console.log("Json param : "+(jsonParam.transactionCode))
        return fetch('http://182.23.65.29:8888/free-0.0.1/service/payment/padipay/reqPadipayLoyalty?transaction_code='+jsonParam.transactionCode+'', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
      })
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          dataSource: responseJson,
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });


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
        let { navigation } = this.props
        let { state } = navigation
        let {pax_list, response, TampEmail} = state.params
        let jsonParam = JSON.parse(response)
        let Param = ''
        Param = JSON.stringify(this.state.dataSource.padipaySignature)
        // let urlBase = "https://www.padipay.com/paymentsapp/webapp/home/request.html"
        let urlBase = this.state.dataSource.padipayReqUrl
        urlBase = urlBase+"?merchantCode="+this.state.dataSource.merchantCode+"&merchantPass="+this.state.dataSource.merchantPass+"&padipaySignature="+this.state.dataSource.padipaySignature+"&invoiceCode="+this.state.dataSource.invoiceCode+"&amount="+this.state.dataSource.amount+"&transactionTime="+this.state.dataSource.transactionTime+"&expirationTime="+this.state.dataSource.expirationTime+"&merchantReturnUrl="+this.state.dataSource.merchantReturnUrl+"&languageVer="+this.state.dataSource.languageVer

        console.log("URL BASE : "+ urlBase)
        // const { params } = this.props.navigation.state;
        return (
            <View style={styles.frame} >
                <Toolbar
                    arrow_back
                    onPress={() => this.backAndroid()}
                    View={
                        <TextView style={styles.lableTitle} text={"Payment"}/>
                    }
                />
                <WebView
                        ref={'WEBVIEW_REF'}
                        source={{
                            // uri: Param.padipayReqUrl,

                            uri:urlBase,
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            },
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
AppRegistry.registerComponent("padiciti", () => PaymentIJDK);
