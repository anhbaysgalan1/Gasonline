import React, {Component} from 'react';
import {I18n} from 'helpers/I18n'
import PropTypes from 'prop-types';
import {Avatar, Button, Paper, Typography, Icon} from '@material-ui/core/';
import withStyles from '@material-ui/core/styles/withStyles';
import {Form, TextField, CheckboxField} from 'components/Forms/';
import {required} from 'components/Forms/Validation'

const styles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    marginTop: theme.spacing(3),
  },
});

class Login extends Component {
  constructor(props) {
    super(props)
    this.validate = {
      username: [
        required(I18n.t("Validate.required.auth.username"))
      ],
      password: [
        required(I18n.t("Validate.required.auth.password"))
      ]
    }
  }

  render() {
    let {classes} = this.props
    document.title = I18n.t("app_name")

    return (
      < Paper className={classes.paper}>
        <Avatar className={classes.avatar}><
          Icon>lockOutlined</Icon>
        </Avatar>

        <Typography component="h1" variant="h5">{I18n.t("Button.login")}</Typography>

        <Form className={classes.form} onSubmit={(values) => {
          this.props.onSubmit(values)
        }}>

          <TextField
            fullWidth
            label={I18n.t("Input.auth.username")}
            name="username"
            validate={this.validate.username}
          />

          <TextField
            fullWidth
            //forwardRef={ref => this.refPassword = ref}
            label={I18n.t("Input.auth.password")}
            name="password"
            type="password"
            error={this.props.error.password.value}
            errorModified={this.props.error.password.modifiedAt}
            validate={this.validate.password}
          />

          <CheckboxField label={I18n.t("Button.remember")} name="remember" checked={true}/>

          <Button type="submit" fullWidth variant="contained" color="primary">
            {I18n.t("Button.login")}
          </Button>

        </Form>
      </Paper>)
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default withStyles(styles)(Login);
