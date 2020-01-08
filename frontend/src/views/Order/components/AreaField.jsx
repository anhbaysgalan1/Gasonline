import React from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import {Validation} from 'components/Forms';
import AutoCompleteField, {Option as OptionAuto} from 'components/Forms/AutoCompleteField';
import {BaseView} from 'views/BaseView';
import {I18n} from 'helpers/I18n';
import {Grid} from '@material-ui/core';

const styles = theme => ({});

class AreaField extends BaseView {
  constructor(props) {
    super(props);
    this.validate = {
      required: [
        Validation.required(I18n.t("Validate.required.base"))
      ]
    };
    this.state = {id: null}
    this.onChangeArea = this.onChangeArea.bind(this);
  }

  componentDidUpdate(prevProp) {
    if (prevProp.order !== this.props.order) {
      this.setState({
        id: this.getData(this.props, "order.area._id", null)
      })
    }
  }

  onChangeArea(area) {
    if (area !== null)
      this.setState({ id: area.value })
  }

  renderArea(areas, key) {
    let result = [];
    if (!Array.isArray(areas)) areas = []
    for (let area of areas) {
      result.push(<OptionAuto key={area._id} value={area._id}>{area[key]}</OptionAuto>)
    }
    return result
  }

  render() {
    const {classes, areas, order} = this.props
    console.log("areas", areas)
    console.log("areas", areas, "\norder", order)
    return (
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <AutoCompleteField
            id="byCodeArea"
            fullWidth
            select
            label={I18n.t("Input.area.code")}
            name="area"
            onChange={this.onChangeArea}
            validate={this.validate.required}
            value={this.state.id}
          >
            {this.renderArea(areas, 'code')}
          </AutoCompleteField>
        </Grid>

        <Grid item xs={12} md={6} className={classes.wrapper}>
          <AutoCompleteField
            id="byNameArea"
            fullWidth
            select
            label={I18n.t("Input.area.name")}
            name="area"
            onChange={this.onChangeArea}
            validate={this.validate.required}
            value={this.state.id}
          >
            {this.renderArea(areas, 'name')}
          </AutoCompleteField>
        </Grid>
      </Grid>
    )
  }
}

AreaField.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AreaField);
