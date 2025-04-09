package model

type DataGov_Api_CarParkInfo_Resp struct {
	Help    string `json:"help"`
	Success bool   `json:"success"`
	Result  struct {
		ResourceID string `json:"resource_id"`
		Fields     []struct {
			Type string `json:"type"`
			ID   string `json:"id"`
		} `json:"fields"`
		Records []struct {
			Id                  int    `json:"_id"`
			CarparkNumber       string `json:"car_park_no"`
			Address             string `json:"address"`
			XCoord              string `json:"x_coord"`
			YCoord              string `json:"y_coord"`
			CarParkType         string `json:"car_park_type"`
			TypeOfParkingSystem string `json:"type_of_parking_system"`
			ShortTermParking    string `json:"short_term_parking"`
			FreeParking         string `json:"free_parking"`
			NightParking        string `json:"night_parking"`
			CarParkDecks        string `json:"car_park_decks"`
			GantryHeight        string `json:"gantry_height"`
			CarParkBasement     string `json:"car_park_basement"`
		} `json:"records"`
		Link struct {
			Start string `json:"start"`
			Next  string `json:"next"`
		} `json:"_links"`
		Total int    `json:"total"`
		Limit int    `json:"limit"`
		Q     string `json:"q"`
	} `json:"result"`
}
