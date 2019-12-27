import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import BaseView from 'views/BaseView';
import {Chip, List, ListItem, ListItemText} from '@material-ui/core'
import {I18n} from 'helpers/I18n';

const styles = theme => ({
  chip: {
    marginLeft: theme.spacing(1),
  },
});

class RemainingFuelList extends BaseView {
  constructor(props) {
    super(props);
  }

  formatRemainingFuels = (data) => {
    let rs = [];
    for (let item in data) {
      rs.push({
        name: item,
        value: parseInt(data[item])
      })
    }
    return rs
  }

  render() {
    const {classes, truck, styleList} = this.props;
    const fuels = this.getData(truck, "remain", {});
    const lists = this.formatRemainingFuels(fuels)

    return (
      <List style={styleList}>
        {lists.map(item =>
          <ListItem key={item.name}>
            <ListItemText primary={I18n.t(`Label.products.${item.name}`)}/>
            <Chip
              className={classes.chip}
              variant="outlined"
              size="small"
              color="secondary"
              label={item.value}
            />
          </ListItem>
        )}
      </List>
    );
  }
}

RemainingFuelList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RemainingFuelList);
