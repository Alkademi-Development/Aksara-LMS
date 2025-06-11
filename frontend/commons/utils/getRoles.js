const roleClass = (data) => {
    let style = ''
    let label = ''
    
    switch (data) {
        case 0:
            style =  'b-orange',
            label = 'Super Admin'
            break;
        case 1:
            style =  'b-blue',
            label = 'Admin'
            break;
        case 2:
            style =  'b-green',
            label = 'Mentor'
            break;
        case 3:
            style =  'b-red',
            label = 'Guru'
            break;
        case 4:
            style =  'b-orange',
            label = 'Student'
            break;
        case 5:
            style =  'b-blue',
            label = 'Industri'
            break;
        case 6:
            style =  'b-yellow',
            label = 'Content Writer'
            break;
        case 7:
            style =  'b-green',
            label = 'Lead Program'
            break;
        case 8:
            style =  'b-red',
            label = 'Partner'
            break;
        case 9:
                style =  'b-yellow',
                label = 'Lead Region'
                break;
        default:
            style =  '',
            label = data
            break;
    }
  
    const statusJson = {
      style,
      label
    }
  
    return statusJson;
  }
  
  export {
    roleClass
  }
  