let coorX
let coorY
navigator.geolocation.getCurrentPosition(
  function (position) {
    coorX = position.coords.latitude
    coorY = position.coords.longitude
  }
)


import { data } from "../modules/data.js";

const body = document.querySelector("body");
const pizzaBlock = document.querySelector(".pizza-block");
const backetContent = document.querySelector(".backet-content");

function craeteCart() {
  for (let key in data) {
    let cart = document.createElement("div");
    cart.classList.add("pizza-cart");
    let img = document.createElement("img");
    img.classList.add("pizza__img");
    img.src = data[key]["image"];
    let h3 = document.createElement("h3");
    h3.classList.add("pizza__title");
    h3.textContent = data[key]["title"];
    let wrapperDiv = document.createElement("div");
    wrapperDiv.classList.add("pizza__cost-warpper");
    let btn = document.createElement("div");
    btn.classList.add("pizza__btn");
    btn.textContent = "Выбрать";
    let p = document.createElement("p");
    p.classList.add("pizza__cost");
    p.textContent = data[key]["cost"] + " сум";

    cart.appendChild(img);
    cart.appendChild(h3);
    cart.appendChild(wrapperDiv);
    wrapperDiv.appendChild(btn);
    wrapperDiv.appendChild(p);
    pizzaBlock.appendChild(cart);
  }
}

craeteCart();

const backetBtn = document.querySelector(".backet-btn");
const closeIco = document.querySelector(".close-ico");
const bg = document.querySelector(".bg");
const backet = document.querySelector(".backet");

backetBtn.addEventListener("click", open);
bg.addEventListener("click", close);
closeIco.addEventListener("click", close);

function open() {
  backet.classList.add("backet--active");
  bg.classList.add("bg--active");
  body.style.overflow = "hidden";
}
function close() {
  backet.classList.remove("backet--active");
  bg.classList.remove("bg--active");
  body.style.overflow = "auto";
}

const pizzaBtn = document.querySelectorAll(".pizza__btn");
const selectPizzaWrapper = document.querySelector(".select__pizza-wrapper");
const bgSelect = document.querySelector(".bg-select");
const selectPizzaBlock = document.querySelector(".select__pizza-block");

function openSelectBlock() {
  selectPizzaWrapper.classList.add("select__pizza-wrapper--active");
  bgSelect.classList.add("bg-select--active");
  body.style.overflow = "hidden";
}
bgSelect.addEventListener("click", () => {
  selectPizzaWrapper.classList.remove("select__pizza-wrapper--active");
  bgSelect.classList.remove("bg-select--active");
  body.style.overflow = "auto";
});

function renderSelectBlock(index) {
  for (let key in data) {
    if (data[key]["id"] - 1 === index) {
      let img = document.createElement("img");
      img.src = data[key]["image"];
      img.classList.add("select__img");

      let div = document.createElement("div");
      div.classList.add("select__title-block");

      let h3 = document.createElement("h3");
      h3.classList.add("select__title");
      h3.textContent = data[key]["title"];

      let p = document.createElement("p");
      p.classList.add("select__description");
      p.textContent = data[key]["description"];

      let selectCostBlock = document.createElement("div");
      selectCostBlock.classList.add("select__cost-block");

      let pCost = document.createElement("p");
      pCost.classList.add("select__cost");
      pCost.textContent = data[key]["cost"] + " сум";

      let selectAddBtn = document.createElement("div");
      selectAddBtn.classList.add("select__add-btn");
      selectAddBtn.setAttribute("data-articul", `${key}`);
      selectAddBtn.textContent = "Добавить";

      selectPizzaBlock.append(img);
      selectPizzaBlock.append(div);
      div.append(h3);
      div.append(p);
      div.append(selectCostBlock);
      selectCostBlock.append(pCost);
      selectCostBlock.append(selectAddBtn);
    }
  }
}

pizzaBtn.forEach((item, i) => {
  item.addEventListener("click", () => {
    openSelectBlock();
    selectPizzaBlock.textContent = "";
    renderSelectBlock(i);
  });
});

let filterArr = [];
let dataBacket = [];

