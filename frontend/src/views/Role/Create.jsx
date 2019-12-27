import React from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Form, TextField, Validation } from 'components/Forms'
import { BaseView } from 'views/BaseView';
import { I18n } from 'helpers/I18n';
import { Grid, Button } from '@material-ui/core';
import PaperFade from "components/Main/PaperFade"
import AutoCompleteField, { Option as OptionAuto } from 'components/Forms/AutoCompleteField'
const styles = theme => ({

});

const required = function (value) {
  if (!value || value.length === 0) {
    return I18n.t("Validate.required.base")
  }
}

class Create extends BaseView {
  constructor(props) {
    super(props)
    this.validate = {
      name: [
        Validation.required(I18n.t("Validate.required.base"))
      ],
      permission: [
        Validation.required(I18n.t("Validate.required.base"))
      ],
    }
  }

  render() {
    const { classes, onSubmit, permission} = this.props
    return (
      <PaperFade className={classes.paper}>
        <Form className={classes.form} onSubmit={onSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12} lg={12}>
              <TextField
                fullWidth
                label={I18n.t("Input.role.name")}
                name="name"
                validate={this.validate.name}
              />
            </Grid>
            <Grid item xs={12} lg={12}>
              <AutoCompleteField
                key="1"
                fullWidth
                select
                label={I18n.t("Input.role.permission")}
                name="permissionIds"
                onChange={(value) => { }}
                value={""}
                validate={[required]}
                isMulti={true}
              >
                {permission.map(option => (
                  <OptionAuto key={option._id} value={option._id} showCheckbox={true}>
                    {option.name}
                  </OptionAuto>
                ))}
              </AutoCompleteField>
            </Grid>
            <br />
            <Grid item xs={12} lg={12}>
              <Button type="submit" variant="contained" color="primary">{I18n.t("Button.create")}</Button>
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
