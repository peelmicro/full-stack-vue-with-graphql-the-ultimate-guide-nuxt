const utils = {
  isJwtTokenValid(jwtToken) {
    if (!jwtToken) {
      return false
    }
    const items = jwtToken.split('.')
    if (!items) {
      return false
    }
    return items.length > 2
  },
  getFirstGraphQLError(graphQLError) {
    if (
      graphQLError &&
      graphQLError.graphQLErrors &&
      graphQLError.graphQLErrors.length > 0
    ) {
      return graphQLError.graphQLErrors[0]
    }
    if (graphQLError && graphQLError.message) {
      return graphQLError.message
    }
    return graphQLError
  },
  getCurrentGraphQLError(graphQLError) {
    const error = this.getFirstGraphQLError(graphQLError)
    if (!error) {
      return graphQLError
    }
    const currentError =
      error.message && (!error.message.message || !error.message.error)
        ? error.message
        : error.error
        ? error.error
        : error.message && error.message.message
        ? error.message.message
        : error.message && error.message.error
        ? error.message.error
        : error
    return currentError
  },
  isValidObjectID(str) {
    str = str + ''
    const len = str.length
    let valid = false
    if (len === 12 || len === 24) {
      valid = /^[0-9a-fA-F]+$/.test(str)
    }
    return valid
  }
}

export default utils
