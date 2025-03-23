package data

import (
	"github.com/SC2006-Lab/MobileAppProject/external_services"
	"github.com/SC2006-Lab/MobileAppProject/model"
)

type ApiData struct {
	CarPark map[string]*model.CarPark
	Weather map[string]*model.WeatherAreaInfo
}

func NewApiData() *ApiData {
	return &ApiData{
		CarPark: model.NewCarPark(),
		Weather: model.NewWeatherAreaInfo(),
	}
}

func (apiData *ApiData) Init() {
	external_services.InitCarParkInformation(apiData.CarPark)
	external_services.InitWeatherInformation(apiData.Weather)
}
