import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import {BaseView} from 'views/BaseView';
import {I18n} from 'helpers/I18n';
import {Button, Grid} from '@material-ui/core';
import {TextField} from 'components/Forms'

const styles = theme => ({
  btnFooter: {
    marginTop: "25px",
    marginLeft: "5px"
  }
});

class OrderSummary extends BaseView {
  constructor(props) {
    super(props)
    this.state = {
      total: 0,
      discount: 0
    }
    this.rows = []
  }

  componentDidMount() {
    this.props.setRef(this)
  }

  onRowChange(rowIndex, data) {
    this.rows[rowIndex] = data
    this.setState({
      total: this.rows.reduce((sum, row) => sum + row.total, 0) || 0,
      discount: this.rows.reduce((sum, row) => sum + Number(row.discount), 0) || 0,
    })
  }

  render() {
    const {classes} = this.props

    return (<React.Fragment>
      <Grid item xs={3}>
        <TextField
          name=""
          variant="outlined"
          label={I18n.t("Label.totalAmount")}
          value={this.state.total}
          InputProps={{
            readOnly: true,
          }}
        />
      </Grid>

      <Grid item xs={3}>
        <TextField
          name=""
          variant="outlined"
          label={I18n.t("Label.discount")}
          value={this.state.discount}
          InputProps={{
            readOnly: true,
          }}
        />
      </Grid>

      <Grid item xs={3}>
        <TextField
          name=""
          variant="outlined"
          label={I18n.t("Label.amount")}
          value={this.state.total - this.state.discount}
          InputProps={{
            readOnly: true,
          }}
        />
      </Grid>

      <Grid item xs={3}>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          className={classes.btnFooter}
        >
          {I18n.t('Button.save')}
        </Button>

        <Button
          variant="contained"
          color="secondary"
          type="button"
          className={classes.btnFooter}
        >
          {I18n.t('Button.print')}
        </Button>
      </Grid>
    </React.Fragment>)
  }
}

export default withStyles(styles)(OrderSummary);
