package model

// For the purpose of help with unmarshalling the json response
type Response struct {
	Code     int    `json:"code"`
	Data     Data   `json:"data"`
	ErrorMsg string `json:"errorMsg"`
}

type Data struct {
	AreaMetadata []AreaMetadata `json:"area_metadata"`
	Items        []Item         `json:"items"`
}

type AreaMetadata struct {
	Name          string        `json:"name"`
	LabelLocation LabelLocation `json:"label_location"`
}

type LabelLocation struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}

type Item struct {
	UpdateTimestamp string      `json:"update_timestamp"`
	Timestamp       string      `json:"timestamp"`
	ValidPeriod     ValidPeriod `json:"valid_period"`
	Forecasts       []Forecast  `json:"forecasts"`
}

type ValidPeriod struct {
	Start string `json:"start"`
	End   string `json:"end"`
	Text  string `json:"text"`
}

type Forecast struct {
	Area     string `json:"area"`
	Forecast string `json:"forecast"`
}
