package model

type CarPark struct {
	CarParkID   string         `json:"carParkID"`
	Address     string         `json:"address"`
	CarParkType string         `json:"carParkType"`
	Latitude    float64        `json:"latitude"`
	Longitude   float64        `json:"longitude"`
	LotDetails  map[string]*Lot `json:"lotDetails"`
}

type Lot struct {
	TotalLots     string `json:"totalLots"`
	AvailableLots string `json:"availableLots"`
}


func NewCarPark() map[string]*CarPark {
	return make(map[string]*CarPark)
}