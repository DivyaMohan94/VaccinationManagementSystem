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


export {setLocalStorage, isLoggedIn, isLoggedOut};