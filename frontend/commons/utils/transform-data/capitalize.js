const capitalizeAllFirst = (str) => {
    let split = str?.toLowerCase()?.split(" ");
    for ( let i = 0; i < split?.length; i++ ){
        let j = split[i].charAt(0).toUpperCase();

        split[i] = j + split[i].substr(1);
    }
    return split?.join(" ");
}

export { capitalizeAllFirst };