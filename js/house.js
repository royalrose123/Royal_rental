var getData;
var thisData =[];
var firebaseData = database.ref("house")
firebaseData.on("value", function(snapshot){
    getData = snapshot.val();
    getThisArticle();
    createHouseLeft();
    createHouseRight();
    console.log("thisData")
    console.log(thisData)
})

let getUser;
let thisUserId;
function getThisArticle(){
    var thisPostId = new URL(document.location).searchParams.get("id");
    console.log("thisPostId = " + thisPostId)
    for(i = 0; i < getData.length; i++){
        if(getData[i]["postId"] == thisPostId ){
            thisData.push(getData[i])
        }
    }
    thisUserId = thisData[0]["postUserId"]
    let firebaseUser = database.ref("member/" + thisUserId)
    firebaseUser.on("value", function(snapshot){
        getUser= snapshot.val();
        createOwnerInfo()
    })
}

/* house left */
function createHouseLeft(){
    createSelectorImg()
    createHouseData()
}

function createSelectorImg(){
    app.createElement("div", "displayHouseImg", "display_house_img", "houseImgContainer", "", "");
    app.get("#displayHouseImg").setAttribute("data-img",0);
    app.createElement("div", "slideLeftContainer", "slide_left_container", "displayHouseImg", "", slideLeft);
    app.createElement("div", "slideLeft", "slide_left", "slideLeftContainer", "", "");
    app.createElement("div", "slideRightContainer", "slide_right_container", "displayHouseImg", "", slideRight);
    app.createElement("div", "slideRight", "slide_right", "slideRightContainer", "", "");
    app.createElement("div", "houseImgSelectorContainer", "house_img_selector_container", "houseImgContainer", "", "");
    for(i = 0; i < 5; i++){
        app.createElement("div", "houseImgSelector" + i, "house_img_selector", "houseImgSelectorContainer","", showThisImg);
        app.get("#houseImgSelector" + i).style.background = "url('" + thisData[0]["houseImg"][i] + "') 50% / cover no-repeat";
        app.get("#houseImgSelector" + i).setAttribute("data-no",i);
    }
    let thisImg = app.get("#displayHouseImg").getAttribute("data-img");
    app.get("#houseImgSelector" + thisImg).style.border = "1px solid orange"
    app.get("#displayHouseImg").style.background = app.get("#houseImgSelector" + thisImg).style.background
}

let originImg = 0;
function showThisImg(e){
    app.get("#displayHouseImg").style.background = e.target.style.background;
    let thisImg = e.target.getAttribute("data-no")
    app.get("#displayHouseImg").setAttribute("data-img",thisImg);
    
    if(originImg === thisImg){
        return
    }else{
        app.get("#houseImgSelector" + thisImg).style.border = "1px solid orange"
        app.get("#houseImgSelector" + originImg).style.border = "none"  
    }
    originImg = thisImg;
}

let nextImg;
function slideRight(){
    nextImg = Number(app.get("#displayHouseImg").getAttribute("data-img")) + 1;
    if(nextImg > 4){
        nextImg = 0;
    }
    app.get("#displayHouseImg").setAttribute("data-img",nextImg);
    app.get("#displayHouseImg").style.background = app.get("#houseImgSelector" + nextImg).style.background;
    app.get("#houseImgSelector" + nextImg).style.border = "1px solid orange"
    app.get("#houseImgSelector" + originImg).style.border = "none"
    originImg = nextImg;
}

function slideLeft(){
    nextImg = Number(app.get("#displayHouseImg").getAttribute("data-img")) - 1;
    if(nextImg < 0){
        nextImg = 4;
    }
    app.get("#displayHouseImg").setAttribute("data-img",nextImg);
    app.get("#displayHouseImg").style.background = app.get("#houseImgSelector" + nextImg).style.background;
    app.get("#houseImgSelector" + nextImg).style.border = "1px solid orange"
    app.get("#houseImgSelector" + originImg).style.border = "none"
    originImg = nextImg;
}


