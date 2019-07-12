let map;
function initAutocomplete() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 25.0244465, lng: 121.5459541 },
    zoom: 14,
    mapTypeId: 'roadmap',
  });

  /* get current location */
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      let pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      map.setZoom(15);
      map.setCenter(pos);
    });
  }

  // Create the search box and link it to the UI element.
  let input = app.get('#navSearch');
  let searchBox = new google.maps.places.SearchBox(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', () => {
    searchBox.setBounds(map.getBounds());
  });

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', () => {
    let places = searchBox.getPlaces();
    if (places.length === 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    let bounds = new google.maps.LatLngBounds();
    places.forEach((place) => {
      if (!place.geometry) {
        console.log('Returned place contains no geometry');
        return;
      }
      let icon = {
        url: place.icon,
        size: new google.maps.Size(30, 30),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 30),
        scaledSize: new google.maps.Size(10, 10),
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map,
        icon,
        title: place.name,
        position: place.geometry.location,
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}

let getMember;
let userFavPost;
let firebaseMember = database.ref('member');
firebaseMember.on('value', (snapshot) => {
  if (checkUser) {
    getMember = snapshot.val();
    getMember = getMember[checkUser.uid];
    console.log(getMember);
    if (!getMember.favPost) {
      userFavPost = [];
    } else {
      userFavPost = getMember.favPost;
    }
  }
});

function isPointInRange(point) {
  const SWLat = map.getBounds().getSouthWest().lat();
  const SWLng = map.getBounds().getSouthWest().lng();
  const NELat = map.getBounds().getNorthEast().lat();
  const NELng = map.getBounds().getNorthEast().lng();
  if (point) {
    if (point.lat >= SWLat && point.lat <= NELat && point.lng >= SWLng && point.lng <= NELng) {
      return true;
    }
    return false;
  }
}

/* firebase house data */
let getNewData;
let getData;
let firebaseData = database.ref('house');
firebaseData.on('value', (snapshot) => {
  getData = snapshot.val();
  map.addListener('bounds_changed', () => {
    if (getData) {
      getNewData = getData.filter(data => isPointInRange(data.latLng));
      getPriceFilterData();
      if (!allFilterResult) {
        createPostData(getNewData);
      } else {
        getFilterData();
        createPostData(allFilterResult);
      }
    }
  });

  if (!getNewData) {
    createPostData(getData);
  }
  createrRoomFilter();
  createKindTypeFilter();
});

let marker;
let markers = [];
let markerCluster;
function setMarkOnMap(addressData) {
  /* remove old markers */
  if (markers.length > 0) {
    for (let i = 0; i < markers.length; i += 1) {
      markers[i].setMap(null);
    }
    markers = [];
  }

  for (let i = 0; i < addressData.length; i += 1) {
    let marker = new google.maps.Marker({
      position: addressData[i].latLng, // marker的放置位置
      map, // 這邊的map指的是第四行的map變數
      title: addressData[i].title,
      icon: 'https://firebasestorage.googleapis.com/v0/b/royal-rental.appspot.com/o/company.png?alt=media&token=4079d0ad-6be1-49e7-a45a-a1d94b510c66',
    });
    markers.push(marker);
    marker.addListener('click', () => {
      let thisSinglePage = app.get('#rentalSingleHouse');
      thisSinglePost = addressData[i];
      if (thisSinglePage) {
        thisSinglePage.parentNode.removeChild(thisSinglePage);
      }
      createSingleHouse(thisSinglePost);
    });
  }

  /* remove old cluster */
  if (markerCluster) {
    markerCluster.clearMarkers();
  }

  markerCluster = new MarkerClusterer(map, markers, {
    gridSize: 180,
    maxZoom: 16,
    // imagePath: 'https://firebasestorage.googleapis.com/v0/b/royal-rental.appspot.com/o/circle.png?alt=media&token=b475f760-d413-46dc-8de3-a6117e9d7fdd',
    styles: [{
      url: 'https://firebasestorage.googleapis.com/v0/b/royal-rental.appspot.com/o/circle.png?alt=media&token=b475f760-d413-46dc-8de3-a6117e9d7fdd', // 可以自訂圖案
      height: 40,
      width: 40,
      anchor: [0, 0], // 文字出現在標記上的哪個位置 (position on marker)
      textColor: '#FFF76F',
      textSize: 14,
      textAlign: 'center',
      backgroundPosition: 'center',
      backgroundSize: 'center',
      backgroundRepeat: 'no-repeat',
    }],
  });
}

let thisSinglePost;
function createPostData(data) {
  let resultHouse = app.get('#resultHouse');
  if (resultHouse) {
    resultHouse.parentNode.removeChild(resultHouse);
  }
  app.createElement('div', 'resultHouse', 'result_house', 'rentalHouseContainer', '', '');
  for (let i = 0; i < data.length; i += 1) {
    app.createElement('div', `houseCard${i}`, 'house_card', 'resultHouse', '', '');
    app.get(`#houseCard${i}`).onclick = (e) => {
      thisSinglePost = data[i];
      createSingleHouse(thisSinglePost);
    };
    app.createElement('div', `houseImg${i}`, 'house_img', `houseCard${i}`, '', '');

    let postCover;
    for (let key in data[i].houseImg) {
      postCover = key;
      break;
    }
    let currentPostId = data[i].postId.toString();
    app.get(`#houseImg${i}`).style.background = `url('${data[i].houseImg[postCover]}')50% / cover no-repeat`;
    app.createElement('div', `houseDetail${i}`, 'house_detail', `houseCard${i}`, '', '');
    app.createElement('div', `priceIcons${i}`, 'price_icons', `houseDetail${i}`, '', '');
    app.createElement('p', `price${i}`, 'price', `priceIcons${i}`, setThousandDigit(data[i].price), '');
    if (checkUser) {
      app.createElement('div', `icons${i}`, 'icons', `priceIcons${i}`, '', '');
      app.createElement('div', `favHeart${currentPostId}`, 'fav_heart', `icons${i}`, '', app.rental.favHouseClick);
      app.get(`#favHeart${currentPostId}`).setAttribute('data-post', data[i].postId);
      if (userFavPost.indexOf(currentPostId) !== -1) {
        app.get(`#favHeart${currentPostId}`).className = 'fav_heart active';
      }
    }
    app.createElement('p', '', '', `houseDetail${i}`, `${data[i].bedroom}間房間, ${data[i].restroom}間廁所, ${data[i].kindType}`, '');
    app.createElement('p', '', '', `houseDetail${i}`, data[i].section_name, '');
  }
  app.get('#resultTitle').innerHTML = `${data.length}筆結果`;

  setMarkOnMap(data);
}

app.rental.favHouseClick = (e) => {
  let thisPostId = e.target.getAttribute('data-post');
  let heartClass = e.target.className;

  if (heartClass === 'fav_heart') {
    e.target.className = 'fav_heart active';
    userFavPost.push(thisPostId);
    database.ref(`member/${checkUser.uid}`).update({
      favPost: userFavPost,
    });
  } else {
    e.target.className = 'fav_heart';
    let index = userFavPost.indexOf(thisPostId);
    userFavPost.splice(index, 1);
    database.ref(`member/${checkUser.uid}`).update({
      favPost: userFavPost,
    });
  }
  e.stopPropagation();
};

/* create single house */
let originalDot = 0;
let singlePostImgArr;
function createSingleHouse(thisPost) {
  app.get('#rentalHouseContainer').style.display = 'none';
  let resultHouse = app.get('#resultHouse');
  if (resultHouse) {
    resultHouse.parentNode.removeChild(resultHouse);
  }

  app.createElement('div', 'rentalSingleHouse', 'rental_single_house', 'rentalRight', '', '');
  app.createElement('div', 'btnContainer', 'btn_container', 'rentalSingleHouse', '', '');
  app.createElement('div', 'backBtn', 'back_btn', 'btnContainer', '', '');
  app.createElement('div', '', '', 'backBtn', '返回搜尋結果', '');
  app.get('#backBtn').onclick = function () {
    app.get('#rentalHouseContainer').style.display = 'block';
    let rentalSingleHouse = app.get('#rentalSingleHouse');
    rentalSingleHouse.parentNode.removeChild(rentalSingleHouse);
    if (!getNewData) {
      createPostData(getData);
    } else {
      if (!allFilterResult) {
        createPostData(getNewData);
      } else {
        createPostData(allFilterResult);
      }
    }
  };
  if (checkUser) {
    app.createElement('div', 'favBtn', 'fav_btn', 'btnContainer', '', app.rental.singlePostFav);
    app.get('#favBtn').setAttribute('data-fav', thisPost.postId);
    app.createElement('div', 'favImg', 'fav_img', 'favBtn', '', '');
    app.createElement('div', '', '', 'favBtn', '收藏', '');
    if (userFavPost.indexOf(thisPost.postId.toString()) !== -1) {
      app.get('#favBtn').className = 'fav_btn active';
    }
  }

  /* single house img */
  app.createElement('div', 'singleHouseImgContainer', 'single_house_img_container', 'rentalSingleHouse', '', '');
  app.createElement('div', 'singleHouseImg', 'single_house_img', 'singleHouseImgContainer', '', '');

  singlePostImgArr = [];
  for (let key in thisPost.houseImg) {
    singlePostImgArr.push(key);
  }
  app.get('#singleHouseImg').style.background = `url('${thisPost.houseImg[singlePostImgArr[0]]}')50% / cover no-repeat`;
  app.get('#singleHouseImg').setAttribute('data-img', 0);

  /* single house slide */
  app.createElement('div', 'SingleLeftContainer', 'single_left_container', 'singleHouseImg', '', app.rental.singlePostSlideLeft);
  app.createElement('div', 'SingleLeft', 'single_left', 'SingleLeftContainer', '', '');
  app.createElement('div', 'SingleRightContainer', 'single_right_container', 'singleHouseImg', '', app.rental.singlePostSlideRight);
  app.createElement('div', 'SingleRight', 'single_right', 'SingleRightContainer', '', '');

  /* single house dot selector */
  app.createElement('div', 'dotSelector', 'dot_selector', 'singleHouseImgContainer', '', '');
  for (let i = 0; i < 5; i += 1) {
    app.createElement('button', `dot${i}`, 'dot', 'dotSelector', '', app.rental.singlePostDotClick);
    app.get(`#dot${i}`).setAttribute('data-order', i);
  }
  app.get('#dot0').className = 'dot active';
  originalDot = 0;

  app.createElement('div', 'singlePriceAddress', 'single_price_address', 'rentalSingleHouse', '', '');
  app.createElement('p', 'singlePrice', 'single_price', 'singlePriceAddress', setThousandDigit(thisPost.price), '');
  app.createElement('div', 'separateLine', 'separate_line', 'singlePriceAddress', '', '');
  app.createElement('div', 'singleAddress', 'single_address', 'singlePriceAddress', '', '');
  app.createElement('p', 'singleDist', 'single_dist', 'singleAddress', thisPost.regionName + thisPost.sectionName, '');
  app.createElement('p', 'singleStreet', 'single_street', 'singleAddress', thisPost.address, '');
  app.createElement('div', '', 'single_house_title', 'rentalSingleHouse', '屋況說明', '');
  app.createElement('div', 'singleDetail', 'single_house_content', 'rentalSingleHouse', thisPost.houseDetail, '');
  app.createElement('div', '', 'single_house_title', 'rentalSingleHouse', '生活周遭', '');
  app.createElement('div', 'singleSurrounding', 'single_house_content', 'rentalSingleHouse', thisPost.houseSurrounding, '');
  app.createElement('div', '', 'single_house_title', 'rentalSingleHouse', '房屋設備', '');
  app.createElement('div', 'singleDeviceContainer', 'single_device_container', 'rentalSingleHouse', '', '');

  let count = 0;
  /* create single device */
  for (key in thisPost.device) {
    if (thisPost.device[key]) {
      app.createElement('p', '', 'single_device', 'singleDeviceContainer', key, '');
    }
    count += 1;
  }
  app.createElement('div', '', 'single_house_title', 'rentalSingleHouse', '其他設備', '');
  app.createElement('div', 'singleOthersContainer', 'single_others_container', 'rentalSingleHouse', '', '');

  /* create single others */
  let isOthersEmpty = true;
  for (key in thisPost.others) {
    if (thisPost.others[key]) {
      app.createElement('p', '', 'single_others', 'singleOthersContainer', key, '');
      isOthersEmpty = false;
    }
    count += 1;
  }
  if (isOthersEmpty) { app.createElement('div', '', '', 'singleOthersContainer', '無', ''); }

  /* more single house info */
  app.createElement('div', 'singleHouseMore', 'single_house_more', 'rentalSingleHouse', '', '');
  app.createElement('p', '', '', 'singleHouseMore', '更多細資訊', '');
  app.get('#singleHouseMore').onclick = function () {
    location.href = `house.html?id=${thisPost.postId}`;
  };
}

/* single post fav btn */
app.rental.singlePostFav = (e) => {
  let favBtn = app.get('#favBtn');
  let favPostId = app.get('#favBtn').getAttribute('data-fav');
  if (favBtn.className === 'fav_btn') {
    favBtn.className = 'fav_btn active';
    userFavPost.push(favPostId);
    database.ref(`member/${checkUser.uid}`).update({
      favPost: userFavPost,
    });
  } else {
    favBtn.classList.remove('active');
    let index = userFavPost.indexOf(favPostId);
    userFavPost.splice(index, 1);
    database.ref(`member/${checkUser.uid}`).update({
      favPost: userFavPost,
    });
  }
};

/* single post img slide */
let currentDot;
app.rental.singlePostSlideLeft = (e) => {
  currentDot = app.get('#singleHouseImg').getAttribute('data-img');
  currentDot--;
  if (currentDot < 0) {
    currentDot = 4;
  }

  app.get('#singleHouseImg').style.background = `url('${thisSinglePost.houseImg[singlePostImgArr[currentDot]]}')50% / cover no-repeat`;
  app.get('#singleHouseImg').setAttribute('data-img', currentDot);
  app.get(`#dot${currentDot}`).className = 'dot active';
  app.get(`#dot${originalDot}`).classList.remove('active');
  originalDot = currentDot;
};

app.rental.singlePostSlideRight = (e) => {
  currentDot = app.get('#singleHouseImg').getAttribute('data-img');
  currentDot++;
  if (currentDot > 4) {
    currentDot = 0;
  }
  app.get('#singleHouseImg').style.background = `url('${thisSinglePost.houseImg[singlePostImgArr[currentDot]]}')50% / cover no-repeat`;
  app.get('#singleHouseImg').setAttribute('data-img', currentDot);
  app.get(`#dot${currentDot}`).className = 'dot active';
  app.get(`#dot${originalDot}`).classList.remove('active');
  originalDot = currentDot;
};

app.rental.singlePostDotClick = (e) => {
  currentDot = e.target.getAttribute('data-order');
  app.get('#singleHouseImg').style.background = `url('${thisSinglePost.houseImg[singlePostImgArr[currentDot]]}')50% / cover no-repeat`;
  app.get('#singleHouseImg').setAttribute('data-img', currentDot);

  app.get(`#dot${currentDot}`).className = 'dot active';
  app.get(`#dot${originalDot}`).classList.remove('active');
  originalDot = currentDot;
};

/* price filter */
let priceFilterData;
function getPriceFilterData() {
  let leftPrice = Number(moneyLeft.textContent);
  let rightPrice = Number(moneyRight.textContent);
  if (getNewData) {
    priceFilterData = getNewData.filter((item, index, array) => item.price >= leftPrice && item.price <= rightPrice);
  } else {
    priceFilterData = getData.filter((item, index, array) => item.price >= leftPrice && item.price <= rightPrice);
  }
}

/* room amount filter */
function createrRoomFilter() {
  app.createElement('div', 'roomAmountFilter', 'filter_type', 'rentalFilter', '', '');
  app.createElement('p', '', 'filter_title', 'roomAmountFilter', '房間數量', '');
  app.createElement('div', 'roomFilterDetail', 'filter_detail', 'roomAmountFilter', '', '');
  for (let i = 1; i <= 4; i++) {
    app.createElement('p', '', 'room_amount', 'roomFilterDetail', i, app.rental.roomFilter);
  }
}

let roomFilter = [];
app.rental.roomFilter = (e) => {
  let roomAmount = e.target.innerHTML;
  if (e.target.className === 'room_amount') {
    e.target.classList.add('active');
    roomFilter.push(roomAmount);
    roomFilter.sort();
  } else {
    e.target.classList.remove('active');
    roomFilter = roomFilter.filter(value => value !== roomAmount);
  }
  getPriceFilterData();
  getFilterData();
};

/* kind type filter */
function createKindTypeFilter() {
  app.createElement('div', 'kindFilter', 'filter_type', 'rentalFilter', '', '');
  app.createElement('p', '', 'filter_title', 'kindFilter', '房屋類型', '');
  app.createElement('div', 'kindFilterDetail', 'filter_detail', 'kindFilter', '', '');
  app.createElement('p', '', 'room_kind', 'kindFilterDetail', '雅房', app.rental.kindTypeFilter);
  app.createElement('p', '', 'room_kind', 'kindFilterDetail', '獨立套房', app.rental.kindTypeFilter);
  app.createElement('p', '', 'room_kind', 'kindFilterDetail', '整層住家', app.rental.kindTypeFilter);
}

let kindFilter = [];
app.rental.kindTypeFilter = (e) => {
  let kindType = e.target.innerHTML;
  //    filterResult = [];
  if (e.target.className === 'room_kind') {
    e.target.classList.add('active');
    kindFilter.push(kindType);
    kindFilter.sort();
  } else {
    e.target.classList.remove('active');
    kindFilter = kindFilter.filter(value => value !== kindType);
  }
  getPriceFilterData();
  getFilterData();
};

let allFilterResult;
function getFilterData() {
  let allFilter = {
    bedroom: roomFilter,
    kindType: kindFilter,
  };

  function multiFilter(array, filters) {
    const filterKeys = Object.keys(filters);
    // filters all elements passing the criteria
    return array.filter(item =>
      // dynamically validate all filter criteria
      filterKeys.every((key) => {
        // ignore when the filter is empty Anne
        if (!filters[key].length) return true;
        return !!~filters[key].indexOf(item[key]);
      }));
  }
  allFilterResult = multiFilter(priceFilterData, allFilter);

  /* delete repeat data */
  let set = new Set();
  allFilterResult = allFilterResult.filter(item => (!set.has(item.postId) ? set.add(item.postId) : false));

  createPostData(allFilterResult);
  let filterArr = Object.keys(allFilter);
  function isEmptyObject(obj, arr) {
    for (let i = 0; i < arr.length; i += 1) {
      if (obj[arr[i]].length) {
        return false;
      }
    }
    return true;
  }

  if (isEmptyObject(allFilter, filterArr)) {
    getPriceFilterData();
    createPostData(priceFilterData);
    app.get('#resultTitle').innerHTML = `${priceFilterData.length}筆結果`;
  }
}

/* price filter */
let leftMoney = app.get('#moneyLeft');
leftMoney.textContent = 0;
let rightMoney = app.get('#moneyRight');
rightMoney.textContent = 100000;

let dragItem;
let container = app.get('#rental');
let leftCirle = app.get('#circleLeft');
let rightCirle = app.get('#circleRight');
let active = false;
let currentX;
let currentY;
let initialX;
let initialY;
let leftOffsetX = 0;
let rightOffsetX = 0;
let currentCircle;
let xOffset = 0;
let yOffset = 0;

container.addEventListener('touchstart', dragStart, false);
container.addEventListener('touchend', dragEnd, false);
container.addEventListener('touchmove', drag, false);

container.addEventListener('mousedown', dragStart, false);
container.addEventListener('mouseup', dragEnd, false);
container.addEventListener('mouseleave', dragEnd, false);
container.addEventListener('mousemove', drag, false);

function dragStart(e) {
  if (e.target.id === 'circleLeft') {
    dragItem = app.get(`#${e.target.id}`);
    xOffset = leftOffsetX;
    currentCircle = e.target.id;
  }
  if (e.target.id === 'circleRight') {
    dragItem = app.get(`#${e.target.id}`);
    xOffset = rightOffsetX;
    currentCircle = e.target.id;
  }

  if (e.type === 'touchstart') {
    initialX = e.touches[0].clientX - xOffset;
  } else {
    initialX = e.clientX - xOffset;
  }

  if (e.target === dragItem) {
    active = true;
  }
}

function dragEnd(e) {
  if (e.target.id === 'circleLeft') {
    active = false;
    getPriceFilterData();
    getFilterData();
  }
  if (e.target.id === 'circleRight') {
    active = false;
    getPriceFilterData();
    getFilterData();
  }
}

function drag(e) {
  if (active) {
    e.preventDefault();
    let bottomWidth = app.get('#bottomLine').getBoundingClientRect().width;

    let maxLeft = app.get('#bottomLine');
    let maxLeftCircle = maxLeft.getBoundingClientRect().left + document.documentElement.scrollLeft;
    let rangeWidth = rightCirle.getBoundingClientRect().x - leftCirle.getBoundingClientRect().x + 8;
    let nowLeftCircle = leftCirle.getBoundingClientRect().left + document.documentElement.scrollLeft;
    let nowRightCircle = nowLeftCircle + rangeWidth;


    if (e.type === 'touchmove') {
      currentX = e.touches[0].clientX - initialX;
      currentY = initialY;
    } else {
      currentX = e.clientX - initialX;
    }

    xOffset = currentX;
    if (currentCircle === 'circleLeft') {
      let limit = nowRightCircle - nowLeftCircle;
      if (currentX <= -8) {
        currentX = 0;
      }

      leftOffsetX = xOffset;
      leftMoney.textContent = Math.round(currentX * ((bottomWidth - 48) / 50000) * 100) * 500;
    }

    if (currentCircle === 'circleRight') {
      if (currentX >= 8) {
        currentX = 0;
      }
      rightOffsetX = xOffset;
      // eslint-disable-next-line max-len
      rightMoney.textContent = Math.round(currentX * ((bottomWidth - 48) / 50000) * 100) * 500 + 100000;
    }

    setTranslate(currentX, 0, dragItem);
    app.get('#rangeLine').style.width = `${rangeWidth}px`;
    app.get('#rangeLine').style.left = `${leftCirle.getBoundingClientRect().x - maxLeftCircle}px`;
  }
}

function setTranslate(xPos, yPos, el) {
  el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
}
