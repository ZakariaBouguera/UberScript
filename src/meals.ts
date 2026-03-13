// type repas
export type Meal = {
  id: number      
  name: string    
  calories: number
  price: number   
}

// type commande
export type Order = {
  id: number     
  meals: Meal[]  
  total: number  
}
