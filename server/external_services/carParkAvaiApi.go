package external_services

import (
	"encoding/json"
	"fmt"
	_ "fmt"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/SC2006-Lab/MobileAppProject/model"
	"github.com/SC2006-Lab/MobileAppProject/utils"
)

func InitCarParkInformation(carPark map[string]*model.CarPark) {
	envConfig := utils.GetEnvConfig()
	client := &http.Client{}

	// LTA
	log.Println("Fetching Car Park Information from LTA")
	LTA_Req, err := http.NewRequest("GET", "https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2", nil)
	if err != nil {
		log.Fatalf("Fail to create request: %v", err)
	}

	LTA_Req.Header.Add("AccountKey", envConfig.LTA_ACCOUNT_KEY)
	LTA_Req.Header.Add("Content-Type", "application/json")

	// request for LTA Call
	LTAResp, err := client.Do(LTA_Req)
	if err != nil {
		log.Fatalf("Fail to make request: %v", err)
	}

	LTARespBody, err := io.ReadAll(LTAResp.Body)
	if err != nil {
		log.Fatalf("Fail to read response body: %v", err)
	}

	var LTARes_Unmarshal model.LTA_API_CarParkInfo_Resp
	err = json.Unmarshal(LTARespBody, &LTARes_Unmarshal)
	if err != nil {
		log.Fatalf("Fail to unmarshal JSON: %v", err)
	}
	log.Println("Fetched Car Park Information from LTA")

	// DataGov First Api Call, Car Park Availability
	log.Println("Fetching Car Park Information from DataGov (Car Park Availability)")

	currentTime := time.Now().Format("2006-01-02T15:04:05")
	url := fmt.Sprintf("https://api.data.gov.sg/v1/transport/carpark-availability?date_time=%s", currentTime)

	DataGovCarParkAvaiResp, err := http.Get(url)
	if err != nil {
		log.Fatalf("Fail to fetch URL: %v", err)
	}

	DataGovCarParkAvaiResp_Body, err := io.ReadAll(DataGovCarParkAvaiResp.Body)
	if err != nil {
		log.Fatalf("Fail to read response body: %v", err)
	}

	var DataGovCarParkAvaiResp_Unmarshal model.DataGov_API_CarParkAvai_Resp
	err = json.Unmarshal(DataGovCarParkAvaiResp_Body, &DataGovCarParkAvaiResp_Unmarshal)
	if err != nil {
		log.Fatalf("Fail to unmarshal JSON: %v", err)
	}
	// log.Println(DataGovCarParkAvaiResp_Unmarshal)
	log.Println("Fetched Car Park Information from DataGov (Car Park Availability)")

	// DataGov Second Api Call, Car Park Info
	log.Println("Fetching Car Park Information from DataGov (Car Park Info)")
	DataGovCarParkInfoResp, err := http.Get("https://data.gov.sg/api/action/datastore_search?resource_id=139a3035-e624-4f56-b63f-89ae28d4ae4c&limit=3000&q=")
	if err != nil {
		log.Fatalf("Fail to fetch URL: %v", err)
	}

	DataGovCarParkInfoResp_Body, err := io.ReadAll(DataGovCarParkInfoResp.Body)
	if err != nil {
		log.Fatalf("Fail to read response body: %v", err)
	}

	var DataGovCarParkInfoResp_Unmarshal model.DataGov_Api_CarParkInfo_Resp
	err = json.Unmarshal(DataGovCarParkInfoResp_Body, &DataGovCarParkInfoResp_Unmarshal)
	if err != nil {
		log.Fatalf("Fail to unmarshal JSON: %v", err)
	}
	log.Println("Fetched Car Park Information from DataGov (Car Park Info)")

	// process LTA api
	log.Println("Processing LTA Car Park Information")
	for _, info := range LTARes_Unmarshal.Value {
		if info.Location == "" {
			continue
		}

		latLon := strings.Split(info.Location, " ")
		latitude, _ := strconv.ParseFloat(latLon[0], 64)
		longitude, _ := strconv.ParseFloat(latLon[1], 64)

		carPark[info.CarparkID] = &model.CarPark{
			CarParkID:  info.CarparkID,
			Address:    info.Development,
			Longitude:  longitude,
			Latitude:   latitude,
			LotDetails: make(map[string]*model.Lot),
		}

		temp_carpark := carPark[info.CarparkID]
		temp_carpark.LotDetails[info.LotType] = &model.Lot{
			AvailableLots: strconv.Itoa(info.AvailableLots),
		}

		if info.Agency == "LTA" {
			temp_carpark.CarParkType = "MULTI-STOREY CAR PARK"
		} else if info.Agency == "URA" {
			temp_carpark.CarParkType = "SURFACE CAR PARK"
		}

	}
	log.Println("Processed LTA Car Park Information")

	// process DataGov api for carpark availability
	log.Println("Processing DataGov Car Park Information (Car Park Availability)")
	for _, carpark_data := range DataGovCarParkAvaiResp_Unmarshal.Items[0].CarparkData {

		dataYear, _ := strconv.Atoi(carpark_data.UpdateDatetime[:4])
		if dataYear != time.Now().Year() {
			continue
		}

		if _, ok := carPark[carpark_data.CarparkNumber]; !ok {
			carPark[carpark_data.CarparkNumber] = &model.CarPark{
				CarParkID:  carpark_data.CarparkNumber,
				LotDetails: make(map[string]*model.Lot),
			}
		}

		temp_carpark := carPark[carpark_data.CarparkNumber]

		for _, carpark_info := range carpark_data.CarparkInfo {
			existsLot, ok := temp_carpark.LotDetails[carpark_info.LotType]
			if !ok {
				temp_carpark.LotDetails[carpark_info.LotType] = &model.Lot{
					TotalLots:     carpark_info.TotalLots,
					AvailableLots: carpark_info.LotsAvailable,
				}
			} else {
				existsLot.TotalLots = carpark_info.TotalLots
			}
		}
	}
	log.Println("Processed DataGov Car Park Information (Car Park Availability)")

	// process DataGiv api for carpark info
	log.Println("Processing DataGov Car Park Information (Car Park Info)")
	svy21_Converter := utils.NewSVY21()

	for _, carpark_info := range DataGovCarParkInfoResp_Unmarshal.Result.Records {
		if carPark[carpark_info.CarparkNumber] == nil {
			// carPark[carpark_info.CarparkNumber] = &model.CarPark{
			// 	CarParkID:   carpark_info.CarparkNumber,
			// 	Address:     carpark_info.Address,
			// 	CarParkType: carpark_info.CarParkType,
			// }

			// xCoord, _ := strconv.ParseFloat(carpark_info.XCoord, 64)
			// yCoord, _ := strconv.ParseFloat(carpark_info.YCoord, 64)
			// lat, lon := svy21_Converter.ToLatLon(yCoord, xCoord)

			// temp_carpark := carPark[carpark_info.CarparkNumber]
			// temp_carpark.Latitude = lat
			// temp_carpark.Longitude = lon
			continue
		} else if carPark[carpark_info.CarparkNumber].Longitude == 0 && carPark[carpark_info.CarparkNumber].Latitude == 0 {
			xCoord, _ := strconv.ParseFloat(carpark_info.XCoord, 64)
			yCoord, _ := strconv.ParseFloat(carpark_info.YCoord, 64)
			lat, lon := svy21_Converter.ToLatLon(yCoord, xCoord)

			temp_carpark := carPark[carpark_info.CarparkNumber]
			temp_carpark.Address = carpark_info.Address
			temp_carpark.Latitude = lat
			temp_carpark.Longitude = lon
			temp_carpark.CarParkType = carpark_info.CarParkType
		}
	}

	log.Println("Car Park Information Processed")

	defer func() {
		log.Println("Closing Response Body for getting Car Park Information")
		LTAResp.Body.Close()
		DataGovCarParkAvaiResp.Body.Close()
		DataGovCarParkInfoResp.Body.Close()
	}()

	CleanCarParkInfo(carPark)

	// for carParkId, carParkInfo := range carPark {
	// 	fmt.Printf("CarParkID: %s\n", carParkId)
	// 	fmt.Printf("Address: %s\n", carParkInfo.Address)
	// 	fmt.Printf("CarParkType: %s\n", carParkInfo.CarParkType)
	// 	fmt.Printf("Latitude: %f\n", carParkInfo.Latitude)
	// 	fmt.Printf("Longitude: %f\n", carParkInfo.Longitude)
	// 	for lottype, lotinfo := range carParkInfo.LotDetails {
	// 		fmt.Println("LotType: ", lottype)
	// 		fmt.Printf("\tTotalLots: %s\n", lotinfo.TotalLots)
	// 		fmt.Printf("\tAvailableLots: %s\n", lotinfo.AvailableLots)
	// 	}
	// 	fmt.Printf("-----------------------------------\n")
	// }
}

func CleanCarParkInfo(carPark map[string]*model.CarPark) {
	log.Println("Cleaning Car Park Information")
	for _, carParkInfo := range carPark {
		if carParkInfo.Latitude == 0 && carParkInfo.Longitude == 0 {
			delete(carPark, carParkInfo.CarParkID)
		}
	}
	log.Println("Car Park Information Cleaned")
}
