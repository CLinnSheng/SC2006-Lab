package model

type DataGov_API_CarParkAvai_Resp struct {
	Items []struct {
		Timestamp   string `json:"timestamp"`
		CarparkData []struct {
			CarparkNumber  string `json:"carpark_number"`
			UpdateDatetime string `json:"update_datetime"`
			CarparkInfo    []struct {
				TotalLots     string `json:"total_lots"`
				LotType       string `json:"lot_type"`
				LotsAvailable string `json:"lots_available"`
			} `json:"carpark_info"`
		} `json:"carpark_data"`
	} `json:"items"`
}
