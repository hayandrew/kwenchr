function formatTime(date) {
  const newDate = new Date(date)
  let hours = newDate.getHours()
  let minutes = newDate.getMinutes()
  const ampm = hours >= 12 ? 'pm' : 'am'
  hours = hours % 12
  hours = hours ? hours : 12
  minutes = minutes < 10 ? '0' + minutes : minutes
  const strTime = hours + ':' + minutes + ' ' + ampm
  return strTime
}

export default formatTime
