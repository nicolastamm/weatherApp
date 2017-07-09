$("body").one("click" , function() { $("#clickToStart").hide(); });
$("#dropDownList").dblclick(function (event) {event.stopPropagation();});
var audio = $("#myAudio")[0];
$(".weatherBoxThunder").mouseenter(function() 
{
  	audio.play();
});
$("body").dblclick(function (event)
{
	var x = event.clientX;
	var y = event.clientY;
	$("#dropDownList").css("left" , x);
	$("#dropDownList").css("top" , y);
	$("#dropDownList").show();
});
$("#dropDownList").mouseleave(function(){$("#dropDownList").hide();})
function getData(cityId)
{
	$.getJSON("http://api.openweathermap.org/data/2.5/weather?id="
		+ cityId
		+ "&appid=3c43bf66d3b26d9464845581fcddd09c", 
	function(data)
	{
			weatherData = data;
			createWindow(cityId); 
	});
}
function createWindow(cityId)
{
	$("#window" + cityId).remove();
	var x = $("#dropDownList").css("left");
	var y = $("#dropDownList").css("top");
	// Indentation here imitates the DOM structure of the new Window.
	$(document.createElement("div"))
		.attr("class" , "weatherBox")
		.attr("id" , "window" + cityId)
		.css("left" , x).css("top" , y)
		.appendTo("body")
		.draggable();

		$(document.createElement("div"))
			.attr("class" , "boxHeader")
			.attr("id" , "boxHeader" + cityId)
			.appendTo("#window" + cityId)
			.html("Weather in " + weatherData.name);

		$(document.createElement("div"))
			.attr("class" , "tempImWrapper")
			.attr("id" , "tempImWrapper" + cityId)
			.appendTo("#window" + cityId);

			$(document.createElement("div"))
				.attr("class" , "temp")
				.appendTo("#tempImWrapper" + cityId)
				.html((weatherData.main.temp - 273.15).toFixed(0) + "°"); //Temperatur kommt in Kelvin an. :O

			$(document.createElement("div"))
				.attr("class" , "weatherImBox")
				.attr("id" , "weatherImBox" + cityId)
				.appendTo("#tempImWrapper" + cityId);

			$("#weatherImBox" + cityId)
				.prepend('<img class="weatherIm" src="http://openweathermap.org/img/w/'
				+ weatherData.weather[0].icon 
				+'.png"/>');

		$(document.createElement("ul"))
			.attr("class" , "textData")
			.attr("id" , "textData" + cityId)
			.appendTo("#window" + cityId);
			var description = "";
			for(var i = 0; i < weatherData.weather.length ; i++)
			{
				description += weatherData.weather[i].main;
			}
			$(document.createElement("li"))
				.html(description)
				.appendTo("#textData" + cityId);

			$(document.createElement("li"))
				.html("Wind: " + weatherData.wind.speed + "m/s , " + weatherData.wind.deg + "°")
				.appendTo("#textData" + cityId);

			$(document.createElement("li"))
				.html("Humidity: " + weatherData.main.humidity + "%")
				.appendTo("#textData" + cityId);

			$(document.createElement("li"))
				.html("Pressure: " + weatherData.main.pressure + "hPa")
				.appendTo("#textData" + cityId);

		var d = new Date();
		var h = d.getHours();
		if(h<10)
		m = "0" + m;
		var m = d.getMinutes();
		if(m<10)
		m = "0" + m;
		$(document.createElement("div"))
			.attr("class" , "footer")
			.attr("id" , "footer" + cityId)
			.html("Last Updated: " + h + ":" + m)
			.appendTo("#window" + cityId);
		$("#footer" + cityId)
			.prepend(' <button id = "removeButton'+ cityId +'"class="myButton" onclick="removeBox(' + cityId + ')"> X </button><button id = "addButton'+ cityId +'"class="myButton" onclick="updateBox(' + cityId + ')"> &#8635; </button>');
	$("#dropDownList").hide();
	changeStyle(cityId);
}
function updateBox(cityId)
{
	var x = $("#window" + cityId).css("left");
	var y = $("#window" + cityId).css("top");
	$("#dropDownList").css("left" , x);
	$("#dropDownList").css("top" , y);
	$("#window" + cityId).remove();
	getData(cityId);
}
var thisSound = undefined;
function removeBox(cityId)
{		
	$("#window" + cityId).remove();
	thisSound.pause();
    thisSound.currentTime = 0;
	
}
function changeStyle(cityId)
{
	switch(weatherData.weather[0].id)
	{
		// RAIN
		case 300:case 301:case 302:case 310:case 311:case 312:case 313:case 314:case 321:case 500:case 501: case 502:case 503:case 504:
		case 520:
			$("#window" + cityId).attr("class" , "weatherBoxRain");
			$("#window" + cityId).attr("onmouseenter" , "PlaySound('rainAudio')");
			$("#window" + cityId).attr("onmouseleave" , "StopSound('rainAudio')");
			break;
		//SNOW
		case 511:case 600:case 601:case 602:case 611:case 612:case 615:case 616:case 620:case 621:
		case 622:
			$("#window" + cityId).attr("class" , "weatherBoxSnow");
			$("#window" + cityId).attr("onmouseenter" , "PlaySound('snowAudio')");
			$("#window" + cityId).attr("onmouseleave" , "StopSound('snowAudio')");
		//STORM
		case 200:case 201:case 202:case 210:case 211:case 212:case 221:case 230:case 231:
		case 232:
			$("#window" + cityId).attr("class" , "weatherBoxThunder");
			$("#window" + cityId).attr("onmouseenter" , "PlaySound('thunderAudio')");
			$("#window" + cityId).attr("onmouseleave" , "StopSound('thunderAudio')");
			break;
		//CLEAR
		case 800:
			$("#window" + cityId).attr("onmouseenter" , "PlaySound('birdsAudio')");
			$("#window" + cityId).attr("onmouseleave" , "StopSound('birdsAudio')");
			break;
		//CLOUDY
		case 801:case 802:case 803:case 804:
			$("#window" + cityId).attr("class" , "weatherBoxCloudy");
			$("#window" + cityId).attr("onmouseenter" , "PlaySound('snowAudio')");
			$("#window" + cityId).attr("onmouseleave" , "StopSound('snowAudio')");
			break;
	}
	var temp = (weatherData.main.temp - 273.15).toFixed(0);
	var difference = 50 - temp;
	var b = difference * 3.64;
	var r = parseInt(255 - b); // Apparently Chrome ignores floats values when passed on to rgba(). weird
	b = parseInt(b);
	if(temp < -40)
	{
		r = 0;
		b = 255;
	}
	if(temp > 50)
	{
		r=255;
		b=0;
	}
	$("#window" + cityId).css("background-color" , "rgba("+ r +", 0 ,"+ b +",0.5)");
	$("#boxHeader" + cityId).css("background-color" , "rgba("+ r +", 0 ,"+ b +",0.8)");
	$("#addButton" + cityId).css("border" , "8px solid rgba("+ r +", 0 ,"+ b +",0.8)");
	$("#addButton" + cityId).css("background-color" , "rgba("+ r +", 0 ,"+ b +",0.5)");
	$("#removeButton" + cityId).css("border" , "8px solid rgba("+ r +", 0 ,"+ b +",0.8)");
	$("#removeButton" + cityId).css("background-color" , "rgba("+ r +", 0 ,"+ b +",0.5)");

	return;
}
var thisSound;
function PlaySound(soundId)
{
	thisSound = document.getElementById(soundId);
	thisSound.play();
}
function StopSound(soundId) {
    thisSound=document.getElementById(soundId);
    thisSound.pause();
    thisSound.currentTime = 0;
	thisSound = undefined;
}
