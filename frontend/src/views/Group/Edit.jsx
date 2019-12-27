import React from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Form, TextField, Validation } from 'components/Forms'
import { BaseView } from 'views/BaseView';
import { I18n } from 'helpers/I18n';
import { Grid, Button } from '@material-ui/core';
import PaperFade from "components/Main/PaperFade"
const styles = theme => ({

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

  render() {
    const { classes, onSubmit, data } = this.props
    return (
      <PaperFade className={classes.paper}>
        <Form className={classes.form} onSubmit={onSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                label={I18n.t("Input.groupCode")}
                name="code"
                validate={this.validate.code}
                value={data.code}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                label={I18n.t("Input.groupName")}
                name="name"
                validate={this.validate.name}
                value={data.name}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                label="Cấp"
                name="level"
                value={data.level}
              />
            </Grid>
            <Grid item xs={12} lg={12}>
              <Button type="submit" variant="contained" color="primary">{I18n.t("Button.editGroup")}</Button>
            </Grid>
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
