// load categories
const loadCategories= () =>{
    fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((json)=> displayCategories(json.categories));
}
// spinner
const manageSpinner=(status)=>{
    if(status==true){
        document.getElementById("spinner").classList.remove("hidden")
        document.getElementById("tree-container").classList.add("hidden");
    }
    else{
               document.getElementById("spinner").classList.add("hidden")
        document.getElementById("tree-container").classList.remove("hidden");
    }
}


// remove active class
const removeactive=()=>{
    const categoryBtns= document.querySelectorAll(".category-btn");
    categoryBtns.forEach(btn=>btn.classList.remove("active"))
    
}
//  load category tree
const loadCategoryTree=(id)=>{
    manageSpinner(true);
   const url = `https://openapi.programming-hero.com/api/category/${id}`;
    fetch(url)
   .then((res)=>res.json())
   .then((data)=>{
    const clickbtn=document.getElementById(`category-btn-${id}`)
    removeactive();
    clickbtn.classList.add("active")
    displayCategoryTree(data.plants)
   })
  
};
// load tree detail
const loadTreeDetail =async(id)=>{
    const url=`https://openapi.programming-hero.com/api/plant/${id}`
    
    const res= await fetch(url);
    const details  = await res.json();
   displayTreeDetail(details.plants);
}
// display tree detail in modal
const displayTreeDetail =(plant)=>{
    
    const detailsbox = document.getElementById("details-container")
    detailsbox.innerHTML=`
    <div class=" bg-white mt-3 md:mt-0 p-4 rounded-lg inter-font">
                    <img class="rounded-lg min-h-[180px] max-h-[180px] w-full object-cover" src="${plant.image}" alt="">
                    <p onclick="loadTreeDetail(${plant.id})" class="mt-2 font-bold text-xl">${plant.name}</p>
                    <p class="mt-2 text-[#1f2937] text-[12px] ">${plant.description}
                    </p>
                    <div class=" flex justify-between items-center mt-2">
                        <button class="btn rounded-3xl text-[#15803D]  bg-[#DCFCE7] geist-font text-[12px]">${plant.category}</button>
                        <p class="font-semibold mr-2 text-[12px]"> <span class="font-extrabold">৳</span> ${plant.price}</p>
                    </div>
                </div>
    `
    document.getElementById("my_modal_5").showModal();

}
// display category tree
const displayCategoryTree = (trees) => {
    const treecontainer = document.getElementById("tree-container");
    treecontainer.innerHTML = "";

    trees.forEach(tree => {
        const card = document.createElement("div");
        card.innerHTML = `
            <div class="bg-white mt-3 md:mt-0 p-4 rounded-lg inter-font">
                <img class="rounded-lg min-h-[180px] max-h-[180px] w-full object-cover" src="${tree.image}" alt="">
                <p onclick="loadTreeDetail(${tree.id})" class="mt-2 font-bold text-xl cursor-pointer">${tree.name}</p>
                <p class="mt-2 text-[#1f2937] text-[12px] line-clamp-2">${tree.description}</p>
                <div class="flex justify-between items-center mt-2">
                    <button class="btn rounded-3xl text-[#15803D] bg-[#DCFCE7] geist-font text-[12px]">${tree.category}</button>
                    <p class="font-semibold mr-2 text-[12px]"> <span class="font-extrabold">৳</span> ${tree.price}</p>
                </div>
                <button class="btn w-full rounded-3xl mt-2 bg-[#15803d] text-white add-to-cart-btn" data-id="${tree.id}" data-name="${tree.name}">
                    Add to cart
                </button>
            </div>
        `;
        treecontainer.append(card);
    });

    // Attach alert + loadCart behavior
    const addBtns = treecontainer.querySelectorAll(".add-to-cart-btn");
    addBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const treeName = btn.getAttribute("data-name");
            const treeId = btn.getAttribute("data-id");

            if (confirm(`${treeName} added to the cart!`)) {
                loadCart(treeId);
            }
        });
    });

    manageSpinner(false);
}

