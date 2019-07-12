/* eslint-disable no-plusplus */
let getUser;
let thisUser;
let thisUserId;
let userPostIdArr;
let userFavArr;
let userFavPost;
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    thisUser = user;
    thisUserId = user.uid;
    console.log('有登入');
  } else {
    console.log('尚未登入');
  }

  let firebaseUser = database.ref(`member/${thisUserId}`);
  firebaseUser.once('value', (snapshot) => {
    getUser = snapshot.val();
    createMemberDisplay();
    app.get('#memberDataBtn').addEventListener('click', memberBarClick);
    app.get('#favHouseBtn').addEventListener('click', memberBarClick);
    app.get('#myHouseBtn').addEventListener('click', memberBarClick);
    getFirebaseUser();

    userFavPost = getUser.favPost;
    if (!userFavPost) userFavPost = [];
  });
});

let getAllData;
let firebaseHouse = database.ref('house');
firebaseHouse.on('value', (snapshot) => {
  getAllData = snapshot.val();
});

function getFirebaseUser() {
  setDefaultGender();
  app.get('#memberId').value = getUser.userId;
  if (!getUser.userName) {
    app.get('#memberName').placeholder = '請輸入姓名';
  } else {
    app.get('#memberName').value = getUser.userName;
  }

  if (!getUser.phone) {
    app.get('#memberPhone').placeholder = '請輸入電話';
  } else {
    app.get('#memberPhone').value = getUser.phone;
  }
  app.get('#memberMail').value = getUser.email;
}

/* user log out */
app.get('#logOut').onclick = function () {
  userLogout();
};

function userLogout() {
  app.get('#memberBtn').style.display = 'none';
  app.get('#loginBtn').style.display = 'block';
  photoURL = '';
  firebase.auth().signOut();
  window.location = 'index.html';
}

/* member bar btn click */
app.member.memberLayoutDisplay = (layoutBlock, layoutNone1, layoutNone2) => {
  app.get(layoutBlock).style.display = 'flex';
  app.get(layoutNone1).style.display = 'none';
  app.get(layoutNone2).style.display = 'none';
};

function memberBarClick(e) {
  memberBarBtn = e.target.id;
  if (memberBarBtn === 'memberDataBtn') {
    app.member.memberLayoutDisplay('#memberData', '#memberFavHouse', '#memberPost');
  } else if (memberBarBtn === 'favHouseBtn') {
    app.member.memberLayoutDisplay('#memberFavHouse', '#memberPost', '#memberData');
  } else if (memberBarBtn === 'myHouseBtn') {
    app.member.memberLayoutDisplay('#memberPost', '#memberData', '#memberFavHouse');
  }
}

/* create member display */
function createMemberDisplay() {
  app.createElement('div', 'memberDisplay', 'member_display', 'member', '', '');
  createMemberData();
  createMemberFavHouse();
  createMemberPost();
  app.member.memberLayoutDisplay('#memberData', '#memberFavHouse', '#memberPost');
}

