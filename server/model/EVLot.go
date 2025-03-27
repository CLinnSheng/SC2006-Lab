package model

type EVLot struct {
	FormattedAddress      string `json:"formattedAddress"`
	ShortFormattedAddress string `json:"shortformattedAddress"`
	Location              struct {
		Latitude  float64 `json:"latitude"`
		Longitude float64 `json:"longitude"`
	} `json:"location"`
	DisplayName struct {
		Text string `json:"text"`
	} `json:"displayName"`
	EVChargerOptions struct {
		ConnectorCount       int `json:"connectorCount"`
		ConnectorAggregation []struct {
			Type            string  `json:"type"`
			Count           int     `json:"count"`
			MaxChargeRateKW float64 `json:"maxChargeRateKw"`
			AvailableCount  *int    `json:"availableCount"`
		} `json:"connectorAggregation"`
	} `json:"evChargeOptions"`
}
