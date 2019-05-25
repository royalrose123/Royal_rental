function createLogLayout(){
    app.createElement("div","logLayoutContainer","log_layout_container","body","","");
    app.createElement("div","logLayout","log_layout","logLayoutContainer","","");
    app.createElement("div","loginInputContainer","login_input_container","logLayout","","");
    app.createElement("input","loginMail","login_mail","loginInputContainer","","");
    app.get("#loginMail").setAttribute("type","email");
    app.get("#loginMail").setAttribute("placeholder","Email");
    app.createElement("input","loginPassword","login_password","loginInputContainer","","");
    app.get("#loginPassword").setAttribute("type","password");
    app.get("#loginPassword").setAttribute("placeholder","******");
    app.createElement("p","forgetBtn","forget_btn","logLayout","忘記密碼?","");
    app.createElement("div","loninBtnContainer","login_btn_container","logLayout","","");
    app.createElement("p","signup","login_btn","loninBtnContainer","註冊",app.log.createAccount);
    app.createElement("p","login","login_btn","loninBtnContainer","登入",app.log.logInClick);
    app.createElement("p","gmailLogin","gmail_login","logLayout","Log In With Gmail",app.log.gmailLogin);
    
    app.get("#logLayoutContainer").addEventListener("click",(e)=>{
        if(e.eventPhase == 2){
            logLayoutContainer.parentNode.removeChild(logLayoutContainer);
        }
    })
}

app.get("#loginBtn").addEventListener("click",function(){
    createLogLayout()
})

app.log.createAccount = function(){
    createEmail = loginMail.value;
    createPassword = loginPassword.value;
    
    firebase.auth().createUserWithEmailAndPassword(createEmail, createPassword).then(checkLogIn()).catch(function(error){
        console.log(error.code);
        if(error.code === "auth/invalid-email"){
            app.get("#alertBoxLayout").style.display = "flex";
            app.get("#alertIndex").innerHTML = "請輸入有效的信箱";
        }else if(error.code === "auth/weak-password"){
            app.get("#alertBoxLayout").style.display = "flex";
            app.get("#alertIndex").innerHTML = "請輸入有效的密碼";
        }else if(error.code === "auth/email-already-in-use"){
            app.get("#alertBoxLayout").style.display = "flex";
            app.get("#alertIndex").innerHTML = "信箱已註冊，或尚未驗證。";
        }
    });
}

var userLogin;
var getError = false;

app.log.logInClick = function(){
    firebase.auth().onAuthStateChanged(function(user){
        let userEmail = loginMail.value;
        let userPassword = loginPassword.value;

        if(userEmail < 4){
            app.get("#alertBoxLayout").style.display = "flex";
            app.get("#alertIndex").innerHTML = "信箱太短了";
            return;
        }else if(userPassword < 4){
            app.get("#alertBoxLayout").style.display = "flex";
            app.get("#alertIndex").innerHTML = "密碼太短了";
            return;
        }

        userLogin = firebase.auth().currentUser;
//        console.log("userLogin = ");
//        console.log(userLogin);

        firebase.auth().signInWithEmailAndPassword(userEmail, userPassword).catch(function(error) {
            if(error.code == "auth/wrong-password"){
                app.get("#alertBoxLayout").style.display = "flex";
                app.get("#alertIndex").innerHTML = "密碼輸入錯誤";
            }else if(error.code == "auth/user-not-found"){
                app.get("#alertBoxLayout").style.display = "flex";
                app.get("#alertIndex").innerHTML = "信箱尚未註冊";
            }else{
                app.get("#alertBoxLayout").style.display = "flex";
                app.get("#alertIndex").innerHTML = "信箱密碼有誤，或尚未驗證1。";
            }
        });

        if(getError === true){
            getError = false;
        }else{
            if(user.emailVerified){
                app.get("#alertBoxLayout").style.display = "flex";
                app.get("#alertIndex").innerHTML = "登入中";
                setUserOnFirebase();
                setTimeout(windowReload,3000);
            }else {
                app.get("#alertBoxLayout").style.display = "flex";
                app.get("#alertIndex").innerHTML = "信箱密碼有誤，或尚未驗證2。";
            } 
        }
    })
}

app.log.gmailLogin = function(){
    var provider = new firebase.auth.GoogleAuthProvider();
    
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
        console.log(result)
      var user = result.user;
      // ...
        if(user){
            windowReload()
        }
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
        console.log(error)
      // ...
    });
}

function windowReload(){
    window.location.reload();
}

function setUserOnFirebase(){
    var firebaseUser = database.ref("member/" + userLogin.uid)
    firebaseUser.on("value", function(snapshot){
        let getUser = snapshot.val();
        
        if(!getUser){
            var dateObject = new Date();
            database.ref("member/" + userLogin.uid).update({
                userId: userLogin.uid,
                userName: userLogin.displayName,
                userCreateTime: dateObject.getTime(),
                email: userLogin.email,
                phone: userLogin.phoneNumber,
                gender: "",
                userPost: [],
                userPhoto: userLogin.photoURL,
                favHouse: [],
            })
        }
    })
}

var userLogin;
function checkLogIn(){
        firebase.auth().onAuthStateChanged(function(user){
        if(user){
            console.log(user)
            userLogin = user;
            user.sendEmailVerification().then(function(){
                app.get("#alertBoxLayout").style.display = "flex";
                app.get("#alertIndex").innerHTML = "已寄信，請前往驗證。";
            })
        }else{
            userLogin = null;
        }
    },function(error){});
}
/* log alert box */
app.log.closeAlertBox = function(){
    app.get("#alertBoxLayout").style.display = "none";
}

app.log.createAlertBox = function(){
    app.createElement("div","alertBoxLayout","alert_box_layout","body","","");
    app.createElement("div","alertBox","alert_box","alertBoxLayout","","");
    app.createElement("p","alertTitle","alert_title","alertBox","Remind","");
    app.createElement("p","alertIndex","alert_index","alertBox","","");
    app.createElement("p","alertBtn","alert_btn","alertBox","OK",app.log.closeAlertBox);
}
app.log.createAlertBox();

