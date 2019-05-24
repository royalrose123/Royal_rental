var thisUser;
var thisUserId;
isLogin();
function isLogin(){
    firebase.auth().onAuthStateChanged(function(user){ 
        if(user){
            thisUser = user;
            thisUserId = user.uid;
            console.log("有登入");
        }else{
            console.log("尚未登入");
        }
        
        var firebaseUser = database.ref("member/" + thisUserId)
        firebaseUser.on("value", function(snapshot){
            getUser = snapshot.val();
            getFirebaseUser()
        })
    })
  
}

var getUser;
function getFirebaseUser(){
    console.log("getUser")
    console.log(getUser)
    app.get("#memberId").value = getUser.userId;
    app.get("#memberMail").value = getUser.email;
}

app.get("#logOut").onclick = function(){
    userLogout()
}
function userLogout(){
    app.get("#memberBtn").style.display = "none";
    app.get("#loginBtn").style.display = "block";
    photoURL = "";
    firebase.auth().signOut();  
    window.location = "rental.html";
}