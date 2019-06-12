var map;
function initMap() {
    map = new google.maps.Map(app.get('#map'), {
        center: {lat: 25.0244465, lng:121.5459541},
        zoom: 14,
        
    });
    
    /* get current location */
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log(position)
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setZoom(15);
            map.setCenter(pos);
        });
    }
    
//    var mapOptions = {
//        zoom: 4,
//        minZoom: 3,
//        maxZoom: 12,
//    };
    
}


/* firebase house data */
var getData;

var firebaseData = database.ref("house")
firebaseData.on("value", function(snapshot){
    getData = snapshot.val();
    console.log("before getData");
    console.log(getData)
    getData = getData.filter(test => test)
    console.log("after getData");
    console.log(getData)
    getInitData();
    setMarkOnMap(getData);
    createrRoomFilter();
    createKindTypeFilter();
})

var marker;
var markers = [];
function setMarkOnMap(addressData){
    // console.log("addressData")
    // console.log(addressData)
    
    for(let i = 0; i < addressData.length; i++){
        var marker = new google.maps.Marker({
            position: addressData[i]["latLng"],	//marker的放置位置
            map: map, //這邊的map指的是第四行的map變數
            title: addressData[i]["title"],
            icon: "../images/company.png",
            // styles: [{ height: 20,
            //             width: 20
            //         }],
        });  
        markers.push(marker)
    }
    
    console.log("markers")
    console.log(markers)
    
    var markerCluster = new MarkerClusterer(map, markers,{
        gridSize: 180,
        maxZoom: 16,
//        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
        styles: [{
                    url: "../images/circle.png", // 可以自訂圖案
                    height: 40,
                    width: 40,
                    anchor: [0, 0],    // 文字出現在標記上的哪個位置 (position on marker)
                    textColor: 'red',
                    textSize: 16,
//                    zIndex: 9000,
                    textAlign: "center",
                    backgroundPosition: "center",
//                    borderRadius: "50%",
                    backgroundSize: "center",
                    backgroundRepeat: "no-repeat"
                    
                }],
              
        });    
}

let thisSinglePost;
function getInitData(){
    app.createElement("div", "resultHouse", "result_house", "rentalHouseContainer", "", "");
    for(let i = 0; i < getData.length; i++){
        app.createElement("div", "houseCard" + i, "house_card", "resultHouse", "", "");
        app.get("#houseCard" + i).onclick = function(){
            thisSinglePost = getData[i];
            console.log(thisSinglePost)
//                location.href= "house.html?id=" + getData[i]["postId"];
            createSingleHouse(thisSinglePost)
        }
        app.createElement("div", "houseImg" + i, "house_img", "houseCard" + i, "", "");

        let postCover;
        for(var key in getData[i]["houseImg"]){
            postCover = key;
            break;
        }
        app.get("#houseImg" + i).style.background = "url('" + getData[i]["houseImg"][postCover] + "')50% / cover no-repeat";
        app.createElement("div", "houseDetail" + i, "house_detail", "houseCard" + i, "", "");
        app.createElement("div", "priceIcons" + i, "price_icons", "houseDetail" + i, "", "")
        app.createElement("p", "price" + i, "price", "priceIcons" + i, setThousandDigit(getData[i]["price"]), "");
        app.createElement("p", "", "", "houseDetail" + i, getData[i]["bedroom"] + "間房間, " + getData[i]["restroom"] + "間廁所, " + getData[i]["kindType"], "");
        app.createElement("p", "", "", "houseDetail" + i, getData[i]["section_name"], "");
    }
    app.get("#resultTitle").innerHTML = getData.length + "筆結果";
}