/* create member data */
function createMemberData() {
  app.createElement('div', 'memberData', 'member_data', 'memberDisplay', '', '');
  app.createElement('div', 'memberPhoto', 'member_photo', 'memberData', '', '');

  app.createElement('div', 'memberGenderRow', 'member_data_row', 'memberData', '', '');
  app.createElement('p', '', 'member_data_title', 'memberGenderRow', '性別', '');
  app.createElement('div', 'memberGenderLabelContainer', 'member_label_container', 'memberGenderRow', '', '');
  app.createElement('label', 'memberGenderLabelM', 'member_gender_label', 'memberGenderLabelContainer', '', '');
  app.createElement('input', 'memberGenderMale', 'member_gender', 'memberGenderLabelM', '', '');
  app.createElement('p', '', '', 'memberGenderLabelM', '男', '');
  app.get('#memberGenderMale').type = 'radio';
  app.get('#memberGenderMale').value = 'male';
  app.get('#memberGenderMale').name = 'memberGender';
  app.createElement('label', 'memberGenderLabelF', 'member_gender_label', 'memberGenderLabelContainer', '', '');
  app.createElement('input', 'memberGenderFemale', 'member_gender', 'memberGenderLabelF', '', '');
  app.createElement('p', '', '', 'memberGenderLabelF', '女', '');
  app.get('#memberGenderFemale').type = 'radio';
  app.get('#memberGenderFemale').value = 'female';
  app.get('#memberGenderFemale').name = 'memberGender';

  app.createElement('div', 'memberIdRow', 'member_data_row', 'memberData', '', '');
  app.createElement('p', '', 'member_data_title', 'memberIdRow', 'ID', '');
  app.createElement('input', 'memberId', 'input_disbled', 'memberIdRow', '', '');
  app.get('#memberId').setAttribute('disabled', '');

  app.createElement('div', 'memberNameRow', 'member_data_row', 'memberData', '', '');
  app.createElement('p', '', 'member_data_title', 'memberNameRow', '姓名', '');
  app.createElement('input', 'memberName', 'input_disbled', 'memberNameRow', '', '');

  app.createElement('div', 'memberPhoneRow', 'member_data_row', 'memberData', '', '');
  app.createElement('p', '', 'member_data_title', 'memberPhoneRow', '手機', '');
  app.createElement('input', 'memberPhone', 'input_disbled', 'memberPhoneRow', '', '');

  app.createElement('div', 'memberMailRow', 'member_data_row', 'memberData', '', '');
  app.createElement('p', '', 'member_data_title', 'memberMailRow', '信箱', '');
  app.createElement('input', 'memberMail', 'input_disbled', 'memberMailRow', '', '');
  app.get('#memberMail').setAttribute('disabled', '');

  app.createElement('div', 'memberDataBtnRow', 'member_data_row', 'memberData', '', '');
  app.createElement('p', 'memberDataModify', 'member_data_btn', 'memberDataBtnRow', '修改資料', app.member.memberDataModify);
  app.createElement('p', 'memberDataConfirm', 'member_data_btn', 'memberDataBtnRow', '確認', app.member.memberDataConfirm);
  app.createElement('p', 'memberDataCancel', 'member_data_btn', 'memberDataBtnRow', '取消', app.member.memberDataCancel);

  app.member.unModify('#memberDataModify', '#memberDataConfirm', '#memberDataCancel');
  app.member.disabled('#memberName', '#memberPhone', '#memberGenderMale', '#memberGenderFemale');

  app.createElement('div', 'alertBtnContainer', 'alert_btn_container', 'alertBox', '', '');
  app.createElement('p', 'alertBtnConfirm', 'alert_btn', 'alertBtnContainer', '確定', app.member.postDeleteConfirm);
  app.createElement('p', 'alertBtnCancel', 'alert_btn', 'alertBtnContainer', '取消', '');
}

app.member.isModify = (memberDataModify, memberDataConfirm, memberDataCancel) => {
  app.get(memberDataModify).style.display = 'none';
  app.get(memberDataConfirm).style.display = 'block';
  app.get(memberDataCancel).style.display = 'block';
};

app.member.unModify = (memberDataModify, memberDataConfirm, memberDataCancel) => {
  app.get(memberDataModify).style.display = 'block';
  app.get(memberDataConfirm).style.display = 'none';
  app.get(memberDataCancel).style.display = 'none';
};

app.member.disabled = (memberName, memberPhone, memberGenderLabelM, memberGenderLabelF) => {
  app.get(memberName).setAttribute('disabled', '');
  app.get(memberPhone).setAttribute('disabled', '');
  app.get(memberGenderLabelM).setAttribute('disabled', '');
  app.get(memberGenderLabelF).setAttribute('disabled', '');

  app.get(memberName).className = 'input_disbled';
  app.get(memberPhone).className = 'input_disbled';
};

app.member.unDisabled = (memberName, memberPhone, memberGenderLabelM, memberGenderLabelF) => {
  app.get(memberName).removeAttribute('disabled');
  app.get(memberPhone).removeAttribute('disabled');
  app.get(memberGenderLabelM).removeAttribute('disabled');
  app.get(memberGenderLabelF).removeAttribute('disabled');

  app.get(memberName).classList.remove('input_disbled');
  app.get(memberPhone).classList.remove('input_disbled');
};

app.member.memberDataModify = function () {
  app.member.isModify('#memberDataModify', '#memberDataConfirm', '#memberDataCancel');
  app.member.unDisabled('#memberName', '#memberPhone', '#memberGenderMale', '#memberGenderFemale');
};

