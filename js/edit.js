var getData;
var thisData =[];
var firebaseData = database.ref("house")
firebaseData.on("value", function(snapshot){
    getData = snapshot.val();
    getThisArticle();
    setThisArticle();
})


function getThisArticle(){
    var thisPostId = new URL(document.location).searchParams.get("id");
    console.log("thisPostId = " + thisPostId)
    for(i = 0; i < getData.length; i++){
        if(getData[i]["postId"] == thisPostId ){
            thisData.push(getData[i])
        }
    }
    setPostUserName();
}

function setPostUserName(){
    thisUserId = thisData[0]["postUserId"]
    let firebaseUser = database.ref("member/" + thisUserId)
    firebaseUser.on("value", function(snapshot){
        getUser= snapshot.val();
        console.log("getUser")
        console.log(getUser)
        app.get("#userName").value = getUser["userName"];
          app.get("#userName").className = "user_name disabled"
         app.get("#userName").setAttribute("disabled","");
    })
}


function setThisArticle(){
    console.log("thisData")
    console.log(thisData)

    app.get("#title").value = thisData[0]["title"];
    app.get("#regionName").value = thisData[0]["regionName"];
    app.get("#sectionName").value = thisData[0]["sectionName"];
    app.get("#streetName").value = thisData[0]["streetName"];
    app.get("#price").value = thisData[0]["price"];
    app.get("#size").value = thisData[0]["size"];

    app.get("#bedroom").value = thisData[0]["bedroom"];
    app.get("#livingroom").value = thisData[0]["livingroom"];
    app.get("#restroom").value = thisData[0]["restroom"];
    app.get("#houseFloor").value = thisData[0]["houseFloor"];
    app.get("#totalFloor").value = thisData[0]["totalFloor"];

    /* set kind type */
    let kindTypeName = thisData[0]["kindType"]
    let kindType = document.getElementsByName("kindType");
    for(let i = 0; i < kindType.length; i++){
        if(kindTypeName === kindType[i].value){
            kindType[i].checked = true
        }
    }
    if(!kindTypeName){
        app.get("#alertBoxLayout").style.display = "flex";
        app.get("#alertIndex").innerHTML = "請選擇類型";
        return
    }

    /* set device */
    let device = document.getElementsByName("deviceCheck");
    for(let i = 0; i < device.length; i++){
       let thisDevice =  device[i].value;
       if(thisData[0]["device"][thisDevice]){
            device[i].checked = true;
       }
    }

    /* set others */
    let others = document.getElementsByName("othersCheck");
    for(let i = 0; i < others.length; i++){
       let thisOthers =  others[i].value;
       if(thisData[0]["others"][thisOthers]){
        others[i].checked = true;
       }
    }

    /* set price include */
    let priceInclude = document.getElementsByName("priceInclude");
    for(let i = 0; i < priceInclude.length; i++){
       let thisPriceInclude =  priceInclude[i].value;
       if(thisData[0]["priceInclude"][thisPriceInclude]){
        priceInclude[i].checked = true;
       }
    }

    app.get("#requireDeposit").value = thisData[0]["require"]["押金"];
    app.get("#requireLeastPeriod").value = thisData[0]["require"]["最短租期"];
    app.get("#requireCook").value = thisData[0]["require"]["開伙"];
    app.get("#requirePet").value = thisData[0]["require"]["養寵物"];
    app.get("#requireIdentify").value = thisData[0]["require"]["身分要求"];
    app.get("#requireGender").value = thisData[0]["require"]["性別要求"];
    app.get("#houseSurrounding").value = thisData[0]["houseSurrounding"];
    app.get("#houseDetail").value = thisData[0]["houseDetail"];
}


// let pathReference = storageRef.child("images/house7_0");
// console.log(pathReference)