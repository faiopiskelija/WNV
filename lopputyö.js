/* My API keys for access to API requests*/
const API_key_openweather = '6e6585db52d9a23c22236394533cf25c'; 
const AccessKey = `U9zhefkoCEJjkAzC8fcHLYwMcz9BuPEqGN8bU30SF_g`;

/* We can also use LocalStorage for saving city, which indicated by user*/
function saveUserInput (user_city){
    localStorage.setItem('userinput', user_city);
}

/* Checking the name of the city entered by the user.*/
function check_userInpit(user_city){
    let clean_user_input = user_city.trim();
    let error = ''; /*Message, that will display the error*/
    switch(true){
        case(clean_user_input == ''): /*If user entered spaces*/
            error = 'Invalid input. Empty value';
            break;
        case(!isNaN(clean_user_input)): /*if user entered numbers*/
            error = 'Invalid input. Numbers are not allowed';
            break;
        default:
            return true;    /*If noone case worked returning 'true' value*/ 
    }
    displayDataError(user_city, error); /*Calling function, which create blocks with error on HTML page*/
    alert(error);
    return false; /* If some case worked - returning 'true value' from check_userInput function*/
}
/*Function for display errors on DOM HTML page*/
function displayDataError (user_city, error){
    const create_p = document.createElement('p');
    const data_result = document.getElementById('data_result');

    create_p.innerHTML = `Error: ${error}, ${user_city} is not exist`;
    data_result.appendChild(create_p);
}
/*Display data about current weather in HTML*/
function displayData(user_city, city_temp, city_temp_max, city_feels_like, city_weather_img, description, wind, city_humidity){
    const create_p = document.createElement('p');
    let create_icon = document.createElement('img');
    let create_small_icon = document.createElement('img');
    const data_result = document.getElementById('data_result');

    create_small_icon.src = 'img/icons8-rain-cloud-50.png';
    create_small_icon.classList = 'small_icon';

    let create_header3 = document.createElement('h3');
    create_header3.innerHTML = `Current weather in ${user_city}`;

    let header_container = document.createElement('div');
    header_container.className = 'header_with_icon';
    header_container.appendChild(create_small_icon);
    header_container.appendChild(create_header3);


    create_icon.src = city_weather_img;
    create_p.innerHTML = `<br>${city_temp}°<br>${description}<br>💨 ${wind} m/s <br>Max tempertature: ${city_temp_max}°<br> Now it feels like: ${city_feels_like}°<br>🌫️${city_humidity}%`;

    data_result.appendChild(header_container);
    data_result.appendChild(create_icon);
    data_result.appendChild(create_p);
}
/*For display forecast block about weather*/
function displayDataForecast(user_city, forecast_day_1_max, forecast_day_1_min, forecast_icon, forecast_description_day, forecast_description_night, forecast_humidity){
    const create_p = document.createElement('p');
    const data_forecast = document.getElementById('forecast');
    const create_icon = document.createElement('img');
    create_header3 = document.createElement('h3');

    let create_small_icon_forecast = document.createElement('img')
    create_small_icon_forecast.src = 'img/icons8-dew-point-50.png';
    create_small_icon_forecast.classList = 'small_icon';

    let header_container = document.createElement('div');
    header_container.className = 'header_with_icon_forecast';
    header_container.appendChild(create_small_icon_forecast);
    header_container.appendChild(create_header3);

    create_header3.innerHTML = `Forecast for tomorrow in ${user_city}`;
    create_p.innerHTML = `<br>${forecast_day_1_max}°/${forecast_day_1_min}°<br>${forecast_description_day}/${forecast_description_night}<br>🌫️${forecast_humidity}%`;
    create_icon.src = forecast_icon;

    data_forecast.appendChild(header_container);
    data_forecast.appendChild(create_icon);
    data_forecast.appendChild(create_p);

}
/*For display NEWS block about city*/
function displayNews(user_city, news_headline, news_date, news_source, news_image, news_description, news_url, errorMessage){
    const data_news = document.getElementById('data_news');
/*If get error*/
    if (errorMessage) {
        const error_block = document.createElement('h3');
        error_block.innerHTML = `${errorMessage}`;
        data_news.appendChild(error_block);
        return;
    }

    let create_small_icon_news = document.createElement('img');
    create_small_icon_news.src = 'img/news.png'
    create_small_icon_news.classList = 'small_icon'

    create_header3 = document.createElement('h3');
    const headline = document.createElement('p');

    create_header3.innerHTML = (`News about ${user_city}`)
    headline.innerHTML = (news_headline);

    
    let header_container_news = document.createElement('div');
    header_container_news.className = 'header_with_icon';
    header_container_news.appendChild(create_small_icon_news);
    header_container_news.appendChild(create_header3);

    const title = document.createElement('h4');
    title.innerHTML = `<a href="${news_url}" target="_blank">${news_headline}</a>`;
    title.style.marginBottom = '10px';

    /*if image loading very long time, trying make image preloader with GIF for news block*/
    const image_wrapper = document.createElement('div')
    const loading_gif = document.createElement('img');
    loading_gif.src = 'loading.gif';
    image_wrapper.appendChild(loading_gif);

    const image = document.createElement('img');
    image.src = news_image;
    
    image.style.display = 'none';
    image.onload = function(){
        image.style.display = 'block';
        loading_gif.remove();
    }
    image_wrapper.appendChild(image);
    /*------------------------------------ */
    const sourceAndDate = document.createElement('p');
    sourceAndDate.innerHTML = `<i>${news_source}</i> | ${new Date(news_date).toLocaleString()}`;
    sourceAndDate.classList.add('news-source-and-date');

    const description_news = document.createElement('p');
    description_news.innerHTML = news_description;
    description_news.classList.add('news-description');

    data_news.appendChild(header_container_news); 
    data_news.appendChild(image_wrapper);
    data_news.appendChild(title);
    data_news.appendChild(sourceAndDate);
    data_news.appendChild(description_news);
    
}
/*Set the background of page to the city requested by the user*/
function displayBackground(image_for_background){
    const body_background = document.querySelector('body');
    body_background.style.backgroundImage = `url(${image_for_background})`;

}
/*Getting data about weather in requested city*/
async function checkWeather(user_city) {
    try {
        const request = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${user_city}&units=metric&appid=${API_key_openweather}`);
        if (request.ok){
            const data = await request.json(); /*getting json for find there information*/
            let city_temp = Math.round(data.main.temp); /*using Math.round() for rounding degrees*/
            let city_temp_max = Math.round(data.main.temp_max);
            let city_feels_like = Math.round(data.main.feels_like);
            let city_weather_img = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`; /*icon of current weather*/
            let description = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1); /*need to make first letter big*/
            let wind = data.wind.speed;
            let city_humidity = data.main.humidity;
            
            
            console.log(`Current temperature in ${user_city}: ${city_temp}°`);
            displayData(user_city, city_temp, city_temp_max, city_feels_like, city_weather_img, description, wind, city_humidity);
            
        } else {
            displayDataError(user_city, request.status);
        }
    } catch(error){
        console.log(error); 
    }
    
}
/*Weather forecast for tomorrow*/
async function forecastWeather(user_city) {
    const url_openweather_forecast = `https://api.openweathermap.org/data/2.5/forecast?q=${user_city}&cnt=24&units=metric&appid=${API_key_openweather}`;
    const request = await fetch(url_openweather_forecast);

    if(request.ok){
        const data = await request.json();
        const forecast_day_1_max = Math.round(data.list[9].main.temp_max);
        const forecast_day_1_min = Math.round(data.list[5].main.temp_min);
        const forecast_icon = `https://openweathermap.org/img/wn/${data.list[9].weather[0].icon}@2x.png`;
        let forecast_description_day = data.list[9].weather[0].description.charAt(0).toUpperCase() + data.list[9].weather[0].description.slice(1);
        let forecast_description_night = data.list[5].weather[0].description.charAt(0).toUpperCase() + data.list[9].weather[0].description.slice(1);
        let forecast_humidity = data.list[9].main.humidity;

        displayDataForecast(user_city, forecast_day_1_max, forecast_day_1_min, forecast_icon, forecast_description_day, forecast_description_night, forecast_humidity);
    }
}
/*Get news by tag, this does not work as I would like, that is, using the API, I can only take yesterday’s news, which will mention the city that the user specified. For more flexible settings, paid API subscriptions are required)*/
async function getNews(user_city) {
    //const API_key_newsapi = 'aa7e5cb5c727488881777ba3322f28d9';//old 
    const API_key_newsapi = 'a47539b9e67e4541b6e0f5714243707c';//new 

    const url_newsapi = `https://newsapi.org/v2/everything?q=${user_city}&pageSize=15&sortBy=publishedAt&apiKey=${API_key_newsapi}`;
    try {
        const request = await fetch(url_newsapi);

        if (request.ok) {
            const data = await request.json();
            const random_index = Math.floor(Math.random()*14);
            const article1 = data.articles[random_index];
            const news_headline = article1.title;
            const news_date = article1.publishedAt;
            const news_source = article1.source.name;
            const news_image = article1.urlToImage;
            const news_url = article1.url;
            const news_description = article1.description;

            displayNews(user_city, news_headline, news_date, news_source, news_image, news_description, news_url, null);
        } else {
            const errorData = await request.json();
            const errorMessage = errorData.message;
            console.error(`Error ${request.status}: ${errorMessage}`); 

            displayNews(null, null, null, null, null, null, null, errorMessage);
        }
    } catch (error) {
        console.log(error.message);
        alert(`Request failed: ${error.message}`);
    }
}
/* Here we get an image of the city, which we use for the background*/
async function getCityImage(user_city){
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(user_city + ' downtown')}&client_id=${AccessKey}&orientation=landscape&order_by=popular`;

    try {
        const request = await fetch (url);
        if(request.ok){
            const data = await request.json();
            //const random_index = Math.floor(Math.random()*5); we can take a random photo, but results better if not...

            let image_for_background = data.results[3].urls.full;
            displayBackground(image_for_background);
        }
    } catch(error){
        console.error(error);
    }
}

/* Start all code*/
window.onload = function(){

/*Checking, if we have already users city in localStorage, and if yes we put this value to input: */
    let saved_user_input = localStorage.getItem('userinput');
     if(saved_user_input){
            console.log(`Saved data: ${saved_user_input}`);
            document.getElementById('city').value = saved_user_input;
        }

    const form_input = document.getElementById('userinput')
    const data_forecast = document.getElementById('forecast')

    let input_line = document.getElementById('city');
    input_line.focus();    

    form_input.addEventListener('submit', function(e){
        e.preventDefault();
        data_result.innerHTML = "";
        data_forecast.innerHTML = "";
        data_news.innerHTML = "";
        data_result.style.display = `block`;
        data_forecast.style.display = `block`;
        data_news.style.display = `block`;
        const city = document.getElementById('city').value.trim();
        input_line.focus();

        if (check_userInpit(city) == false) {
            return; 
        }

        saveUserInput(city);
        getCityImage(city);
        checkWeather(city);
        forecastWeather(city);
        getNews(city);

    })
    
}
