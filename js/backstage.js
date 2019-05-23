var getData;
firebaseData = database.ref()
firebaseData.on('value', function(snapshot) {
    getData = snapshot.val();
    houseSubmit();
});

/* select imgage */
app.get("#uploadHouseImg").addEventListener("change", function(){
    readURL(this);
    
})

/* support ID 10, Chrome 7 */
/* use FileReader to display images */
let currentImg = 0;
let houseImgArr = []
function readURL(input){
    let imgLength = app.get("#houseImgRight").children.length - 1
    if(!imgLength){
        currentImg = 0;
        houseImgArr = [];
    }else{
        let lastImg = app.get("#houseImgRight").children[imgLength]
        lastImgNo = lastImg.getAttribute("data-no")
        currentImg = Number(lastImgNo) + 1
    }
    houseImgArr.push(currentImg)
    createImg(currentImg)
    if(input.files && input.files[0]){
        var reader = new FileReader();
        reader.onload = function (e){
            app.get("#houseImg" + currentImg).setAttribute('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function createImg(newImg){
    app.createElement("div","houseImgContainer" + newImg, "house_img_container", "houseImgRight", "", "")
    app.createElement("div","houseImgCover" + newImg, "house_img_cover", "houseImgContainer" + newImg, "", "")
    app.createElement("img","houseImg" + newImg, "house_img", "houseImgContainer" + newImg, "", "")
    app.createElement("div","houseImgDelete" + newImg, "house_img_delete", "houseImgCover" + newImg, "x", app.backstage.deleteImg)
    app.get("#houseImgContainer" + newImg).setAttribute("data-no", newImg)
    app.get("#houseImgDelete" + newImg).setAttribute("data-delete", newImg)
}

app.backstage.deleteImg = (e) => {
    let thisImgNo = e.target.getAttribute("data-delete")
    let thisImg = app.get("#houseImgContainer" + thisImgNo)
    thisImg.remove()
    for(i = 0; i < houseImgArr.length; i++){
        if(houseImgArr[i] == thisImgNo){
          houseImgArr.splice(i, 1)
        }
    }
}

/* house submit */
function houseSubmit(){
    app.get("#houseSubmit").addEventListener("click", function(){
        let houseImages = [] 
        houseImgArr.map((img) => {
          houseImages.push(app.get("#houseImg" + img).getAttribute("src"));
        })
        if(houseImages.length === 0){
//            alert("請選擇照片")
//            return
        }
//        if(!getData[0]["houseImg"]){
//            getData[0]["houseImg"] = []
//        }
        
        let kindTypeName;
        let kindType = document.getElementsByName("kindType")
        for(let i = 0; i < kindType.length; i++){
            if(kindType[i].checked){
                 kindTypeName = kindType[i].value
            }
        }
        
        let deviceObj = {}
        let device = document.getElementsByName("deviceCheck")
        for(i = 0; i < device.length; i++){
            deviceObj[device[i].value] =  device[i].checked
        }
        
        let othersObj = {}
        let others = document.getElementsByName("othersCheck")
        for(i = 0; i < others.length; i++){
            othersObj[others[i].value] =  others[i].checked
        }
        
        let requireObj = {}
        let require = document.getElementsByClassName("require")
        for(i = 0; i < require.length; i++){
            if(!require[i].value){
//                alert("請輸入" + require[i].name )
//                return
            }
            requireObj[require[i].name] = require[i].value
        }
        
        var dateObject = new Date();
        
        let prevPostId;
        let thisPostId;
        if(!getData){
            thisPostId = 0;
        }else{
            prevPostId = getData[getData.length - 1]["postId"]
            thisPostId = Number(prevPostId) + 1;
        }
        console.log(prevPostId)
        
        
        database.ref(thisPostId).update({
            title: title.value,
            userId: userId.value,
            postId: thisPostId,
            regionName: regionName.value,
            sectionName: sectionName.value,
            streetName: streetName.value,
            price: price.value,
            size: size.value,
            bedroom: bedroom.value,
            restroom: restroom.value,
            livingroom: livingroom.value,
            houseFloor: houseFloor.value,
            totalFloor: houseFloor.value,
            kindType: kindTypeName,
            device: deviceObj,
            others: othersObj,
            require: requireObj,
            houseImg: houseImages,
            houseSurrounding: houseSurrounding.value,
            houseDetail: houseDetail.value,
            userId: userId.value,
            userName: userId.value,
            address: regionName.value + sectionName.value + streetName.value,
            createTime: dateObject.getTime(),
            lastUpdateTime: dateObject.getTime(),
            houseQuestion: []
        })
        
    })
}
