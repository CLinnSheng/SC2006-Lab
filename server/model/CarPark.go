package model

type CarPark struct {
	CarParkID     string  `json:"carParkID"`
	Address   string  `json:"development"`
	CarParkType   string  `json:"carParkType"`
	Latitude      float64 `json:"latitude"`
	Longitude     float64 `json:"longitude"`
	AvailableLots int     `json:"availableLots"`
	LotType       string  `json:"lotType"`
	TotalLots     int     `json:"totalLots"`
}