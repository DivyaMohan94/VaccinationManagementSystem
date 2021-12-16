const setLocalStorage = (data) =>{
    localStorage.setItem("loggedIn", true);
    localStorage.setItem("email", data.email);
    localStorage.setItem("id", data._id);
    localStorage.setItem("name", data.name);
    localStorage.setItem("miles", data.miles);
    localStorage.setItem("redeemedMiles",data.redeemedMiles);
    // localStorage.setItem("id", data._id);
}

const isLoggedIn =()=>{
    if(localStorage.getItem("loggedIn")==="true"){
        return true;
    }else{
        return false;
    }
}

const isLoggedOut = () =>{
    return !isLoggedIn();
}

const computeCurrentDateTime = (dateString) => {
    let currentDate = dateString;
    const realDatenow = new Date();
    let minutes = realDatenow.getMinutes();
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let hours = realDatenow.getHours();
    hours = hours < 10 ? "0" + hours : hours;
    let seconds = realDatenow.getSeconds();
    seconds = seconds < 10 ? "0" + seconds : seconds;
    // console.log(minutes + "" + seconds + "" + hours);
    //add time here to hardcoded string
    let formatString = `-${hours}-${minutes}-${seconds}`;
    currentDate += formatString;
    return currentDate;
}


export { setLocalStorage, isLoggedIn, isLoggedOut, computeCurrentDateTime };