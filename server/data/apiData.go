package data

import (
	"github.com/SC2006-Lab/MobileAppProject/external_services"
	"github.com/SC2006-Lab/MobileAppProject/model"
)

type ApiData struct {
	CarPark map[string]*model.CarPark
	Weather map[string]*model.WeatherAreaInfo
	URAToken *string
	OneMapToken *string
}

func NewApiData() *ApiData {
	return &ApiData{
		CarPark: model.NewCarPark(),
		Weather: model.NewWeatherAreaInfo(),
		URAToken: new(string),
		OneMapToken: new(string),
	}
}

func (apiData *ApiData) Init() {
	external_services.InitCarParkInformation(apiData.CarPark)
	external_services.InitWeatherInformation(apiData.Weather)
	external_services.URA_Init(apiData.URAToken)
	external_services.OneMapInit(apiData.OneMapToken)
}

func (apiData *ApiData) getOneMapToken() string {
	return *apiData.OneMapToken
}