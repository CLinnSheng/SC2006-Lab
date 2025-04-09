package model

type WeatherAreaInfo struct {
	Name      string
	Latitude  float64
	Longitude float64
	Weather   string
}

func NewWeatherAreaInfo() map[string]*WeatherAreaInfo {
	return make(map[string]*WeatherAreaInfo)
}
