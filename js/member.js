var getUser;
var thisUser;
var thisUserId;
var userPostIdArr;
var userFavIdArr;
firebase.auth().onAuthStateChanged(function(user){ 
    if(user){
        thisUser = user;
        thisUserId = user.uid;
        console.log("有登入");
    }else{
        console.log("尚未登入");
    }

    var firebaseUser = database.ref("member/" + thisUserId);
    firebaseUser.once("value", function(snapshot){
        getUser = snapshot.val();
        
        createMemberDisplay();
        app.get("#memberDataBtn").addEventListener("click",memberBarClick);
        app.get("#favHouseBtn").addEventListener("click",memberBarClick);
        app.get("#myHouseBtn").addEventListener("click",memberBarClick);
        getFirebaseUser();
        
    })
})

var getAllData;
var firebaseHouse = database.ref("house");
firebaseHouse.on('value', function(snapshot) {
    getAllData = snapshot.val();
    console.log("getAllData");
    console.log(getAllData)
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

/* member bar btn click */
app.member.memberLayoutDisplay = (layoutBlock,layoutNone1,layoutNone2) =>{
    app.get(layoutBlock).style.display = "flex";
    app.get(layoutNone1).style.display = "none";
    app.get(layoutNone2).style.display = "none";
}

function memberBarClick(e){
    memberBarBtn = e.target.id;
    if(memberBarBtn == "memberDataBtn"){
        app.member.memberLayoutDisplay("#memberData","#memberFavHouse","#memberPost");
    }else if(memberBarBtn == "favHouseBtn"){
        app.member.memberLayoutDisplay("#memberFavHouse","#memberPost","#memberData");
    }else if(memberBarBtn == "myHouseBtn"){
        app.member.memberLayoutDisplay("#memberPost","#memberData","#memberFavHouse");
    }
}




/* create member display */
function createMemberDisplay(){
    app.createElement("div","memberDisplay","member_display","member","","");
    createMemberData();
    createMemberFavHouse();
    createMemberPost();
    app.member.memberLayoutDisplay("#memberData","#memberFavHouse","#memberPost");
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

    app.createElement("div","alertBtnContainer","alert_btn_container","alertBox","","")
    app.createElement("p","alertBtnConfirm","alert_btn","alertBtnContainer","確定",app.member.postDeleteConfirm)
    app.createElement("p","alertBtnCancel","alert_btn","alertBtnContainer","取消","")
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

/* create member favorite house */
function createMemberFavHouse(){
    userFavIdArr = getUser["userFav"]
    // console.log("userFavIdArr");
    // console.log(userFavIdArr)
    app.createElement("div","memberFavHouse","member_fav_house","memberDisplay","","");
    
    if(!userFavIdArr){
        app.createElement("p","","","memberFavHouse","目前沒有收藏","");
    }else{
        userFavIdArr.map((postId)=>{
            app.createElement("div","favHouse" + postId,"fav_house","favHouse","","");
            app.createElement("div","favHouseImg" + postId,"fav_house_img","favHouse" + postId,"","");
            app.get("#favHouseImg" + postId).style.background = "url('" + getAllData[postId]["houseImg"][0] + "') 50% / cover no-repeat";
            app.createElement("div","favHouseDetail" + postId,"fav_house_detail","favHouse" + postId,"","");
            app.createElement("p","favPrice","price","favHouseDetail"+ postId,getAllData[postId]["price"],"");
             app.createElement("p","fav_Room","","favHouseDetail" + postId,getAllData[postId]["bedroom"] + "間房間、" + getAllData[postId]["restroom"] +"間廁所","");
            app.createElement("p","favSectionName","section_name","favHouseDetail" + postId,getAllData[postId]["sectionName"],"");
            app.get("#post" + postId).onclick = function(){
                location.href= "house.html?id=" + getAllData[postId]["postId"]
            }
        })
    }
} 

/* create member post */
function createMemberPost(){
    userPostIdArr = getUser["userPost"];
    console.log("userPostIdArr")
    console.log(userPostIdArr)
    app.createElement("div","memberPost","member_post","memberDisplay","","");
    if(!userPostIdArr){
        app.createElement("p","","","memberPost","目前沒有刊登","");
    }else{
        userPostIdArr.map((postId)=>{
            app.createElement("div","postConatiner" + postId,"post_container","memberPost","","");
            
            app.createElement("div","post" + postId,"post","postConatiner" + postId,"","");
            app.createElement("div","postHouseImg" + postId,"house_img","post" + postId,"","");
            app.get("#postHouseImg" + postId).style.background = "url('" + getAllData[postId]["houseImg"][0] + "') 50% / cover no-repeat";
            app.createElement("div","postHouseDetail" + postId,"house_detail","post" + postId,"","");
            app.createElement("p","postPrice","price","postHouseDetail"+ postId,getAllData[postId]["price"],"");
             app.createElement("p","postRoom","","postHouseDetail" + postId,getAllData[postId]["bedroom"] + "間房間、" + getAllData[postId]["restroom"] +"間廁所","");
            app.createElement("p","postSectionName","section_name","postHouseDetail" + postId,getAllData[postId]["sectionName"],"");
            app.get("#post" + postId).onclick = function(){
                location.href= "house.html?id=" + getAllData[postId]["postId"]
            }
            app.createElement("div","postBtnContainer" + postId,"post_btn_container","postConatiner" + postId,"","");
            app.createElement("div","postModifyBtn" + postId,"post_btn","postBtnContainer" + postId,"修改",app.member.postModify);
            app.createElement("div","postDeleteBtn" + postId,"post_btn","postBtnContainer" + postId,"刪除",app.member.postDelete);
            app.get("#postModifyBtn" + postId).setAttribute("data-postId",postId);
            app.get("#postDeleteBtn" + postId).setAttribute("data-postId",postId);
        })
    }
}

app.member.postModify = (e) =>{
    let thisPostId = e.target.getAttribute("data-postId");
    location.href= "edit.html?id=" + thisPostId;
    console.log(thisPostId)
}

let thisPostId;
let thisPostImg;
let thisCard;
app.member.postDelete = (e) =>{
    thisPostId = e.target.getAttribute("data-postid");
    thisPostImg = getAllData[thisPostId]["houseImg"]
    console.log("確認前thisPostId")
    console.log(thisPostId)
    thisCard = app.get("#postConatiner" + thisPostId)
    
    app.get("#alertBoxLayout").style.display = "flex";
    app.get("#alertIndex").innerHTML = "確定要刪除嗎";
    app.get("#alertBtn").style.display = "none"
    app.get("#alertBtnCancel").addEventListener("click",function(){
        app.get("#alertBoxLayout").style.display = "none";
    })
}

app.member.postDeleteConfirm = () =>{
    for(let i = 0; i < thisPostImg.length; i++){
        // Create a reference to the file to delete
        let imgRef = storageRef.child("images/house" + thisPostId + "_" + i);
        // Delete the file
        imgRef.delete().then(function() {  /* delete firebase storage img */
        // File deleted successfully
        }).catch(function(error) {
        // Uh-oh, an error occurred!
        console.log(error)
        });
        console.log("i = " + i)
        if(i == thisPostImg.length - 1){
            console.log("確認後thisPostId")
            console.log(thisPostId)
            console.log("刪除前userPostIdArr")
            console.log(userPostIdArr)
            database.ref("house/" + thisPostId).remove().then(function(result){
                console.log("result")
                console.log(result)
            }).catch(function(err){
                console.log("err")
                console.log(err)
            }); /* delete firebase house  */
            for(let j = 0; j < userPostIdArr.length; j++){

                if(thisPostId == getUser["userPost"][j]){
                    database.ref("member/" + thisUserId + "/userPost/" + j).remove(); /* delete firbase member userPost */
                    userPostIdArr.splice(j, 1);
                    console.log("刪除後userPostIdArr")
                    console.log(userPostIdArr)
                    console.log("thisCard");
                    console.log(thisCard);
                    // let memberPost = app.get("#memberPost");
                    thisCard.parentNode.removeChild(thisCard); /* remove member post display */
                    // break;
                }
            }
            
            // alert("刪除完成")
        }
    }
    app.get("#alertBoxLayout").style.display = "none";
}

// app.get("#alertBtnConfirm").addEventListener("click",function(){
    
// })