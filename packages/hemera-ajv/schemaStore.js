'use strict'

class SchemaStore {
  constructor() {
    this.store = new Map()
  }

  add(schema) {
    const id = schema.$id
    if (id === undefined) {
      throw new Error('Missing schema $id property')
    }

    if (this.store.has(id)) {
      throw new Error(`Schema with id '${id}' already declared!`)
    }

    this.store.set(id, schema)
  }

  cleanId(schema) {
    for (const key in schema) {
      if (key === '$id') {
        delete schema[key]
      }
      if (schema[key] !== null && typeof schema[key] === 'object') {
        this.cleanId(schema[key])
      }
    }
  }

  resolve(id) {
    if (!this.store.has(id)) {
      throw new Error(`Schema with id '${id}' does not exist!`)
    }
    return this.store.get(id)
  }

  traverse(schema) {
    // remove schema id in order to avoid duplication error by ajv
    this.cleanId(schema)

    for (const key in schema) {
      if (typeof schema[key] === 'string' && schema[key].slice(-1) === '#') {
        schema[key] = this.resolve(schema[key].slice(0, -1))
      }

      if (schema[key] !== null && typeof schema[key] === 'object') {
        this.traverse(schema[key])
      }
    }
  }
}

module.exports = SchemaStore