selectPizzaBlock.addEventListener("click", (e) => {
  if (e.target.classList.contains("select__add-btn")) {
    let articul = e.target.dataset["articul"];
    if (filterArr[articul] !== undefined) {
      filterArr[articul]["count"]++;
      filterArr[articul]["totalCost"] =
        filterArr[articul]["cost"] * filterArr[articul]["count"];
    } else {
      filterArr[articul] = data[articul];
      data[articul]["count"] = 1;
      filterArr[articul]["totalCost"] =
        filterArr[articul]["cost"] * filterArr[articul]["count"];
      dataBacket.push(filterArr[articul]);
    }
    renderBacketContent();
    renderBacketList();
    checkLengthData();
    selectPizzaWrapper.classList.remove("select__pizza-wrapper--active");
    bgSelect.classList.remove("bg-select--active");
    body.style.overflow = "auto";
  }
});

function renderBacketContent() {
  backetContent.innerHTML = "";
  dataBacket.forEach((item, i) => {
    backetContent.innerHTML += `
    <div class="backet-content__cart">
        <div class="backet-content__title-wrapper">
            <img class="backet-content__img" src="${item.image}" alt="img">
            <div>
                <h4 class="backet-content__title">${item.title}</h4>
                <p class="backet-content__description">${item.description}</p>
            </div>
        </div>
        <div class="backet-content__cost-wrapper">
            <p class="backet-content__cost">${item.totalCost} сум</p>
            <div class="backet-content__count-block">
                <i class="backet-content__count-minus fa-solid fa-minus"></i>
                <div class="backet-content__count">${item.count}</div>
                <i class="backet-content__count-plus fa-solid fa-plus"></i>
            </div>
        </div>
    </div>
    `;

    const countPlus = document.querySelectorAll(".backet-content__count-plus");
    const countMinus = document.querySelectorAll(
      ".backet-content__count-minus"
    );

    countPlus.forEach((item, j) => {
      item.addEventListener("click", () => {
        dataBacket[j].count++;
        dataBacket[j].totalCost = dataBacket[j].cost * dataBacket[j].count;
        renderBacketContent();
        renderBacketList();
      });
    });

    countMinus.forEach((item, k) => {
      item.addEventListener("click", () => {
        if (dataBacket[k].count > 0) {
          dataBacket[k].count--;
          dataBacket[k].totalCost = dataBacket[k].cost * dataBacket[k].count;
          renderBacketContent();
          renderBacketList();
          checkLengthData();
        }
        if (dataBacket[k].count === 0) {
          for (let key in filterArr) {
            delete filterArr[key];
          }
          dataBacket.splice(k, 1);
          renderBacketContent();
          renderBacketList();
          checkLengthData();
        }
      });
    });
  });
}

const openFormBtn = document.querySelector(".backet-open-form__btn");
const formWrapper = document.querySelector(".form-wrapper");
const formBg = document.querySelector(".form-bg");
const closeFormIco = document.querySelector(".close-form-ico");

openFormBtn.setAttribute("disabled", "true");
backetContent.classList.add("empty-flex");
function checkLengthData() {
  if (dataBacket.length >= 1) {
    openFormBtn.removeAttribute("disabled");
    backetContent.classList.remove("empty-flex");
  } else {
    openFormBtn.setAttribute("disabled", "true");
    backetContent.classList.add("empty-flex");
    backetContent.innerHTML = `
    <img class="empty-img" src="img/empty.png" alt="empty">
    `;
  }
}

openFormBtn.addEventListener("click", () => {
  formWrapper.classList.add("form-wrapper--active");
  formBg.classList.add("form-bg--active");
  backet.classList.remove("backet--active");
  bg.classList.remove("bg--active");
});
formBg.addEventListener("click", closeFormFunction);
closeFormIco.addEventListener("click", closeFormFunction);
function closeFormFunction() {
  formWrapper.classList.remove("form-wrapper--active");
  formBg.classList.remove("form-bg--active");
  body.style.overflow = "auto";
}

const backetFormList = document.querySelector(".backet-list");
const deliveTotalCost = document.querySelector(".delive__total-cost");