/* create single house */
let originalDot = 0;
let singlePostImgArr = [];
function createSingleHouse(thisPost){
    app.get("#rentalHouseContainer").style.display = "none";
    app.createElement("div", "rentalSingleHouse", "rental_single_house", "rentalRight", "", "");
    app.createElement("div", "btnContainer", "btn_container", "rentalSingleHouse", "", "");
    app.createElement("div", "backBtn", "back_btn", "btnContainer", "", "");
    app.createElement("div", "", "", "backBtn", "返回搜尋結果", "");
    app.get("#backBtn").onclick = function(){
        app.get("#rentalHouseContainer").style.display = "block";
        let thisSinglePage = app.get("#rentalSingleHouse");
        thisSinglePage.parentNode.removeChild(thisSinglePage);
    }
    app.createElement("div", "favBtn", "fav_btn", "btnContainer", "", "");
    app.createElement("div", "favImg", "fav_img", "favBtn", "", "");
    app.createElement("div", "", "", "favBtn", "收藏", "");
    
    /* single house img */
    app.createElement("div", "singleHouseImgContainer", "single_house_img_container", "rentalSingleHouse", "", "");
    app.createElement("div", "singleHouseImg", "single_house_img", "singleHouseImgContainer", "", "");

    
    for(var key in thisPost["houseImg"]){
        singlePostImgArr.push(key);
    }
    app.get("#singleHouseImg").style.background = "url('" + thisPost["houseImg"][singlePostImgArr[0]] + "')50% / cover no-repeat";
    app.get("#singleHouseImg").setAttribute("data-img", 0)
    /* single house slide */
    app.createElement("div", "SingleLeftContainer", "single_left_container", "singleHouseImg", "", app.rental.singlePostSlideLeft);
    app.createElement("div", "SingleLeft", "single_left", "SingleLeftContainer", "", "");
    app.createElement("div", "SingleRightContainer", "single_right_container", "singleHouseImg", "", app.rental.singlePostSlideRight);
    app.createElement("div", "SingleRight", "single_right", "SingleRightContainer", "", "");
    
    /* single house dot selector*/
    app.createElement("div", "dotSelector", "dot_selector", "singleHouseImgContainer", "", "");
    for(let i = 0; i < 5; i++){
        app.createElement("button", "dot" + i, "dot", "dotSelector", "", app.rental.singlePostDotClick);
        app.get("#dot" + i).setAttribute("data-order", i)
    }
    app.get("#dot0").className = "dot active";
    originalDot = 0;
    
    app.createElement("div", "singlePriceAddress", "single_price_address", "rentalSingleHouse", "", "");
    app.createElement("p", "singlePrice", "single_price", "singlePriceAddress", setThousandDigit(thisPost["price"]), "");
    app.createElement("div", "separateLine", "separate_line", "singlePriceAddress", "", "");
    app.createElement("div", "singleAddress", "single_address", "singlePriceAddress", "", "");
    app.createElement("p", "singleDist", "single_dist", "singleAddress", thisPost["regionName"] + thisPost["sectionName"], "");
    app.createElement("p", "singleStreet", "single_street", "singleAddress", thisPost["address"], "");
    
    app.createElement("div", "", "single_house_title", "rentalSingleHouse", "屋況說明", "");
    app.createElement("div", "singleDetail", "single_house_content", "rentalSingleHouse", thisPost["houseDetail"], "");
    
    app.createElement("div", "", "single_house_title", "rentalSingleHouse", "生活周遭", "");
    app.createElement("div", "singleSurrounding", "single_house_content", "rentalSingleHouse", thisPost["houseSurrounding"], "");
    
    app.createElement("div", "", "single_house_title", "rentalSingleHouse", "房屋設備", "");
    app.createElement("div", "singleDeviceContainer", "single_device_container", "rentalSingleHouse", "", "");
    
    let count = 0;
    /* create single device */
    for(key in thisPost["device"]){
        if(thisPost["device"][key]){
            app.createElement("p","","single_device","singleDeviceContainer",key,"");
        }
        count++;
    }
    app.createElement("div", "", "single_house_title", "rentalSingleHouse", "其他設備", "");
    app.createElement("div", "singleOthersContainer", "single_others_container", "rentalSingleHouse", "", "");
    
    /* create single others */
    let isOthersEmpty = true;
    for(key in thisPost["others"]){
        if(thisPost["others"][key]){
            app.createElement("p","","single_others","singleOthersContainer",key,"");
            isOthersEmpty = false;
        }
        count++;
    }
    if(isOthersEmpty){app.createElement("div","","","singleOthersContainer","無","");}
    
    /* more single house info */ 
    app.createElement("div", "singleHouseMore", "single_house_more", "rentalSingleHouse", "", "");
    app.createElement("p", "", "", "singleHouseMore", "更多細資訊", "");
    app.get("#singleHouseMore").onclick = function(){
                location.href= "house.html?id=" + thisPost["postId"];
    }
}


/* single post img slide */
let currentDot;
app.rental.singlePostSlideLeft = (e) => {
    currentDot = app.get("#singleHouseImg").getAttribute("data-img")
    currentDot--;
    if(currentDot < 0){
        currentDot = 4;
    }

    app.get("#singleHouseImg").style.background = "url('" + thisSinglePost["houseImg"][singlePostImgArr[currentDot]] + "')50% / cover no-repeat";
    app.get("#singleHouseImg").setAttribute("data-img", currentDot)
    app.get("#dot" + currentDot).className = "dot active"
    app.get("#dot" + originalDot).classList.remove("active")
    originalDot = currentDot;
}