app.member.memberDataConfirm = function () {
  let gender;
  let genderName = document.getElementsByName('memberGender');
  for (let i = 0; i < genderName.length; i++) {
    if (genderName[i].checked) {
      gender = genderName[i].value;
    }
  }

  if (!gender) {
    app.get('#alertBoxLayout').style.display = 'flex';
    app.get('#alertIndex').innerHTML = '請選擇性別';
    app.get('#alertBtnContainer').style.display = 'none';
    return;
  } if (!memberName.value) {
    app.get('#alertBoxLayout').style.display = 'flex';
    app.get('#alertIndex').innerHTML = '請輸入姓名';
    return;
  } if (!memberPhone.value) {
    app.get('#alertBoxLayout').style.display = 'flex';
    app.get('#alertIndex').innerHTML = '請輸入電話';
    return;
  }

  database.ref(`/member/${thisUserId}`).update({
    userName: app.get('#memberName').value,
    phone: memberPhone.value,
    gender,
  });

  let firebaseUser = database.ref(`member/${thisUserId}`);
  firebaseUser.once('value', (snapshot) => {
    getUser = snapshot.val();
  });

  app.member.unModify('#memberDataModify', '#memberDataConfirm', '#memberDataCancel');
  app.member.disabled('#memberName', '#memberPhone', '#memberGenderMale', '#memberGenderFemale');
};

app.member.memberDataCancel = function () {
  app.member.unModify('#memberDataModify', '#memberDataConfirm', '#memberDataCancel');
  app.member.disabled('#memberName', '#memberPhone', '#memberGenderMale', '#memberGenderFemale');

  if (!getUser.userName) {
    app.get('#memberName').value = '';
    app.get('#memberName').placeholder = '請輸入姓名';
  } else {
    app.get('#memberName').value = getUser.userName;
  }

  if (!getUser.phone) {
    app.get('#memberPhone').value = '';
    app.get('#memberPhone').placeholder = '請輸入電話';
  } else {
    app.get('#memberPhone').value = getUser.phone;
  }
  setDefaultGender();
};

function setDefaultGender() {
  let userGender = getUser.gender;
  let selectGender = document.getElementsByName('memberGender');
  for (let i = 0; i < selectGender.length; i++) {
    if (selectGender[i].value === userGender) {
      selectGender[i].checked = true;
    }
  }
}

/* create member favorite house */
function createMemberFavHouse() {
  userFavArr = getUser.favPost;
  app.createElement('div', 'memberFavHouse', 'member_fav_house', 'memberDisplay', '', '');
  console.log('userFavArr');
  console.log(userFavArr);
  if (!userFavArr) {
    app.createElement('p', '', '', 'memberFavHouse', '目前沒有收藏', '');
  } else {
    getAllData.map((post) => {
      let thisId = post.postId.toString();
      if (userFavArr.indexOf(thisId) !== -1) {
        app.createElement('div', `favHouse${thisId}`, 'fav_house', 'memberFavHouse', '', '');
        app.createElement('div', `favHouseImg${thisId}`, 'fav_house_img', `favHouse${thisId}`, '', '');
        let thisFavImg = [];
        for (let key in post.houseImg) {
          thisFavImg.push(key);
        }
        app.get(`#favHouseImg${thisId}`).style.background = `url('${post.houseImg[thisFavImg[0]]}') 50% / cover no-repeat`;
        app.createElement('div', `favHouseDetail${thisId}`, 'fav_house_detail', `favHouse${thisId}`, '', '');
        app.createElement('p', `favPriceIcons${thisId}`, 'fav_price_icons', `favHouseDetail${thisId}`, '', '');
        app.createElement('p', `favPrice${thisId}`, 'price', `favPriceIcons${thisId}`, setThousandDigit(post.price), '');

        app.createElement('div', `icons${thisId}`, 'icons', `favPriceIcons${thisId}`, '', '');
        app.createElement('div', `favHeart${thisId}`, 'fav_heart', `icons${thisId}`, '', app.member.favHouseClick);
        app.get(`#favHeart${thisId}`).setAttribute('data-post', post.postId);
        app.createElement('p', 'fav_Room', '', `favHouseDetail${thisId}`, `${post.bedroom}間房間、${post.restroom}間廁所`, '');
        app.createElement('p', 'favSectionName', 'section_name', `favHouseDetail${thisId}`, post.sectionName, '');
        app.get(`#favHouse${thisId}`).onclick = function () {
          location.href = `house.html?id=${post.postId}`;
        };
      }
    });
  }
}

/* favorite heart click */
app.member.favHouseClick = (e) => {
  let thisFavId = e.target.getAttribute('data-post');
  let index = userFavPost.indexOf(thisFavId);
  userFavPost.splice(index, 1);
  let thisFavPost = app.get(`#favHouse${thisFavId}`);
  thisFavPost.parentNode.removeChild(thisFavPost);
  console.log(userFavPost);
  if (!userFavPost.length) {
    app.createElement('p', '', '', 'memberFavHouse', '目前沒有收藏', '');
  }
  database.ref(`member/${thisUserId}`).update({
    favPost: userFavPost,
  });
  e.stopPropagation();
};

