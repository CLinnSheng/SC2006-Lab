package external_services

import (
	"encoding/json"
	"fmt"
	"io"
	_ "log"
	"net/http"
	"net/url"

	"github.com/SC2006-Lab/MobileAppProject/model"
)

func ComputeRoute(originLat, originLng, destLat, destLng float64, oneMapToken string, client *http.Client) (*model.RouteInfo, error) {
	baseURL := "https://www.onemap.gov.sg/api/public/routingsvc/route"
	uObj, err := url.Parse(baseURL)
	if err != nil {
		return nil, fmt.Errorf("failed to parse URL: %v", err)
	}

	query := uObj.Query()
	query.Add("start", fmt.Sprintf("%f,%f", originLat, originLng))
	query.Add("end", fmt.Sprintf("%f,%f", destLat, destLng))
	query.Add("routeType", "drive")
	uObj.RawQuery = query.Encode()

	req, err := http.NewRequest("GET", uObj.String(), nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %v", err)
	}

	req.Header.Add("Authorization", oneMapToken)

	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to send request: %v", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %v", err)
	}

	var OneMap_Resp model.OneMapRoute_Resp
	err = json.Unmarshal(body, &OneMap_Resp)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal JSON: %v", err)
	}

	routeInfo := &model.RouteInfo{
		Distance: OneMap_Resp.RouteSummary.TotalDistance,
		Duration: OneMap_Resp.RouteSummary.TotalTime,
		Polyline: OneMap_Resp.RouteGeometry,
	}

	return routeInfo, nil
}
