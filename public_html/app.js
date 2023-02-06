//url používané na lokálnu prácu s dátami
const url = "./titanium.json";
//url na ťahanie json dát zo servera
//const url = "https://63da6fbb2af48a60a7cdc739.mockapi.io/api/v1/sample_data";
const btn = document.querySelector('.btn');
const table = document.querySelector('.table');
const login = document.querySelector('.login');
const td = document.querySelectorAll('td');
const content = document.querySelector('.content');
const singleItem = document.getElementById('#singleItem');
const developer = document.querySelector('.developer');
const modalPhoneSection = document.querySelector('.modalPhoneSection');
const dialPhone = new Audio('./assets/sounds/phone.mp3');

//---------pripojenie k dátam a ich zobrazenie, volá sa až keď je správne meno a heslo----------
const fetchData = async () => {
    const response = await fetch(url);
    const data = await response.json();
    newData = [...data];
    displayItems(newData,data);
};

//---------------začiatok login appky + natiahnutie dát--------------
btn.addEventListener('click', function (e) {
    e.preventDefault();
    const name = document.getElementById('name');
    const password = document.getElementById('password');
    const nameValue = name.value;
    const passwordValue = password.value;
    if (nameValue === 'admin' && passwordValue === '2023') {
        login.classList.remove('flex');
        login.classList.add('hidden');
        fetchData();
    } else {
        alert('Incorrect name or password!!!');
    }
});
//---------------koniec login appky + natiahnutie dát--------------


//-------------zobrazenie dát(zároveň su tu funkčnosti mazanie riadkov, reload dát, search dát a otváranie jednotlivého developera)-------
const displayItems = (newItems,items) => {
    content.classList.add('flex');

    if (newItems.length < 1) {
        table.innerHTML = `<h3 class="noMatch">Sorry, such Developer name doesn't exist in our database. Please try again.</h3>
                                <button class="backToDev">Back to the List of Developers</button>`;
        const backToDev = document.querySelector('.backToDev');
        backToDev.addEventListener('click', () => fetchData());
        return;

    }

    const displayData = newItems.map((item) => {
        return `<tr id=${item.id} class="tr">
                    <td><img src="${item.avatar}"/></td>
                    <td>${item.name}</td>
                    <td><a href="#">${item.phone_number}</a></td>
                    <td><a href="#">${item.email}</a></td>
                    <td><button class="deleteBtn">
                            <i class="fas fa-times"></i>
                        </button></td>
                </tr>`;
    }).join("");
    table.innerHTML =
            ` <form class="searchForm">
                    <input type="search" id="search" name="search" class="search" 
                        placeholder="Search by name">
                </form>
                <div class="reloadData">
                    <button type="button" class="reloadDataBtn">Reload Data</button>  
                    <button type="button" class="logOut">Log Out</button>  
                </div>
            <div style="overflow-x: auto;">
              <table border="0" id="table">
                <thead>
                    <tr style="background:#8DA9C4 margin-bottom:1rem">
                    <th>Avatar</th>
                    <th>Name</th>
                    <th>Phone number</th>
                    <th>Email</th>
                    <th>Delete</th>
                    </tr>
                </thead>
                <tbody id="tbody">
                    ${displayData}
                </tbody>
            </table>
            </div>`;

      //---------------listener na odstránenie riadku v zozname-------------------       
    const deleteBtn = document.querySelectorAll('.deleteBtn');
    deleteBtn.forEach(function (btn) {
        btn.addEventListener('click', deletePerson);
    });
    //------------------listener na otvorenie detailov developera----------------
    const trows = document.querySelectorAll('.tr');
    trows.forEach(function (trow) {
        trow.addEventListener('dblclick', openDeveloper);
    });
    //----------------reload dát--------------------
  const reloadDataBtn = document.querySelector('.reloadDataBtn');
  reloadDataBtn.addEventListener('click', ()=> fetchData());
  //akože odhlásenie
  const logOut = document.querySelector('.logOut');
  logOut.addEventListener('click', ()=> window.location.reload());
//      https://developers-app.netlify.app/   http://localhost:8383/Titanium-developers-app/index.html

 //----------------search podľa mena-------------------
 const searchForm = document.querySelector('.searchForm');
 const search = document.querySelector('.search');

 searchForm.addEventListener('submit', () => {
     let value = search.value;
     newItems = items.filter((person) => {
         let finalValue = person.name.toLowerCase().includes(value);
         return finalValue;
     });
     displayItems(newItems,items);
 });
};

  

