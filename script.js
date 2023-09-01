// Variables

const btnContainer = document.getElementById("btn-container");

const cardContainer = document.getElementById("card-container");

const mainSection = document.getElementById("main");

const errorContainer = document.getElementById("error-container");

let categoryBtns = "";

let currentID = 1000;
let currentBtn = "All";

const category_url =
  "https://openapi.programming-hero.com/api/videos/categories";

// Functions

const getData = async (id) => {
  const response = await fetch(
    `https://openapi.programming-hero.com/api/videos/category/${id}`
  );

  const data = await response.json();

  return data;
};

const showCategory = async () => {
  const response = await fetch(category_url);
  const data = await response.json();

  let html = "";

  data?.data?.map(({ category_id, category }) => {
    curHtml = "";

    if (category === "All") {
      html += `
      <button
        onclick="showProduct(${category_id}, '${category}')"
        type="button"
        class="category-btn border bg-[#FF1F3D] text-white px-3 sm:px-4 font-medium text-sm py-1"
      >
        ${category}
    </button>
      `;
    } else {
      html += `
      <button
        onclick="showProduct(${category_id}, '${category}')"
        type="button"
        class="category-btn border bg-gray-500/30 text-black/70 px-3 sm:px-4 font-medium text-sm py-1"
      >
        ${category}
      </button> `;
    }
  });

  categoryBtns = document.getElementsByClassName("category-btn");

  btnContainer.innerHTML = html;
};

const activeBtn = (name) => {
  for (let i = 0; i < categoryBtns.length; i++) {
    if (categoryBtns[i].innerText == currentBtn) {
      categoryBtns[i].classList.remove("bg-gray-500/30");
      categoryBtns[i].classList.add("bg-[#FF1F3D]");

      categoryBtns[i].classList.remove("text-black/70");
      categoryBtns[i].classList.add("text-white");
    } else {
      categoryBtns[i].classList.remove("bg-[#FF1F3D]");
      categoryBtns[i].classList.add("bg-gray-500/30");

      categoryBtns[i].classList.remove("text-white");
      categoryBtns[i].classList.add("text-black/70");
    }
  }
};

const showProduct = async (id, name, sortData) => {
  let data;

  errorContainer.classList.add("hidden");
  errorContainer.classList.remove("flex");
  cardContainer.innerHTML = "";

  currentID = id;
  currentBtn = name;

  activeBtn(currentBtn);

  !sortData ? (data = await getData(id)) : (data = sortData);

  handleNoData(data);

  let html = "";

  data?.data?.map((item) => {
    let time = null;

    item?.others?.posted_date ? (time = Number(item?.others?.posted_date)) : "";

    html += `
    
    <div class="grid grid-cols-1 gap-2">
        <!-- Card Img -->
        <div class="relative">
            <img
                src=${item?.thumbnail}
                alt=""
                class="rounded-xl h-full w-full object-cover"
            />
            <p
                class="text-white text-sm absolute bottom-[2%] right-[2%] bg-black px-1 py-[2px]"
            >
                ${time ? secToHour(time) : ""}
            </p>
        </div>

        <!-- Card Content -->

        <div class="flex gap-3">
            <!-- Card Profile Img -->
            <div class="w-max">
                <img
                    src=${item?.authors[0]?.profile_picture}
                    alt=""
                    class="rounded-full w-[45px] md:w-[50px] lg:w-[60px] xl:w-[50px] h-[40px] lg:h-[30px] object-cover"
                />
            </div>

            <!-- Card Right Content -->
            <div class="text-sm text-[#171717b3]">
                <h1 class="font-bold text-md text-black">
                Building a Winning UX Strategy Using the Kano Model
                </h1>
                <div class="flex gap-2">
                    <p class="">${item?.authors[0]?.profile_name}</p>
                    ${
                      item?.authors[0].verified
                        ? "<img src='./images/verified.svg'>"
                        : ""
                    }
                </div>
                <p class="">${item?.others?.views} views</p>
            </div>
        </div>
  </div>

    `;

    cardContainer.innerHTML = html;
  });
};

const handleNoData = (data) => {
  if (data?.data?.length == 0) {
    errorContainer.classList.remove("hidden");
    errorContainer.classList.add("flex");

    errorContainer.innerHTML = `
      <!-- 404 page -->
      
        <div
          class="flex flex-col gap-2 justify-center items-center w-[300px] text-center"
        >
          <img src="./images/icon.png" alt="" />
          <h2 class="font-bold text-2xl">
            Opps!! Sorry, There is no content here
          </h2>
        </div>
      
      `;
  }
};

const secToHour = (sec) => {
  const hour = Math.floor(sec / 3600);
  const minute = Math.floor((sec / 60) % 60);
  return `${hour}hrs ${minute}min ago`;
};

const comparator = (a, b) => {
  return (
    Number(b?.others?.views.slice(0, -1)) -
    Number(a?.others?.views.slice(0, -1))
  );
};

const sortByView = async () => {
  const data = await getData(currentID);
  data?.data.sort(comparator);
  showProduct(currentID, currentBtn, data);
};

showCategory();
showProduct(1000);

console.log(secToHour(""));
