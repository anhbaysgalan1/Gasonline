import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import {DateTimeField, TextField} from 'components/Forms'
import {BaseView} from 'views/BaseView';
import {I18n} from 'helpers/I18n';
import {Grid, Typography} from '@material-ui/core';
import PaperFade from "components/Main/PaperFade"

const styles = theme => ({});

class OrderInfo extends BaseView {

  render() {
    const {classes, data} = this.props

    return (<PaperFade className={classes.paper}>
      <Typography variant="h6">{I18n.t("Label.orderInfo")}</Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} lg={12}>
          <DateTimeField
            fullWidth
            format="HH:mm DD/MM/YYYY"
            label={I18n.t("Label.date")}
            variant="outlined"
            name="date"
            value={this.getData(data, "insert.when")}
          />
        </Grid>

        <Grid item xs={12} lg={12}>
          <TextField
            name="note"
            fullWidth
            multiline
            rows={2}
            label={I18n.t("Input.note")}
            value={this.getData(data, "note", "")}
          />
        </Grid>
      </Grid>
    </PaperFade>)
  }
}

export default withStyles(styles)(OrderInfo);
