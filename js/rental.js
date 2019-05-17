
var map;
function initMap() {
    map = new google.maps.Map(app.get('#map'), {
        center: {lat: 25.0526853, lng:121.5363705},
        zoom: 12
    });
}

// getRentalFilter()
// function getRentalFilter(){
    
//     app.get("#bottomLine").style.width = "100%";
//     let bottomWidth = app.get("#bottomLine").offsetWidth
//     let rangeWidth = app.get("#rangeLine").offsetWidth
//     let rightCircle = rangeWidth / bottomWidth * 100000
//     // maxMoney = 
//     console.log("bottomLine = " + bottomWidth );
//     console.log("rangeLine = " + rangeWidth );

//     let circleLeft = app.get("#circleLeft")
//     circleLeft.addEventListener("mousedown",focus)
//     circleLeft.addEventListener("mousemove",drag)
//     circleLeft.addEventListener("mouseup",unfocus)
//     circleLeft.addEventListener("mouseleave",unfocus)

//     let leftMoney = app.get("#moneyLeft");
//     leftMoney.textContent = 0;
//     let RightMoney = app.get("#moneyRight");
//     RightMoney.textContent = rightCircle;


//     let isDown = false;
//     function focus(e){
//         isDown = true;
//         console.log("down")
//         console.log(e.offsetX)
//         console.log(e.screenX)
//     }

//     function unfocus(){
//         isDown = false;
//         console.log("up")
//     }

//     function drag(e){
//         if(!isDown) return;
//         e.offsetX += e.movementX;
        
//     }
// }

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
    console.log(app.get("#circleLeft").getBoundingClientRect())
    // console.log()
}

function setTranslate(xPos, yPos, el) {
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}

function setMoneyRange(e){
    // console.log(e.clientX)
}


