package model

type OneMapRoute_Resp struct {
	RouteGeometry string `json:"route_geometry"`
	RouteSummary struct {
		TotalDistance float64 `json:"total_distance"`
		TotalTime     float64 `json:"total_time"`
	} `json:"route_summary"`
}