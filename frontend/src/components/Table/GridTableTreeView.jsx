import React, {PureComponent} from 'react'
import LoadingCircle from 'components/Progress/LoadingCircle'
import {
  Grid,
  TableHeaderRow,
  TableFilterRow,
  PagingPanel,
  TableSelection,
  TableColumnResizing,
  ColumnChooser,
  TableColumnVisibility,
  Toolbar,
  VirtualTable,
  TableFixedColumns,
  TableTreeColumn,
} from '@devexpress/dx-react-grid-material-ui';

import {
  FilteringState,
  SortingState,
  PagingState,
  CustomPaging,
  SelectionState,
  IntegratedSelection,
  DataTypeProvider,
  TreeDataState,
  CustomTreeData,
  IntegratedFiltering
} from '@devexpress/dx-react-grid';

import DateRangeField from 'components/Forms/DateRangeField'
import TextField from 'components/Forms/TextField'
import {withStyles} from '@material-ui/core/styles';
import _ from 'lodash'

const debug = require("debug")("mq:table")
const styles = theme => {
  return {
    table: {
      position: "relative",
      overflowX: "auto",
      //height: "calc(100vh - 64px)"
    },
    tableToolbar: {
      padding: "0px"
    },
    toolbarRightIcons: {
      position: "absolute",
      right: "48px"
    }
  }
}

const filterByType = {
  text: {
    operations: [
      "contains",
      "notContains",
      "startsWith",
      "endsWith",
      "equal",
      "notEqual"
    ],
    editorComponent: ({value, onValueChange}) => (
      <TextField
        fullWidth
        defaultValue={value}
        name="filter"
        type="text"
        placeholder="Filter..."
        onChange={onValueChange}
      />
    )
  },
  number: {
    operations: [
      "equal",
      "notEqual",
      "greaterThan",
      "greaterThanOrEqual",
      "lessThan",
      "lessThanOrEqual"
    ],
    editorComponent: ({value, onValueChange}) => (
      <TextField
        fullWidth
        defaultValue={value}
        name="filter"
        type="number"
        placeholder="Filter..."
        onChange={onValueChange}
      />
    )
  },
  date: {
    operations: [],
    editorComponent: ({value, onValueChange}) => (
      <DateRangeField
        fullWidth
        defaultValue={{
          ...value,
          key: "dateRange"
        }}
        name="filter"
        onChange={(value => {
          if (!value.startDate && !value.endDate) value = undefined
          onValueChange(value)
        })}
      />
    )
  }
}

const FilterIcon = ({type, ...restProps}) => {
  //if (type === 'month') return <DateRange {...restProps} />;
  return <TableFilterRow.Icon type={type} {...restProps} />;
};
const Root = props => <Grid.Root {...props} style={{height: '100%'}}/>;
const ToolbarRoot = (tableProps, tableState) => (props) => {
  let leftChildren = ""
  let rightChildren = ""
  if (typeof tableProps.selectedActions == "function") {
    leftChildren = tableProps.selectedActions(tableState.selection)
  }
  if (typeof tableProps.tableActions == "function") {
    rightChildren = tableProps.tableActions({tableProps, tableState})
  }

  return <Toolbar.Root className={tableProps.classes.tableToolbar}>
    <div>
      {tableState.selection.length ? leftChildren : ''}
    </div>
    <div className={tableProps.classes.toolbarRightIcons}>
      {rightChildren}
    </div>
    {props.children}
  </Toolbar.Root>
}

class GridTable extends PureComponent {
  constructor(props) {
    super(props);

    let defaultState = {
      id: props.id || undefined,
      loading: true,
      restoring: true,
      selection: [],
      sorting: [],
      filters: [],
      columnOptions: {
        disableFilter: [],
        disableSorting: [],
        columnWidths: [],
        hiddens: [],
        defaultReOrder: [],
        dataTypeProvider: [],
        fixedColumns: {
          left: [], //TableSelection.COLUMN_TYPE mặc định luôn fixed trường checkbox
          right: []
        },
      },

      pageSize: 20,
      currentPage: 0,
      totalCount: 0,
      pageSizes: [10, 20, 30, 50]
    };

    this.state = defaultState
    this.selection = []
    this.ToolbarRootComponent = ToolbarRoot(this.props, this.state)

    this.getRowId = this.getRowId.bind(this)
    this.onChangePage = this.onChangePage.bind(this)
    this.onChangePageSize = this.onChangePageSize.bind(this)
    this.onSelectionChange = this.onSelectionChange.bind(this)
    this.onSortingChange = this.onSortingChange.bind(this)
    this.onFiltersChange = this.onFiltersChange.bind(this)
    this.onColumnWidthsChange = this.onColumnWidthsChange.bind(this)
  }

