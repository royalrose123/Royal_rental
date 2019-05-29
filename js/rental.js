
var map;
function initMap() {
    map = new google.maps.Map(app.get('#map'), {
        center: {lat: 25.0526853, lng:121.5363705},
        zoom: 12
    });
}


/* firebase house data */
var getData;

var firebaseData = database.ref("house")
firebaseData.on("value", function(snapshot){
    getData = snapshot.val();
    getInitData();
    console.log(getData)
})

function getInitData(){
    
    app.createElement("div", "resultHouse", "result_house", "rentalRight", "", "")
    for(let i = 0; i < getData.length; i++){
        app.createElement("div", "houseCard" + i, "house_card", "resultHouse", "", "")
        app.get("#houseCard" + i).onclick = function(){
                location.href= "house.html?id=" + getData[i]["postId"]
        }
//        app.get("#articleContent"+i).setAttribute("href","house.html?id=" + getData[i]["postId"]);
        app.createElement("div", "houseImg" + i, "house_img", "houseCard" + i, "", "")
        app.get("#houseImg" + i).style.background = "url('" + getData[i]["houseImg"][0] + "')50% / cover no-repeat"
        app.createElement("div", "houseDetail" + i, "house_detail", "houseCard" + i, "", "")  
        app.createElement("div", "priceIcons" + i, "price_icons", "houseDetail" + i, "", "")
        app.createElement("p", "price" + i, "price", "priceIcons" + i, getData[i]["price"], "")
        app.createElement("p", "", "", "houseDetail" + i, getData[i]["bedroom"] + "間房間, " + getData[i]["restroom"] + "間廁所, " + getData[i]["kindType"], "")
        app.createElement("p", "", "", "houseDetail" + i, getData[i]["section_name"], "")
    }
}

/* price filter */
let leftMoney = app.get("#moneyLeft");
leftMoney.textContent = 0;
let RightMoney = app.get("#moneyRight");
RightMoney.textContent = 10000;

var dragItem;
var container = app.get("#rental");
var leftCirle = app.get("#circleLeft")
var rightCirle = app.get("#circleRight")
var active = false;
var currentX;
var currentY;
var initialX;
var initialY;
var leftOffsetX = 0;
var rightOffsetX = 0;
var currentCircle;
var xOffset = 0;
var yOffset = 0;

container.addEventListener("touchstart", dragStart, false);
container.addEventListener("touchend", dragEnd, false);
container.addEventListener("touchmove", drag, false);

container.addEventListener("mousedown", dragStart, false);
container.addEventListener("mouseup", dragEnd, false);
// container.addEventListener("mouseleave", dragEnd, false);
container.addEventListener("mousemove", drag, false);

function dragStart(e) {
    // console.log(app.get("#bottomLine"))
    if(e.target.id === "circleLeft"){
        dragItem = app.get("#" + e.target.id)
        xOffset = leftOffsetX;
        currentCircle = e.target.id
    }
    if(e.target.id === "circleRight"){
        dragItem = app.get("#" + e.target.id)
        xOffset = rightOffsetX;
        currentCircle = e.target.id     
    }

    if (e.type === "touchstart") {
    initialX = e.touches[0].clientX - xOffset;
    } else {
    initialX = e.clientX - xOffset;
    }

    if (e.target === dragItem) {
    active = true;
    }
    setMoneyRange(e)
}

function dragEnd(e) {
    active = false;
}
                      
function drag(e) {
    if (active) {
    
    e.preventDefault();
    
    if (e.type === "touchmove") {
        currentX = e.touches[0].clientX - initialX;
        currentY = initialY;
    } else {
        currentX = e.clientX - initialX;
    }
    
    
    xOffset = currentX;
    if(currentCircle === "circleLeft"){
        leftOffsetX = xOffset;
        // console.log(e.target);
    }
    if(currentCircle === "circleRight"){
        rightOffsetX = xOffset;
    }
    
    setTranslate(currentX, 0, dragItem);
    setMoneyRange(e)
    }
    
    let rangeWidth = rightCirle.getBoundingClientRect().x - leftCirle.getBoundingClientRect().x + 16
    // console.log(rangeWidth)
    app.get("#rangeLine").style.width = rangeWidth + "px";
    app.get("#rangeLine").style.left = leftCirle.getBoundingClientRect().x - 963 + "px";
//    console.log(app.get("#circleLeft").getBoundingClientRect())
    // console.log()
}

function setTranslate(xPos, yPos, el) {
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}

function setMoneyRange(e){
    // console.log(e.clientX)
}


