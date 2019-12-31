import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import {DateTimeField, TextField, Validation} from 'components/Forms'
import SelectField from 'components/Forms/SelectField'
import AutoCompleteField, {Option as OptionAuto} from 'components/Forms/AutoCompleteField'
import PaperFade from "components/Main/PaperFade";
import {BaseView} from 'views/BaseView'
import AreaField from './AreaField'
import Map from './Map'
import ReactGoogleMap from '../ReactGoogleMap/ReactGoogleMap'
import IframeMap from '../ReactGoogleMap/IframeMap'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Utils from 'helpers/utility'
import {
  Grid,
  Button,
  Typography,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
} from '@material-ui/core'
import {I18n} from 'helpers/I18n'
import moment from 'moment'

const minDate = moment(new Date()).format("MM/DD/YYYY");
const styles = theme => ({
  rootRadio: {
    marginRight: `${theme.spacing(5)}px`,
  },
  mapWrapper: {
    position: "relative",
    height: "350px",
    width: "100%"
  },
  labelAddress: {
    marginLeft: '15px',
    marginBottom: '-15px',
    fontSize: '12px'
  }
});

class MainForm extends BaseView {
  constructor(props) {
    super(props);
    this.state = {
      autocomplete: [],
      deliveryAddress: '',
      reload: false,
    }
    this.validate = {
      date: [
        Validation.required(I18n.t("Validate.required.base")),
        Validation.checkDateTime(minDate, I18n.t("Validate.dateInvalid"), I18n.t("Validate.minDate"))
      ],
      required: [
        Validation.required(I18n.t("Validate.required.base"))
      ]
    };
  }

  renderCustomer = (customers) => {
    let result = [];
    for (let customer of customers) {
      result.push(
        <OptionAuto key={customer._id} value={customer._id}>
          {customer.code} {customer.name}
        </OptionAuto>
      )
    }
    return result
  }

  onChangeAddress = (value) => {
    this.setState({ deliveryAddress: value, reload: !this.state.reload})
  }

  getDeliveryAddress = (address) => {
    this.setState({ deliveryAddress: address, reload: !this.state.reload})
  }

  render() {
    const {classes, areas, customers, order} = this.props
    let { deliveryAddress } = this.state
    return (
      <PaperFade className={classes.paper}>
        <Typography variant="h6">{I18n.t("Label.order.deliveryInfo")}</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={12}>
            <AutoCompleteField
              fullWidth
              select
              label={I18n.t("Input.customer.name")}
              name="customer"
              value={this.getData(order, 'customer._id', null)}
              validate={this.validate.required}
            >
              {this.renderCustomer(customers)}
            </AutoCompleteField>
          </Grid>
          {/* <Grid item xs={12} lg={12}>
            <TextField
              type="hidden"
              label={I18n.t(`Input.order.deliveryAddress`)}
              fullWidth
              name="deliveryAddress"
              defaultValue={this.getData(order, "deliveryAddress", null) || deliveryAddress}
              onChange={(value) => this.onChangeAddress(value)}
              validate={this.validate.required}
            />
          </Grid> */}
          {/* <Grid item xs={12} lg={12}>
            <ExpansionPanel expanded={true} >
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>{I18n.t(`Input.order.deliveryAddress`)}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails> 
                  <ReactGoogleMap 
                    onChangeAddress={this.onChangeAddress}
                    deliveryAddress={deliveryAddress}
                    getDeliveryAddress={this.getDeliveryAddress}
                  />
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Grid> */}
          <TextField
            type="hidden"
            name="deliveryAddress"
            defaultValue={this.getData(order, "deliveryAddress", null) || deliveryAddress}
            onChange={(value) => this.onChangeAddress(value)}
          />
          {/* React Google Map -----------------------*/}
          {
            deliveryAddress 
            ? <Typography color='default' className={classes.labelAddress}>{I18n.t(`Input.order.deliveryAddress`)}</Typography> 
            : ''
          }
          <Grid item xs={12} lg={12}>
            <ReactGoogleMap 
              onChangeAddress={this.onChangeAddress}
              deliveryAddress={deliveryAddress}
              getDeliveryAddress={this.getDeliveryAddress}
            />
          </Grid>
          <Grid item xs={12} lg={12}>
            <AreaField
              areas={areas}
              order={{...order}}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <DateTimeField
              fullWidth
              label={I18n.t(`Input.order.deliveryDate`)}
              name="deliveryDate"
              format="DD/MM/YYYY"
              showTime={false}
              autoOk={true}
              value={this.getData(order, "deliveryDate", null)} //nếu null -> now date
              validate={this.validate.date}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <SelectField
              fullWidth
              type="text"
              label={I18n.t(`Input.order.deliveryTime`)}
              name="deliveryTime"
              value={this.getData(order, "deliveryTime", null)}
              validate={this.validate.required}
            >
              {Utils.renderDeliveryTimeOptions()}
            </SelectField>
          </Grid>

        </Grid>
      </PaperFade>
    )
  }
}

MainForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MainForm);
