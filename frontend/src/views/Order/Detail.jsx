import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import {Button, Chip, Grid, Icon, Typography} from "@material-ui/core";
import {Form, TextField} from "components/Forms";
import {BaseView} from "views/BaseView";
import FuelsForm from "./components/FuelsForm";
import PaperFade from "components/Main/PaperFade";
import {deliveryTime} from "config/constant";
import {I18n} from "helpers/I18n";
import moment from "moment";

const styles = theme => ({
  mapWrapper: {
    position: "relative",
    height: "350px",
    width: "100%"
  },
  chip: {
    margin: `${theme.spacing(3)}px ${theme.spacing(1)}px ${theme.spacing(
      1
    )}px ${theme.spacing(3)}px`
  },
  okBtn: {
    float: "right"
  },
  typography: {
    margin: `${theme.spacing(3)}px ${theme.spacing(0)}px ${theme.spacing(
      1
    )}px ${theme.spacing(3)}px`
  },
  button: {
    marginLeft: "5px"
  },
  sizeIcon: {
    fontSize: "15px"
  }
});

class Detail extends BaseView {
  constructor(props) {
    super(props);
  }

  mapDeliveryTimeValue(order) {
    let value = this.getData(order, "deliveryTime", null);
    for (let i = 0; i < deliveryTime.length; i++) {
      let element = deliveryTime[i];
      if (Number(element.value) === Number(value)) {
        return element.label;
      }
    }
  }

  renderChip(order) {
    const {classes} = this.props;
    let driverName = this.getData(order, "driver.fullName", "");

    switch (order.status) {
      case 1:
        return (
          <Chip
            label={I18n.t("Label.statusOrder.waiting")}
            className={classes.chip}
          />
        );

      case 2:
        return (
          <Grid className={classes.chip}>
            <Chip variant="outlined" color="secondary" label={driverName}/>
            <Typography variant="caption" style={{marginLeft: "8px"}}>
              {I18n.t("Label.statusOrder.divided")}
            </Typography>
          </Grid>
        );

      case 3:
        return (
          <Grid className={classes.chip}>
            <Chip variant="outlined" color="primary" label={driverName}/>
            <Typography variant="caption" style={{marginLeft: "8px"}}>
              {I18n.t("Label.statusOrder.delivered")}
            </Typography>
          </Grid>
        );

      default:
        break;
    }
    return "";
  }

  componentWillUnmount() {
    localStorage.removeItem("backDivideOrder");
  }

  render() {
    const {classes, order} = this.props;
    let backDivideOrder = localStorage.getItem("backDivideOrder");
    console.log("backDivideOrder", backDivideOrder);
    return (
      <PaperFade>
        <Form className={classes.form}>
          <Grid container>
            <Grid item xs={12} lg={3}>
              <FuelsForm
                typeNum="quantity"
                title={I18n.t("Label.order.quantity")}
                order={{...order}}
                readOnly={true}
              />
              {this.renderChip(order)}
            </Grid>

            <Grid item xs={12} lg={9}>
              <PaperFade className={classes.paper}>
                <Typography variant="h6">
                  {I18n.t("Label.order.deliveryInfo")}
                </Typography>
                <Grid container spacing={4}>
                  <Grid item xs={12} lg={12}>
                    <TextField
                      fullWidth
                      label={I18n.t("Input.customer.name")}
                      name="order.customer"
                      value={
                        this.getData(order, "customer.code", null) +
                        " -- " +
                        this.getData(order, "customer.name", null)
                      }
                      InputProps={{
                        readOnly: true
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} lg={12}>
                    <TextField
                      fullWidth
                      label={I18n.t(`Input.order.deliveryAddress`)}
                      name="order.deliveryAddress"
                      value={this.getData(order, "deliveryAddress", null)}
                      InputProps={{
                        readOnly: true
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} lg={12}>
                    <div className={classes.mapWrapper}>{/* <Map/> */}</div>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={I18n.t("Input.area.code")}
                      name="order.area"
                      value={
                        this.getData(order, "area.code", null) +
                        " -- " +
                        this.getData(order, "area.name", null)
                      }
                      InputProps={{
                        readOnly: true
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={I18n.t(`Input.order.orderDate`)}
                      name="order.orderDate"
                      value={moment(
                        this.getData(order, "orderDate", moment())
                      ).format("DD/MM/YYYY")}
                      InputProps={{
                        readOnly: true
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={I18n.t(`Input.order.deliveryDate`)}
                      name="order.deliveryDate"
                      value={moment(
                        this.getData(order, "deliveryDate", null)
                      ).format("DD/MM/YYYY")}
                      InputProps={{
                        readOnly: true
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="text"
                      label={I18n.t(`Input.order.deliveryTime`)}
                      name="order.deliveryTime"
                      value={this.mapDeliveryTimeValue(order)}
                      InputProps={{
                        readOnly: true
                      }}
                    />
                  </Grid>
                </Grid>
              </PaperFade>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={12} container justify={"flex-end"}>
            <Grid item>
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => this.goto(`${backDivideOrder ? "/divide-order" : "/orders"}`)}
              >
                <Icon className={classes.sizeIcon}>arrow_back_ios</Icon>
                {I18n.t("Button.back")}
              </Button>
            </Grid>
          </Grid>
        </Form>
      </PaperFade>
    );
  }
}

Detail.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Detail);