app.rental.singlePostSlideRight = (e) => {
    currentDot = app.get("#singleHouseImg").getAttribute("data-img")
    currentDot++;
    if(currentDot > 4){
        currentDot = 0;
    }
    app.get("#singleHouseImg").style.background = "url('" + thisSinglePost["houseImg"][singlePostImgArr[currentDot]] + "')50% / cover no-repeat";
    app.get("#singleHouseImg").setAttribute("data-img", currentDot)
    app.get("#dot" + currentDot).className = "dot active"
    app.get("#dot" + originalDot).classList.remove("active")
    originalDot = currentDot;
}

app.rental.singlePostDotClick = (e) => {
    console.log(e.target)
    currentDot = e.target.getAttribute("data-order")
    app.get("#singleHouseImg").style.background = "url('" + thisSinglePost["houseImg"][singlePostImgArr[currentDot]] + "')50% / cover no-repeat";
    app.get("#singleHouseImg").setAttribute("data-img", currentDot)
    
    app.get("#dot" + currentDot).className = "dot active"
    app.get("#dot" + originalDot).classList.remove("active")
    originalDot = currentDot;
}

function removeResult(){
    let resultHouse = app.get("#resultHouse");
    resultHouse.parentNode.removeChild(resultHouse)
}

function createFilterResult(filterData){
    app.createElement("div", "resultHouse", "result_house", "rentalHouseContainer", "", "")
    for(let i = 0; i < filterData.length; i++){
        app.createElement("div", "houseCard" + i, "house_card", "resultHouse", "", "")
        app.get("#houseCard" + i).onclick = function(){
            thisSinglePost = filterData[i];
            createSingleHouse(thisSinglePost)
        }

        
        app.createElement("div", "houseImg" + i, "house_img", "houseCard" + i, "", "")
        let postCover;
        for(var key in filterData[i]["houseImg"]){
            postCover = key;
            break;
        }
        app.get("#houseImg" + i).style.background = "url('" + filterData[i]["houseImg"][postCover] + "')50% / cover no-repeat"
        app.createElement("div", "houseDetail" + i, "house_detail", "houseCard" + i, "", "")  
        app.createElement("div", "priceIcons" + i, "price_icons", "houseDetail" + i, "", "")
        app.createElement("p", "price" + i, "price", "priceIcons" + i, setThousandDigit(filterData[i]["price"]), "")
        app.createElement("p", "", "", "houseDetail" + i, filterData[i]["bedroom"] + "間房間, " + filterData[i]["restroom"] + "間廁所, " + filterData[i]["kindType"], "")
        app.createElement("p", "", "", "houseDetail" + i, filterData[i]["section_name"], "")
    }
    app.get("#resultTitle").innerHTML = filterData.length + "筆結果";
}

/* price filter */
let priceFilterData;
function getPriceFilterData(){
    let leftPrice = Number(moneyLeft.textContent);
    let rightPrice = Number(moneyRight.textContent);
    priceFilterData = []
    firebaseData.orderByChild("price").startAt(leftPrice).endAt(rightPrice).on("child_added", function(snapshot) {
        priceFilterData.push(snapshot.val());
    })
}

/* room amount filter */
function createrRoomFilter(){
    app.createElement("div", "roomAmountFilter", "filter_type", "rentalFilter", "", "");
    app.createElement("p", "", "filter_title", "roomAmountFilter", "房間數量", "");
    app.createElement("div", "roomFilterDetail", "filter_detail", "roomAmountFilter", "", "");
    for(let i = 1; i <= 4; i++){
        app.createElement("p", "", "room_amount", "roomFilterDetail", i, app.rental.roomFilter);
    }
}

let roomFilter = [];
app.rental.roomFilter = (e) => {
    let roomAmount = e.target.innerHTML;
    if(e.target.className === "room_amount"){
        e.target.classList.add('active')
        roomFilter.push(roomAmount);
        roomFilter.sort();
    }else{
        e.target.classList.remove('active')
        roomFilter = roomFilter.filter(function (value) {
            return value !== roomAmount;
        });
    }
    removeResult()
    getPriceFilterData()
    getFilterData()
}

