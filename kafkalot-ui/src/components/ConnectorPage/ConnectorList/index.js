import React, { PropTypes, } from 'react'

import List from 'material-ui/List'
import Divider from 'material-ui/Divider'

import * as style from './style'
import ConnectorItem from '../ConnectorItem'
import {
  ItemProperty as CONNECTOR_PROPERTY,
} from '../../../reducers/ConnectorReducer/ItemState'

export default class ConnectorList extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    connectors: PropTypes.array.isRequired,
  }

  static createItem(connector, actions) {
    return (<ConnectorItem connector={connector}
                           key={connector[CONNECTOR_PROPERTY.name]}
                           openConfirmDialogToRemove={actions.openConfirmDialogToRemove}
                           openEditorDialogToEdit={actions.openEditorDialogToEdit}
                           setReadonly={actions.setReadonly}
                           unsetReadonly={actions.unsetReadonly}
                           startConnector={actions.start}
                           stopConnector={actions.stop}
      />)
  }

  render() {
    const { connectors, actions, } = this.props

    const items = connectors
      .reduce((acc, connector) => {
        acc.push(ConnectorList.createItem(connector, actions))
        acc.push(<Divider key={`divider-${connector[CONNECTOR_PROPERTY.name]}`} />)
        return acc
      }, [])

    return (
      <List style={style.list}>
        <Divider />
        {items}
      </List>
    )
  }
}

