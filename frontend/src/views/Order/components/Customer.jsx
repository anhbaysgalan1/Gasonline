import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import {AutoCompleteField, Validation} from 'components/Forms'
import {BaseView} from 'views/BaseView';
import {I18n} from 'helpers/I18n';
import {Grid, Typography} from '@material-ui/core';
import PaperFade from "components/Main/PaperFade"

const styles = theme => ({});

class Customer extends BaseView {
  state = {
    customer: {
      phone: "",
      birthday: "",
      name: "",
      salutation: 0
    }
  }

  getOptionLabel = (option) => {
    if (option.__isNew__) return I18n.t('Label.createCustomerByPhone', {phone: option.value})
    if (option.phone) return `${option.phone} (${option.name})`
    return null
  }

  getOptionValue = (option) => {
    if (!option) return undefined
    if (!option.phone) return option.value
    return option.phone
  }

  changeCustomer = (option) => {
    if (!option) option = {}

    if (!option.phone) {
      option = {
        phone: option.value,
        name: "",
        birthday: "",
      }
    }
    this.setState({
      customer: {
        ...this.state.customer,
        ...option
      }
    })
  }

  render() {
    const {classes, loadCustomer, data, readOnly} = this.props
    return (<PaperFade className={classes.paper}>
      <Typography variant="h6">Đại Lý</Typography>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <AutoCompleteField
            fullWidth
            label={I18n.t("Input.name")}
            name="customer[phone]"
            async={true}
            creatable={true}
            getOptionLabel={this.getOptionLabel}
            getOptionValue={this.getOptionValue}
            onChange={this.changeCustomer}
            loadOptions={loadCustomer}
            validate={[Validation.required(I18n.t('Validate.required.base'))]}
            value={data && data.phone ? data : null}
            isDisabled={readOnly}
          />
        </Grid>
      </Grid>
    </PaperFade>)
  }
}

export default withStyles(styles)(Customer);
