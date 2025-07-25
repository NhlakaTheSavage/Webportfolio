function getWeather() {
    const city = document.getElementById('cityInput').value;
    const apiKey = '769fd0b6adb5f46260939947c22d6edb';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                const resultDiv = document.getElementById('weatherResult');
                resultDiv.innerHTML = `
                    <h2>${data.name}, ${data.sys.country}</h2>
                    <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
                    <p><strong>Condition:</strong> ${data.weather[0].description}</p>
                `;
            } else {
                document.getElementById('weatherResult').innerHTML = `<p>City not found.</p>`;
            }
        })
        .catch(error => {
            console.error('Error fetching weather:', error);
            alert('An error occurred while fetching the weather.');
        });
}