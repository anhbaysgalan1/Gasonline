import React from 'react';
import {Button, Icon, IconButton} from '@material-ui/core'
import {I18n} from 'helpers/I18n'
import LogOutDialog from './LogOutDialog'

export default class ProfileMenu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false
        }
    }
    onShow = () => {
        this.setState({ open: true })
    }
    onHide = () => {
        this.setState({ open: false })
    }
    render() {
        return (
            <div>
                <IconButton variant="contained" size='small' color="default" type="button" onClick={this.onShow}>
                    <Icon>input</Icon> 
                </IconButton>
                <LogOutDialog onLogout = {this.props.onLogout} onHide = {this.onHide} open = {this.state.open}/>
            </div>
        )
    }

}