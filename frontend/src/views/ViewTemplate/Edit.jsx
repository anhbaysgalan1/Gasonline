import React from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import {Form, TextField, Validation} from 'components/Forms'
import {BaseView} from 'views/BaseView';
import {I18n} from 'helpers/I18n';
import {Button, Grid} from '@material-ui/core';
import PaperFade from "components/Main/PaperFade"

const styles = theme => ({});

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
    const {classes, onSubmit, data} = this.props
    return (
      <PaperFade className={classes.paper}>
        <Form className={classes.form} onSubmit={onSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                label={I18n.t("Input.code")}
                name="code"
                validate={this.validate.code}
                value={data.code}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                label={I18n.t("Input.name")}
                name="name"
                validate={this.validate.name}
                value={data.name}
              />
            </Grid>
            <br/>
            "Mở file views/__COMPONENTNAME__/Create.jsx để chỉnh sửa view."
            <Grid item xs={12} lg={12}>
              <Button type="submit" variant="contained" color="primary">{I18n.t("Button.edit")}</Button>
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
