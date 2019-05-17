
createSelectorImg()
function createSelectorImg(){
    app.createElement("div", "displayHouseImg", "display_house_img", "houseImgContainer", "", "");
    app.createElement("div", "houseImgSelectorContainer", "house_img_selector_container", "houseImgContainer", "", "");
    for(i = 1; i <= 5; i++){
        app.createElement("div", "houseImgSelector" + i, "house_img_selector", "houseImgSelectorContainer", "", "");
        app.get("#houseImgSelector" + i).style.background = "url('../images/00" + i + ".jpeg') 50% / cover no-repeat";
        
    }

    let thisImg = app.get("#houseImgSelector1" ).style.background
    app.get("#displayHouseImg").style.background = thisImg;
    console.log(thisImg)
}