package external_services

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/SC2006-Lab/MobileAppProject/model"
	"github.com/SC2006-Lab/MobileAppProject/utils"
)

func OneMapInit(token *string) {
	envConfig := utils.GetEnvConfig()
	log.Println("Getting OneMap Token")
	reqPayload := map[string]string{
		"email":    envConfig.ONEMAP_EMAIL,
		"password": envConfig.ONEMAP_PASSWORD,
	}

	// Marshall the request payload to JSON
	reqPayloadBytes, err := json.Marshal(reqPayload)
	if err != nil {
		log.Fatal("Failed to marshal request payload:", err)
	}

	req, err := http.NewRequest("POST", "https://www.onemap.gov.sg/api/auth/post/getToken", bytes.NewBuffer(reqPayloadBytes))
	if err != nil {
		log.Fatal("Failed to create request:", err)
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Fatal("Failed to send request:", err)
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatal("Failed to read response body:", err)
	}

	var OneMap_Resp model.OneMap_Resp
	err = json.Unmarshal(body, &OneMap_Resp)
	if err != nil {
		log.Fatal("Failed to unmarshal JSON:", err)
	}

	*token = OneMap_Resp.AccessToken
	log.Println("OneMap Token retrieved successfully")
}
