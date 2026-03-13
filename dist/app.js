var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fetchMeals } from "./meals.js";
import { User, TropPauvreErreur } from "./user.js";
const user = new User(1, "Bob", 30);
user.loadOrders();
let panier = [];
let tousLesRepas = [];
let nextMealId = 1000;
const mealListEl = document.getElementById("mealList");
const menuListEl = document.getElementById("menuList");
const menuTotalHTEl = document.getElementById("menuTotalHT");
const menuTotalTTCEl = document.getElementById("menuTotalTTC");
const calculateMenuBtn = document.getElementById("calculateMenuBtn");
const orderMenuBtn = document.getElementById("orderMenuBtn");
const addMealBtn = document.getElementById("addMealBtn");
const walletDisplayEl = document.getElementById("wallet");
const walletErrorEl = document.getElementById("walletError");
const userNameEl = document.getElementById("user");
const orderHistoryEl = document.getElementById("orderHistory");
const mealNameInput = document.getElementById("mealName");
const mealCaloriesInput = document.getElementById("mealCalories");
const mealPriceInput = document.getElementById("mealPrice");
//affichage du portefeuille
function updateWalletDisplay() {
    walletDisplayEl.textContent = `${user.wallet}€`;
    userNameEl.textContent = user.name;
}
// affichage de l'historique des commande
function updateOrderHistory() {
    orderHistoryEl.innerHTML = "";
    if (user.orders.length === 0) {
        orderHistoryEl.innerHTML = "<p class='text-muted'>Aucune commande</p>";
        return;
    }
    user.orders.forEach((order) => {
        const div = document.createElement("div");
        div.className = "alert alert-secondary py-2";
        const mealNames = order.meals.map((m) => m.name).join(", ");
        div.textContent = `Commande #${order.id} — ${mealNames} — ${order.total}€`;
        orderHistoryEl.appendChild(div);
    });
}
function displayMeals() {
    mealListEl.innerHTML = "";
    if (tousLesRepas.length === 0) {
        mealListEl.innerHTML = "<li class='list-group-item'>Aucun repas dispo.</li>";
        return;
    }
    tousLesRepas.forEach((meal) => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        const span = document.createElement("span");
        span.textContent = `${meal.name} prix: ${meal.price}€ calories: ${meal.calories} kcal`;
        const btn = document.createElement("button");
        btn.className = "btn btn-sm btn-outline-primary";
        btn.textContent = "Ajouter";
        btn.addEventListener("click", () => addToMenu(meal));
        li.appendChild(span);
        li.appendChild(btn);
        mealListEl.appendChild(li);
    });
}
// ajoute un repas au panier
function addToMenu(meal) {
    panier.push(meal);
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.textContent = `${meal.name} prix: ${meal.price}€`;
    const removeBtn = document.createElement("button");
    removeBtn.className = "btn btn-sm btn-outline-danger";
    removeBtn.textContent = "Supprimer";
    removeBtn.addEventListener("click", () => {
        const index = panier.indexOf(meal);
        if (index > -1)
            panier.splice(index, 1);
        li.remove();
    });
    li.appendChild(removeBtn);
    menuListEl.appendChild(li);
}
// calcul ht + tva 10%
calculateMenuBtn.addEventListener("click", () => {
    const totalHT = panier.reduce((sum, meal) => sum + meal.price, 0);
    const totalTTC = totalHT * 1.1;
    menuTotalHTEl.textContent = totalHT.toFixed(2);
    menuTotalTTCEl.textContent = totalTTC.toFixed(2);
});
orderMenuBtn.addEventListener("click", () => {
    walletErrorEl.textContent = "";
    if (panier.length === 0) {
        walletErrorEl.textContent = "⚠️ panier vide";
        return;
    }
    try {
        user.orderMeals(panier);
        updateWalletDisplay();
        updateOrderHistory();
        // reset panier
        panier = [];
        menuListEl.innerHTML = "";
        menuTotalHTEl.textContent = "0";
        menuTotalTTCEl.textContent = "0";
    }
    catch (error) {
        if (error instanceof TropPauvreErreur) {
            walletErrorEl.textContent =
                `${error.message} — solde : ${error.solde}€ | total : ${error.prixCommande}€`;
        }
        else {
            walletErrorEl.textContent = "erreur inattendue";
        }
    }
});
addMealBtn.addEventListener("click", () => {
    const name = mealNameInput.value.trim();
    const calories = parseInt(mealCaloriesInput.value);
    const price = parseFloat(mealPriceInput.value);
    // validation basique
    if (!name || isNaN(calories) || isNaN(price)) {
        alert("remplis tous les champs !");
        return;
    }
    const newMeal = { id: nextMealId++, name, calories, price };
    tousLesRepas.push(newMeal);
    displayMeals();
    mealNameInput.value = "";
    mealCaloriesInput.value = "";
    mealPriceInput.value = "";
});
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        updateWalletDisplay();
        updateOrderHistory();
        // fetch les repas depuis l'api
        const repasApi = yield fetchMeals();
        tousLesRepas = repasApi;
        displayMeals();
    });
}
init();
