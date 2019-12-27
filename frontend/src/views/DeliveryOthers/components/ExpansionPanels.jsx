import React from 'react';
import PropTypes from 'prop-types';
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from '@material-ui/core';

import withStyles from '@material-ui/core/styles/withStyles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import BaseView from 'views/BaseView';
import Utils from 'helpers/utility';

const styles = theme => ({
  gridTable: {
    overFlow: "auto",
  },
  details: {
    alignItems: 'center',
  },
});

class DetailedExpansionPanel extends BaseView {
  constructor(props) {
    super(props);
  }

  renderExpansionPanelDetail = (orders) => {
    return (
      <Table size="small" aria-label="a dense table">
        <TableBody>
          {orders.map((order, index) => (
            <TableRow key={order._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                {this.renderCustomerInfo(order)}
              </TableCell>
              <TableCell>
                {this.getData(order, 'area.code', 'N/A')}
              </TableCell>
              <TableCell>
                {this.getData(order, 'deliveryAddress', 'N/A')}
              </TableCell>
              <TableCell>
                {Utils._formatDeliveryTime(order.deliveryTime)}
              </TableCell>
              <TableCell>
                {Utils._formatOrderStatus(order.status)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  renderCustomerInfo = (order) => {
    return order.customer ? `${order.customer.code} ${order.customer.name}` : 'N/A'
  }

  render() {
    const {classes, truck} = this.props;
    let driver = this.getData(truck, 'driver.fullName', 'N/A');
    let orders = this.getData(truck, 'orders', []);

    return (
      // defaultExpanded
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon/>}
          aria-controls={truck.id}
          id={truck.id}
        >
          <Typography>{driver}</Typography>
        </ExpansionPanelSummary>

        <ExpansionPanelDetails className={classes.details}>
          {this.renderExpansionPanelDetail(orders)}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

DetailedExpansionPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DetailedExpansionPanel);