//-----------mazanie jednotlivých osôb, funkcia volaná v rámci funkcie displayItems-------------
function deletePerson(e) {
    const element = e.currentTarget.parentElement.parentElement;
    const tbody = document.getElementById('tbody');
    tbody.removeChild(element);
}

//---------------otvorí podrobný list developera, volaná vo funkcii displayItems------------
function openDeveloper(e) {
    content.classList.add('hidden');
    content.classList.remove('flex');
    developer.classList.remove('hidden');

    const img = e.currentTarget.children[0].children[0].src;
    const name = e.currentTarget.children[1].textContent;
    const phone = e.currentTarget.children[2].children[0].textContent;
    const email = e.currentTarget.children[3].children[0].textContent;
    const id = e.currentTarget.id;

    developer.innerHTML = `<div class="developerContainer">
                <h1 class="developerNumber">Developer: <span>${id}</span></h1>
                <img src="${img}" alt="" class="bigImg">
                <h2 class="developerName"><i class="fa-solid fa-person personIcon"></i><span>${name}</span></h2>
                <h3 class="modalPhone"><i class="fa-solid fa-phone-flip phoneIcon"></i><span>${phone}</span></h3>
               <h3 class="modalEmail"><i class="fa-solid fa-envelope emailIcon"></i><span>${email}</span></h3>
            <div class="btn-container">
               <button type="button" class="backBtn">Back To List</button>
            </div>
            </div>`;
    const backBtn = document.querySelector('.backBtn');
    backBtn.parentElement.addEventListener('click', backToData);
    const modalPhone = document.querySelector('.modalPhone');
    modalPhone.addEventListener('click', openModalPhone);
    const modalEmail = document.querySelector('.modalEmail');
    modalEmail.addEventListener('click', openModalEmail);
}

//-------------návrat do zoznamu developerov, volaná vo funkcii openDeveloper----------------
const backToData = () => {
    content.classList.remove('hidden');
    developer.classList.add('hidden');
};


//---------------otvára a zatvára dialógové okno na simulované volanie developerovi----------------
const openModalPhone = (e) => {
    developer.classList.add('hidden');
    dialPhone.play();
    const phone = e.currentTarget.children[1].textContent;

    modalPhoneSection.innerHTML = ` <div class="modalPhoneContainer">
                                    <h1>${phone}</h1>
                                    <h1>Calling...</h1>
                                    <button class="closeModalPhone">
                                        <i class="fa-solid fa-phone-slash"></i>
                                    </button>
                                   </div>`;
    modalPhoneSection.classList.remove('hidden');
    modalPhoneSection.classList.add('flex');
    modalPhoneSection.classList.add('boxShadow');
    const closeModalPhone = document.querySelector('.closeModalPhone');
    closeModalPhone.addEventListener('click', closePhone);
};
//-----------------uzatvára dialógové okno na simulované volanie developerovi------------------
function closePhone() {
    developer.classList.remove('hidden');
    modalPhoneSection.classList.add('hidden');
    modalPhoneSection.classList.remove('flex');
    modalPhoneSection.classList.remove('boxShadow');
    dialPhone.pause();
    dialPhone.currentTime = 0;

}
;

//-----------------------otvára a zatvára dialógové okno na poslanie mailu developerovi------------------
const openModalEmail = (e) => {
    developer.classList.add('hidden');
    const email = e.currentTarget.children[1].textContent;
    const modalEmailSection = document.querySelector('.modalEmailSection');

    modalEmailSection.innerHTML = ` <button class="emailBtn">Send email to: ${email}</button>
                                    <button class="closeModalEmail">
                                        Back to Developer Info
                                    </button>`;
    
const emailBtn = document.querySelector('.emailBtn');
emailBtn.addEventListener('click', ()=> window.open(`mailto:${email}?subject=subject&body=body`));

    modalEmailSection.classList.remove('hidden');
    modalEmailSection.classList.add('flex');
    modalEmailSection.classList.add('boxShadow');
    const closeModalEmail = document.querySelector('.closeModalEmail');
    closeModalEmail.addEventListener('click', closeEmail);

//-------------------uzatvára dialógové okno na posielanie mailov developerovi----------------    
    function closeEmail() {
        developer.classList.remove('hidden');
        modalEmailSection.classList.add('hidden');
        modalEmailSection.classList.remove('flex');
        modalEmailSection.classList.remove('boxShadow');
    }
    ;
};