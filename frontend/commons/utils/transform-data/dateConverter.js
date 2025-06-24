// Format Params Can Use
// d-m-y | d-m | m-y | d-y | d | m | y
const toDateTimes = (value, format = null, optMonth = null) => {
  // Remove TimeZone
  // convert 2022-12-29T00:00:00.00000Z to 2022-12-29T00:00:00
  let optionOfMonth = optMonth;
  
  if (!value) return value

  if(!optionOfMonth || optionOfMonth === null){
    let tempOption = {};
    tempOption.country = 'default';
    tempOption.type = 'short';
    optionOfMonth = tempOption;
  }

  value = value.toString()
  const splitDot = value.split('.')
  const splitZ = value.split('Z')

  if (splitDot.length > 1) value = splitDot[0]
  else if (splitZ.length > 1) value = splitZ[0]

  const tempDate = new Date(value) // input 2022-12-29T00:00:00

  const date = String(tempDate.getDate());
  const month = String(tempDate.toLocaleString(optionOfMonth.country, { month: optionOfMonth.type }));
  const year = String(tempDate.getFullYear());
  const times = String(tempDate.toTimeString('hh:mm'))
  const convertedTimes = times.split(' ')?.[0]?.split(':')

  let result = `${date} ${month} ${year}, ${convertedTimes?.[0]}:${convertedTimes?.[1]}`;

  if (format) {
    format = format.split('-')

    if (format.includes('d') && format.includes('m') && format.includes('y')) result = `${date} ${month} ${year}, ${convertedTimes?.[0]}:${convertedTimes?.[1]}`;
    else if (format.includes('d') && format.includes('m')) result = `${date} ${month}, ${convertedTimes?.[0]}:${convertedTimes?.[1]}`;
    else if (format.includes('m') && format.includes('y')) result = `${month} ${year}, ${convertedTimes?.[0]}:${convertedTimes?.[1]}`;
    else if (format.includes('d') && format.includes('y')) result = `${date} ${year}, ${convertedTimes?.[0]}:${convertedTimes?.[1]}`;
    else if (format.includes('d')) result = `${date}, ${convertedTimes?.[0]}:${convertedTimes?.[1]}`;
    else if (format.includes('m')) result = `${month}, ${convertedTimes?.[0]}:${convertedTimes?.[1]}`;
    else if (format.includes('y')) result = `${year}, ${convertedTimes?.[0]}:${convertedTimes?.[1]}`;
  }

  return result; // output 29 Dec 2022, 07:00
}

// Format Params Can Use
// d-m-y | d-m | m-y | d-y | d | m | y
const toDate = (value, format = null, optMonth = null) => {
  // Remove TimeZone
  // convert 2022-12-29T00:00:00.00000Z to 2022-12-29T00:00:00
  let optionOfMonth = optMonth;

  if (!value) return value

  if(!optionOfMonth || optionOfMonth == null){
    let tempOption = {};
    tempOption.country = 'default';
    tempOption.type = 'short';
    optionOfMonth = tempOption;
  }
  
  value = value.toString()
  const splitDot = value.split('.')
  const splitZ = value.split('Z')
  
  if (splitDot.length > 1) value = splitDot[0]
  else if (splitZ.length > 1) value = splitZ[0]

  const tempDate = new Date(value) // input 2022-12-29T00:00:00

  const date = String(tempDate.getDate());
  const month = String(tempDate.toLocaleString(optionOfMonth.country, { month: optionOfMonth.type }));
  const year = String(tempDate.getFullYear());

  let result = `${date} ${month} ${year}`;

  if (format) {
    format = format.split('-')

    if (format.includes('d') && format.includes('m') && format.includes('y')) result = `${date} ${month} ${year}`
    else if (format.includes('d') && format.includes('m')) result = `${date} ${month}`
    else if (format.includes('m') && format.includes('y')) result = `${month} ${year}`
    else if (format.includes('d') && format.includes('y')) result = `${date} ${year}`
    else if (format.includes('d')) result = `${date}`
    else if (format.includes('m')) result = `${month}`
    else if (format.includes('y')) result = `${year}`
  }

  return result; // output 29 Dec 2022
}

const toDateShort = (value) => {
  // Remove TimeZone
  // convert 2022-12-29T00:00:00.00000Z to 2022-12-29T00:00:00
  value = value.toString()
  const splitDot = value.split('.')
  const splitZ = value.split('Z')

  if (splitDot.length > 1) value = splitDot[0]
  else if (splitZ.length > 1) value = splitZ[0]
  
  const tempDate = new Date(value) // input 2022-12-29T00:00:00

  const date = String(tempDate.getDate());
  const month = String(tempDate.getMonth() + 1);
  const year = String(tempDate.getFullYear());

  const result = `${year}-${month < 10 ? '0'+month : month}-${date < 10 ? '0'+date : date}`;

  return result; // output 2022-12-29
}

const toDateFromNow = (value) => {
  // Remove TimeZone
  // convert 2022-12-29T00:00:00.00000Z to 2022-12-29T00:00:00
  value = value.toString()
  const splitDot = value.split('.')
  const splitZ = value.split('Z')
  
  if (splitDot.length > 1) value = splitDot[0]
  else if (splitZ.length > 1) value = splitZ[0]
  
  const tempDate = new Date(value) // input 2022-12-29T00:00:00
  const dateNow = new Date()

  const diffSeconds = Math.abs(dateNow - tempDate)
  const diffMinute = Math.ceil(diffSeconds / (1000 * 60)) - 1
  const diffHours = Math.ceil(diffSeconds / (1000 * 60 * 60)) - 1
  const diffDays = Math.ceil(diffSeconds / (1000 * 60 * 60 * 24)) - 1
  const diffMonth = Math.ceil(diffSeconds / (1000 * 60 * 60 * 24 * 30)) - 1
  const diffYears = Math.ceil(diffSeconds / (1000 * 60 * 60 * 24 * 30 * 12)) - 1

  let message = ""

  if (diffMinute < 1) message = `beberapa detik`
  else if (diffMinute >= 1 && diffMinute < 60) message = `${diffMinute} menit`
  else if (diffHours >= 1 && diffHours < 24) message = `${diffHours} jam`
  else if (diffDays >= 1 && diffDays < 30) message = `${diffDays} hari`
  else if (diffMonth >= 1 & diffMonth < 12) message = `${diffMonth} bulan`
  else if (diffYears >= 1) message = `${diffYears} tahun`

  if (dateNow - tempDate > 0) message = `${message} yang lalu`
  else message = `dalam ${message}`

  return message; // output 2022-12-29
}

export {
  toDateTimes,
  toDate,
  toDateShort,
  toDateFromNow
}