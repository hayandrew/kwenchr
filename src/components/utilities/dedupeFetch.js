const activeRequests = new Map()

export default async function dedupeFetch(url, options = {}) {
  // Only deduplicate GET requests
  const method = options.method || 'GET'
  if (method !== 'GET') {
    return fetch(url, options)
  }

  if (activeRequests.has(url)) {
    try {
      const response = await activeRequests.get(url)
      // Clones the response so both concurrent callers can read the body stream
      return response.clone()
    } catch (e) {
      // Fallback if caching promise fails
      return fetch(url, options)
    }
  }

  const promise = fetch(url, options)
    .then((res) => {
      // Clear from registry shortly after resolution so future requests (e.g. refresh actions) can run
      setTimeout(() => {
        activeRequests.delete(url)
      }, 200)
      return res
    })
    .catch((err) => {
      activeRequests.delete(url)
      throw err
    })

  activeRequests.set(url, promise)
  
  try {
    const response = await promise
    return response.clone()
  } catch (err) {
    throw err
  }
}