/* kind type filter */
function createKindTypeFilter(){
    app.createElement("div", "kindFilter", "filter_type", "rentalFilter", "", "");
    app.createElement("p", "", "filter_title", "kindFilter", "房屋類型", "");
    app.createElement("div", "kindFilterDetail", "filter_detail", "kindFilter", "", "");
    app.createElement("p", "", "room_kind", "kindFilterDetail", "雅房", app.rental.kindTypeFilter);
    app.createElement("p", "", "room_kind", "kindFilterDetail", "獨立套房", app.rental.kindTypeFilter);
    app.createElement("p", "", "room_kind", "kindFilterDetail", "整層住家", app.rental.kindTypeFilter);
}

let kindFilter = [];
app.rental.kindTypeFilter = (e) => {
    let kindType = e.target.innerHTML;
//    filterResult = [];
    if(e.target.className === "room_kind"){
        e.target.classList.add('active')
        kindFilter.push(kindType);
        kindFilter.sort();
    }else{
        e.target.classList.remove('active')
        kindFilter = kindFilter.filter(function (value) {
            return value !== kindType;
        });
    }
    removeResult()
    getPriceFilterData()
    getFilterData()
}

function getFilterData(){
    let allFilter = {
        bedroom: roomFilter,
        kindType: kindFilter,
    }
    
    function multiFilter(array, filters) {
        const filterKeys = Object.keys(filters);
        // filters all elements passing the criteria
        return array.filter((item) => {
            // dynamically validate all filter criteria
            return filterKeys.every(key => {
                //ignore when the filter is empty Anne
                if(!filters[key].length) return true
                return !!~filters[key].indexOf(item[key])
            })
        })
    }
    let allFilterResult = multiFilter(priceFilterData, allFilter);
    
    /* delete repeat data */
    let set = new Set();
    allFilterResult = allFilterResult.filter(item => !set.has(item.postId) ? set.add(item.postId) : false);
    
    createFilterResult(allFilterResult);
    let filterArr = Object.keys(allFilter);
    function isEmptyObject(obj, arr) {
        for(i = 0; i < arr.length; i++){
            if(obj[arr[i]].length){
                
                return false;
            }
        }
        return true;
    }
    
    if(isEmptyObject(allFilter, filterArr)){
        removeResult();
        getPriceFilterData();
        createFilterResult(priceFilterData);
        app.get("#resultTitle").innerHTML = priceFilterData.length + "筆結果";
    }
}

/* price filter */
let leftMoney = app.get("#moneyLeft");
leftMoney.textContent = 0;
let rightMoney = app.get("#moneyRight");
rightMoney.textContent = 100000;

var dragItem;
var container = app.get("#rental");
var leftCirle = app.get("#circleLeft");
var rightCirle = app.get("#circleRight");
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
}

function dragEnd(e) {
    if(e.target.id === "circleLeft"){
        active = false;
        removeResult()
        getPriceFilterData();
        getFilterData()
    }
    if(e.target.id === "circleRight"){
        active = false;
        removeResult()
        getPriceFilterData();
        getFilterData()
    }
}

function drag(e) {  
    if (active) {
        e.preventDefault();
        let bottomWidth = app.get("#bottomLine").getBoundingClientRect().width

        let maxLeft = app.get("#bottomLine")
        let maxLeftCircle = maxLeft.getBoundingClientRect().left+document.documentElement.scrollLeft; 
        let rangeWidth = rightCirle.getBoundingClientRect().x - leftCirle.getBoundingClientRect().x + 8;
        let nowLeftCircle = leftCirle.getBoundingClientRect().left+document.documentElement.scrollLeft; 
        let nowRightCircle = nowLeftCircle + rangeWidth;
        

        if (e.type === "touchmove") {
            currentX = e.touches[0].clientX - initialX;
            currentY = initialY;
        } else {
            currentX = e.clientX - initialX;
        }
        
        xOffset = currentX;
        if(currentCircle === "circleLeft"){
            let limit = nowRightCircle - nowLeftCircle
            if(currentX <= -8){
                currentX = 0;
            }
            
            leftOffsetX = xOffset;
            leftMoney.textContent = Math.round(currentX * ((bottomWidth - 48) / 50000) * 100) * 500;
        }
        
        if(currentCircle === "circleRight"){
            if(currentX >= 8){
                currentX = 0;
            }
            rightOffsetX = xOffset;
            rightMoney.textContent = Math.round(currentX * ((bottomWidth - 48) / 50000) * 100) * 500 +100000;;
        }
        
        setTranslate(currentX, 0, dragItem);
        app.get("#rangeLine").style.width = rangeWidth + "px";
        app.get("#rangeLine").style.left = leftCirle.getBoundingClientRect().x - maxLeftCircle + "px";
    }
}

function setTranslate(xPos, yPos, el) {
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}



