
let url = 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-0A430EFC-24FB-491F-A19B-4145672BC1C9&format=JSON'

let cities = [
    ['基隆市', '新北市', '臺北市', '桃園市', '新竹市', '新竹縣', '苗栗縣', '臺中市', '南投縣', '彰化縣', '雲林縣', '嘉義市', '嘉義縣', '臺南市', '高雄市', '屏東縣', '宜蘭縣', '花蓮縣', '臺東縣', '澎湖縣', '金門縣', '連江縣'],
    ['基隆市', '新北市', '臺北市', '桃園市', '新竹市', '新竹縣', '宜蘭縣'], //北部
    ['苗栗縣','臺中市', '南投縣', '彰化縣', '雲林縣' ],//中部
    ['臺南市', '高雄市', '屏東縣','澎湖縣','嘉義市', '嘉義縣'], //南部
    [ '花蓮縣', '臺東縣']//東部
    , ['澎湖縣', '金門縣', '連江縣']//外島
];


let currentCities;//天氣卡需要顯示的那些城市
let organizationData = {};//放組織後的資料(記得要定義是物件，不然會undefind)
let currentCity = cities[0];//第一列=>>全部城市
let dayTime = document.querySelector('.day');//顯示日期與時間
//======================按鈕區============================//
// let btnAll = document.querySelector('.all')
// let btnNorth = document.querySelector('.north')
// let btnMiddle = document.querySelector('.middle')
// let btnSouth = document.querySelector('.south')
// let btnEast = document.querySelector('.east')
// let btnOther = document.querySelector('.other')

// btnAll.addEventListener('click',function(){
//     currentCity = cities[0];
//     console.log(currentCity);
//     orgAllcities();
// })
// btnNorth.addEventListener('click',function(){
//     currentCity = cities[1];
//     console.log(currentCity);
//     orgAllcities();
// })
// console.log(btnNorth);
// btnMiddle.addEventListener('click',function(){
//     currentCity = cities[2];
//     console.log(currentCity);
//     orgAllcities();
// })
// btnSouth.addEventListener('click',function(){
//     currentCity = cities[3];
//     console.log(currentCity);
//     orgAllcities();
// })
// btnEast.addEventListener('click',function(){
//     currentCity = cities[4];
//     console.log(currentCity);
//     orgAllcities();
// })
// btnOther.addEventListener('click',function(){
//     currentCity = cities[5];
//     console.log(currentCity);
//     orgAllcities();
// })
let btn = document.querySelectorAll('button')

btn.forEach( (num,index) =>{
    num.addEventListener('click',function(){
        console.log(index);
        currentCity = cities[index];
        orgAllcities();
    })
})


//======================按鈕區終點============================//
fetchData();//提取資料

//======================功能區============================//
function fetchData() {

    fetch(url)
        //遠端抓資料
        .then(function (response) {
            return response.json();//把資料做轉換
        })
        .then(function (data) {
            console.log(data);//顯示接收的資料=>再判斷怎麼使用

            orgData(data);//整理要處理的資料
            orgAllcities();

        })


}

