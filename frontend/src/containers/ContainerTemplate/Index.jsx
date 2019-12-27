import React from 'react';
import View from 'views/__DIRVIEWNAME__/Index'
import __ACTIONNAME__ from '../../actions/__ACTIONNAME__';
import BaseContainer, {selector} from 'containers/BaseContainer';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {I18n} from 'helpers/I18n';

/**
 * Files are automatically generated from the template.
 * MQ Solutions 2019
 */
class Index extends BaseContainer {
  constructor(props) {
    super(props)
    this.refTable = null
    this.onFetchData = this.onFetchData.bind(this)
    this.onRefTable = this.onRefTable.bind(this)
    this.onDeleteData = this.onDeleteData.bind(this)
  }

  componentDidUpdate(prevProps) {
    //example for check props change
    /* if(prevProps.x !== this.props.x){
      //props x changed
    } */
  }

  onFetchData(state) {
    this.props.dispatch(__ACTIONNAME__.fetchAll(state))
  }

  onRefTable(ref) {
    this.refTable = ref
  }

  onDeleteData(selectedIds) {
    this.props.dispatch(__ACTIONNAME__.delete({
        ids: selectedIds
      }))
      .then(result => {
        if (!result.error) {
          //success
          this.notify(I18n.t('Message.success.delete'))
          if (this.refTable) {
            this.refTable.onSelectionChange([])
            this.refTable.onFetchData()
          }
        } else {
          //error
          this.notify(`Response: [${result.error.status}] ${result.error.message}`, 'error')
        }
      })
  }

  render() {
    return (<View
      onFetchData={this.onFetchData}
      onRefTable={this.onRefTable}
      onDeleteData={this.onDeleteData}
      data={this.props.data}
    />);
  }
}

const mapStateToProps = state => {
  return {
    data: selector(state, "__REDUXNAME__.list", {}),
  }
}

export default withRouter(connect(mapStateToProps)(Index))
