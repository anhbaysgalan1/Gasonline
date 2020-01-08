// import React from 'react'
// import PropTypes from 'prop-types';
// import withStyles from '@material-ui/core/styles/withStyles';
// import withWidth, {isWidthUp} from '@material-ui/core/withWidth';
// import {DateTimeField, Form, TextField, Validation} from 'components/Forms'
// import {BaseView} from 'views/BaseView';
// import {I18n} from 'helpers/I18n';
// import {Button, Chip, Grid, Typography} from '@material-ui/core';
// import PaperFade from "components/Main/PaperFade";
// import InputAdornment from '@material-ui/core/InputAdornment';
// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
// import {faYenSign} from '@fortawesome/free-solid-svg-icons';
// import DateRangeIcon from '@material-ui/icons/DateRange';
// import FaceIcon from '@material-ui/icons/Face';
// import LocalGasStationIcon from '@material-ui/icons/LocalGasStation';
// import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
// import moment from 'moment';

// const styles = theme => ({
//   icon: {
//     color: theme.palette.grey.dark,
//   },
//   chipWraper: {
//     alignSelf: "center"
//   },
//   chip: {
//     position: "absolute"
//   },
//   label: {
//     padding: `${theme.spacing(2)}px ${theme.spacing(2)}px 0px ${theme.spacing(2)}px !important`
//   },
// });

// class Index extends BaseView {
//   constructor(props) {
//     super(props);
//     this.onChangeDate = this.onChangeDate.bind(this);
//   }

//   onClickEditBtn = () => {
//     let {onChangeStatus, isEditing} = this.props
//     onChangeStatus(!isEditing)
//   }

//   cancel = () => {
//     this.goto('/setting-price')
//   }

//   onChangeDate(value) {
//     this.props.onFetchData(moment(value).format("YYYY-MM"))
//   }

//   renderChip(label, icon) {
//     const {classes} = this.props;
//     return (
//       <React.Fragment>
//         <Grid item xs={12} lg={2} className={classes.chipWraper}>
//           <Chip
//             variant="outlined"
//             className={classes.chip}
//             color="primary"
//             icon={icon}
//             label={label}
//           />
//         </Grid>
//       </React.Fragment>
//     )
//   }

//   renderFuel_(name, key, fullWidth) {
//     let fullScreen = !isWidthUp('sm', this.props.width);
//     const {classes, settingPrice, isEditing} = this.props;

//     return (
//       <Grid item xs={12} lg={fullWidth ? fullWidth : 3}>
//         <TextField
//           fullWidth={fullScreen}
//           label={I18n.t(`Label.products.${name}`)}
//           name={key}
//           value={this.getData(settingPrice, key, 0)}
//           validate={[Validation.required(I18n.t("Validate.required.base"))]}
//           InputProps={{
//             endAdornment:
//               <InputAdornment position="end">
//                 <FontAwesomeIcon icon={faYenSign} className={classes.icon}/>
//               </InputAdornment>,
//             readOnly: !isEditing
//           }}
//         />
//       </Grid>
//     )
//   }

//   render() {
//     const {classes, onSubmit, isEditing} = this.props;

//     return (
//       <PaperFade>
//         <Form className={classes.form} onSubmit={onSubmit}>
//           <Grid container spacing={4}>
//             <Grid item xs={12}>
//               <DateTimeField
//                 name="month"
//                 format="MM/YYYY"
//                 showTime={false}
//                 autoOk={true}
//                 views={["year", "month"]}
//                 onChange={this.onChangeDate}
//                 InputProps={{
//                   readOnly: true
//                 }}
//               />
//             </Grid>

//             <Grid item xs={12} className={classes.label}>
//               <Typography variant="h6">{I18n.t("Label.customer.types.direct")}</Typography>
//             </Grid>

//             {/* SKE - Đầu tháng */}
//             {this.renderChip(I18n.t("Label.dateRange.startMonth"), <DateRangeIcon fontSize="small"/>)}
//             {this.renderFuel_("diesel", "prices.ske.startMonth.diesel")}
//             {this.renderFuel_("gasoline", "prices.ske.startMonth.gasoline")}
//             {this.renderFuel_("kerosene", "prices.ske.startMonth.kerosene")}

//             {/* SKE - Cuối tháng */}
//             {this.renderChip(I18n.t("Label.dateRange.endMonth"), <DateRangeIcon fontSize="small"/>)}
//             {this.renderFuel_("diesel", "prices.ske.endMonth.diesel")}
//             {this.renderFuel_("gasoline", "prices.ske.endMonth.gasoline")}
//             {this.renderFuel_("kerosene", "prices.ske.endMonth.kerosene")}

//             <Grid item xs={12} className={classes.label}>
//               <Typography variant="h6">{I18n.t("Label.customer.types.mediate")}</Typography>
//             </Grid>

//             {/* Type A */}
//             {this.renderChip(I18n.t(`Label.customer.MCFlags.A`), <FaceIcon fontSize="small"/>)}
//             {this.renderFuel_("diesel", "prices.mcCenter.flagA.diesel")}
//             {this.renderFuel_("gasoline", "prices.mcCenter.flagA.gasoline")}
//             {this.renderFuel_("insurance", "insurance")}

//             {/* Type B */}
//             {this.renderChip(I18n.t(`Label.customer.MCFlags.B`), <FaceIcon fontSize="small"/>)}
//             {this.renderFuel_("diesel", "prices.mcCenter.flagB.diesel", 10)}

//             {/* Type C */}
//             {this.renderChip(I18n.t(`Label.customer.MCFlags.C`), <FaceIcon fontSize="small"/>)}
//             {this.renderFuel_("diesel", "prices.mcCenter.flagC.diesel")}
//             {this.renderFuel_("kerosene", "prices.mcCenter.flagC.kerosene", 7)}

//             <Grid item xs={12} className={classes.label}>
//               <Typography variant="h6">{I18n.t("Label.products.adBlue")}</Typography>
//             </Grid>

//             {/* Ad Blue */}
//             {this.renderChip(I18n.t(`Label.products.adBlue`), <LocalGasStationIcon fontSize="small"/>)}
//             {this.renderFuel_("adBlue", "prices.adBlue", 10)}

//             <Grid item xs={12} className={classes.label}>
//               <Typography variant="h6">{I18n.t("Label.tax")}</Typography>
//             </Grid>

//             {/* Thuế */}
//             {this.renderChip(I18n.t("Label.tax"), <AttachMoneyIcon fontSize="small"/>)}
//             {this.renderFuel_("consumptionTax", "taxes.consumptionTax")}
//             {this.renderFuel_("dieselTax", "taxes.dieselTax")}

//             <Grid item xs={12} container direction="row" justify="flex-start" spacing={2}>
//               {!isEditing ?
//                 <Grid item>
//                   <Button variant="contained" color="primary" onClick={this.onClickEditBtn}>
//                     {I18n.t("Button.edit")}
//                   </Button>
//                 </Grid>
//                 :
//                 [
//                   <Grid item key="confirm">
//                     <Button variant="contained" color="primary" type="submit">
//                       {I18n.t("Button.confirm")}
//                     </Button>
//                   </Grid>,
//                   <Grid item key="cancel">
//                     <Button variant="outlined" color="primary" onClick={this.cancel}>
//                       {I18n.t("Button.cancel")}
//                     </Button>
//                   </Grid>
//                 ]
//               }
//             </Grid>
//           </Grid>
//         </Form>
//       </PaperFade>
//     )
//   }
// }

// Index.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

// export default withWidth()(withStyles(styles)(Index));
