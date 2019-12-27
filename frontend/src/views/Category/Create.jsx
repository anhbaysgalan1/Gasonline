import React from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Form, TextField, Validation } from 'components/Forms'
import SelectField, {Option} from 'components/Forms/SelectField'
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
    const { classes, onSubmit } = this.props
    return (
      <PaperFade>
        <Form className={classes.form} onSubmit={onSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                label={I18n.t("Input.name")}
                name="name"
                validate={this.validate.name}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <SelectField
                fullWidth
                label={I18n.t("Input.discountType")}
                name="discountType"
                validate={this.validate.name}
              >
                <Option value="1">Chiết khấu theo đơn</Option>
                <Option value="2">Chiết khấu số lượng</Option>
              </SelectField>
            </Grid>
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
