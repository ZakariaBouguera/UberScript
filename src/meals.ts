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

export async function fetchMeals(): Promise<Meal[]> {
  try {
    // on appelle l'API
    const response = await fetch("https://keligmartin.github.io/api/meals.json")

    // en cas d'erreur
    if (!response.ok) {
      throw new Error(`Erreur serveur : ${response.status}`)
    }

    // on convertit la réponse en json
    const meals: Meal[] = await response.json()
    return meals
    }
    catch (error) {
    // si l'API échoue
    console.error("Erreur lors du chargement des repas")
    // on renvoie un tableau vide
    return []
  }
}