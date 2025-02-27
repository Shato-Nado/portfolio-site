// Калькулятор
const display = document.getElementById('display');
const buttonsContainer = document.getElementById('calculatorButtons');

const buttons = [
  '7', '8', '9', '/',
  '4', '5', '6', '*',
  '1', '2', '3', '-',
  '0', '.', '=', '+',
  'C'
];

buttons.forEach(buttonText => {
  const button = document.createElement('button');
  button.textContent = buttonText;
  button.classList.add('btn');
  button.addEventListener('click', () => {
    if (buttonText === '=') {
      try {
        display.value = eval(display.value);
      } catch {
        display.value = 'Ошибка';
      }
    } else if (buttonText === 'C') {
      display.value = '';
    } else {
      display.value += buttonText;
    }
  });
  buttonsContainer.appendChild(button);
});

// Отзывы
const reviewsForm = document.getElementById('reviewsForm');
const reviewsList = document.getElementById('reviewsList');

reviewsForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const text = document.getElementById('text').value;

  if (name && text) {
    const review = document.createElement('div');
    review.innerHTML = `<strong>${name}:</strong> ${text}`;
    reviewsList.appendChild(review);

    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    reviews.push({ name, text });
    localStorage.setItem('reviews', JSON.stringify(reviews));

    reviewsForm.reset();
  }
});

window.addEventListener('load', () => {
  const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
  reviews.forEach(review => {
    const reviewElement = document.createElement('div');
    reviewElement.innerHTML = `<strong>${review.name}:</strong> ${review.text}`;
    reviewsList.appendChild(reviewElement);
  });
});

// Погода
const apiKey = 'твой_api_ключ'; // Замени на свой API-ключ
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&q=';

const weatherForm = document.getElementById('weatherForm');
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');

async function getWeather(city) {
  try {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    const data = await response.json();

    if (data.cod === 200) {
      const weather = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>Температура: ${Math.round(data.main.temp)}°C</p>
        <p>Погода: ${data.weather[0].description}</p>
        <p>Влажность: ${data.main.humidity}%</p>
        <p>Ветер: ${data.wind.speed} м/с</p>
        <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
      `;
      weatherResult.innerHTML = weather;

      localStorage.setItem('lastCity', city);
    } else {
      weatherResult.innerHTML = `<p>Город не найден.</p>`;
    }
  } catch (error) {
    weatherResult.innerHTML = `<p>Ошибка при запросе данных. Попробуйте позже.</p>`;
  }
}

window.addEventListener('load', () => {
  const lastCity = localStorage.getItem('lastCity') || 'Moscow';
  getWeather(lastCity);
});

weatherForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = cityInput.value;
  if (city) {
    getWeather(city);
  } else {
    weatherResult.innerHTML = `<p>Введите название города.</p>`;
  }
});