const formatDate = function (timestamp) {
  // Given timestam

  // Create a new Date object from the timestamp
  const date = new Date(timestamp)

  // Define arrays for day names and month names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  // Extract date components
  const dayName = dayNames[date.getDay()]
  const monthName = monthNames[date.getMonth()]
  const day = date.getDate()
  const year = date.getFullYear()
  let hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? "PM" : "AM"

  // Convert hours to 12-hour format
  hours = hours % 12
  hours = hours ? hours : 12 // Handle midnight

  // Construct the formatted date and time
  const formattedDateTime = `${dayName}, ${monthName} ${day}, ${year}, ${hours}:${minutes
    .toString()
    .padStart(2, "0")} ${ampm}`

  return formattedDateTime
}
module.exports = { formatDate }
