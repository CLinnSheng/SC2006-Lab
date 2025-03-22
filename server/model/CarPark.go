package model

type CarPark struct {
	CarParkID   string `json:"carParkID"`
	Address     string `json:"development"`
	CarParkType string `json:"carParkType"`
	LotType     string `json:"lotType"`
	Latitude      float64 `json:"latitude"`
	Longitude     float64 `json:"longitude"`
	AvailableLots string  `json:"availableLots"`
	TotalLots     string  `json:"totalLots"`
}
