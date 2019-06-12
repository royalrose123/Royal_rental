var getData;
var thisData =[];
var thisPostId;
var firebaseData = database.ref("house")
firebaseData.on("value", function(snapshot){
    getData = snapshot.val();
    getThisArticle();
    setPostUserName();
    setThisArticle()
})

function getThisArticle(){
    thisPostId = new URL(document.location).searchParams.get("id");
    for(i = 0; i < getData.length; i++){
        if(getData[i]["postId"]  == thisPostId ){
            thisData.push(getData[i])
        }
    }
    console.log("thisData")
    console.log(thisData)
    setPostUserName()
}

function setPostUserName(){
    thisUserId = thisData[0]["postUserId"]
    let firebaseUser = database.ref("member/" + thisUserId)
    firebaseUser.on("value", function(snapshot){
        getUser= snapshot.val();
        app.get("#userName").value = getUser["userName"];
          app.get("#userName").className = "user_name disabled"
         app.get("#userName").setAttribute("disabled","");
    })
}

let thisDataImgArr = []; /* img name in the biggining  */
function setThisArticle(){
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

    /* set require */
    app.get("#requireDeposit").value = thisData[0]["require"]["押金"];
    app.get("#requireLeastPeriod").value = thisData[0]["require"]["最短租期"];
    app.get("#requireCook").value = thisData[0]["require"]["開伙"];
    app.get("#requirePet").value = thisData[0]["require"]["養寵物"];
    app.get("#requireIdentify").value = thisData[0]["require"]["身分要求"];
    app.get("#requireGender").value = thisData[0]["require"]["性別要求"];
    app.get("#houseSurrounding").value = thisData[0]["houseSurrounding"];
    app.get("#houseDetail").value = thisData[0]["houseDetail"];
    
    for(var key in thisData[0]["houseImg"]){
        thisDataImgArr.push(key);
    }

    for(let i = 0; i < thisDataImgArr.length; i++){
        app.createElement("div","houseImgContainer" + i, "house_img_container", "houseImgRight", "", "");
        app.createElement("div","houseImgCover" + i, "house_img_cover", "houseImgContainer" + i, "", "");
        app.createElement("img","houseImg" + i, "house_img", "houseImgContainer" + i, "", "");
        app.createElement("div","houseImgDelete" + i, "house_img_delete", "houseImgCover" + i, "x", app.edit.deleteImg);
        app.get("#houseImgDelete" + i).setAttribute("data-delete", i);
        app.get("#houseImgDelete" + i).setAttribute("data-img", thisDataImgArr[i]);
        app.get("#houseImg" + i).setAttribute('src', thisData[0]["houseImg"][thisDataImgArr[i]]);
        houseImgArr.push(thisDataImgArr[i]);
    }
}

/* select imgage */
// var uploadImgs = {};  /*  */
app.get("#uploadHouseImg").addEventListener("change", function(){
    readURL(this);
    // var file = this.files[0];
    // uploadImgs[currentImg] = file
})

/* support ID 10, Chrome 7 */
/* use FileReader to display images */
let currentImg = 0;
let houseImgArr = [];  /* all img name on display for now */ /* to set imgNo  */
let uploadImg = {};     /* img file need to upload to firebase storage  */
let uploadImgArr = []; /* img name need to upload to firebase storage  */
function readURL(input){
    let imgLength = app.get("#houseImgRight").children.length - 1;
    let lastImgNo = houseImgArr[houseImgArr.length - 1];
    if(!imgLength){
        currentImg = 0;
        houseImgArr = [];
    }else{
        lastImgNo = lastImgNo.split("_")[1]
        currentImg = Number(lastImgNo) + 1;
    }
    houseImgArr.push("house" + thisPostId + "_" + currentImg)
    uploadImgArr.push("house" + thisPostId + "_" + currentImg)
    uploadImg["house" + thisPostId + "_" + currentImg] = input.files[0];

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
    app.createElement("div","houseImgDelete" + newImg, "house_img_delete", "houseImgCover" + newImg, "x", app.edit.deleteImg)
    app.get("#houseImgDelete" + newImg).setAttribute("data-delete", newImg)
    app.get("#houseImgDelete" + newImg).setAttribute("data-img","house" + thisPostId + "_" +  newImg)
}

let deleteImgArr = []; /* same imgName need to delete from firebase storage first  */
app.edit.deleteImg = (e) => {
    let thisImgNo = e.target.getAttribute("data-delete")
    let thisImgName = e.target.getAttribute("data-img")
    let thisImg = app.get("#houseImgContainer" + thisImgNo)
    thisImg.remove() /* remove this img display */

    for(let i = 0; i < houseImgArr.length; i++){
        if(houseImgArr[i] == thisImgName){
          houseImgArr.splice(i, 1); 
        }
    }

    for(let i = 0; i < uploadImgArr.length; i++){
        if(uploadImgArr[i] == thisImgName){
        uploadImgArr.splice(i, 1);
        }
    }

    deleteImgArr.push(thisImgName)
    delete uploadImg[thisImgName];
    console.log(uploadImg)
}