  /**
   * lưu lại toàn bộ setting của table
   */
  backupSetting() {
    if (!this.props.id) return
    let setting = Object.assign({}, this.state)
    delete setting["columnOptions"]["dataTypeProvider"]
    localStorage.setItem(`gridTable.${this.props.id}`, JSON.stringify(setting))
  }

  restoreSetting() {
    if (!this.props.id) return false
    let setting = localStorage.getItem(`gridTable.${this.props.id}`)
    if (setting) {
      setting = JSON.parse(setting)
      let oldColumns = _.get(setting, "columnOptions.columnWidths", []).map(column => column.columnName)
      let {columns} = this.props
      let currentColumnName = columns.map(column => column.name)
      //kiểm tra sự thay đổi của column
      let changed = _.xor(currentColumnName, oldColumns).length
      if (!changed) {
        setting = _.merge(this.state, setting)
        //let dataTypeProvider = this.buildDataTypeProvider(this.props.columns)
        //setting['columnOptions']['dataTypeProvider'] = dataTypeProvider
        setting['restoring'] = true
        this.setState(setting)
        return true
      }
    }
    return false
  }

  componentDidMount() {
    if (!this.restoreSetting()) {
      const {defaultSort, defaultSelection, defaultPageSize} = this.props
      if (defaultSort) {
        this.setState({sorting: defaultSort})
      }
      if (defaultSelection) {
        this.setState({selection: defaultSelection})
      }
      if (defaultPageSize) {
        this.setState({pageSize: defaultPageSize})
      }
      this.setOptionsColumns(this.props.columns)
    }

    this.columns = this.dataAccessors(this.props.columns)
    let dataTypeProvider = this.buildDataTypeProvider(this.props.columns)
    let defaultResizing = this.state.columnOptions.columnWidths
    if (this.state.columnOptions.columnWidths.length === 0) {
      const widthTable = this.refTable.offsetWidth
      //set defaultResizing
      defaultResizing = this.props.columns.map(column => {
        return {
          columnName: column.name,
          width: Math.max((widthTable - 58) / this.props.columns.length, 140)
        }
      })
    }

    this.setState({
      columnOptions: {
        ...this.state.columnOptions,
        dataTypeProvider: dataTypeProvider,
        columnWidths: defaultResizing
      }
    })

    if (typeof this.props.onRefTable == "function") {
      this.props.onRefTable(this)
    }
    this.onFetchData()
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    return {
      loading: prevState.loading
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.restoring) {
      this.setState({restoring: false})
    }

    if (prevState.loading === this.state.loading === true) {
      this.setState({loading: false})
    }
  }

  componentWillUnmount() {
    this.backupSetting()
    // if(this.state.id){
    //   localStorage.setItem(`gridTable.${this.state.id}`, JSON.stringify(this.state))
    // }
  }


  editorComponentRender(editorComponent, column) {
    //xử lý nếu không có editor thì return undefined để sử dụng editor mặc định
    if (!editorComponent) return undefined
    return (params) => {
      let components = editorComponent(params)
      //thêm các props mặc định. filterFormat cho editor Component (nếu là date thì sẽ apply
      let rendered = React.cloneElement(components, {
        name: "filter",
        margin: "none",
        ...column.editorProps,
        disabled: column.filterable === false,
        format: column.filterFormat
      })
      return (
        <div style={{width: "100%"}}>
          {rendered}
        </div>
      )
    }
  }

