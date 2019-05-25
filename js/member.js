var getUser;
var thisUser;
var thisUserId;
firebase.auth().onAuthStateChanged(function(user){ 
    if(user){
        thisUser = user;
        thisUserId = user.uid;
        console.log("有登入");
    }else{
        console.log("尚未登入");
    }

    var firebaseUser = database.ref("member/" + thisUserId)
    firebaseUser.once("value", function(snapshot){
        getUser = snapshot.val();
        createMemberDisplay();
        getFirebaseUser();
    })
})

function getFirebaseUser(){
    console.log("getUser");
    console.log(getUser["gender"]);
    
    setDefaultGender()
    
    app.get("#memberId").value = getUser.userId;
    if(!getUser.userName){
        app.get("#memberName").placeholder = "請輸入姓名" 
    }else{
        app.get("#memberName").value = getUser.userName;
    }
    
    if(!getUser.phone){
        app.get("#memberPhone").placeholder = "請輸入電話" 
    }else{
        app.get("#memberPhone").value = getUser.phone;
    }
    app.get("#memberMail").value = getUser.email;
}

/* user log out */ 
app.get("#logOut").onclick = function(){
    userLogout();
}
function userLogout(){
    app.get("#memberBtn").style.display = "none";
    app.get("#loginBtn").style.display = "block";
    photoURL = "";
    firebase.auth().signOut();  
    window.location = "rental.html";
}

/* create member display */
function createMemberDisplay(){
    app.createElement("div","memberDisplay","member_display","member","","");
    createMemberData();
}

/* create member data */
function createMemberData(){
    app.createElement("div","memberData","member_data","memberDisplay","","");
    app.createElement("div","memberPhoto","member_photo","memberData","","");
    
    app.createElement("div","memberGenderRow","member_data_row","memberData","","");
    app.createElement("p","","member_data_title","memberGenderRow","性別","");
    app.createElement("div","memberGenderLabelContainer","member_label_container","memberGenderRow","","");
    app.createElement("label","memberGenderLabelM","member_gender_label","memberGenderLabelContainer","","");
    app.createElement("input","memberGenderMale","member_gender","memberGenderLabelM","","");
    app.createElement("p","","","memberGenderLabelM","男","");
    app.get("#memberGenderMale").type = "radio"
    app.get("#memberGenderMale").value = "male"
    app.get("#memberGenderMale").name = "memberGender"
    app.createElement("label","memberGenderLabelF","member_gender_label","memberGenderLabelContainer","","");
    app.createElement("input","memberGenderFemale","member_gender","memberGenderLabelF","","");
    app.createElement("p","","","memberGenderLabelF","女","");
    app.get("#memberGenderFemale").type = "radio"
    app.get("#memberGenderFemale").value = "female"
    app.get("#memberGenderFemale").name = "memberGender"
    
    app.createElement("div","memberIdRow","member_data_row","memberData","","");
    app.createElement("p","","member_data_title","memberIdRow","ID","");
    app.createElement("input","memberId","input_disbled","memberIdRow","","");
    app.get("#memberId").setAttribute("disabled","");
    
    app.createElement("div","memberNameRow","member_data_row","memberData","","");
    app.createElement("p","","member_data_title","memberNameRow","姓名","");
    app.createElement("input","memberName","input_disbled","memberNameRow","","");
    
    app.createElement("div","memberPhoneRow","member_data_row","memberData","","");
    app.createElement("p","","member_data_title","memberPhoneRow","手機","");
    app.createElement("input","memberPhone","input_disbled","memberPhoneRow","","");
    
    app.createElement("div","memberMailRow","member_data_row","memberData","","");
    app.createElement("p","","member_data_title","memberMailRow","信箱","");
    app.createElement("input","memberMail","input_disbled","memberMailRow","","");
    app.get("#memberMail").setAttribute("disabled","");
    
    app.createElement("div","memberDataBtnRow","member_data_row","memberData","","");
    app.createElement("p","memberDataModify","member_data_btn","memberDataBtnRow","修改資料",app.member.memberDataModify);
    app.createElement("p","memberDataConfirm","member_data_btn","memberDataBtnRow","確認",app.member.memberDataConfirm);
    app.createElement("p","memberDataCancel","member_data_btn","memberDataBtnRow","取消",app.member.memberDataCancel);
    
    app.member.unModify("#memberDataModify","#memberDataConfirm","#memberDataCancel");
    app.member.disabled("#memberName","#memberPhone","#memberGenderMale","#memberGenderFemale");
}

