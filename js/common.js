createNav()
function createNav(){
    app.createElement("div", "navLeft", "nav_left", "nav", "", "");
    app.createElement("div", "navLogo", "nav_logo", "navLeft", "", "");
    app.createElement("p", "navTitle", "nav_title", "navLeft", "Royal Rental", "");
    app.createElement("input", "navSearch", "nav_search", "navLeft", "", "");
    app.get("#navSearch").setAttribute("placeholder","請問想住哪呢?")
    app.createElement("div", "navRight", "nav_right", "nav", "", "");
    app.createElement("ul", "navList", "nav_list", "nav", "", "");
    app.createElement("li", "rentalBtn", "nav_item", "navList", "找房", "");
    app.createElement("li", "memberBtn", "nav_item", "navList", "會員", "");
    app.createElement("li", "loginBtn", "nav_item", "navList", "登入", "");
    app.createElement("div", "navFavBtn", "nav_fav_btn", "navRight", "", "");
    app.createElement("div", "navFavImg", "nav_fav_img", "navFavBtn", "", "");
    app.createElement("p", "favBtnTitle", "nav_fav_title", "navFavBtn", "我的最愛", "");
}