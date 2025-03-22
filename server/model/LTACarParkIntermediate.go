package model

type LTA_API_CarParkInfo_Resp struct {
	Odata_Metadata string `json:"odata.metadata"`
	Value []struct {
		CarparkID string `json:"CarParkID"`
		Area string `json:"Area"`
		Development string `json:"Development"`
		Location string `json:"Location"`
		AvailableLots int `json:"AvailableLots"`
		LotType string `json:"LotType"`
		Agency string `json:"Agency"`
	} `json:"value"`
}