package model

type RouteInfo struct {
	Distance int32  `json:"distance"`
	Duration int64  `json:"duration"`
	Polyline string `json:"polyline"`
}