//load cart
const loadCart=async(id)=>{
    const url=`https://openapi.programming-hero.com/api/plant/${id}`
    fetch(url)
    .then((res)=>res.json())
    .then((data)=> displaycart(data.plants))

}
// display cart
let cartItems = []; 
const displaycart=(plant)=>{
    const cartcontainer = document.getElementById("cart-container");
    const cartDiv = document.createElement("div");
    cartDiv.innerHTML=`
                <div class="bg-[#F0FDF4] p-[12px] flex justify-between items-center rounded-lg my-3">
                    <div class="inter-font">
                    <p>${plant.name}</p>
                    <p class="text-[#8C8C8C] pt-1.5">৳ <span>${plant.price}</span> x 1</p>
                    </div>
                    <div>
                        <i class="fa-solid fa-xmark text-[#8C8C8C]  cursor-pointer remove-btn"></i>
                    </div>
                </div>
`
    cartcontainer.append(cartDiv);
    cartItems.push(plant);
    // Update total price
    const updateTotalPrice = () => {
        const totalSpan = document.getElementById("total-price");
        const total = cartItems.reduce((sum, item) => sum + Number(item.price), 0);
        totalSpan.textContent = total;
    };

    // Initial total update
    updateTotalPrice();

    // Remove button functionality
    const removeButton = cartDiv.querySelector(".remove-btn");
    removeButton.addEventListener("click", () => {
        cartDiv.remove(); 
        cartItems = cartItems.filter(i => i.id !== plant.id); 
        updateTotalPrice(); 
    });
}






// display categories
const displayCategories =(categories)=>{
  const categorycontainer = document.getElementById("category-container");
  categorycontainer.innerHTML="";

  // Add "All Trees" button dynamically
  const allBtnDiv = document.createElement("div");
  allBtnDiv.innerHTML = `
    <button id="category-btn-all" onclick="loadAllTreeWithActive(this)" 
        class="btn w-full md:w-52 p-2.5 border-none justify-start bg-transparent outline-none hover:bg-[#15803d] hover:text-white category-btn">
      All Trees
    </button>
  `;
  categorycontainer.append(allBtnDiv);

  // Add API categories
  for(let category of categories){
      const btnDiv = document.createElement("div");
      btnDiv.innerHTML=`
        <button id="category-btn-${category.id}" onclick="loadCategoryTree(${category.id})" 
          class="btn w-full md:w-52 p-2.5 border-none justify-start bg-transparent outline-none hover:bg-[#15803d] hover:text-white category-btn">
          ${category.category_name}
        </button>
      `;
      categorycontainer.append(btnDiv);
  }
}
const loadAllTreeWithActive = (btn) => {
    removeactive();
    btn.classList.add("active");
    loadAllTree();
}

// Function for "All Trees" button


// load all tree
const loadAllTree=()=>{
    manageSpinner(true);
    fetch("https://openapi.programming-hero.com/api/plants")
    .then((res)=> res.json())
    .then((json)=> displayAllTree(json.plants))
}
// `display all tree
const displayAllTree = (plants) => {
    const treecontainer = document.getElementById("tree-container");
    treecontainer.innerHTML = "";

    plants.forEach(plant => {
        const card = document.createElement("div");
        card.innerHTML = `
            <div class="bg-white mt-3 md:mt-0 p-4 rounded-lg inter-font">
                <img class="rounded-lg min-h-[180px] max-h-[180px] w-full object-cover" src="${plant.image}" alt="">
                <p onclick="loadTreeDetail(${plant.id})" class="mt-2 font-bold text-xl cursor-pointer">${plant.name}</p>
                <p class="mt-2 text-[#1f2937] text-[12px] line-clamp-2">${plant.description}</p>
                <div class="flex justify-between items-center mt-2">
                    <button class="btn rounded-3xl text-[#15803D] bg-[#DCFCE7] geist-font text-[12px]">${plant.category}</button>
                    <p class="font-semibold mr-2 text-[12px]"> <span class="font-extrabold">৳</span> ${plant.price}</p>
                </div>
                <button class="btn w-full rounded-3xl mt-2 bg-[#15803d] text-white add-to-cart-btn" data-id="${plant.id}" data-name="${plant.name}">
                    Add to cart
                </button>
            </div>
        `;
        treecontainer.append(card);
    });

    const addBtns = treecontainer.querySelectorAll(".add-to-cart-btn");
    addBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const plantName = btn.getAttribute("data-name");
            const plantId = btn.getAttribute("data-id");

            if (confirm(`${plantName} added to the cart!`)) {
                loadCart(plantId);
            }
        });
    });

    manageSpinner(false);
}

// button prevent
const form = document.getElementById("tree-form");

  form.addEventListener("submit", function(event) {
    event.preventDefault(); 

  });
//   initial load
loadAllTree();
loadCategories();
