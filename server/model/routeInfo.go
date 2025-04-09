package model

type RouteInfo struct {
	Distance float64 `json:"distance"`
	Duration float64 `json:"duration"`
	Polyline string  `json:"polyline"`
}
