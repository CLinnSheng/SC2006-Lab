package model

import "github.com/google/uuid"

type ParkingLot struct {
	ParkingLotID uuid.UUID `json:"parkingLotID"`
	Name         string    `json:"name"`
	Latitude     float64   `json:latitude`
	Longtitude   float64   `json:longtitude`
	TotalSpaces  int32     `json:totalSpaces`
}