function createHouseData(){
    /* create house require */
    let count = 0;
    for(key in thisData[0]["require"]){
        app.createElement("div","houseRequireRow" + count,"house_require_row","houseRequireContainer","","");
        app.createElement("p","houseRequireTitle" + count,"house_require_title","houseRequireRow" + count,key,"");
        app.createElement("p","" ,"house_separate","houseRequireRow" + count," : ","");
        app.createElement("p","","house_require_detail","houseRequireRow" + count,thisData[0]["require"][key],"");
        count++;
    }
    
    /* create device */
    app.createElement("p","","house_device_title","houseDeviceContainer","房東提供","");
    for(key in thisData[0]["device"]){
        app.createElement("div","houseDeviceRow" + count,"house_device_row","houseDeviceContainer","","");
        app.createElement("div","houseDeviceImg" + count,"house_device_img","houseDeviceRow" + count,"","");
        if(thisData[0]["device"][key]){
            app.get("#houseDeviceImg" + count).style.background = "url('./images/check.jpg') 50% / cover no-repeat";
        }else{
            app.get("#houseDeviceImg" + count).style.background = "url('./images/uncheck.png') 50% / cover no-repeat";
        }
        
        app.createElement("p","","house_device","houseDeviceRow" + count,key,"");
        count++;
    }
    
    /* create house surrounding */
    app.createElement("p","houseSurroundingTitle","house_surrounding_title","houseSurroundingContainer","生活交通","");
    app.createElement("p","","","houseSurroundingContainer",thisData[0]["houseSurrounding"],"");
    
    /* create house detail */
    app.createElement("p","houseDetailTitle","house_detail_title","houseDetailContainer","屋況說明","");
    app.createElement("p","","","houseDetailContainer",thisData[0]["houseDetail"],"");
    
    /* create house question */
    app.createElement("p","houseQuestionTitle","house_question_title","houseQuestionContainer","房屋問答","");
    if(!thisData[0]["houseQuestion"]){
        app.createElement("p","","","houseQuestionContainer","目前沒有問答","");
    }
    
    /* create house ask */
    app.createElement("p","houseAskTitle","house_ask_title","houseAskContainer","我要提問","");
    app.createElement("textarea","houseAsk","house_ask","houseAskContainer","","");
    app.createElement("p","houseAskBtn","house_ask_btn","houseAskContainer","確認送出","");
}

/* house right */
function createHouseRight(){
    createHouseInfo();
}

function createHouseInfo(){
   /* house info price  */ app.createElement("div","housePriceContainer","house_price_container","houseInfoContainer","","");
    app.createElement("span","housePrice","house_price","housePriceContainer",thisData[0]["price"],"");
    app.createElement("span","","","housePriceContainer","元/月","");
    
    let priceInclude = "含";
    for(key in thisData[0]["priceInclude"]){
        if(thisData[0]["priceInclude"][key]){
            priceInclude = priceInclude + key + "/";
        }
    }
    app.createElement("p","housePriceInclude","house_price_include","housePriceContainer",priceInclude,"");
    /* house info */
    app.createElement("ul","houseInfoLists","house_info_lists","houseInfoContainer","","");
    app.createElement("li","","house_info","houseInfoLists","坪數：" + thisData[0]["size"] + "坪","");
    app.createElement("li","","house_info","houseInfoLists","樓層：" + thisData[0]["houseFloor"] + "F/" + thisData[0]["totalFloor"] + "F","");
    app.createElement("li","","house_info","houseInfoLists","房間：" + thisData[0]["bedroom"] + "間","");
    app.createElement("li","","house_info","houseInfoLists","廁所：" + thisData[0]["restroom"] + "間","");
    app.createElement("li","","house_info","houseInfoLists","類型：" + thisData[0]["kindType"],"");
}

function createOwnerInfo(){
    /* owner name */
    app.createElement("div","owner","owner","ownerContainer","","");
    app.createElement("div","ownerPhoto","owner_photo","owner","","");
    let gender = "";
    if(getUser["gender"] === "male"){
        gender = "先生"
    }else if(getUser["gender"] === "female"){
        gender = "小姐"
    }
    let userName = getUser["userName"].substr(0,1) + gender
    app.createElement("p","ownerName","owner_name","owner",userName,"");
    /* owner phone */
    app.createElement("div","ownerPhoneContainer","owner_phone_container","ownerContainer","","");
     app.createElement("div","ownerPhoneImg","owner_phone_img","ownerPhoneContainer","","");
    
    app.createElement("p","ownerPhone","owner_phone","ownerPhoneContainer",getUser["phone"],"");
}
