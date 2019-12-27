import React from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Form, TextField, Validation } from 'components/Forms'
import SelectField, { Option } from 'components/Forms/SelectField'
import { BaseView } from 'views/BaseView';
import { I18n } from 'helpers/I18n';
import { Grid, Button, Typography } from '@material-ui/core';
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

  renderCategories() {
    const { categories } = this.props
    let result = []
    for (let category of categories) {
      result.push(<Option key={category._id} value={category._id}>{category.name}</Option>)
    }
    return result
  }
  renderRowDiscount() {
    let numOfRows = 10
    let result = []
    const { data, groups } = this.props
    for (let i = 0; i < numOfRows; i++) {
      result.push(<React.Fragment key={i}>
        <Grid item xs={3} lg={3}>
          <TextField
            fullWidth
            label="Số lượng"
            name={`discount[${i}].value`}
            value={this.getData(data, `discount.${i}.value`, 0)}
          />
        </Grid>
        <Grid item xs={4} lg={3}>
          <SelectField
            fullWidth
            label="Cấp bậc"
            name={`discount[${i}].level`}
            value={this.getData(data, `discount.${i}.level`, 0)}
          >
            {groups.map(group => <Option value={group.level} key={group._id}>{group.name}</Option>)}
          </SelectField>
        </Grid>
        <Grid item xs={2} lg={3}>
          <TextField
            fullWidth
            label="Phần trăm"
            name={`discount[${i}].percent`}
            value={this.getData(data, `discount.${i}.percent`, 0)}
          />
        </Grid>
        <Grid item xs={3} lg={3}>
          <TextField
            fullWidth
            label="Tiền"
            name={`discount[${i}].price`}
            value={this.getData(data, `discount.${i}.price`, 0)}
          />
        </Grid>
      </React.Fragment>)
    }
    return result
  }
  render() {
    const { classes, onSubmit, data } = this.props
    return (
      <PaperFade className={classes.paper}>
        <Form className={classes.form} onSubmit={onSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12} lg={4}>
              <TextField
                fullWidth
                label={I18n.t("Input.name")}
                name="name"
                validate={this.validate.name}
                value={data.name}
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <SelectField
                fullWidth
                label={I18n.t("Input.category")}
                name="categoryId"
                value={data.categoryId}
              >
                {this.renderCategories()}
              </SelectField>
            </Grid>
            <Grid item xs={12} lg={4}>
              <TextField
                fullWidth
                label={I18n.t("Input.price")}
                name="price"
                value={data.price}
              />
            </Grid>
            <Grid item xs={12} lg={12}>
              <Typography variant="h6">Bảng chiết khâu</Typography>
            </Grid>
            {this.renderRowDiscount()}
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