/* set address to lat lag */
let addressData;
function addressToLatLng(address){
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address}, function(results, status){
        if(status === "OK"){
            localStorage.setItem("address",JSON.stringify(results[0])) 
        }
    })
}

let count = 0;
/* edit btn click */
let deleteFirebaseImg;
app.get("#houseEditConfirm").addEventListener("click", function(){
    let address = regionName.value + sectionName.value + streetName.value;
    addressToLatLng(address)

    deleteImgArr = deleteImgArr.filter(function(element, index, arr){
        return arr.indexOf(element) === index;
    });
    deleteFirebaseImg = thisDataImgArr.concat(deleteImgArr);
    deleteFirebaseImg = deleteFirebaseImg.filter(function(element, index, arr){
        return arr.indexOf(element) !== index;
    });
        
    for(let i = 0; i < deleteFirebaseImg.length; i++){
        storageRef.child("images/house" + thisPostId + "/" + deleteFirebaseImg[i]).delete(); 
        console.log("deleteFirebaseImg")
        console.log(deleteFirebaseImg)
        delete thisData[0]["houseImg"][deleteFirebaseImg[i]];
        if(i == deleteFirebaseImg.length - 1){
            console.log("刪完了")
        }
    }

    app.get("#alertBoxLayout").style.display = "flex";
    app.get("#alertBtn").style.display = "none";
    app.get("#alertIndex").innerHTML = "上傳中，請稍等。";

    if(uploadImgArr.length){
        uploadImgArr.map((img) => {
            let storageRef = storage.ref();
            let uploadToStorage = storageRef.child("images/" + "house" + thisPostId + "/" + img).put(uploadImg[img]);
    
        //     Listen for state changes, errors, and completion of the upload.
        uploadToStorage.on("state_changed",function(snapshot) {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(progress)
                switch(progress){
                    case 0:
                        break;
                    case 100:
                        break;
                }
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
        //                console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
        //                console.log('Upload is running');
                        break;
                }
            }, function(error) {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case 'storage/unauthorized':
                        console.log(error);
                        break;
                    case 'storage/canceled':
                         console.log(error);
                        break;
                    case 'storage/unknown':
                        console.log(error);
                        break;
                }
            }, function() {
                let pathReference = storageRef.child("images/" + "house" + thisPostId + "/" + img);
                pathReference.getDownloadURL().then(function(url) {
                    thisData[0]["houseImg"][img] = url;
                    count++;
                    if(count === uploadImgArr.length){
                        addressData = JSON.parse(localStorage.getItem("address"));
                        updateHouseData()
                        setTimeout(
                            function(){
                                window.location = "edit.html?id=" + thisPostId;
                            },3000);
                    }
                })
            })
        })
    }else{
        setTimeout(
            function(){
                addressData = JSON.parse(localStorage.getItem("address"));
                updateHouseData()
            },3000);
    }
})

function updateHouseData(){
    let kindTypeName;
    let kindType = document.getElementsByName("kindType");
    for(let i = 0; i < kindType.length; i++){
        if(kindType[i].checked){
            kindTypeName = kindType[i].value;
        }
    }
    
    let deviceObj = {};
    let device = document.getElementsByName("deviceCheck");
    for(let i = 0; i < device.length; i++){
        deviceObj[device[i].value] =  device[i].checked;
    }

    let othersObj = {};
    let others = document.getElementsByName("othersCheck");
    for(let i = 0; i < others.length; i++){
        othersObj[others[i].value] =  others[i].checked;
    }
    
    let priceIncludeObj = {};
    let priceInclude = document.getElementsByName("priceInclude");
    for(let i = 0; i < priceInclude.length; i++){
        priceIncludeObj[priceInclude[i].value] =  priceInclude[i].checked;
    }

    let requireObj = {};
    let require = document.getElementsByClassName("require")
    for(let i = 0; i < require.length; i++){
        if(!require[i].value){
            alert("請輸入" + require[i].name )
            return
        }
        requireObj[require[i].name] = require[i].value;
    }
    
    var dateObject = new Date();
    database.ref("house/" + thisPostId).update({
        title: title.value,
        regionName: regionName.value,
        sectionName: sectionName.value,
        streetName: streetName.value,
        price: Number(price.value),
        size: Number(size.value),
        bedroom: bedroom.value,
        restroom: restroom.value,
        livingroom: livingroom.value,
        houseFloor: houseFloor.value,
        totalFloor: totalFloor.value,
        kindType: kindTypeName,
        device: deviceObj,
        others: othersObj,
        priceInclude: priceIncludeObj,
        require: requireObj,
        houseImg: thisData[0]["houseImg"],
        houseSurrounding: houseSurrounding.value,
        houseDetail: houseDetail.value,
        address: addressData.formatted_address,
        latLng: addressData.geometry.location,
        lastUpdateTime: dateObject.getTime(),
    })

    app.get("#alertIndex").innerHTML = "修改成功";
    app.get("#alertBtn").style.display = "block";
    app.get("#alertBtn").onclick = function(){
        location.href= "edit.html?id=" + thisPostId;
    }

    setTimeout(
        function(){
            window.location = "edit.html?id=" + thisPostId;
            console.log(thisPostId)
        },3000);
}

