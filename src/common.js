let checkUser;
firebase.auth().onAuthStateChanged((user) => {
  checkUser = user;
  if (checkUser) {
    if (checkUser.emailVerified) {
      console.log("已驗證")
      app.get('#loginBtn').style.display = 'none';
      app.get('#memberBtn').style.display = 'block';
    
  } else {
    console.log("未驗證")

    app.get('#loginBtn').style.display = 'block';
    app.get('#memberBtn').style.display = 'none';
    // firebase.auth().signOut();
  }
  console.log("checkUser")
  console.log(checkUser)
  }
});

createLoadingPage();
function createLoadingPage() {
  app.createElement('div', 'loadPage', 'load_page', 'body', '', '');
  app.createElement('div', 'loadPageImg', 'load_page_img', 'loadPage', '', '');
  app.createElement('div', 'liveImgL', 'live_img l', 'loadPageImg', '', '');
  app.createElement('div', 'liveImgI', 'live_img i', 'loadPageImg', '', '');
  app.createElement('div', 'liveImgV', 'live_img v', 'loadPageImg', '', '');
  app.createElement('div', 'liveImgE', 'live_img e', 'loadPageImg', '', '');

  loadingAnimaion();
  setTimeout(() => {
    removeLodingPage();
  }, 7000);
}

function loadingAnimaion() {
  app.get('#loadPageImg').style.bottom = '0%';
  app.get('#loadPageImg').style.transition = '1.6s all';

  app.get('#liveImgL').style.top = '12%';
  app.get('#liveImgL').style.right = '5%';
  //    app.get("#liveImgL").style.transition = "1.6s all"
  app.get('#liveImgL').style.animation = 'houseLMove 3.0s 0s ease 1 alternate running';


  app.get('#liveImgI').style.top = '10%';
  app.get('#liveImgI').style.left = '37%';
  //    app.get("#liveImgI").style.transition = "1.6s all"
  app.get('#liveImgI').style.animation = 'houseIMove 3.0s 0s ease 1 alternate running';

  app.get('#liveImgV').style.bottom = '40%';
  app.get('#liveImgV').style.left = '0%';
  app.get('#liveImgV').style.transform = 'rotate(0deg)';
  app.get('#liveImgV').style.transition = '1.6s all';
  app.get('#liveImgV').style.animation = 'houseVMove 3.0s 0s ease 1 alternate running';

  app.get('#liveImgE').style.left = '0%';
  app.get('#liveImgE').style.bottom = '0%';
  app.get('#liveImgE').style.animation = 'houseEMove 3.0s 0s ease 1 alternate running';
  setInterval(() => {
    app.get('#liveImgE').style.animation = 'houseETurn 1.6s 1s infinite linear';

    app.get('#liveImgE').style.transformOrigin = 'center';
  },
  3000);
}

function removeLodingPage() {
  app.get('#loadPage').style.display = 'none';
}

/* create nav */
createNav();
function createNav() {
  app.createElement('div', 'navLeft', 'nav_left', 'nav', '', '');
  app.createElement('div', 'navLogo', 'nav_logo', 'navLeft', '', '');
  app.get('#navLogo').addEventListener('click', () => {
    location.href = 'index.html';
  });
  app.createElement('p', 'navTitle', 'nav_title', 'navLeft', 'Live Life', '');
  
  const page = new URL(document.location).pathname;
  if (page.indexOf("index.html") !== -1 || page === '/Royal_rental/') {
    app.createElement('input', 'navSearch', 'nav_search', 'navLeft', '', '');
    // app.get("#navSearch").setAttribute("autocomplete","off")
    app.get('#navSearch').setAttribute('placeholder', '請問想住哪呢?');
  }


  app.createElement('div', 'navRight', 'nav_right', 'nav', '', '');
  app.createElement('ul', 'navList', 'nav_list', 'navRight', '', '');
  app.createElement('li', 'navClose', 'nav_close', 'navList', 'x', '');
  app.createElement('li', 'rentalBtn', 'nav_btn', 'navList', '找房', '');
  app.createElement('li', 'postBtn', 'nav_btn', 'navList', '刊登', '');
  app.createElement('li', 'memberBtn', 'nav_btn', 'navList', '會員', '');
  app.get("#memberBtn").style.display = 'none';
  app.createElement('li', 'loginBtn', 'nav_btn', 'navList', '登入', '');
  app.createElement('i', 'navBtn', 'fas fa-bars', 'navRight', '', '');

  app.get('#rentalBtn').onclick = function () {
    location.href = './index.html';
  };

  app.get('#memberBtn').onclick = function () {
    location.href = './member.html';
  };

  app.get('#postBtn').onclick = function () {
    console.log(checkUser);
    if (!checkUser) {
      app.get('#alertBoxLayout').style.display = 'flex';
      app.get('#alertIndex').innerHTML = '請先登入或註冊會員';
    } else {
      location.href = './backstage.html';
    }
  };

  app.get('#navBtn').addEventListener('click', () => {
    app.get('#navList').style.display = 'inline-block';
  });

  app.get('#navClose').addEventListener('click', () => {
    app.get('#navList').style.display = 'none';
  });
}
