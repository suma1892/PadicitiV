import {
    getIcon,
    Colors,
    Metrics,
    Fonts,
    Style,
    Scale,
    getAirlineLogo 
    // getImages
} from '../Assets'
import Toolbar          from './ToolbarComponent'
import RadioButtons     from './RadioButtons'
import FrameRadiusComponent from './FrameRadiusComponent'
import CalendarsScreen         from './CalendarsScreen'
import ItemListSchedulrFlight from './ItemListSchedulrFlight'
import TextView               from './TextView'
import IJDKReservation from '../Containers/IJDK/IJDKReservation'
import CardComponentReview    from './CardComponentReview'
import CheckBox               from './CheckBox'
import CardDetil   from './CardDetil'
import LoadingFull from './LoadingFull'
import Loading from './Loading'
import DialogComponent from './DialogComponent'
import _OS from './_OS'
import Alert from './Alert'
import Container from './Container'
import ToolbarV2 from './ToolbarV2'
import CardComponent, { CardRecentSearch , CardListHotel, NearPlace, CardReviewHotel, CardCreditCard, CardPessanger, CardMyTrip, CardPromos , CardComponentFilter, CardModalDate, CardCall} from './CardComponent'
import Touchable from './Touchable'
import { ItemField } from './ItemComponent/ItemListComponent'
import CalculateComponent from './ItemComponent/CalculateComponent'
import Button from './ItemComponent/Button'
import CheckListButton from './ItemComponent/CheckListButton'
import TextField from './ItemComponent/Textfield'
import Modal from './ModalComponent'
import {CountDown} from './CountDown'
// TRAIN
import { TrainButton }              from './TrainButtonComponent'
import { CardSortTrain, CardTrain , CardSortPelni } from './TrainCardComponent'
import { CardSortBus, CardBus } from './Bus/BusCardComponent'
import { TrainCheckbox }            from './TrainCheckboxComponent'
import { TrainForm, TrainInput ,TrainDropdownInput,TrainOption }    from './TrainFormComponent'
import { TrainRadio }               from './TrainRadioComponent'
import { TrainStepper }             from './TrainStepperComponent'
 import { Icon }                     from './IconComponent'
 import  ModalDropdown  from './ModalDropdown';
import {CardSortTrain1, CardIJDK ,CardIJDKV2, CardSortPelni1, CardQR, CardSortV3} from './IJDKCardComponent';
import { IJDKForm, IJDKInput ,IJDKDropdownInput,IJDKOption }    from './IJDKFormComponent'

export {
    CardSortTrain1,
    CardSortPelni1,
    CardQR,
    CardIJDKV2,
    getIcon,
    CardSortV3,
    Colors,
    IJDKForm,
    IJDKDropdownInput,
    IJDKOption,
    Metrics,
    Fonts,
    Style,
    Scale,
    getAirlineLogo,
    Toolbar,
    CardComponent,
    RadioButtons,
    FrameRadiusComponent,
    CalendarsScreen,
    ItemListSchedulrFlight,
    TextView, 
    CardComponentReview,
    CheckBox,
    CardDetil,
    CountDown,
    LoadingFull,
    Loading,
    DialogComponent,
    _OS,
    Alert,   
    Container,
    ToolbarV2,
    CardRecentSearch,
    Touchable,
    ItemField,
    CalculateComponent,
    Button,
    CardListHotel,
    CheckListButton,
    NearPlace,
    CardReviewHotel,
    CardCreditCard,
    CardPessanger,
    TextField,
    TrainButton,
    CardSortTrain, 
    CardTrain,
    TrainCheckbox,
    TrainForm,
    TrainInput,
    TrainOption,
    TrainRadio,
    TrainStepper,
    CardIJDK,
    IJDKInput,
    CardMyTrip,
    CardPromos,
    Icon,
    CardSortBus, 
    CardBus,
    CardCall,
    Modal,
    CardComponentFilter,
    CardModalDate,
    CardSortPelni,
    ModalDropdown,
    IJDKReservation,
    TrainDropdownInput
}
