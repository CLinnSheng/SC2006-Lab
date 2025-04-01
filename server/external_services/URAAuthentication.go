package external_services

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/SC2006-Lab/MobileAppProject/model"
	"github.com/SC2006-Lab/MobileAppProject/utils"
)

func URAInit_GetToken(token *string) {
	acessKey := utils.GetURAAccessKey()

	client := &http.Client{}
	
	req, err := http.NewRequest("GET", "https://eservice.ura.gov.sg/uraDataService/insertNewToken/v1", nil)
	if err != nil {
		log.Fatal("Fail to create request:", err)
	}

	req.Header.Add("AccessKey", acessKey)

	resp, err := client.Do(req)
	if err != nil {
		log.Fatal("Fail to make request:", err)
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatal("Fail to read response body:", err)
	}

	var URAResp model.URAResponse
	err = json.Unmarshal(body, &URAResp)
	if err != nil {
		log.Fatal("Fail to unmarshal JSON:", err)
	}

	*token = URAResp.Result
}