/* create member post */
function createMemberPost() {
  userPostIdArr = getUser.userPost;
  app.createElement('div', 'memberPost', 'member_post', 'memberDisplay', '', '');
  if (!userPostIdArr) {
    app.createElement('p', '', '', 'memberPost', '目前沒有刊登', '');
  } else {
    for (let i = 0; i < userPostIdArr.length; i++) {
      if (userPostIdArr[i]) {
        let postId = userPostIdArr[i];
        app.createElement('div', `postConatiner${postId}`, 'post_container', 'memberPost', '', '');

        app.createElement('div', `post${postId}`, 'post', `postConatiner${postId}`, '', '');
        app.createElement('div', `postHouseImg${postId}`, 'house_img', `post${postId}`, '', '');
        let postCover;
        for (let key in getAllData[postId].houseImg) {
          postCover = key;
          break;
        }
        app.get(`#postHouseImg${postId}`).style.background = `url('${getAllData[postId].houseImg[postCover]}') 50% / cover no-repeat`;
        app.createElement('div', `postHouseDetail${postId}`, 'house_detail', `post${postId}`, '', '');
        app.createElement('p', 'postPrice', 'price', `postHouseDetail${postId}`, setThousandDigit(getAllData[postId].price), '');
        app.createElement('p', 'postRoom', '', `postHouseDetail${postId}`, `${getAllData[postId].bedroom}間房間、${getAllData[postId].restroom}間廁所`, '');
        app.createElement('p', 'postSectionName', 'section_name', `postHouseDetail${postId}`, getAllData[postId].sectionName, '');
        app.get(`#post${postId}`).onclick = function () {
          location.href = `house.html?id=${getAllData[postId].postId}`;
        };
        app.createElement('div', `postBtnContainer${postId}`, 'post_btn_container', `postConatiner${postId}`, '', '');
        app.createElement('div', `postModifyBtn${postId}`, 'post_btn', `postBtnContainer${postId}`, '修改', app.member.postModify);
        app.createElement('div', `postDeleteBtn${postId}`, 'post_btn', `postBtnContainer${postId}`, '刪除', app.member.postDelete);
        app.get(`#postModifyBtn${postId}`).setAttribute('data-postId', postId);
        app.get(`#postDeleteBtn${postId}`).setAttribute('data-postId', postId);
      }
    }
  }
}

app.member.postModify = (e) => {
  let thisPostId = e.target.getAttribute('data-postId');
  location.href = `edit.html?id=${thisPostId}`;
};

let thisPostId;
let thisPostImg;
let thisPostImgArr = [];
let thisCard;

app.member.postDelete = (e) => {
  thisPostId = e.target.getAttribute('data-postid');
  thisPostImg = getAllData[thisPostId].houseImg;
  thisCard = app.get(`#postConatiner${thisPostId}`);
  for (let key in thisPostImg) {
    thisPostImgArr.push(key);
  }
  app.get('#alertBoxLayout').style.display = 'flex';
  app.get('#alertIndex').innerHTML = '確定要刪除嗎';
  app.get('#alertBtn').style.display = 'none';
  app.get('#alertBtnCancel').addEventListener('click', () => {
    app.get('#alertBoxLayout').style.display = 'none';
    thisPostImgArr = [];
  });
};

app.member.postDeleteConfirm = () => {
  userPostIdArr = userPostIdArr.filter((element, index, arr) => arr.indexOf(element) === index);
  for (let i = 0; i < thisPostImgArr.length; i++) {
    // Create a reference to the file to delete
    storageRef.child(`images/house${thisPostId}/${thisPostImgArr[i]}`).delete(); /* delete firebase storage img */
    if (i === thisPostImgArr.length - 1) {
      thisPostImgArr = [];
      database.ref(`house/${thisPostId}`).remove(); /* delete firebase house post */

      for (let j = 0; j < getUser.userPost.length; j++) {
        if (thisPostId == getUser.userPost[j]) {
          database.ref(`member/${thisUserId}/userPost/${j}`).remove(); /* delete firbase member userPost */
          thisCard.parentNode.removeChild(thisCard); /* remove member post display */
          let index = userPostIdArr.indexOf(thisPostId);
          userPostIdArr.splice(index, 1);
        }
      }

      if (!userPostIdArr.length) {
        app.createElement('p', '', '', 'memberPost', '目前沒有刊登', '');
      }
    }
  }
  app.get('#alertBoxLayout').style.display = 'none';
};
