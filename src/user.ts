import { Meal, Order } from "./meals.js"

export class TropPauvreErreur extends Error {
  // info pour l'erreur 
  public solde: number    // ce qu'il reste dans le wallet
  public prixCommande: number  // le prix de la commande

  constructor(message: string, solde: number, prixCommande: number) {
    super(message) 
    this.name = "TropPauvreErreur"
    this.solde = solde
    this.prixCommande = prixCommande
  }
}
//class et condtructeur
export class User {
  id: number
  name: string
  wallet: number   
  orders: Order[]

  constructor(id: number, name: string, wallet: number) {
    this.id = id
    this.name = name
    this.wallet = wallet
    this.orders = []
  }

  orderMeal(meal: Meal): void {
    // vérification si la personne a assez d'argent 
    if (meal.price > this.wallet) {
      throw new TropPauvreErreur(
        `ta pas de sous ! "${meal.name}"`,
        this.wallet,        
        meal.price
      )
    }
    this.wallet -= meal.price // retirer le montant du wallet

    const newOrder: Order = {
      id: Date.now(),
      meals: [meal],       
      total: meal.price
    }

    this.orders.push(newOrder) // on ajoute la commande au tableau

    //localStorage permettant de garder les données après la recherage de la page
    this.saveOrders()
  }
  saveOrders(): void {
    localStorage.setItem(`orders_${this.id}`, JSON.stringify(this.orders))
  }

  loadOrders(): void {
    // On récupère les commandes sauvegardées
    const saved = localStorage.getItem(`orders_${this.id}`)

    if (saved) {
      this.orders = JSON.parse(saved) as Order[]
    }
  }
}