function renderBacketList() {
  backetFormList.innerHTML = "";
  dataBacket.forEach((item, i) => {
    backetFormList.innerHTML += `
    <div class="backet-item__wrapper">
      <p class="backet-item__title">${item.title}</p>
      <p class="backet-item__count">${item.count} шт.</p>
    </div>
    `;
  });
  totalCostFunction(dataBacket);
}
let totalCostMessage;
function totalCostFunction(a, b) {
  totalCostMessage =
    dataBacket.reduce(function (p, c) {
      return p + c.totalCost;
    }, 0) + " сум";
  deliveTotalCost.innerHTML = totalCostMessage;
}

const deliveBtn = document.querySelector(".delive-btn");

const inputName = document.querySelector(".input__name");
const inputNumber = document.querySelector(".input__number");
const textarea = document.querySelector(".textarea");

$(window).scroll(function () {
  let height = $(window).scrollTop();
  if (height > 70) {
    $(".header").addClass("header-active");
  } else {
    $(".header").removeClass("header-active");
  }
});

ymaps.ready(init);
function init() {
  build(coorX, coorY, true);
}
let userCoordinatesX
let userCoordinatesY
function build(x, y, point = false) {
  var myPlacemark,
    myMap = new ymaps.Map('mymap', {
      center: [x, y],
      zoom: 16
    });
  myPlacemark = new ymaps.Placemark([x, y], {}, {
    draggable: true
  });
  if (point) myMap.geoObjects.add(myPlacemark);

  userCoordinatesX = myPlacemark.geometry._coordinates[0]
  userCoordinatesY = myPlacemark.geometry._coordinates[1]

  myPlacemark.events.add('dragend', function () {
    userCoordinatesX = myPlacemark.geometry._coordinates[0]
    userCoordinatesY = myPlacemark.geometry._coordinates[1]
  });

}

inputName.oninput = function () {
  this.value = this.value.replace(/[^a-zа-яё]/gi, "");
};
inputNumber.addEventListener("input", function () {
  this.value = this.value.replace(/[^0-9+]/g, "");
  this.value = "+998 " + this.value.slice(4);
});
inputNumber.addEventListener("keypress", (e) => {
  if (e.keyCode === 43) {
    return (inputNumber.value = "");
  }
});

const successBlockWrapper = document.querySelector('.success-block__wrapper')
const successBg = document.querySelector('.success-bg')
const successBlock = document.querySelector('.success-block')
const successIco = document.querySelector('.success-ico')


function openSuccessModal() {
  body.style.overflow = "hidden";
  successBlockWrapper.classList.add('success-block__wrapper--active')
  successBg.classList.add('success-bg--active')
  successBlock.classList.add('success-block--active')
}

function checkUserInfo() {
  if (inputName.value.trim().length === 0) {
    inputName.placeholder = "Введите имя!";
    inputName.classList.add("input-danger");
  } else {
    inputName.classList.remove("input-danger");
    if (inputNumber.value.trim().length < 14) {
      inputNumber.placeholder = "Введите номер телефона!";
      inputNumber.classList.add("input-danger");
    } else {
      inputNumber.classList.remove("input-danger");
      createMessage();
    }
  }
}


function createMessage() {
  let message = "";

  message += "Имя: " + inputName.value + "%0A";
  message += "Телефон: " + inputNumber.value + "%0A";
  message += "Описание: " + textarea.value + "%0A%0A";

  dataBacket.forEach((item, i) => {
    if (item.totalCost !== 0) {
      message += `${item.title} - ${item.count}шт.  цена: ${item.totalCost}`;
    }
  });

  message += "%0A%0AИтого: " + totalCostMessage;
  message += "%0A%0A" + "Адрес: " + `https://yandex.uz/maps/10334/samarkand/?ll=${userCoordinatesY}%2C${userCoordinatesX}%26mode=search%26sll=${userCoordinatesY}%2C${userCoordinatesX}%26text=${userCoordinatesX}%2C${userCoordinatesY}%26z=19`;

  const token = "5531036925:AAFG6cWxN6CrIYsuZ2jmNftq1PJezsJFgiY";
  const profileId = "-629330673";
  let url =
    "https://api.telegram.org/bot" +
    token +
    "/sendMessage?chat_id=" +
    profileId +
    "&text=";
  let xttp = new XMLHttpRequest();
  xttp.open("GET", url + message, true);
  xttp.send();
  openSuccessModal()

}

function loadWin() {
  window.location.reload()
}

deliveBtn.addEventListener("click", checkUserInfo);
successIco.addEventListener("click", loadWin);

