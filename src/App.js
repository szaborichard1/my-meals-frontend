import axios from 'axios';
import { useEffect, useState } from 'react';
import './style/App.css';
import MealTable from './components/MealTable';

function App() {
  const [randomMeal, setRandomMeal] = useState([])
  const [receivedRandomMeal, setReceivedRandomMeal] = useState(false);

  const getMeal = () => {
    const url = "https://www.themealdb.com/api/json/v1/1/random.php";
    axios
    .get(url)
    .then((res) => setRandomMeal(res.data.meals[0]))
    setReceivedRandomMeal(true);
  }

  return (
    <div className="App">
      {receivedRandomMeal? <MealTable meal={randomMeal} key={randomMeal.idMeal}/>: 
      <div>
      <h1>
        Random meal for every day!
      </h1>
      <h3>
        What is the purpose of this page?
      </h3>
      <p>
        To surprise you with delicious meals every day.
      </p>
      <button onClick={getMeal}>I want my daily meal!</button>
      </div>
    }
    </div>
  );
}

export default App;
