function getLocation (){
    navigator.geolocation.getCurrentPosition(
    function(success){
     console.log(success,"success")
     const { coords } = success;
     const {latitude,longitude} = coords
     console.log(latitude,longitude)
     countryNameFoo(latitude,longitude)
     cityName(latitude,longitude)
    }, 
    function(error){
     console.log(error)  
    });
}
function showDaily(daily) {
        const container = document.getElementById("dailyUI");
        container.innerHTML = "";
        
        for (let i = 0; i < daily.time.length; i++) {
        
        const date = new Date(daily.time[i]);
        const dayName = date.toLocaleDateString("en-US", {
        weekday: "long"
        });
        
        const maxT = daily.temperature_2m_max[i];
        const minT = daily.temperature_2m_min[i];
        const code = daily.precipitation_sum[i];
        
        container.innerHTML += `
            <li>
            <span>${dayName}</span><br>
            <span>${maxT}° / ${minT}°</span><br>
            <span>${getIcon(code)}</span>
            </li>
         `;
    }
}

getLocation()
function countryNameFoo(latitude,longitude){
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,precipitation,weathercode&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`)
    .then(
        function(res){
            return res.json()
        }
    )
    .then(
        function(res){
            console.log(res)
            var {daily} = res
            var {hourly} = res
            var {current_weather} = res
            var {temperature} = current_weather
            var {weathercode} = current_weather
            var {time} = current_weather
            var newTime = Number(time.slice(11,13))
            console.log(newTime)
            showDaily(daily);
            showHourly(hourly);
            if(weathercode == 0){
                if (newTime >= 6 && newTime < 16) {
                    var video = document.querySelector("video")
                    var source = video.querySelector("source")
                    source.src = "assets/sunny day.mp4"; 
                    video.load();              
                    video.play();
                    document.querySelector("#weatherNow").textContent = "Clear sky"
                }else if (newTime >= 16 && newTime < 20) {
                    var video = document.querySelector("video")
                    var source = video.querySelector("source")
                    source.src = "assets/sunset.mp4"; 
                    video.load();              
                    video.play();
                    document.querySelector("#weatherNow").textContent = "Clear sky"
                 } else if (newTime < 6 || newTime >= 20) {
                    var video = document.querySelector("video")
                    var source = video.querySelector("source")
                    source.src = "assets/night.mp4"; 
                    video.load();              
                    video.play();
                    document.querySelector("#weatherNow").textContent = "Clear sky"
                }
            }else if(weathercode ==1 ||weathercode ==2||weathercode ==3){
               if (newTime >= 6 && newTime < 18) {
                    var video = document.querySelector("video")
                    var source = video.querySelector("source")
                    source.src = "assets/clouds.mp4"; 
                    video.load();              
                    video.play();
                    document.querySelector("#weatherNow").textContent = "cloudy"
                 }else if (newTime < 6 || newTime >= 18) {
                    var video = document.querySelector("video")
                    var source = video.querySelector("source")
                    source.src = "assets/cloudy night.mp4"; 
                    video.load();              
                    video.play();
                    document.querySelector("#weatherNow").textContent = "cloudy"
                }
            }else if(weathercode ==61 ||weathercode ==63||weathercode ==65 ){
               if (newTime >= 6 && newTime < 18) {
                 var video = document.querySelector("video")
                var source = video.querySelector("source")
                source.src = "assets/heavy rain.mp4"; 
                video.load();              
                video.play();
                document.querySelector("#weatherNow").textContent = "heavy Rain"
               }else if (newTime < 6 || newTime >= 18) {
                var video = document.querySelector("video")
                var source = video.querySelector("source")
                source.src = "assets/rain.mp4"; 
                video.load();              
                video.play();
                document.querySelector("#weatherNow").textContent = "Rain"
               }
            }else if(weathercode ==80 ||weathercode ==81||weathercode ==82 ){
                var video = document.querySelector("video")
                var source = video.querySelector("source")
                source.src = "assets/thunder.mp4"; 
                video.load();              
                video.play();
                document.querySelector("#weatherNow").textContent = "Thunderstorm"
            }
            document.querySelector("#temp").textContent = `${temperature}°`
        }
    )
    .catch();
}
function cityName(latitude,longitude){
    fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
    .then(function(res){
        return res.json()
    }).then(function(res){
        console.log(res)
        var {city} = res
        document.querySelector("#cityName").textContent = city
    })
}   
function getIcon(code) {
  if (code === 0) return `<i class="fa-solid fa-sun"></i>`;
  if ([1,2].includes(code)) return `<i class="fa-solid fa-cloud-sun"></i>`;
  if (code === 3) return `<i class="fa-solid fa-cloud"></i>`;
  if ([45,48].includes(code)) return `<i class="fa-solid fa-wind"></i>`;
  if ([51,53,55,80,81,82].includes(code)) return `<i class="fa-solid fa-cloud-sun-rain"></i>`;
  if ([61,63,65].includes(code)) return `<i class="fa-solid fa-cloud-showers-heavy"></i>`;
  if ([71,73,75].includes(code)) return `<i class="fa-light fa-snowflake"></i>`;
  if ([95,96,99].includes(code)) return `<i class="fa-solid fa-cloud-bolt"></i><i class="fa-solid fa-cloud-showers-heavy"></i>`;
  return `<i class="fa-solid fa-feather-pointed"></i>`;
}

function showHourly(hourly) {
  const container = document.getElementById("hourlyUI");
  container.innerHTML = "";

  for (let i = 0; i < hourly.time.length; i += 3) {

    const fullTime = hourly.time[i];
    const hour = fullTime.slice(11, 16); // "14:00"

    const temp = hourly.temperature_2m[i];
    const code = hourly.weathercode[i];

    container.innerHTML += `
      <li>
        <span>${hour}</span>
        <span>${getIcon(code)}</span>
        <span>${temp}°</span>
      </li>
    `;
  }
}