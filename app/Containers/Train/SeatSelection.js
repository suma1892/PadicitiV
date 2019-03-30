import React, { Component } from 'react'
import {
    AppRegistry,
    View,
    StyleSheet,
    ScrollView,
    FlatList, Image, Alert as Confirmation, Platform
} from 'react-native'
import {
    TextView as Text,
    ToolbarV2 as Toolbar,
    Scale,
    Colors,
    Fonts,
    Touchable,
    Metrics,
    getIcon, Alert, Loading, Button
} from '../../Components/'
import { ArraySeat, dataSeat } from '../../Utils/dummy';
import { Validaton, STRING_TR, STRING } from '../../Utils'
import { getURLTrain } from '../../Services/API'
import { NavigationActions } from 'react-navigation';
import { JSONGet_ } from '../../Services/JsonService'
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures'
const backAction = NavigationActions.back({ key: '' })
export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            seats: [],
            Counter : 0,
            seatReserved: [],
            type : null,
            select_seat: null,
            pax_return : [],
            pax_depart : [],
            button_seat : 1,
            change_seat : null,
            current_seat: [],
            costumerName: null,
            train_name: null,
            train_class: null,
            current_train_class: null,
            current_train_class_all: [],
            index_Seat: 0,
            total_index_seat: 0,
            chouse_seat : null,
            chouse_costumerName : null,
            numberA: [],
            numberB: [],
            seat_map: [],
            index : 0,
            coloumn_array : [],
            coloumn: 'ABXCD',
            loading: true,
            load_title : 'Harap tunggu',
            parameter: {
                org: 'GMR',
                des: 'BD',
                train_no: '20',
                dep_date: '20180730',
                book_code: null,
                wagon_code: null,
                wagon_no: null,
                seat: null
            }
        }
    }

    componentDidMount() {
    const { params } = this.props.navigation.state;
    this.setState({button_seat : params.data_return ? 2 : 1 })
    this.getAllData('seat')
    }

    onSwipeLeft(gestureState) {
        console.log('Left >> ',gestureState)
        
       
      }
     
      onSwipeRight(gestureState) {
       
        
      }

      onSwipe(gestureName, gestureState) {
        const {SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
        this.setState({gestureName: gestureName});
        switch (gestureName) {
          case SWIPE_LEFT:
          if ((this.state.index_Seat + 1) <= (this.state.total_index_seat - 1)) {
            console.log('LEFT')
              this.setState({ index_Seat: this.state.index_Seat + 1 }, () => {
                  this.getSeat(this.state.index_Seat, this.state.seat_map)
              })
          }
            break;
          case SWIPE_RIGHT:
          if (this.state.index_Seat != 0) {
            this.setState({ index_Seat: this.state.index_Seat - 1 }, () => {
                this.getSeat(this.state.index_Seat, this.state.seat_map)
            })
        }
            break;
        }
      }

    getAllData(type){

        const { params } = this.props.navigation.state;
        var seat_arr =[]
        var name_arr =[]
        var current_train_class_all_arr = []
        if (type){
        // if (params.data_return){
        //     this.state.parameter.org = params.data_return.org_code
        //     this.state.parameter.des = params.data_return.des_code
        //     this.state.parameter.train_no = params.data_return.train_no
        //     this.state.parameter.dep_date = params.data_return.dep_date
        //     this.state.parameter.book_code = params.data_return.book_code

        //     for (var i = 0; i < params.data_seat_return.length; i++) {
        //         var seat = params.data_seat_return[i].seat !== ' ' ? params.data_seat_return[i].seat.split('Seat')[1].trim(): null
        //         var current_train_class_all_ = params.data_seat_return[i].seat ? params.data_seat_return[i].seat.split('/')[0] : params.data_seat_return[i].seat
            
        //         if (seat) {
        //             seat_arr.push(seat)
        //             current_train_class_all_arr.push(current_train_class_all_)
        //         }
                
        //         this.state.current_train_class = params.data_seat_return[i].seat ? params.data_seat_return[0].seat.split('/')[0].split(' ')[0] : params.data_seat_return[i].seat
        //         name_arr.push(params.data_seat_return[i].name)
        //     }
        //     this.setState({current_train_class_all : current_train_class_all_arr, current_seat : seat_arr, costumerName : name_arr, chouse_seat : params.data_seat_return[0].seat.split('Seat')[1], chouse_costumerName : params.data_seat_return[0].name})

        //     this.state.train_name = params.data_return.train_name
        // }  
        // else {

            this.state.parameter.org = params.data.org_code
        this.state.parameter.des = params.data.des_code
        this.state.parameter.train_no = params.data.train_no
        this.state.parameter.dep_date = params.data.dep_date
   
        this.state.parameter.book_code = params.data.book_code
        var seat_arr =[]
        var name_arr =[]
        var current_train_class_all_arr = []
  
        for (var i = 0; i < params.data_seat.length; i++) {
            var seat = params.data_seat[i].seat !== ' ' ? params.data_seat[i].seat.split('Seat')[1].trim(): null
            var current_train_class_all_ = params.data_seat[i].seat ? params.data_seat[i].seat.split('/')[0] : params.data_seat[i].seat
        
            if (seat) {
                seat_arr.push(seat)
                current_train_class_all_arr.push(current_train_class_all_)
            }
            
            this.state.current_train_class = params.data_seat[i].seat ? params.data_seat[0].seat.split('/')[0].split(' ')[0] : params.data_seat[i].seat
            name_arr.push(params.data_seat[i].name)
        }
     
        this.setState({current_train_class_all : current_train_class_all_arr, current_seat : seat_arr, costumerName : name_arr, chouse_seat : params.data_seat[0].seat.split('Seat')[1], chouse_costumerName : params.data_seat[0].name})


        this.state.train_name = params.data.train_name

        // }
        
        this.state.costumerName = params.name
        // this.state.current_seat = params.seat.split(':')[1].split(' ')[3].replace('(', '').replace(')', '')
        
        // this.state.current_train_class = params.seat.split(':')[1].split(' ')[1] + ' ' + params.seat.split(':')[1].split(' ')[2]
        this.AuthGet('seat')

        } else {

            this.state.parameter.org = params.data_return.org_code
            this.state.parameter.des = params.data_return.des_code
            this.state.parameter.train_no = params.data_return.train_no
            this.state.parameter.dep_date = params.data_return.dep_date
            this.state.parameter.book_code = params.data_return.book_code

            for (var i = 0; i < params.data_seat_return.length; i++) {
                var seat = params.data_seat_return[i].seat !== ' ' ? params.data_seat_return[i].seat.split('Seat')[1].trim(): null
                var current_train_class_all_ = params.data_seat_return[i].seat ? params.data_seat_return[i].seat.split('/')[0] : params.data_seat_return[i].seat
            
                if (seat) {
                    seat_arr.push(seat)
                    current_train_class_all_arr.push(current_train_class_all_)
                }
                
                this.state.current_train_class = params.data_seat_return[i].seat ? params.data_seat_return[0].seat.split('/')[0].split(' ')[0] : params.data_seat_return[i].seat
                name_arr.push(params.data_seat_return[i].name)
            }
            this.setState({current_train_class_all : current_train_class_all_arr, current_seat : seat_arr, costumerName : name_arr, chouse_seat : params.data_seat_return[0].seat.split('Seat')[1], chouse_costumerName : params.data_seat_return[0].name})

            this.state.train_name = params.data_return.train_name
        this.AuthGet('seat')
        }
    }
    
    buttonNextandPrev(next) {
        switch (next) {
            case 'next':
                if ((this.state.index_Seat + 1) <= (this.state.total_index_seat - 1)) {
                  console.log('Tambah')
                    this.setState({ index_Seat: this.state.index_Seat + 1 }, () => {
                        this.getSeat(this.state.index_Seat, this.state.seat_map)
                    })
                }
                break
            default:
                if (this.state.index_Seat != 0) {
                    this.setState({ index_Seat: this.state.index_Seat - 1 }, () => {
                        this.getSeat(this.state.index_Seat, this.state.seat_map)
                    })
                }
                break
        }
    }

    Confirmation(Seats) {
        const { params } = this.props.navigation.state;
        Confirmation.alert(
            'Ingin mengubah kursi ?',
            '',
            [
                { text: 'Tidak', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                {
                    text: 'Ya, Lanjutkan', onPress: () => this.setState({ select_seat: this.state.select_seat, current_seat: this.state.current_seat }, () => {
                        var  wagon_no_arr = []
                        var wagon_code_arr =[]
                        
                        
                        for (var i = 0; i< params.data_seat.length ; i++){
                            // var seat = params.data_seat[i].seat ? params.data_seat[i].seat.split(':')[1].split(' ')[3].replace('(', '').replace(')', '') : params.data_seat[0].seat.split(':')[1].split(' ')[3].replace('(', '').replace(')', '') 
                            // var wagon_code = params.data_seat[i].seat ? params.data_seat[i].seat.split(':')[1].split(' ')[1] : params.data_seat[0].seat.split(':')[1].split(' ')[1]
                            var wagon_no = params.data_seat[i].seat ? params.data_seat[i].seat.split('/')[0].split(' ')[1].trim() : params.data_seat[0].seat.split('/')[0].split(' ')[1].trim()
                          
                            if (wagon_no) {wagon_no_arr.push(this.state.current_train_class_all[i].split(' ')[1])}
                                if (this.state.current_train_class_all[i]) {
                                    wagon_code_arr.push(this.state.current_train_class_all[i].split(' ')[0])
                                }
                                
                            }
                            this.state.parameter.wagon_code = wagon_code_arr.toString(),
                            this.state.parameter.wagon_no = wagon_no_arr.toString(),
                            this.state.parameter.seat = this.state.current_seat.toString(),
                            this.setState({type :  params.data_return ?this.state.type ? null : 'return' : null , loading: true, load_title : 'Harap tunggu sedang mengupdate kursi'}),
                            this.AuthGet('change_seat')
                            
                        
                    })
                },
            ],
            { cancelable: false }
        )
    }


    AuthGet = (type) => {
        const { params } = this.props.navigation.state;
        let { navigation } = this.props
        // this.setState({ loading: false })
        try {
            // this.setState({ loading: true })
            let url = getURLTrain(type, this.state.parameter)
            console.log("URL TRAIN : "+ url)
            JSONGet_(url, null).then((response) => {
                response = response.data
               
                switch (type) {
                    case 'seat':
                    this.setState({ loading: false }, () =>{
                            var array_seat_map = []
                            if (response.seat_map.length !== 0) {
                                this.setState({ seat_map:[]})
                                for (var i = 0; i < response.seat_map.length; i++) {
                                   
                                    if (response.seat_map[i][0] === this.state.current_train_class) {
                                        array_seat_map.push(response.seat_map[i])
                                    }
                                }
                                this.setState({ seat_map: array_seat_map }, () => {
                                   
                                   
                                    for (var i = 0; i < this.state.seat_map.length; i++) {
                                        
                                       
                                        if (this.state.seat_map[i][0] + ' ' + this.state.seat_map[i][1] === this.state.current_train_class_all[0]) {
                                            this.setState({ index_Seat: i }, () => {
                                                this.getSeat(this.state.index_Seat, this.state.seat_map, this.state.current_train_class)
                                            })

                                        }
                                    }

                                })

                            }
                        })
                        break;
                    case 'change_seat':
                    this.setState({ loading: false }, () =>{
                            if(response.err_code === 0){
                                this.setState({change_seat : response, current_seat : response.seat[0], select_seat :response.seat[0], current_train_class : response.wagon_code +' '+response.wagon_no}, () =>{
                                   
                                    var data_arr =[]
                                    for (var i = 0; i < params.data_seat.length; i++) {
                                        // var seat = params.data_seat[i].seat.split(':')[1].split(' ')[3].replace('(', '').replace(')', '')
                                        data_arr.push({
                                            type : params.data_seat[i].type,
                                            name : params.data_seat[i].name,
                                            identity : params.data_seat[i].identity,
                                            seat : (Array.isArray(response.wagon_code) ? response.wagon_code[i] : response.wagon_code) +' '+ (Array.isArray(response.wagon_no) ? response.wagon_no[i] : response.wagon_no)+(response.seat[i] ? '/ Seat '+ response.seat[i] : ' ')
                                        })
                                        
                                    }
                                    
                                    this.setState({pax_depart : this.state.pax_depart.length !== 0 ? this.state.pax_depart : data_arr}, () => {
                                        if (this.state.type === 'return'){
                                            this.state.type = 'depart'
                                            this.setState({button_seat : 1, load_title : 'Harap tunggu'})
                                            this.getAllData()
                                        } else {
                                            this.setState({pax_return: data_arr}, () =>{
                                                this.props.navigation.dispatch(backAction)
                                                // navigation.goBack()
                                                params.ActivityResult({data: this.state.pax_depart, data_return : this.state.pax_return, slug: params.slug})
                                            })
                                            
                                        }
                                    })
                                })
                            } else {
                                navigation.goBack()
                                Platform.OS === 'ios' && Alert(STRING_TR.LABEL.failed)
                            }
                        })
                        break;
                }
            }).catch((err) => {
                console.log(err)
                this.setState({ loading: false }, () => {
                    navigation.goBack()
                    Platform.OS === 'ios' && Alert(STRING_TR.LABEL.failed)
                    // this.backAndroid()
                })
            })
        } catch (Error) {
            this.setState({ loading: false }, () => {
                navigation.goBack()
                Platform.OS === 'ios' && Alert(STRING_TR.LABEL.failed)
                // this.backAndroid()
            })
            console.log('Error >>> ', Error)
        }
    }

    getSeat(index, seat_map, current_train_class) {
        var seat_map = seat_map
        var TrainClass = []
        var Coloumn = []
        var ObjectTrain = []
        // for(i=0;i<){}
        var tamp = 0
        
        // for (var i = 0; i < seat_map.length; i++) {
            console.log("KURSI YG ADA  ======>"+seat_map[index][2].length)
        TrainClass.push(seat_map[index][0] + '_' + seat_map[index][1])
        for (var j = 0; j < seat_map[index][2].length; j++) {
        console.log(seat_map[index][1])
// console.log("SEAT MAP ======> "+ JSON.stringify(seat_map))

// if(seat_map[index][2][j][5] === 0  ){
//     console.log('seat ====> '+seat_map[index][2][j][2]+seat_map[index][2][j][3]);
//     console.log('avaibility =====> '+seat_map[index][2][j][5]);
// }

//cek status avb 
let avbsts=0;
let statusSeat ="";
if(seat_map[index][2][j][5] === 0){
    tamp+=1
    statusSeat = "no-seat";
    avbsts=0
}else{
    statusSeat = "booked"
    avbsts=1
}

// console.log(' statuse seat ================>'+statusSeat)
            var object = {
                "wagon_no": seat_map[index][1],
                "wagon_code": seat_map[index][0],
                "name": seat_map[index][2][j][3] === '' ? 'X' : seat_map[index][2][j][3],
                "val": seat_map[index][2][j][2] + seat_map[index][2][j][3],
                "show": seat_map[index][2][j][5],
                "avail": seat_map[index][2][j][5],
                "col": seat_map[index][2][j][3] === '' ? 'X' : seat_map[index][2][j][3],
                "row": seat_map[index][2][j][0],
                "available":avbsts,
                "class": seat_map[index][2][j][5] === 1 ? 'booked' : "no-seat",
                "subclass": seat_map[index][2][j][4] === 'F' ? 'C' : seat_map[index][2][j][4]
            }
            // tamp+=1
            Coloumn.push(seat_map[index][2][j][3] === '' ? 'X' : seat_map[index][2][j][3])
            console.log("OBJECT TRAIN satuaaaan ======================================================================> "+JSON.stringify(object))
            ObjectTrain.push(object)
        //  console.log('==========================================================================================================================')
        //     console.log("wkwkwkwkwkw LAND====> "+JSON.stringify(ObjectTrain))
        //     console.log('==========================================================================================================================')
        }
        console.log("TAMPUNGAN KURSI :=======>"+tamp)
        // }
        // console.log("OBJECT TRAIN ====> "+JSON.stringify(ObjectTrain))
        Coloumn = [...(new Set(Coloumn))];
        var array_train_class = []
        var train_class = {}
        var object1 = {}
        var object2 = []
        var numberA = []
        var numberB = []


this.setState({coloumn_array : Coloumn})
        for (var i = 0; i < Coloumn.length; i++) {
            for (var j = 0; j < ObjectTrain.length; j++) {

                if (Coloumn[i] === ObjectTrain[j].col) {
                    object2.push(ObjectTrain[j])
                }
            }
            object1[Coloumn[i]] = object2
            object2 = []


        }
        train_class['Seat'] = object1
        array_train_class.push(train_class)

        for (var i = 0; i < Coloumn.toString().replace(/,/g, "").split('X')[0].length; i++) {

            numberA.push(Coloumn.toString().replace(/,/g, "").split('X')[0][i])

        }

        for (var j = 0; j < Coloumn.toString().replace(/,/g, "").split('X')[1].length; j++) {

            numberB.push(Coloumn.toString().replace(/,/g, "").split('X')[1][j])

        }

        this.setState({ seats: array_train_class[0], total_index_seat: seat_map.length, train_class: seat_map[index][0] + ' ' + seat_map[index][1], numberA: numberA, numberB: numberB })


    }

    checkSeat(seat_, border) {

        for (var A = 0; A < this.state.current_seat.length; A++) {

            for (var i = 0; i < this.state.coloumn_array.length; i++) {
                var col = this.state.coloumn_array[i]

                for (var j = 0; j < this.state.seats.Seat[col].length; j++) {
                    if (this.state.seats.Seat[col][j].val === this.state.current_seat[A] && this.state.current_train_class_all[A] === this.state.seats.Seat[col][j].wagon_code + ' '+ this.state.seats.Seat[col][j].wagon_no) {
                        this.state.seats.Seat[col][j].class = 'no-seat'
                    }
                }
            }
        }
        
        if (seat_.subclass === "") {
            return "white"
        }

        for (var i = 0 ; i< this.state.current_seat.length ; i++){
           
            if (this.state.current_seat[i] === seat_.val && this.state.current_train_class_all[i] === seat_.wagon_code + ' ' + seat_.wagon_no) {
                
                if (this.state.chouse_seat.trim() === this.state.current_seat[i]) {
                    return Colors.tangerine
                } else {
                    return '#4778fb'
                }
            }

            if (seat_.class === 'booked' && this.state.current_train_class_all[i] === seat_.wagon_code + ' ' + seat_.wagon_no  || seat_.class === 'booked') {
                // this.setState({Counter : this.state.Counter + 1})
                // Alert(this.state.Counter)
                return '#c7cfdb'
            }else{
                return '#44CF6C'
            } 

           
        }
        console.log("Border===============>"+border)
        console.log("SEAT VAL===================>"+Validaton.Number(seat_.val))
        if (border && Validaton.Number(seat_.val)) {
            return '#44CF6C'
        }
    }

    clickSeat(seats, item, item_, item_x) {
        const { params } = this.props.navigation.state;
        var Seats = seats[item][item_][item_x.item]
       
        for (var A = 0; A < this.state.current_seat.length; A++) {

            for (var i = 0; i < this.state.coloumn_array.length; i++) {
                var col = this.state.coloumn_array[i]

                for (var j = 0; j < this.state.seats.Seat[col].length; j++) {
                    if (this.state.seats.Seat[col][j].val === this.state.current_seat[A] && this.state.current_train_class_all[A] === this.state.seats.Seat[col][j].wagon_code + ' '+ this.state.seats.Seat[col][j].wagon_no) {
                        this.state.seats.Seat[col][j].class = 'no-seat'
                    }
                }
            }
        }
        this.setState({ chouse_seat: Seats.val, seats : this.state.seats})
        // var index_seat = this.state.current_seat.indexOf(this.state.chouse_seat)
        if (this.state.chouse_seat) {
            if (this.state.chouse_seat ===  Seats.val && Seats.wagon_code + ' ' + Seats.wagon_no === this.state.current_train_class_all[this.state.index]) {
                
                if (this.state.current_seat.indexOf(Seats.val) !== -1) {
                    this.setState({ index: this.state.current_seat.indexOf(Seats.val) }, () => {
                        // this.state.current_seat[this.state.current_seat.indexOf(this.state.chouse_seat)] = Seats.val    
                        //     this.setState({ chouse_seat: Seats.val, chouse_costumerName: params.data_seat[this.state.index].name })
                      
                        switch (true) {
                            case Validaton.Number(Seats.val) !== null && Seats.class !== 'booked' && Seats.subclass !== '':
                           
                            this.state.current_seat[this.state.current_seat.indexOf(this.state.chouse_seat)] = Seats.val   
                            this.state.current_train_class_all[this.state.current_seat.indexOf(this.state.chouse_seat)] = Seats.wagon_code + ' '+Seats.wagon_no
                            this.setState({ chouse_seat: Seats.val, chouse_costumerName: params.data_seat[this.state.index].name })
                                break
                            default:
                                return (this.setState({ select_seat: this.state.select_seat, chouse_seat: this.state.chouse_seat }, () => {
                                    Alert(STRING.Warrning.seat_not_availabel)
                                }))
                        }
                    })
                } else {
                    
                    switch (true) {
                        case Validaton.Number(Seats.val) !== null && Seats.class !== 'booked' && Seats.subclass !== '':
                        this.state.current_train_class_all[this.state.current_seat.indexOf(this.state.chouse_seat)] = Seats.wagon_code + ' '+Seats.wagon_no
                            this.state.current_seat[this.state.current_seat.indexOf(this.state.chouse_seat)] = Seats.val
                            this.setState({ chouse_seat: Seats.val, chouse_costumerName: params.data_seat[this.state.index].name})
                            break
                        default:
                            return (this.setState({ select_seat: this.state.select_seat, chouse_seat: this.state.chouse_seat }, () => {
                                Alert(STRING.Warrning.seat_not_availabel)
                            }))
                    }
                }
            } else {
                // Alert('Kursi yang dipilih harus dalam gerbong yang sama')
                if (this.state.current_seat.indexOf(Seats.val) !== -1) {
                    this.setState({ index: this.state.current_seat.indexOf(Seats.val) }, () => {
                        
                        switch (true) {
                            case Validaton.Number(Seats.val) !== null && Seats.class !== 'booked' && Seats.subclass !== '':
                            
                            this.state.current_seat[this.state.current_seat.indexOf(this.state.chouse_seat)] = Seats.val   
                            this.state.current_train_class_all[this.state.current_seat.indexOf(this.state.chouse_seat)] = Seats.wagon_code + ' '+Seats.wagon_no
                            this.setState({ chouse_seat: Seats.val, chouse_costumerName: params.data_seat[this.state.index].name })
                                break
                            default:
                                return (this.setState({ select_seat: this.state.select_seat, chouse_seat: this.state.chouse_seat }, () => {
                                    Alert(STRING.Warrning.seat_not_availabel)
                                }))
                        }
                    })
                } else {
                   
                    switch (true) {
                        case Validaton.Number(Seats.val) !== null && Seats.class !== 'booked' && Seats.subclass !== '':
                        
                        this.state.current_train_class_all[this.state.index]  = Seats.wagon_code + ' '+Seats.wagon_no
                            this.state.current_seat[this.state.index] = Seats.val
                            this.setState({ chouse_seat: Seats.val, chouse_costumerName: params.data_seat[this.state.index].name})
                            break
                        default:
                            return (this.setState({ select_seat: this.state.select_seat, chouse_seat: this.state.chouse_seat }, () => {
                                Alert(STRING.Warrning.seat_not_availabel)
                            }))
                    }
                }
            }
        }
    }

    render() {
        const { navigation } = this.props
        const { state, goBack } = navigation
        const numberA = this.state.numberA
        const numberB = this.state.numberB
        const { params } = this.props.navigation.state;
        const config = {
            velocityThreshold: 0.4,
            directionalOffsetThreshold: 90
          };
          console.log("CURRENT SEAT : "+this.state.current_seat)
        return (
            <View style={[s.container]}>
                <Toolbar
                    centerTitle
                    style={s.toolbar}
                    type={next => this.setState({ next })}
                    title={(this.state.type ? params.data.des +' ('+params.data.des_code+ ') ' : params.data.org +' ('+params.data.org_code+ ') ')+ (params.data_return ? '⇌ ' : '> ') + (this.state.type ? params.data.org +' ('+params.data.org_code+ ') ' : params.data.des +' ('+params.data.des_code+ ') ')}
                    barStyle={s.toolbar}
                    left={[{
                        icon: 'ic_close',
                        onPress: () => navigation.goBack()
                    }]}
                />

                
                <View style={s.viewClient}>

                <FlatList
                            horizontal
                            contentContainerStyle={{ paddingHorizontal: Metrics.padding.small }}
                            showsHorizontalScrollIndicator={false}
                            data={this.state.current_seat}
                            keyExtractor={(item, index) => `key-${index}`}
                            renderItem   = {({item, index} ) => (
                                <ListCostumer
                                backgroundColor ={this.state.index === index ? Colors.tangerine : '#4778fb'}
                                costumerTrainClass = {this.state.current_train_class_all[index]+'-'+item}
                                costumerName={this.state.costumerName[index]}
                            />
                            )}/>

                    <View style={s.footerDescription}>
                    <View style={s.row}>
                        <View style={[s.dot_status, { backgroundColor: Colors.tangerine }]} />
                        <Text style={s.textDescription}>Aktif</Text>
                    </View>
                    <View style={s.row}>
                        <View style={[s.dot_status, { backgroundColor: '#4778fb'}]} />
                        <Text style={s.textDescription}>Dipilih</Text>
                    </View>
                    <View style={[s.row, { marginRight: Metrics.padding.normal }]}>
                        <View style={[s.dot_status, s.avalaibleseat]} />
                        <Text style={[s.textDescription]}>Tersedia</Text>
                    </View>
                    <View style={s.row}>
                        <View style={[s.dot_status, { backgroundColor: '#c7cfdb' }]} />
                        <Text style={s.textDescription}>Terisi</Text>
                    </View>
                </View>

                <View style ={{height : Metrics.padding.large, backgroundColor : Colors.whitesmoke, justifyContent : 'center', alignItems : 'center'}}>
                <Text style ={{color : Colors.gray}}>{this.state.current_train_class +' '+ (this.state.index_Seat+1)}</Text>
                
                </View>
                </View>

                <View style={{ flex: 1, flexDirection: 'row' }}>
                    {this.state.total_index_seat !== 1 && <Touchable onPress={() => this.buttonNextandPrev()}>
                        <View state={{ flex: 1, }}>
                            <Image
                                source={getIcon('ic_arrow_left')}
                                resizeMode='contain'
                                style={{ flex: 1, paddingRight: Scale(8), paddingLeft: Scale(8), width: Scale(30), justifyContent: 'center', alignItems: 'center' }}
                            />

                        </View>
                    </Touchable>}

                    <ScrollView
                        horizontal
                        style={{ flex: 1 }}>
                        <View>
                            <View style={s.centerContent}>
                                <View style={s.numberContainer}>
                                    {/* <ScrollView 
                            horizontal
                            style ={{flex : 1}}> */}
                                    <View style={{ flexDirection: 'row' }}>
                                        {numberA.map((i) =>
                                            <View key={i} style={s.rowA}>
                                                <Text style={{ fontSize: Metrics.font.medium, color: Colors.black }}>{i}</Text>
                                            </View>
                                        )}
                                    </View>
                                    <View style={{ flexDirection: 'row', marginLeft: Metrics.padding.large * 1.5 }}>
                                        {numberB.map((i) =>
                                            <View key={i} style={s.rowA}>
                                                <Text style={{ fontSize: Metrics.font.medium, color: Colors.black }}>{i}</Text>
                                            </View>
                                        )}
                                    </View>
                                    {/* </ScrollView> */}

                                </View>
                                <ScrollView
                                vertical
                                style ={{flex : 1}}>
                                    {/* <GestureRecognizer
                                    onSwipe={(direction, state) => this.onSwipe(direction, state)}
                                        // onSwipeLeft={(state) => this.onSwipeLeft(state)}
                                        // onSwipeRight={(state) => this.onSwipeRight(state)}
                                        config={config}
                                        style={{
                                            flex: 1,
                                        }}
                                    > */}
                                    <View>
                                <FlatList
                                scrollEnabled ={ false}
                                    data={Object.keys(this.state.seats)}
                                    keyExtractor={(item, index) => String(index)}
                                    renderItem={({ item, index }) => {

                                        let { seats } = this.state
                                        console.log("seatssss : "+ JSON.stringify(seats))
                                        // console.log("SEATS COUNTER "+this.state.Counter)
                                        return (
                                            <FlatList
                                            scrollEnabled ={ false}
                                                horizontal
                                                data={Object.keys(seats[item])}
                                                keyExtractor={(item_, index_) => String(index_)}
                                                renderItem={item_ => {
                                                    index_ = item_.index
                                                    item_ = item_.item
                                                    return (
                                                        <FlatList
                                                        scrollEnabled ={ false}
                                                            data={Object.keys(seats[item][item_])}
                                                            keyExtractor={(item_, index_) => String(index_)}
                                                            renderItem={item_x => {
                                                                index_x = item_x.index
                                                                seat_ = seats[item][item_][item_x.item]
                                                                return (
                                                                    <Touchable onPress={() => this.clickSeat(seats, item, item_, item_x)}>
                                                                        <View style={s.containerChair}>
                                                                            <View style={[s.viewChair, { backgroundColor: this.checkSeat(seat_) }, { borderColor: this.checkSeat(seat_, 'border') }]}>
                                                                                <Text style={{ color: seat_.col !== 'X' ? 'white' : 'black' }}>{seat_.val}</Text>
                                                                                {/* <Text style={{color: Colors.blue}}>{(this.state.select_seat === seats[item][item_][item_x.item].val)}</Text> */}
                                                                            </View>
                                                                        </View>


                                                                    </Touchable>

                                                                )
                                                            }}
                                                        />
                                                    )
                                                }}
                                            />
                                        )
                                    }}
                                />
                                </View>
                                {/* </GestureRecognizer> */}
                                </ScrollView>

                            </View>

                        </View>
                    </ScrollView>

                    {this.state.total_index_seat !== 1 && <Touchable onPress={() => this.buttonNextandPrev('next')}>
                        <View state={{ flex: 1 }}>
                            <Image
                                source={getIcon('ic_arrow_right')}
                                resizeMode='contain'
                                style={{ flex: 1, paddingRight: Scale(8), paddingLeft: Scale(8), width: Scale(30), justifyContent: 'center', alignItems: 'center' }}
                            />

                        </View>
                    </Touchable>}

                </View>

                
                <Button onPress={() => this.Confirmation()}>
                        {this.state.button_seat === 2 ? 'Choose Seat Departure':'Done'}
                    </Button>
                <Loading
                    text={this.state.load_title}
                    visible={this.state.loading} />
            </View>
        )
    }
}


const ListCostumer = props => (
    <View>
    {props.costumerName && 
       
            <View
            style ={{
                backgroundColor: props.backgroundColor ? props.backgroundColor:'#4778fb',
                fontSize: Metrics.font.regular,
                borderRadius: 5,
                justifyContent : 'center',
                alignItems : 'center',
                padding : Metrics.padding.tiny,
                marginRight : Metrics.padding.small,
                width : Metrics.screenWidth/4.6

            }}>
                <Text style={[s.nameClient,{fontWeight: 'bold'}]} ellipsize = {'tail'}>{props.costumerTrainClass}</Text>
                <Text style={s.nameClient} ellipsize = {'tail'}>{props.costumerName}</Text>
            </View>
        

         
    }
    </View>

)

class ChairBox extends Component {


    render() {
        let { props } = this
        return (
            <Touchable onPress={() => props.onClick(props.value)}>
                <View style={s.checkbox}>
                    {(this.props.value === props.selected) && <Text>{props.className}</Text>}
                </View>
            </Touchable>
        )
    }
}

const s = StyleSheet.create({
    rowA: {
        flexDirection: 'row',
        paddingHorizontal: Metrics.padding.medium,
    },
    numberContainer: {

        flexDirection: 'row',

        marginVertical: Metrics.padding.tiny,
    },
    avalaibleseat: {
        borderWidth: 2,
        borderColor: '#44CF6C',//GREEN tersedia
    },
    textDescription: {
        fontSize: Metrics.font.regular,
        paddingVertical: Metrics.padding.tiny
    },
    dot_status: {
        height: Metrics.icon.tiny,
        width: Metrics.icon.tiny,
        borderRadius: Metrics.icon.tiny / 2,
        marginHorizontal: Metrics.padding.tiny,
        marginRight: Metrics.padding.small,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerDescription: {
        flexDirection: 'row',
        // position: 'absolute',
        // bottom: 0,
        paddingHorizontal: Metrics.padding.normal,
        paddingVertical: Metrics.padding.small,
        backgroundColor: Colors.white,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerChair: {
        flex: 1,
        alignSelf: 'center',

    },
    viewChair: {
        height: Metrics.icon.medium,
        width: Metrics.icon.medium,
        borderWidth: 2,
        borderRadius: 6,
        borderColor: '#44CF6C',//GREEN
        margin: Metrics.padding.small,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameClient: {
        // padding: Metrics.padding.tiny,
        color: Colors.white,
        width : Scale(52), 
        
        // backgroundColor: Colors.tangerine,
        fontSize: Scale(8),
        // borderRadius: 3.
    },
    viewClient: {
        justifyContent: 'center',
        // paddingHorizontal: Metrics.padding.small,
        paddingVertical: Metrics.padding.small,
        height: Metrics.icon.normal * 4,
        width : Metrics.screenWidth,
        borderBottomColor: Colors.border

    },
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    toolbar_title: {
        fontSize: Scale(16),
        color: Colors.white,
        flex: 1,
    },
    toolbar_subtitle: {
        ...Fonts.bold,
        fontSize: Scale(14),
        color: Colors.white,
    },

    title_section: {
        ...Fonts.bold,
        fontSize: Fonts.size.medium,
        paddingHorizontal: Scale(16),
        paddingVertical: Scale(8),
    },
    checkbox: {
        backgroundColor: Colors.white,
        borderColor: Colors.tangerine,
        borderWidth: Scale(2.5),
        width: Metrics.icon.large,
        height: Metrics.icon.large,
        borderRadius: Scale(4),
        padding: Scale(2),
        justifyContent: 'center',
        alignItems: 'center',
    },

    check: {
        backgroundColor: Colors.white,
        borderColor: Colors.transparent,
        borderBottomWidth: Scale(2),
        borderRightWidth: Scale(2),
        width: Scale(10),
        height: Scale(20),
        transform: [{ rotate: '45deg' }]
    },

    checkbox_active: {
        backgroundColor: Colors.pizzaz,
        flex: 1,
        borderRadius: Scale(2)
    },
    item_frame: {
        backgroundColor: Colors.white,
        paddingHorizontal: Scale(16),
        paddingVertical: Scale(11),
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    item_title: {
        fontSize: Fonts.size.regular,
        flex: 1,
    },
    item_subtitle: {
        flex: 4,
        fontSize: Fonts.size.regular,
        color: Colors.warm_grey
    },

    btn_reset: {
        borderWidth: 1,
        borderColor: Colors.pizzaz,
        borderRadius: Scale(3),
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Scale(8),
        paddingVertical: Scale(4),
    },
    btn_reset_txt: {
        color: Colors.pizzaz,
    },

    btn_apply: {
        backgroundColor: Colors.pizzaz,
        paddingHorizontal: Scale(8),
        paddingVertical: Scale(16),
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn_apply_txt: {
        fontSize: Fonts.size.medium,
        color: Colors.white
    }
})

AppRegistry.registerComponent("padiciti", () => TrainSortFilter);
