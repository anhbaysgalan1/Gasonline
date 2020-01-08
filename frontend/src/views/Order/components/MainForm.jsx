import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { DateTimeField, TextField, Validation } from "components/Forms";
import SelectField from "components/Forms/SelectField";
import AutoCompleteField, {
  Option as OptionAuto
} from "components/Forms/AutoCompleteField";
import PaperFade from "components/Main/PaperFade";
import { BaseView } from "views/BaseView";
import AreaField from "./AreaField";
import ReactGoogleMap from "../ReactGoogleMap/ReactGoogleMap";
import Utils from "helpers/utility";
import { Grid, Typography } from "@material-ui/core";
import { formatDateField } from "config/constant";
import { I18n } from "helpers/I18n";
import moment from "moment";

moment.defaultFormat = formatDateField;

const minDate = moment(new Date()).format();
const styles = theme => ({
  rootRadio: {
    marginRight: `${theme.spacing(5)}px`
  },
  mapWrapper: {
    position: "relative",
    height: "350px",
    width: "100%"
  },
  labelAddress: {
    marginLeft: "15px",
    marginBottom: "-15px",
    fontSize: "12px"
  }
});

class MainForm extends BaseView {
  constructor(props) {
    super(props);
    this.state = {
      areaId: "",
      autocomplete: [],
      deliveryAddress: "",
      reload: false,
      lat: "",
      lng: ""
    };
    this.validate = {
      date: [
        Validation.required(I18n.t("Validate.required.base")),
        Validation.checkDateTime(
          minDate,
          I18n.t("Validate.dateInvalid"),
          I18n.t("Validate.minDate")
        )
      ],
      required: [Validation.required(I18n.t("Validate.required.base"))]
    };
  }

  renderCustomer = customers => {
    let result = [];
    for (let customer of customers) {
      result.push(
        <OptionAuto key={customer._id} value={customer._id}>
          {customer.code} {customer.name}
        </OptionAuto>
      );
    }
    return result;
  }

  onChangeAddress = value => {
    this.setState({ 
      deliveryAddress: value, 
      reload: !this.state.reload 
    })
  }

  onChangeArea = (data) => {
    this.setState({ areaId : data.value })
  }

  getDeliveryAddress = value => {
    let deliveryAddress = this.getData(value, "deliveryAddress", "");
    let lat = this.getData(value, "lat", "");
    let lng = this.getData(value, "lng", "");
    this.setState({
      deliveryAddress: deliveryAddress,
      lat: lat,
      lng: lng,
      reload: !this.state.reload
    })
  }

  render() {
    const { classes, areas = [], customers, order, checkExist, getMouseInOutAddress } = this.props;
    let { deliveryAddress, lat, lng } = this.state
    let areaId = this.getData(order, 'area._id')
    let latitude  = lat || this.getData(order, "mapAddress.latitude", null)
    let longitude = lat || this.getData(order, "mapAddress.longitude", null)
    return (
      <PaperFade className={classes.paper}>
        <Typography variant="h6">
          {I18n.t("Label.order.deliveryInfo")}
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={12}>
            <AutoCompleteField
              fullWidth
              select
              label={I18n.t("Input.customer.name")}
              name="customer"
              value={this.getData(order, "customer._id", null)}
              validate={this.validate.required}
            >
              {this.renderCustomer(customers)}
            </AutoCompleteField>
          </Grid>
          <TextField
            type="hidden"
            name="deliveryAddress"
            defaultValue={ deliveryAddress || this.getData(order, "deliveryAddress", null)}
            onChange={value => this.onChangeAddress(value)}
          />
          <TextField
            type="hidden"
            name="lat"
            defaultValue={ lat || this.getData(order, "mapAddress.latitude", null) }
            value={lat}
          />
          <TextField
            type="hidden"
            name="lng"
            defaultValue={ lng || this.getData(order, "mapAddress.longitude", null) }
            value={lng}
          />
          {
            (!checkExist  && !lat && !lng) 
            ? <Grid item xs={12}><Typography style={{ color: 'red' }}>{I18n.t('Label.noAddress')}</Typography></Grid> 
            : ""
          }
          
          {/* </Grid> */}
          <Grid item xs={12} lg={12}>
            <ReactGoogleMap
              order={order}
              onChangeAddress={this.onChangeAddress}
              deliveryAddress={deliveryAddress}
              getDeliveryAddress={this.getDeliveryAddress}
              getMouseInOutAddress={getMouseInOutAddress}
            />
          </Grid>
          {/* <AreaField areas={areas} order={{...order}} /> */}
          <Grid item xs={12} lg={6}>
            <AutoCompleteField
              fullWidth
              select
              label={I18n.t("Input.area.code")}
              name="area"
              onChange={this.onChangeArea}
              validate={this.validate.required}
              value={this.state.areaId || areaId}
            >
              {areas.map(item => (
                <OptionAuto key={item._id} value={item._id} showCheckbox={false}>
                  {item.code}
                </OptionAuto>
              ))}
            </AutoCompleteField>
          </Grid>
          <Grid item xs={12} lg={6}>
              <AutoCompleteField
                fullWidth
                select
                label={I18n.t("Input.area.name")}
                name="area"
                onChange={this.onChangeArea}
                validate={this.validate.required}
                value={this.state.areaId || areaId}
              >
                {areas.map(item => (
                  <OptionAuto key={item._id} value={item._id} showCheckbox={false}>
                    {item.name}
                  </OptionAuto>
                ))}
              </AutoCompleteField>
            </Grid>
          <Grid item xs={12} md={6}>
            <DateTimeField
              fullWidth
              label={I18n.t(`Input.order.deliveryDate`)}
              name="deliveryDate"
              format={formatDateField}
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
    );
  }
}

MainForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MainForm);
