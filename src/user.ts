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

  orderMeals(meals: Meal[]): void {
  // meals est un tableau, donc on calcule le total avec reduce
  const total = meals.reduce((sum, meal) => sum + meal.price, 0)

  // On compare le total (pas meals.price qui n'existe pas sur un tableau)
  if (total > this.wallet) {
    throw new TropPauvreErreur(
      `ta pas de sous !`,
      this.wallet,
      total
    )
  }

  this.wallet -= total // on retire le total (pas meals.price)

  const newOrder: Order = {
    id: Date.now(),
    meals: meals,   // meals est déjà un tableau, pas besoin de [meals]
    total: total
  }

  this.orders.push(newOrder)
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