function orgData(data) {
    let Cities = data.records.location; //所有城市
    Cities.forEach(City => {
        // console.log(City);

        //城市名
        let CityName = City.locationName;
        // console.log("city : "+CityName);

        //時間值
        let CitytimeInfo = City.weatherElement[0].time[0];
        let StartTime = CitytimeInfo.startTime;
        // console.log("from : "+StartTime);
        let EndTime = CitytimeInfo.endTime;
        // console.log("to : "+EndTime);
        //日期
        dayTime.innerHTML ='' ;
        startTime()
        function startTime() {
            const today = new Date();
            let h = today.getHours();
            let m = today.getMinutes();
            let s = today.getSeconds();
            m = checkTime(m);
            s = checkTime(s);
            dayTime.innerHTML = StartTime.substr(0, 10).replaceAll('-', '/') +'<br>'+ h + ":" + m + ":" + s;
            setTimeout(startTime, 1000);
        }
        
        function checkTime(i) {
            if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
            return i;
        }
        //----------------------------------------------------------------------

        //天氣狀況(ex:晴時多雲偶陣雨)
        let temp_info = City.weatherElement[0].time[0].parameter.parameterName;
        // console.log(temp_info);
        let infoNum = City.weatherElement[0].time[0].parameter.parameterValue;
        // console.log("第"+infoNum+"個"); 

        //溫度值(°C)
        let Hight_temperature = City.weatherElement[4].time[0].parameter.parameterName + "°C";
        //最高溫度
        // console.log("max-temperature : "+Hight_temperature);

        let Low_temperature = City.weatherElement[2].time[0].parameter.parameterName + "°C";
        //最低溫度
        // console.log("min-temperature : "+Low_temperature);


        //濕度(百分比)
        let humidity = City.weatherElement[1].time[0].parameter.parameterName + "%";
        // console.log("humidity : "+humidity);

        //體感舒適度(ex:悶熱)
        let tempFeel = City.weatherElement[3].time[0].parameter.parameterName;
        // console.log(tempFeel);
        organizationData[CityName] = {

            "StartTime": StartTime,

            "EndTime": EndTime,

            "temp_info": temp_info,

            "infoNum":infoNum,

            "Hight_temperature": Hight_temperature,

            "Low_temperature": Low_temperature,

            "humidity": humidity,

            "tempFeel": tempFeel,
        }

        // console.log(organizationData);
    });
}
//處理每一個城市
function orgAllcities() {
    let card_region = document.querySelector('.card-region');
    
    card_region.innerHTML = '';
    currentCity.forEach((city, index) => {
        // console.log(city);
        let locationData = organizationData[city];
        let weatherSvg ='';
        
        let tempNum = locationData.infoNum;
        console.log(tempNum);
        switch (tempNum) {
            case '1':case '':
                weatherSvg = 'day';//sunny
                break;
            case '2':case '3':
                weatherSvg = 'cloudy-day-1';//sunny+cloudy
                break;
            case '4':case '5':case '6':case '7':
                weatherSvg = 'cloudy';//cloudy
                break;
            case '8':case '9':case '10':case '11':case '12':case '13':case '14':case '37':case '38':case '39':
                weatherSvg = 'rainy-5';//rainy
                break;
            case '15':case '16':case '17':case '18':case '19':case '20':case '21':case '22':case '23':case '24':case '25':case '26':case '27':case '28':case '29':case '30':case '31':case '32':case '33':case '34':case '35':case '36':case '41':
                weatherSvg = 'thunder';//thonder
                break;
            case '42':
            weatherSvg = 'weather';//sunny+cloudy
            break;
        
            default:
                weatherSvg =''
                break;
        }

        
        // console.log('locationData=>', city, locationData);
        card_region.innerHTML +=
            //.substr(0,16)從字串裡面取一部分(從字串中的第幾個開始取,取數值的範圍)    
            //.replaceAll('-','/')把數值內的-符號改成/符號
                `
                    <div class="single-card">
                        <ul>
                            <p>${city}</p>
                            <p>${locationData.StartTime.substr(0, 0).replaceAll('-', '/')}</p>
                            <p>${locationData.StartTime.substr(11, 5).replaceAll('-', '/')}-${locationData.EndTime.substr(11, 5).replaceAll('-', '/')}</p>
                            <p>${locationData.tempFeel}</p>
                            <p>濕度 <i class="fa-solid fa-temperature-half"></i> : ${locationData.humidity}</p>
                            <p>${locationData.temp_info}</p>
                            <p>${locationData.Low_temperature} ~ ${locationData.Hight_temperature}</p>
                        </ul>
                        <img src="./apisvg/animated/${weatherSvg}.svg" alt="weather-infoimg">
                    `
        
    });



}


//======================功能區終點============================//