app.member.isModify = (memberDataModify,memberDataConfirm,memberDataCancel) =>{
    app.get(memberDataModify).style.display = "none";
    app.get(memberDataConfirm).style.display = "block";
    app.get(memberDataCancel).style.display = "block";
}

app.member.unModify = (memberDataModify,memberDataConfirm,memberDataCancel) =>{
    app.get(memberDataModify).style.display = "block";
    app.get(memberDataConfirm).style.display = "none";
    app.get(memberDataCancel).style.display = "none";
}

app.member.disabled = (memberName,memberPhone,memberGenderLabelM,memberGenderLabelF) =>{
    app.get(memberName).setAttribute("disabled","");
    app.get(memberPhone).setAttribute("disabled","");
    app.get(memberGenderLabelM).setAttribute("disabled","");
    app.get(memberGenderLabelF).setAttribute("disabled","");
    
    app.get(memberName).className = "input_disbled"
    app.get(memberPhone).className = "input_disbled"
}

app.member.unDisabled = (memberName,memberPhone,memberGenderLabelM,memberGenderLabelF) =>{
    app.get(memberName).removeAttribute("disabled");
    app.get(memberPhone).removeAttribute("disabled");
    app.get(memberGenderLabelM).removeAttribute("disabled");
    app.get(memberGenderLabelF).removeAttribute("disabled");
    
    app.get(memberName).classList.remove("input_disbled")
    app.get(memberPhone).classList.remove("input_disbled")
}

app.member.memberDataModify = function(){
    app.member.isModify("#memberDataModify","#memberDataConfirm","#memberDataCancel");
    app.member.unDisabled("#memberName","#memberPhone","#memberGenderMale","#memberGenderFemale");
}

app.member.memberDataConfirm = function(){
    let gender;
    let genderName = document.getElementsByName("memberGender")
    for(let i = 0; i < genderName.length; i++){
        if(genderName[i].checked){
             gender = genderName[i].value
        }
    }
    
    if(!gender){
        app.get("#alertBoxLayout").style.display = "flex";
        app.get("#alertIndex").innerHTML = "請選擇性別";
        return
    }else if(!memberName.value){
            app.get("#alertBoxLayout").style.display = "flex";
            app.get("#alertIndex").innerHTML = "請輸入姓名";
        return
    }else if(!memberPhone.value){
            app.get("#alertBoxLayout").style.display = "flex";
            app.get("#alertIndex").innerHTML = "請輸入電話";
        return
    }
    
     database.ref("/member/" + thisUserId).update({
        userName: app.get("#memberName").value, 
        phone: memberPhone.value,
        gender: gender,
     })
    
    var firebaseUser = database.ref("member/" + thisUserId)
    firebaseUser.once("value", function(snapshot){
        getUser = snapshot.val();
    })
    
    app.member.unModify("#memberDataModify","#memberDataConfirm","#memberDataCancel");
    app.member.disabled("#memberName","#memberPhone","#memberGenderMale","#memberGenderFemale");
}

app.member.memberDataCancel = function(){
    app.member.unModify("#memberDataModify","#memberDataConfirm","#memberDataCancel");
    app.member.disabled("#memberName","#memberPhone","#memberGenderMale","#memberGenderFemale");
    
    if(!getUser["userName"]){
        app.get("#memberName").value = "";
        app.get("#memberName").placeholder = "請輸入姓名" 
    }else{
        app.get("#memberName").value = getUser["userName"];
    }
    
    if(!getUser["phone"]){
        app.get("#memberPhone").value = "";
        app.get("#memberPhone").placeholder = "請輸入電話" 
    }else{
        app.get("#memberPhone").value = getUser["phone"];
    }
    setDefaultGender()
}

function setDefaultGender(){
    let userGender = getUser["gender"];
    console.log("userGender = " + userGender)
    let selectGender = document.getElementsByName("memberGender")
    for(let i = 0; i < selectGender.length; i++){
        if(selectGender[i].value === userGender){
             selectGender[i].checked = true;
        }
    }
}