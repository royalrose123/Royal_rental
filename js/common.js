/* create nav */
createNav()
function createNav(){
    app.createElement("div", "navLeft", "nav_left", "nav", "", "");
    app.createElement("div", "navLogo", "nav_logo", "navLeft", "", "");
    app.createElement("p", "navTitle", "nav_title", "navLeft", "Royal Rental", "");
    app.createElement("input", "navSearch", "nav_search", "navLeft", "", "");
    app.get("#navSearch").setAttribute("placeholder","請問想住哪呢?")
    app.createElement("div", "navRight", "nav_right", "nav", "", "");
    app.createElement("ul", "navList", "nav_list", "navRight", "", "");
    app.createElement("li", "navClose", "nav_close", "navList", "x", "");
    app.createElement("li", "rentalBtn", "nav_btn", "navList", "找房", "");
    app.createElement("li", "postBtn", "nav_btn", "navList", "刊登", "");
    app.createElement("li", "memberBtn", "nav_btn", "navList", "會員", "");
    app.createElement("li", "loginBtn", "nav_btn", "navList", "登入", "");
    app.createElement("div", "navFavBtn", "nav_fav_btn", "navRight", "", "");
    app.createElement("div", "navFavImg", "nav_fav_img", "navFavBtn", "", "");
    app.createElement("p", "favBtnTitle", "nav_fav_title", "navFavBtn", "我的最愛", "");
    app.createElement("i", "navBtn", "fas fa-bars", "navRight", "", "");
    
    app.get("#memberBtn").onclick = function(){
        location.href= './member.html'
    }
    
    app.get("#postBtn").onclick = function(){
        location.href= './backstage.html'
    }
    
    app.get("#navBtn").addEventListener("click",function(){
        app.get("#navList").style.display = "inline-block"
    })
    
    app.get("#navClose").addEventListener("click",function(){
        app.get("#navList").style.display = "none"
    })
}

