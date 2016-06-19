import { STORAGES, } from '../constants/Config'

export const URL_BASE = 'api/v1/connectors'

export const STORAGE_PROPERTY = { name: 'name', address: 'address', }

/** multi storage support */
export const STORAGE_NAMES = STORAGES.map(storage => storage[STORAGE_PROPERTY.name])
export const INITIAL_STORAGE_NAME = STORAGE_NAMES[0]

/** internal functions (tested) */

export function _getStorageAddress(storages, storageName) {
  const filtered = storages.filter(storage => storage[STORAGE_PROPERTY.name] === storageName)

  if (filtered.length >= 2) throw new Error(`STORAGES has duplicated ${storageName}`)
  if (filtered.length === 0) throw new Error(`Can't find address using stroage name: ${storageName}`)

  return filtered[0].address
}

export function _buildConnectorUrl(storageName, connectorName) {
  /** connectorName might be undefined to retrieve all connectors */
  const postfix = (connectorName === void 0) ? '' : `/${connectorName}`
  const storageAddress = _getStorageAddress(STORAGES, storageName)

  return `${storageAddress}/${URL_BASE}${postfix}`
}

/** exposed functions, use ENV variables (injected by webpack) */
export default {
  getConnectorsUrl: (storageName) => {
    return _buildConnectorUrl(storageName)
  },

  getConnectorUrl: (storageName, connectorName) => {
    return _buildConnectorUrl(storageName, connectorName)
  },

  getConnectorConfigUrl: (storageName, connectorName) => {
    return `${_buildConnectorUrl(storageName, connectorName)}/config`
  },
  
  getConnectorCommandUrl: (storageName, connectorName) => {
    return `${_buildConnectorUrl(storageName, connectorName)}/command`
  },
}
