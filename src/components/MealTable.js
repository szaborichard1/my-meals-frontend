import axios from "axios";
import { useEffect, useState } from "react";
import '../style/table.css';

const MealTable = ({meal}) => {

    const [ingredients, setIngredients] = useState([])
    const [instructions, setInstructions] = useState([])
    const [actualMeal, setActualMeal] = useState([])

    useEffect(() => {
        setActualMeal(meal);
    }, [meal])

    useEffect(() => {
        pairIngredientsData(actualMeal)
        sliceUpInstructions(actualMeal.strInstructions);
    }, [actualMeal])

    const pairIngredientsData = (actualMeal) => {
        let result = []
        for(let i = 1; i <= 20; i++){
            let ingredientType = actualMeal["strIngredient" + i]
            let ingredientMeasure = actualMeal["strMeasure" + i]
            if(ingredientType !== undefined && ingredientType !== null){
                if(ingredientType.length !== 0){
                    result.push(`${ingredientType} - ${ingredientMeasure}`)
                }
            }
        }
        setIngredients(result)
    }

    const getMeal = () => {
        const url = "https://www.themealdb.com/api/json/v1/1/random.php";
        axios
        .get(url)
        .then((res) => setActualMeal(res.data.meals[0]))
      }

    const sliceUpInstructions = (instructions) => {
        if (instructions !== undefined){
            let cleanedInstructions = []
            let slicedInstructions = instructions.split("\r\n");
            for(let i = 0; i < slicedInstructions.length; i++){
                if(slicedInstructions[i].length > 10){
                    cleanedInstructions.push(slicedInstructions[i].replace("\r\n", ""));
                }
            }
            setInstructions(cleanedInstructions);
        }
    }

    const saveAndSendEmailWithMeal = () => {
        const url = "http://localhost:8080/recipe/add";
        axios.post(url, {
            recipeId: actualMeal.idMeal,
            name: actualMeal.strMeal,
            category: actualMeal.strCategory,
            area: actualMeal.strArea,
            instructions: actualMeal.strInstructions.split("\r\n\r\n"),
            imageLink: actualMeal.strMealThumb,
            youtubeVideoLink: actualMeal.strYoutube,
            sourceLink: actualMeal.strSource,
            ingredients: ingredients
        })
    }

    if (ingredients === undefined) {
        return <h1>Loading...</h1>
    } else {
        return <div>
                    <h1>{actualMeal.strMeal}</h1>
                    <table>
                        <caption>Ingredients</caption>
                        <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Ingredient type</th>
                            <th scope="col">Ingredient measure</th>
                        </tr>
                        </thead>
                        <tbody>
                                {ingredients.map((ingredient) =>
                                <>
                                    <tr>
                                        <td data-column="ID">{ingredients.indexOf(ingredient) + 1}</td>
                                        <td data-column="Ingredient type">{ingredient.split(" - ")[0]}</td>
                                        <td data-column="Ingredient measure">{ingredient.split(" - ")[1]}</td>
                                    </tr>
                                </>
                                )}
                        </tbody>
                    </table>
                    <div id="infobox">
                    <h3 class="about">How to make it:</h3>
                    {actualMeal.strYoutube != undefined? <iframe width="50%" height="50%"
                    src={actualMeal.strYoutube.replace("watch?v=", "embed/")}>
                    </iframe>: <></>}
                    <ol>
                        {instructions.map((instruction) => 
                            <li>{instruction}</li>
                        )}
                    </ol>
                    </div>
                    <button onClick={saveAndSendEmailWithMeal}>Send me this via email</button>
                    <button onClick={getMeal}>Show me another one!</button>
                </div>
    }
}



export default MealTable;