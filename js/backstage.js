var getData;
firebaseData = database.ref("house")
firebaseData.on('value', function(snapshot) {
    getData = snapshot.val();
    houseSubmit();
    console.log("getData")
    console.log(getData)
});

var getUser;
var thisUser;
var thisUserId;
firebase.auth().onAuthStateChanged(function(user){ 
    if(user){
        thisUser = user;
        thisUserId = user.uid;
    }

    var firebaseUser = database.ref("member/" + thisUserId)
    firebaseUser.once("value", function(snapshot){
        getUser = snapshot.val();
        checkMemberData()
        setMemberData();
    })
})

function checkMemberData(){
    if(!getUser["gender"]){
        app.get("#alertBoxLayout").style.display = "flex";
        app.get("#alertIndex").innerHTML = "請先填寫會員資料。";
        app.get("#alertBtn").style.display = "block";
        app.get("#alertBtn").onclick = function(){
            window.location = "member.html";
        }
    }
}

/* select imgage */
var uploadImgs = {};
app.get("#uploadHouseImg").addEventListener("change", function(){
    readURL(this);
    var file = this.files[0];
    uploadImgs[currentImg] = file
})

/* support ID 10, Chrome 7 */
/* use FileReader to display images */
let currentImg = 0;
let houseImgArr = [];
let uploadImgArr = {};
let imgLength;
function readURL(input){
    imgLength = app.get("#houseImgRight").children.length - 1
    if(!imgLength){
        currentImg = 0;
        houseImgArr = [];
    }else{
        let lastImg = app.get("#houseImgRight").children[imgLength]
        lastImgNo = lastImg.getAttribute("data-no")
        currentImg = Number(lastImgNo) + 1;
    }
    houseImgArr.push(currentImg)
    uploadImgArr[currentImg] = input.files[0]; /* firebase img arr*/
    console.log(uploadImgArr);
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
    for(let i = 0; i < houseImgArr.length; i++){
        if(houseImgArr[i] == thisImgNo){
          houseImgArr.splice(i, 1)
        }
    }
    delete uploadImgArr[thisImgNo];
}

function setMemberData(){
    app.get("#userName").value = getUser["userName"];
    app.get("#userName").className = "user_name disabled"
    app.get("#userName").setAttribute("disabled","");
}

/* set address to lat lag */
let addressData;
function addressToLatLng(address){
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address}, function(results, status){
        if(status === "OK"){
            console.log("status")
            console.log(status)
            localStorage.setItem("address",JSON.stringify(results[0])) 
        }
    })
}

/* house submit */
let prevPostId;
let thisPostId;
let uploadTask;
let houseImages = [] ;
let getFirebaseURL = [];
let count = 0;

function houseSubmit(){

    app.get("#houseSubmit").addEventListener("click", function(){
        let address = regionName.value + sectionName.value + streetName.value;
        addressToLatLng(address)
        
        if(!getData){
            thisPostId = 0;
        }else{
            prevPostId = getData[getData.length - 1]["postId"]
            thisPostId = Number(prevPostId) + 1;
        }

        houseImgArr.map((img, i) => {
            let thisImgUrl = app.get("#houseImg" + img).src;
            houseImages.push(thisImgUrl);
            
            let storageRef = storage.ref();
            let uploadImg = storageRef.child("images/house" + thisPostId + "_" + i).put(uploadImgArr[img]);

        //     Listen for state changes, errors, and completion of the upload.
            uploadImg.on("state_changed",function(snapshot) {
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
                let pathReference = storageRef.child("images/house" + thisPostId + "_" + i);
                pathReference.getDownloadURL().then(function(url) {
                    getFirebaseURL.push(url);
                    count++;
                    if(count === houseImgArr.length){
                        addressData = JSON.parse(localStorage.getItem("address"));
                        setHouseData();
                    }
                })
            })
            app.get("#alertBoxLayout").style.display = "flex";
            app.get("#alertBtn").style.display = "none";
            app.get("#alertIndex").innerHTML = "上傳中，請稍等。";
        })
    }) 
//        setTimeout(function(){window.location = "rental.html";},3000);
}

function setHouseData(){
//    console.log("thisPostId");
//    console.log(thisPostId);
    console.log("houseImages")
    console.log(houseImages)
    let kindTypeName;
    let kindType = document.getElementsByName("kindType");
    for(let i = 0; i < kindType.length; i++){
        if(kindType[i].checked){
            kindTypeName = kindType[i].value;
        }
    }
    if(!kindTypeName){
        app.get("#alertBoxLayout").style.display = "flex";
        app.get("#alertIndex").innerHTML = "請選擇類型";
        return
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
        postId: thisPostId,
        postUserId: getUser["userId"],
        postUserPhone: getUser["phone"],
        postUserName: getUser["userName"],
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
        houseImg: getFirebaseURL,
        houseSurrounding: houseSurrounding.value,
        houseDetail: houseDetail.value,
        address: addressData.formatted_address,
        latLng: addressData.geometry.location,
        createTime: dateObject.getTime(),
        lastUpdateTime: dateObject.getTime(),
        houseQuestion: []
    })

    let preUserPost = getUser["userPost"];
    if(!preUserPost){
        preUserPost = [];
        preUserPost.push(thisPostId);
    }else{
        preUserPost.push(thisPostId);
    }

    database.ref("member/" + thisUserId).update({
        userPost: preUserPost,
    })
//    uploadImg()
    app.get("#alertIndex").innerHTML = "刊登成功";
    app.get("#alertBtn").style.display = "block";
    app.get("#alertBtn").onclick = function(){
        window.location = "rental.html";
    }
}