  buildDataTypeProvider(columns) {
    let dataTypeProvider = []
    for (let column of columns) {
      //set dataTypeProvider
      let defaultOperations = undefined,
        defaultFormatterComponent = undefined,
        defaultEditorComponent = undefined

      if (!column.type) column.type = "text"
      if (column.type && filterByType[column.type]) {
        defaultOperations = filterByType[column.type]["operations"]
        defaultFormatterComponent = filterByType[column.type]["formatterComponent"]
        defaultEditorComponent = filterByType[column.type]["editorComponent"]
      }
      //build editorComponent, editor của filter
      let edittorComponent = column.editorComponent || defaultEditorComponent
      dataTypeProvider.push({
        columnName: column.name,
        for: [column.name],
        availableFilterOperations: column.availableFilterOperations || defaultOperations,
        formatterComponent: column.formatterComponent || defaultFormatterComponent,
        editorComponent: this.editorComponentRender(edittorComponent, column)
      })
    }
    /* this.setState({
      columnOptions: {
        ...this.state.columnOptions,
        dataTypeProvider: [...dataTypeProvider]
      }
    } */
    return dataTypeProvider
  }

  setOptionsColumns(columns) {
    let {
      disableFilter,
      disableSorting,
      defaultReOrder,
      fixedColumns,
      hiddens,
    } = this.state.columnOptions

    for (let column of columns) {
      //check disable filter
      if (column.filterable === false) {
        disableFilter.push({
          columnName: column.name,
          filteringEnabled: false
        })
      }

      //check disable sorting
      if (column.sortable === false) {
        disableSorting.push({
          columnName: column.name,
          sortingEnabled: false
        })
      }

      //set re-order
      defaultReOrder.push(column.name)

      //set fixedColumns
      if (column.fixed) {
        if (column.fixed === "right") fixedColumns.right.push(column.name)
        else {
          if (column.name === defaultReOrder[0])
            fixedColumns.left.push(TableSelection.COLUMN_TYPE)

          fixedColumns.left.push(column.name)
        }
      }
      //set hidden column
      if (column.hidden) {
        hiddens.push(column.name)
      }
    }

    this.setState({
      columnOptions: {
        ...this.state.columnOptions,
        disableFilter: disableFilter,
        disableSorting: disableSorting,
        defaultReOrder: defaultReOrder,
        fixedColumns: fixedColumns,
        hiddens: hiddens
      }
    })
  }

  getRowId(row) {
    if (this.props.getRowId) {
      return this.props.getRowId(row)
    }
    return row._id || row.id
  }

  onSelectionChange(selection) {
    debug("change selection: ", selection)
    this.setState({selection: selection})
    //this.tableState.selection = selection
    //this.onFetchData()
  }

  onSortingChange(sorting) {
    debug("change sort: ", sorting)
    this.onFetchData({sorting: sorting})

  }

  onChangePage(page) {
    debug("change page...", page)
    this.onFetchData({currentPage: page})
  }

  onChangePageSize(pageSize) {
    debug("change PageSize: ", pageSize)
    this.onFetchData({
      currentPage: 0, //reset page when page size changed
      pageSize: pageSize
    })
  }

  getPropertyByColumnName(columnName, property) {
    const column = this.props.columns.filter(column => column.name === columnName)[0]
    if (column && column[property]) return column[property]
    return null
  }

  formatValueByType(value, type) {
    switch (type) {
      case "text":
        value = String(value)
        break;
      case "number":
        value = Number(value)
        break;

      default:
        break;
    }
    return value
  }

  onFiltersChange(filters) {
    debug("change filters but not fetch data: ", filters)
    clearTimeout(this.onFiltersChangeTimeout)
    this.onFiltersChangeTimeout = setTimeout(() => {
      debug("filters start fetch new data", filters)
      //build filters
      filters = filters.map(filter => {
        //set default opration
        if (!filter.operation) filter.operation = this.getPropertyByColumnName(filter.columnName, "defaultFilterOperation") || "contains"
        const dataType = this.getPropertyByColumnName(filter.columnName, "type") //set dataType to filter Object
        return {
          ...filter,
          dataType: dataType,
          value: this.formatValueByType(filter.value, dataType)
        }
      })
      this.onFetchData({
        currentPage: 0, //reset page when page size changed
        filters: filters
      })
    }, 300)

  }

  onColumnWidthsChange(widths) {
    this.setState({
      columnOptions: {
        ...this.state.columnOptions,
        columnWidths: widths
      }
    })
  }

  onFetchData(newState = {}) {
    const state = {
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
      sorting: this.state.sorting,
      filters: this.state.filters,
      ...newState
    }

    this.setState({
      loading: true,
      ...state
    })
    debug("onFetchData: ", state)
    this.props.onFetchData(state)
  }

