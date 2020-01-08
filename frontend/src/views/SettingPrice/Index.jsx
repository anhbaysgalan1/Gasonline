import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import {Button, CardContent, Chip, Grid, Typography, withWidth} from '@material-ui/core'
import {DateTimeField, Form, TextField, Validation, MoneyField } from 'components/Forms'
import PaperFade from "components/Main/PaperFade"
import {BaseView} from 'views/BaseView'
import InputAdornment from '@material-ui/core/InputAdornment'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faYenSign} from '@fortawesome/free-solid-svg-icons'
import LocalGasStationIcon from '@material-ui/icons/LocalGasStation'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'
import {monthFormatBackend, monthFormatDefault} from 'config/constant'
import {I18n} from 'helpers/I18n'
import moment from 'moment'

moment.defaultFormat = monthFormatBackend;

const styles = theme => ({
  cardBackground: {
    borderStyle: "ridge",
    height: '325px'
  },
  cardTitle: {
    marginBottom: '10px'
  },
  form: {
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px`,
  },
  icon: {
    color: theme.palette.grey.dark,
  },
  chipWraper: {
    alignSelf: "center"
  },
  chip: {
    // position: "absolute"
  },
  label: {
    padding: `${theme.spacing(2)}px ${theme.spacing(2)}px 0px ${theme.spacing(2)}px !important`
  },
  button: {
    marginLeft: '5px'
  }
})

class Index extends BaseView {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      reload: false,
      month: moment().format()
    }
    this.onChangeDate = this.onChangeDate.bind(this);
  }

  onClickEditBtn = () => {
    this.setState({isEditing: true, reload: !this.state.reload})
  }

  cancel = () => {
    this.goto('/setting-price')
  }

  onChangeDate(value) {
    this.props.onFetchData(moment(value, monthFormatDefault).format())
  }

  renderChip(label, icon) {
    const {classes} = this.props;
    return (
      <Grid item xs={12} lg={12}>
        <Chip
          variant="outlined"
          className={classes.chip}
          color="primary"
          icon={icon}
          label={label}
        />
      </Grid>
    )
  }

  renderAdornments(name){
    let { classes } = this.props
    switch (name){
      case "insurance":
        return "L"
      case "taxes.consumptionTax":
        return ""
      case "taxes.dieselTax":
        return ""
      default:
        return <FontAwesomeIcon icon={faYenSign} className={classes.icon}/>
    } 
  }

  renderInput(label, name) {
    const {classes, settingPrice} = this.props;
    let {isEditing} = this.state
    return (
      <Grid key={name} item xs={12} md={12} lg={12}>
        <MoneyField
          label={label}
          name={name}
          value={this.getData(settingPrice, name, 0)}
          validate={[Validation.required(I18n.t("Validate.required.base"))]}
          InputProps={{
            endAdornment:
              <InputAdornment position="end">
                {this.renderAdornments(name)}
              </InputAdornment>,
            readOnly: !isEditing
          }}
        />
      </Grid>
    )
  }

  renderSettingSKE() {
    return ['diesel', 'gasoline', 'kerosene'].map(fuel =>
      (
        <Grid item xs={12} lg={4} key={fuel} >
          {this.renderChip(I18n.t(`Label.products.${fuel}`), <LocalGasStationIcon fontSize="small"/>)}
          {this.renderInput(I18n.t("Label.dateRange.startMonth"), `prices.ske.startMonth.${fuel}`)}
          {this.renderInput(I18n.t("Label.dateRange.endMonth"), `prices.ske.endMonth.${fuel}`)}
        </Grid>
      )
    )
  }

  renderSettingDieselMC() {
    return ['A', 'B', 'C'].map(key =>
      this.renderInput(I18n.t(`Label.customer.MCFlags.${key}`), `prices.mcCenter.diesel.flag${key}`)
    )
  }

  render() {
    const {classes, onSubmit} = this.props;
    const {isEditing, month} = this.state
    return (
      <PaperFade>
        <Form onSubmit={onSubmit}>
          <Grid container spacing={2} direction="row" justify="flex-start" alignItems="stretch">
            <Grid item xs={12}>
              <DateTimeField
                label={I18n.t(`Label.date`)}
                name="month"
                format={monthFormatDefault}
                showTime={false}
                autoOk={true}
                views={["year", "month"]}
                value={month}
                onChange={this.onChangeDate}
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>

            <Grid item xs={12} lg={9}>
              {/* SKE */}
              <CardContent className={classes.cardBackground}>
                <Typography variant="h6" className={classes.cardTitle}>
                  {I18n.t("Label.customer.types.direct")}
                </Typography>

                <Grid container spacing={2} direction="row" justify="flex-start" alignItems="stretch">
                  {this.renderSettingSKE()}
                </Grid>
              </CardContent>
            </Grid>

            <Grid item xs={12} lg={3}>
              <CardContent className={classes.cardBackground}>
                <Typography variant="h6" className={classes.cardTitle}>
                  {I18n.t("Label.products.adBlue")}
                </Typography>

                {this.renderChip(I18n.t(`Label.products.adBlue`), <LocalGasStationIcon fontSize="small"/>)}
                {this.renderInput(I18n.t(`Label.products.adBlue`), "prices.adBlue")}
              </CardContent>
            </Grid>

            <Grid item xs={12} lg={9}>
              {/* MC Center */}
              <CardContent className={classes.cardBackground}>
                <Typography variant="h6" className={classes.cardTitle}>
                  {I18n.t("Label.customer.types.mediate")}
                </Typography>

                <Grid container spacing={2} direction="row" justify="flex-start" alignItems="flex-start">
                  <Grid item xs={12} lg={4}>
                    {/* Dầu Diesel */}
                    {this.renderChip(I18n.t(`Label.products.diesel`), <LocalGasStationIcon fontSize="small"/>)}
                    {this.renderSettingDieselMC()}
                  </Grid>

                  <Grid item xs={12} lg={4}>
                    {
                      this.renderChip(
                        `${I18n.t(`Label.products.gasoline`)} & ${I18n.t(`Label.products.kerosene`)}`,
                        <LocalGasStationIcon fontSize="small"/>
                      )
                    }
                    {/* Xăng */}
                    {this.renderInput(I18n.t(`Label.products.gasoline`), "prices.mcCenter.gasoline")}
                    {/* Dầu hỏa */}
                    {this.renderInput(I18n.t(`Label.products.kerosene`), "prices.mcCenter.kerosene")}
                  </Grid>

                  <Grid item xs={12} lg={4}>
                    {/* Bảo hiểm */}
                    {this.renderChip(I18n.t(`Label.insurance`), <AttachMoneyIcon fontSize="small"/>)}
                    {this.renderInput(I18n.t(`Label.insurance`), "insurance")}
                  </Grid>
                </Grid>
              </CardContent>
            </Grid>
            {/* Thuế */}
            <Grid item xs={12} lg={3}>
              <CardContent className={classes.cardBackground}>
                <Typography variant="h6" className={classes.cardTitle}>
                  {I18n.t("Label.tax")}
                </Typography>
                {this.renderChip(I18n.t("Label.tax"), <AttachMoneyIcon fontSize="small"/>)}
                {this.renderInput(I18n.t(`Label.taxes.consumptionTax`), "taxes.consumptionTax")}
                {this.renderInput(I18n.t(`Label.taxes.dieselTax`), "taxes.dieselTax")}
              </CardContent>
            </Grid>
          </Grid>

          <Grid container spacing={2} direction="row" justify="flex-end">
            <Grid item>
              {!isEditing ?
                <Button size='small' variant="contained" color="primary" onClick={this.onClickEditBtn}>
                  {I18n.t("Button.edit")}
                </Button>
                :
                [
                  <Button size='small' key="confirm" variant="contained" color="primary" type="submit">
                    {I18n.t("Button.confirm")}
                  </Button>,
                  <Button size='small' key="cancel" variant="outlined" color="primary"
                          onClick={this.cancel}
                          className={classes.button}
                  >
                    {I18n.t("Button.cancel")}
                  </Button>
                ]
              }
            </Grid>
          </Grid>
        </Form>
      </PaperFade>
    )
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withWidth()(withStyles(styles)(Index));
