import React from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Form, TextField, DateTimeField, Validation, AutoCompleteField } from 'components/Forms'
import SelectField, { Option } from 'components/Forms/SelectField'
import { BaseView } from 'views/BaseView';
import { I18n } from 'helpers/I18n';
import { Grid, Button } from '@material-ui/core';
import PaperFade from "components/Main/PaperFade"
import { city } from 'config/constant'

const styles = theme => ({
});

class Create extends BaseView {
  state = {
    reload: 0
  }
  parent = {}
  getOptionLabel = (option) => {
    if(option && option.name)
      return `${option.code} - ${option.name} (${option.Group.name})`
    return undefined
  }

  getOptionValue = (option) => {
    if (!option) return undefined
    return option._id
  }
  changeParent = (option) => {
    this.parent = option
    this.setState({
      reload: !this.state.reload
    })
  }

  getGroups = () => {
    let {groups} = this.props
    let parent = this.parent
    groups = groups.filter(group => group.level > this.getData(parent, "Group.level", 9999))
    return groups
  }
  render() {
    const { classes, onSubmit, loadParent } = this.props
    const groups = this.getGroups()
    return (
      <PaperFade>
        <Form className={classes.form} onSubmit={onSubmit}>
          <Grid container spacing={4}>
          <Grid item xs={12} lg={6}>
            <AutoCompleteField
              fullWidth
              label={I18n.t("Input.parent")}
              name="parentId"
              async={true}
              getOptionLabel={this.getOptionLabel}
              getOptionValue={this.getOptionValue}
              onChange={this.changeParent}
              loadOptions={loadParent}
              //isDisabled={readOnly}
            />
            </Grid>
            <Grid item xs={12} lg={6}>
              <SelectField
                fullWidth
                label="Cấp bậc"
                name="groupId"
                validate = {[Validation.required("Trường bắt buộc")]}
              >
              {groups.map(e => <Option key={e._id} value={e._id}>{e.name}</Option>)}
              </SelectField>
            </Grid>
            <Grid item xs={12} lg={3}>
              <TextField
                fullWidth
                label="Tên đại lý"
                name="name"
                validate = {[Validation.required("Trường bắt buộc")]}
              />
            </Grid>
            <Grid item xs={12} lg={3}>
              <TextField
                fullWidth
                label={I18n.t("Input.phone")}
                name="phone"
                validate = {[Validation.required("Trường bắt buộc")]}
              />
            </Grid>
            <Grid item xs={12} lg={3}>
              <DateTimeField
                fullWidth
                label={I18n.t("Input.birthday")}
                name="birthday"
                format="DD/MM/YYYY"
                showTime={false}
                autoOk={true}
              />
            </Grid>
            <Grid item xs={12} lg={3}>
              <SelectField
                fullWidth
                label="Địa phương"
                name="city"
                validate = {[Validation.required("Trường bắt buộc")]}
              >
                {city.map(e => <Option key={e.code} value={e.code}>{e.name}</Option>)}
              </SelectField>
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                name="note"
                fullWidth
                multiline
                label={I18n.t("Input.note")}
              />
            </Grid>
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