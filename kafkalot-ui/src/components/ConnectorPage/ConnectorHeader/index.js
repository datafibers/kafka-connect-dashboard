import React, { PropTypes, } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import {Popover, PopoverAnimationVertical,} from 'material-ui/Popover'

import Filter from '../../Common/Filter'
import Selector from '../../Common/Selector'
import * as style from './style'

import { isRunning, } from '../../../reducers/ConnectorReducer/ItemState'
import { Payload as SorterPayload, } from '../../../reducers/ConnectorReducer/SorterState'
import { Payload as FilterPayload, } from '../../../reducers/ConnectorReducer/FilterState'
import { Payload as StorageSelectorPayload, } from '../../../reducers/ConnectorReducer/StorageSelectorState'
import * as Page from '../../../constants/page'

export default class ConnectorHeader extends React.Component {
  static propTypes = {
    sortingStrategy: PropTypes.object.isRequired,
    storageSelector: PropTypes.object.isRequired,
    connectors: PropTypes.array.isRequired,
    openEditorDialogToCreate: PropTypes.func.isRequired,
    filterConnector: PropTypes.func.isRequired,
    filterKeyword: PropTypes.string.isRequired,
    sortConnector: PropTypes.func.isRequired,
    changeStorage: PropTypes.func.isRequired,
  }

  static createSummaryDOM(connectors, createButton) {
    const totalJobCount = connectors.length
    const runningJobCount = connectors.filter(connector => isRunning(connector)).length

    return (
      <div style={style.summaryStorage}>
        <span>Running</span>
        <span style={style.summaryRunningConnector}> {runningJobCount}</span>
        <span> of {totalJobCount}</span>
        <span style={style.buttonStorage}> {createButton} </span>
      </div>
    )
  }

  constructor(props) {
    super(props)

    this.handleCreateJob = this.handleCreateJob.bind(this)
    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.handleSorterChange = this.handleSorterChange.bind(this)
    this.handleStorageSelectorChange = this.handleStorageSelectorChange.bind(this)
  }

  handleCreateJob() {
    const { openEditorDialogToCreate, } = this.props
    openEditorDialogToCreate()
  }

  handleFilterChange(filterKeyword) {
    const { filterConnector, } = this.props
    const payload = { [FilterPayload.FILTER_KEYWORD]: filterKeyword, }
    filterConnector(payload)
  }

  handleSorterChange(strategy) {
    const { sortConnector, } = this.props
    const payload = { [SorterPayload.STRATEGY]: strategy, }

    sortConnector(payload)
  }

  handleStorageSelectorChange(storage) {
    const { changeStorage, } = this.props
    const payload = { [StorageSelectorPayload.STORAGE]: storage, }

     changeStorage(payload)
  }

  render() {
    const {
      sortingStrategy, storageSelector,
      connectors, filterKeyword, } = this.props

    /** 1. create `CREATE` button */
    const createButton = (
      <RaisedButton labelStyle={style.buttonLabel}
                    secondary label={"CREATE"}
                    onTouchTap={this.handleCreateJob} />)

    /** 2. draw summary */
    const summaryWithPopover = ConnectorHeader.createSummaryDOM(connectors, createButton)

    /** 3. filter label */
    const filterLabel = (filterKeyword !== '') ?
      `filtered by '${filterKeyword}'` : 'Insert Filter'

    return (
      <div>
        <div style={style.title}>
          {Page.ConnectorPageTitle}
        </div>
        <div>
          <Filter handler={this.handleFilterChange}
                  floatingLabel={filterLabel}
                  style={style.filterInput} />
          <Selector handler={this.handleStorageSelectorChange}
                    style={style.storageSelector}
                    labelStyle={style.storageSelectorLabel}
                    floatingLabel="Storage"
                    floatingLabelStyle={style.selectorFloatingLabel}
                    strategies={storageSelector.availableStorages}
                    currentStrategy={storageSelector.selectedStorage} />
          <Selector handler={this.handleSorterChange}
                  style={style.selector}
                  labelStyle={style.selectorLabel}
                  floatingLabel="Sort by"
                  floatingLabelStyle={style.selectorFloatingLabel}
                  strategies={sortingStrategy.availableStrategies}
                  currentStrategy={sortingStrategy.selectedStrategy} />
        </div>
        {summaryWithPopover}
      </div>
    )
  }
}
