function getLocation (){
    document.querySelector("#startBtn").style.display = "none"
    document.querySelector("#main").style.display = "flex"
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
function bgVideo(BGVideo){
    var video = document.querySelector("video")
    var source = video.querySelector("source")
    source.src = BGVideo; 
    video.load();              
    video.play();
}
 async function countryNameFoo(latitude,longitude){
    var weatherApi = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,precipitation,weathercode&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`)
    var weatherApiJson =await weatherApi.json()        
    console.log(weatherApiJson)
            var {daily} = weatherApiJson
            var {hourly} = weatherApiJson
            var {current_weather} = weatherApiJson
            var {temperature} = current_weather
            var {weathercode} = current_weather
            var {time} = current_weather
            var newTime = Number(time.slice(11,13))
            console.log(newTime)
            showDaily(daily);
            showHourly(hourly);
            if(weathercode == 0){
                if (newTime >= 6 && newTime < 16) {
                    bgVideo("assets/sunny day.mp4")
                    document.querySelector("#weatherNow").textContent = "Clear sky"
                }else if (newTime >= 16 && newTime < 20) {
                    bgVideo("assets/sunset.mp4"); 
                    document.querySelector("#weatherNow").textContent = "Clear sky"
                 } else if (newTime < 6 || newTime >= 20) {
                    bgVideo("assets/night.mp4"); 
                    document.querySelector("#weatherNow").textContent = "Clear sky"
                }
            }else if(weathercode ==1 ||weathercode ==2||weathercode ==3){
               if (newTime >= 6 && newTime < 18) {
                    bgVideo("assets/clouds.mp4"); 
                    document.querySelector("#weatherNow").textContent = "cloudy"
                 }else if (newTime < 6 || newTime >= 18) {
                    bgVideo("assets/cloudy night.mp4"); 
                    document.querySelector("#weatherNow").textContent = "cloudy"
                }
            }else if(weathercode ==61 ||weathercode ==63||weathercode ==65 ){
               if (newTime >= 6 && newTime < 18) {
                bgVideo("assets/heavy rain.mp4"); 
                document.querySelector("#weatherNow").textContent = "heavy Rain"
               }else if (newTime < 6 || newTime >= 18) {
                bgVideo("assets/rain.mp4"); 
                document.querySelector("#weatherNow").textContent = "Rain"
               }
            }else if(weathercode ==80 ||weathercode ==81||weathercode ==82 ){            
                bgVideo("assets/thunder.mp4"); 
                document.querySelector("#weatherNow").textContent = "Thunderstorm"
            }
            document.querySelector("#temp").textContent = `${temperature}°`
        }
async function cityName(latitude,longitude){
    var cityApi = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
    var cityApiJson= await cityApi.json()
    console.log(cityApiJson)
    var {city} = cityApiJson
    document.querySelector("#cityName").textContent = city
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
  const now = new Date();
  const currentHour = now.getHours();
  let shownHours = 0;
  for (let i = 0; i < hourly.time.length && shownHours < 12; i++) {
    const hourTime = new Date(hourly.time[i]);
    const hour = hourTime.getHours();
    if (hour >= currentHour) {
      let displayHour = hour % 12 || 12;
      let ampm = hour >= 12 ? "PM" : "AM";
      const temp = hourly.temperature_2m[i];
      const code = hourly.weathercode[i];
      container.innerHTML += `
        <li>
          <span>${displayHour} ${ampm}</span><br>
          <span>${getIcon(code)}</span><br>
          <span>${temp}°</span>
        </li>
      `;
      shownHours++;
    }
  }
}