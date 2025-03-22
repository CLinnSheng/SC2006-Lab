package model

// For the purpose of help with unmarshalling the json response

type DataGov_Api_Weather_Resp struct {
	Code int `json:"code"`
	Data struct {
		AreaMetadata []struct {
			Name          string `json:"name"`
			LabelLocation struct {
				Latitude  float64 `json:"latitude"`
				Longitude float64 `json:"longitude"`
			} `json:"label_location"`
		} `json:"area_metadata"`
		Items []struct {
			UpdateTimestamp string `json:"update_timestamp"`
			Timestamp       string `json:"timestamp"`
			ValidPeriod     struct {
				Start string `json:"start"`
				End   string `json:"end"`
				Text  string `json:"text"`
			} `json:"valid_period"`
			Forecasts []struct {
				Area     string `json:"area"`
				Forecast string `json:"forecast"`
			} `json:"forecasts"`
		} `json:"items"`
	} `json:"data"`
	ErrorMsg string `json:"errorMsg"`
}

type LabelLocation struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}

type Forecast struct {
	Area     string `json:"area"`
	Forecast string `json:"forecast"`
}
