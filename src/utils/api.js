const apiURL = `http://api.openweathermap.org/data/2.5/forecast?`;
//http://api.openweathermap.org/data/2.5/forecast?q=Munich,de&APPID=&cnt=10&units=imperial
const appID = '75f972b80e26f14fe6c920aa6a85ad57';
const city = 'Munich,de';

const requests = {
	get: (params, callBack) => {
		fetch(`${apiURL}q=${city}&APPID=${appID}&${params}`, {
			method: 'GET'
		})
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
				throw new Error(`${response.status} ${response.statusText}`);
			})
			.then((json) => {
				callBack(null, json);
			})
			.catch((error) => {
				callBack(error, null);
			});
	}
};

const OpenWeatherApi = {
	getWeather: (units, callBack) => {
		requests.get(`units=${units}`, callBack);
	}
};
export default OpenWeatherApi;
