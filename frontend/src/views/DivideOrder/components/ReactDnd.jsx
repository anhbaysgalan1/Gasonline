import React, {Component} from "react"
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd"
import {I18n} from 'helpers/I18n'
import {Icon, Tooltip, Grid, IconButton} from '@material-ui/core'
import withStyles from '@material-ui/core/styles/withStyles'
import {BaseView} from 'views/BaseView'
import {withRouter} from 'react-router-dom'
import _ from 'lodash'
import moment from "moment"

const styles = theme => ({
})

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  height: 'auto',
  overflowX: 'hidden',
  // padding: '5px 5px',
  padding: '10px',
  margin: `0 0 2px 0`,
  background: isDragging ? "lightgreen" : "white",
  ...draggableStyle
})

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: '5px 5px',
  overflowX: 'auto',
  height: 400,
  width: '100%'
})

class ReactDND extends BaseView {
  constructor(props) {
    super(props)
    this.state = {
      reload: false,
      elements: props.dataFormat
    }
    this.onDragEnd = this.onDragEnd.bind(this)
  }

  componentDidUpdate(prevProps, prevState){
    if(JSON.stringify(this.props.dataFormat) != JSON.stringify(prevProps.dataFormat)){
      this.setState({ elements: this.props.dataFormat  })
    }
  }

  onDragEnd(result) {
    if (!result.destination) {
      return
    }
    const elements = reorder(this.state.elements, result.source.index, result.destination.index)
    this.props.getDataSort(elements)
    this.setState({ elements })
  }

  gotoDetail = (_id) => {
    this.goto(`/orders/detail/${_id}`)
    localStorage.setItem('backDivideOrder', 'backDivideOrder')
  }

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {
                this.state.elements.map((item, index) => (
                  <Draggable key={item._id} draggableId={item._id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                      >
                        <Grid container spacing={2} direction="row" justify="flex-start" alignItems='center' >
                          <Grid item xs={1}> {index + 1} </Grid>
                          <Grid item xs={7}> {this.getData(item, "deliveryAddress", "")} </Grid>
                          <Grid item xs={2}> {this.getData(item, "customer.code", "")} </Grid>
                          <Grid item xs={2}>
                            <Tooltip title={I18n.t("Tooltip.detail")} key='local_shipping'>
                              <Icon key='local_shipping' onClick={() => this.gotoDetail(item._id)} >local_shipping</Icon>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </div>
                    )}
                  </Draggable>
                ))
              }
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
  }
}


export default withStyles(styles)(withRouter(ReactDND))

// export default ReactDND
// Put the thing into the DOM!
