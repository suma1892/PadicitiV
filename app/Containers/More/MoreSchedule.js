import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    FlatList,
    ScrollView,
    Image,  Dimensions, AppRegistry, AsyncStorage
} from 'react-native'

import s from '../../Components/Styles'
import { Colors, Fonts,
    Metrics, 
    Container, 
    getIcon, 
    ToolbarV2 as Toolbar, 
    ItemField, 
    CalculateComponent, TextView as Text,
    Button, CardModalDate, Touchable, Modal} from '../../Components/index'
import { TabNavigator, StackNavigator, NavigationActions } from 'react-navigation';
import {Function, STRING } from '../../Utils'
import { ListRecentSearch } from '../../Utils/dummy';
import moment from 'moment'
const backAction = NavigationActions.back({key:''}) 

const Datedata = [
    {
    id:'1',
    dayName: 'Senin',
     date : '1',
     month : 'January',
     price :'Rp. 400'
    },
    {
        id:'2',
    dayName: 'Selasa',
     date : '2',
     month : 'January',
     price :'Rp. 400'
    },
    {
        id:'3',
        dayName: 'Rabu',
     date : '3',
     month : 'January',
     price :'Rp. 400'
    },
    {
        id:'4',
        dayName: 'Kamis',
     date : '4',
     month : 'January',
     price :'Rp. 400'
    },
    {
        id:'5',
        dayName: 'Jumat',
     date : '5',
     month : 'January',
     price :'Rp. 400'
    },
]

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            data: Datedata,
            dataIndex: 0,
        });
    }
    
    componentDidMount(){
        this.state.data.map((item,i) =>{
          this.setState({
              data     : [],
              ['select_'+ item.id]  : false
          }, () => {
              this.setState({ data     : Datedata})
          }
      ) 
        })
    }
      _onSelect(item) {
          this.setState({ data     : [], ['select_'+ item.id]  : !this.state['select_'+ item.id]}, () => {
              this.setState({ data     : Datedata})
          })
      }
    
  
    render() {

        const { dispatch , navigate} = this.props.navigation;
        return (
            <Container style={s.container}>
                 
                 <Toolbar
                        style       = {s.toolbar}
                        type        = {next => this.setState({next})}
                        title       = 'Hotel'
                        barStyle    = {s.toolbar}
                        left        = {[{
                                        icon: 'ic_arrow_back',
                                        onPress : () => dispatch(backAction)
                                    }]}
                    />
                    <ScrollView>
                    <Modal
                            type={'more'}
                            active={this.state.visibleModal}
                            onClose={value => this.setState({ visibleModal: value })}
                        >   
                           <View style={style.headerModal}>
                                <Text style={style.textHeader}>{STRING.Label.anotherDate}</Text>
                           </View>
                           
                            <View style={style.modal}>
                                <View style={style.ContainerModal}>
                                <FlatList
                                    horizontal
                                    contentContainerStyle={{ paddingHorizontal: Metrics.padding.small }}
                                    showsHorizontalScrollIndicator={false}
                                    data={this.state.data}
                                    keyExtractor={(item, index) => `key-${index}`}
                                    renderItem   = {({item, index} ) => (
                                        <View style={{justifyContent:'center', paddingHorizontal: Metrics.padding.tiny}}>
                                            <CardModalDate
                                                dayName ={item.dayName}
                                                date ={item.date}
                                                month ={item.month}
                                                price={item.price}
                                                onPress = {() => console.log("s")}
                                                overlay = {this.state.dataIndex === index}
                                            />
                                        </View>
                                    )}/>
                                </View>
                                <View >
                                    <Button 
                                            style ={style.save}
                                            onPress={()=> console.log('')}
                                            text =  {STRING.Label.closeButton}
                                        />
                                </View>
                            </View>
                        </Modal>
                    <Button
                        //style ={style.button}
                        onPress={()=> this.setState({visibleModal: true})}
                        text = {STRING.Label_Flight.seach_hotel}
                    />
                   
                    </ScrollView> 
             </Container>
        )
    }
}



const style = StyleSheet.create({
    textHeader:{
        fontSize: Metrics.font.regular,
        fontFamily: Fonts.bold.fontFamily,
        fontWeight : "500",
        color : Colors.white
    },
    headerModal:{
        backgroundColor: 'rgba(0,0,0,0.20)',
        paddingHorizontal: Metrics.padding.normal,
        paddingVertical: Metrics.padding.small
    },
    ContainerModal:{
        backgroundColor :'#E0E0E2',
        paddingVertical: Metrics.padding.normal,
    },
    button:{
        backgroundColor : 'pink'
    },
    save: {
        marginTop: Metrics.padding.normal,
        backgroundColor : Colors.blue,  
    },
})

