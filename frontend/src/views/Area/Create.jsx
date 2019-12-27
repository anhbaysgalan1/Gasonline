import React from 'react'
import PropTypes from 'prop-types';
import {Button, Grid, Icon} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import {Form, TextField, Validation} from 'components/Forms';
import PaperFade from "components/Main/PaperFade";
import {BaseView} from 'views/BaseView';
import {I18n} from 'helpers/I18n';
import {withRouter} from 'react-router-dom'

const styles = theme => ({
  button: {
    marginLeft: '5px'
  },
  sizeIcon: {
    fontSize: '15px'
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

  cancel = () => {
    this.goto('/areas')
  }

  render() {
    const {classes, onSubmit} = this.props
    return (
      <PaperFade>
        <Form className={classes.form} onSubmit={onSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                label={I18n.t("Input.area.code")}
                name="code"
                validate={this.validate.code}
              />
            </Grid>

            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                label={I18n.t("Input.area.name")}
                name="name"
                validate={this.validate.name}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} container direction="row" justify="flex-end" alignItems="flex-end" spacing={2}>
            <Grid item>
              <Button size='small' type="submit" variant="contained" color="primary" onClick={() =>  this.goto('/areas')} className={classes.button} >
                <Icon className={classes.sizeIcon}>arrow_back_ios</Icon>{I18n.t("Button.back")}
              </Button>
              <Button size='small' type="submit" variant="contained" color="primary" className={classes.button}>
                {I18n.t("Button.create")}
              </Button>
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

export default withStyles(styles)(withRouter(Create));