  renderDataTypeProvider() {
    const {dataTypeProvider} = this.state.columnOptions
    let result = dataTypeProvider.map(provider => (
      <DataTypeProvider
        key={`DataTypeProvider-${provider.columnName}`}
        {...provider}
      />
    ))
    return result
  }

  renderSelection() {
    const {showCheckboxColumn} = this.props
    if (showCheckboxColumn) {
      return [
        <SelectionState
          key="SelectionState"
          selection={this.state.selection}
          onSelectionChange={this.onSelectionChange}
        />,
        <IntegratedSelection
          key="IntegratedSelection"
        />
      ]
    }
    return ''
  }

  renderFilter() {
    const {filters, columnOptions} = this.state
    let filterPlugins = [
      <FilteringState
        key="FilteringState"
        defaultFilters={filters}
        //onFiltersChange={this.onFiltersChange}
        columnExtensions={columnOptions.disableFilter}
      />,
      <TableFilterRow
        key="TableFilterRow"
        showFilterSelector={true}
        iconComponent={FilterIcon}
        messages={{}}
      />,
      <IntegratedFiltering/>
    ]
    return filterPlugins
  }

  renderSorting() {
    const {columnOptions, sorting} = this.state
    return [
      <SortingState
        key="SortingState"
        defaultSorting={sorting}
        onSortingChange={this.onSortingChange}
        columnExtensions={columnOptions.disableSorting}
      />
    ]
  }

  renderPaging() {
    const {currentPage, pageSize, pageSizes} = this.state
    const {totalCount} = this.props
    return [
      <PagingState
        key="PagingState"
        currentPage={currentPage}
        pageSize={pageSize}
        onCurrentPageChange={this.onChangePage}
        onPageSizeChange={this.onChangePageSize}
      />,
      <CustomPaging
        key="CustomPaging"
        totalCount={totalCount}
      />,
      <PagingPanel
        key="PagingPanel"
        pageSizes={pageSizes}
      />
    ]
  }

  renderTableColumnUtility() {
    const {columnOptions} = this.state
    return [
      <TableColumnResizing
        key="TableColumnResizing"
        onColumnWidthsChange={this.onColumnWidthsChange}
        columnWidths={columnOptions.columnWidths}
      />,
      <TableColumnVisibility
        key="TableColumnVisibility"
        defaultHiddenColumnNames={columnOptions.hiddens}
      />
    ]
  }

  renderToolbar() {
    const ToolbarRootComponent = ToolbarRoot(this.props, this.state)

    return [
      <Toolbar
        key="Toolbar"
        rootComponent={ToolbarRootComponent}
      />,
      <ColumnChooser
        key="ColumnChooser"
      />
    ]
  }

  renderFixedColumns() {
    const {columnOptions} = this.state
    return [
      <TableFixedColumns
        key="TableFixedColumns"
        leftColumns={columnOptions.fixedColumns.left}
        rightColumns={columnOptions.fixedColumns.right}
      />
    ]
  }

  dataAccessors(columns) {
    return columns
  }

  getChildRows = (row, rootRows) => {
    if (this.props.getChildRows) return this.props.getChildRows(row, rootRows)
    const childRows = rootRows.filter(r => r.parentId === (row ? row._id : null));
    return childRows.length ? childRows : null;
  }

  renderTable() {
    const {rows, classes, className, defaultExpandedRowIds} = this.props
    if (!this.columns) return ''
    return (
      <div className={`${classes.table} ${className}`}>
        <Grid
          rows={rows || []}
          columns={this.columns}
          getRowId={this.getRowId}
          rootComponent={Root}
        >
          <TreeDataState defaultExpandedRowIds={defaultExpandedRowIds}/>
          <CustomTreeData
            getChildRows={this.getChildRows}
          />
          <VirtualTable
            height={this.props.height}
          />

          {this.renderDataTypeProvider()}
          {this.renderTableColumnUtility()}

          <TableHeaderRow/>
          <TableTreeColumn
            for="name"
          />
          {this.renderToolbar()}
        </Grid>
      </div>
    )
  }

  render() {
    debug("render Table, state: ", this.state, this.props)
    const {loading} = this.state
    const {classes, className} = this.props

    return <div className={`${classes.table} ${className}`} ref={ref => this.refTable = ref}>
      {this.renderTable()}
      <LoadingCircle
        show={loading}
      />
    </div>
  }
}

export default withStyles(styles, {withTheme: true})(GridTable)
