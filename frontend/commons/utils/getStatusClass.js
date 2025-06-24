const statusClass = (data) => {
  let style = ''
  let label = ''
  
  switch (true) {
    case data?.comingSoon:
        style =  'b-orange',
        label = 'Akan Datang'
      break;
    case data?.started:
        style =  'b-blue',
        label = 'Sedang Berlangsung'
      break;
    case data?.onRegistration:
        style =  'b-green',
        label = 'Pendaftaran Dibuka'
      break;
    case data?.ended:
        style =  'b-red',
        label = 'Telah Selesai'
      break;
    default:
        style =  'b-orange',
        label = 'Segera Dimulai'
      break;
  }

  const statusJson = {
    style,
    label
  }

  return statusJson;
}

const statusClassNew = (data) => {
  let statusArray = []

  if (data?.comingSoon) {
    const object = {
      style:  'badge-orange',
      label: 'Akan Datang' 
    }
    statusArray.push(object)
  }
  if (data?.onRegistration) {
    const object = {
      style:  'badge-green',
      label: 'Pendaftaran'
    }
    statusArray.push(object)
  }
  if (data?.started) {
    const object = {
      style:  'badge-blue',
      label: 'Berlangsung'
    }
    statusArray.push(object)
  }
  if (data?.ended) {
    const object = {
      style:  'badge-red',
      label: 'Selesai',
    }
    statusArray.push(object)
  }

  if (!data?.comingSoon && !data?.onRegistration && !data?.started && !data?.ended) {
    const object = {
      style:  'badge-orange',
      label: 'Segera Dimulai'
    }
    statusArray.push(object)
  }

  return statusArray;
}

export {
  statusClass,
  statusClassNew
}
