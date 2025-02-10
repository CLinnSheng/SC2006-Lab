package model

import "github.com/google/uuid"

type Favourite struct {
	FavouriteID  uuid.UUID `json:"favouriteID"`
	ParkingLotID uuid.UUID `json:"parkingLotID"`
	UserID       uuid.UUID `json:"userID"`
	Name         string    `json:"name"`
	Latitude     float64   `json:latitude`
	Longtitude   float64   `json:longtitude`
}
