import { Table } from './models'
import { UserInput } from './interfaces'

let defaultsDocument: any = null
let previousTableState: any

let tableState: TableState | any = null
export let globalDefaults: UserInput = {}
export let documentDefaults: UserInput = {}

export default function (): TableState {
  return tableState
}

export function getGlobalOptions(): UserInput {
  return globalDefaults
}

export function getDocumentOptions(): UserInput {
  return documentDefaults
}

class TableState {
  doc: any

  constructor(doc: any, table: Table) {
    this.doc = doc
  }

  pageHeight() {
    return this.pageSize().height
  }

  pageWidth() {
    return this.pageSize().width
  }

  pageSize() {
    let pageSize = this.doc.internal.pageSize

    // JSPDF 1.4 uses get functions instead of properties on pageSize
    if (pageSize.width == null) {
      pageSize = {
        width: pageSize.getWidth(),
        height: pageSize.getHeight(),
      }
    }

    return pageSize
  }

  scaleFactor() {
    return this.doc.internal.scaleFactor
  }

  pageNumber() {
    const pageInfo = this.doc.internal.getCurrentPageInfo()
    if (!pageInfo) {
      // Only recent versions of jspdf has pageInfo
      return this.doc.internal.getNumberOfPages()
    }
    return pageInfo.pageNumber
  }
}

export function setupState(doc: any) {
  previousTableState = tableState

  // Hack for lazy init of table property
  const table = {} as Table
  tableState = new TableState(doc, table)

  if (doc !== defaultsDocument) {
    defaultsDocument = doc
    documentDefaults = {}
    documentDefaults = {}
  }
}

export function resetState() {
  tableState = previousTableState
}

export function setDefaults(defaults: UserInput, doc = null) {
  if (doc) {
    documentDefaults = defaults || {}
    defaultsDocument = doc
  } else {
    globalDefaults = defaults || {}
  }
}
