import ConfirmDialogBase from 'components/Dialogs/ConfirmDialog';

class ConfirmDialog extends ConfirmDialogBase {
  constructor() {
    super()
    this.state = {
      open: false,
    };
    this.onSubmit = this.onSubmit.bind(this)
  }

  show(truck = null, selectedIds = []) {
    this.setState({
      open: true,
      truck: truck,
      selectedIds: selectedIds
    })
  }

  onSubmit() {
    const {onSubmit, onCompleteSubmit, isShowPopup, hideOrderPopup} = this.props
    this.hide()
    if (isShowPopup) {
      hideOrderPopup();
    }

    if (typeof onSubmit === "function") {
      onSubmit(this.state.truck, this.state.selectedIds);
      onCompleteSubmit();
    }
  }
}

export default ConfirmDialog;
