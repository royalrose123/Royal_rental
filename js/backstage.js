
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

app.get("#houseSubmit").addEventListener("click", function(){
    let houseImages = [] 
    houseImgArr.map((img) => {
      houseImages.push(app.get("#houseImg" + img).getAttribute("src"));
    })
    console.log("houseImages")
    console.log(houseImages)
})