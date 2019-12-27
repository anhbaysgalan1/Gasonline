import React from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import {
  Form, Validation, DateRangeField
} from 'components/Forms'
import { BaseView } from 'views/BaseView';
import { I18n } from 'helpers/I18n';
import { Grid, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import PaperFade from "components/Main/PaperFade"
import utility from 'helpers/utility'
import moment from 'moment'
const styles = theme => ({
  footer: {
    background: "#f3f3f3"
  }
});

class Create extends BaseView {
  constructor(props) {
    super(props)
    this.validate = {
      code: [
        Validation.required(I18n.t("Validate.required.base"))
      ],
      name: [
        Validation.required(I18n.t("Validate.required.base"))
      ],
    }
  }

  renderStaffs() {
    const {classes, data } = this.props
    return data.map(staff => {
      let totalAmount = 0
      return <Grid key={staff._id} item xs={12} lg={12}>
        <Typography variant="h6">{staff.name}</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="30%">{I18n.t("Table.name")}</TableCell>
              <TableCell>{I18n.t("Table.header.staffValue")}</TableCell>
              <TableCell>{I18n.t("Table.header.quantity")}</TableCell>
              <TableCell>{I18n.t("Table.header.amount")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staff.products.map(product => {
              let unit = utility.getUnitForStaffValue(product.staffValueType)
              let amount = utility.getValueForStaff(product.price, product.staffValue, product.staffValueType) * product.quantity
              totalAmount += amount
              return <TableRow key={product._id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{`${product.staffValue}${unit}`}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>{amount}K</TableCell>
            </TableRow>
            })}
            <TableRow className={classes.footer}>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>{I18n.t("Table.header.totalAmount")}</TableCell>
              <TableCell>{totalAmount}K</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Grid>
    }
    )
  }

  render() {
    const { classes, onSubmit } = this.props
    return (
      <PaperFade className={classes.paper}>
        <Form className={classes.form} onSubmit={onSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12} lg={12}>
              <DateRangeField
                format="DD/MM/YYYY"
                inputProps={{
                  label: "Thời gian"
                }}
                value={{
                  startDate: moment().startOf('month').toDate(),
                  endDate: moment().endOf('month').toDate()
                }}
                name="date"
              />
            </Grid>
            <Grid item xs={12} lg={12}>
              <Button type="submit" variant="contained" color="secondary">{I18n.t("Button.view")}</Button>
            </Grid>
            {this.renderStaffs()}
          </Grid>
        </Form>
      </PaperFade>
    )
  }
}

Create.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Create);
