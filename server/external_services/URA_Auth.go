package external_services

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/SC2006-Lab/MobileAppProject/model"
	"github.com/SC2006-Lab/MobileAppProject/utils"
)

func URA_Init(token *string) {
	log.Println("Getting URA Token")
	acessKey := utils.GetURA_AccessKey()

	client := &http.Client{}

	req, err := http.NewRequest("GET", "https://eservice.ura.gov.sg/uraDataService/insertNewToken/v1", nil)
	if err != nil {
		log.Fatal("Fail to create request:", err)
	}

	req.Header.Add("AccessKey", acessKey)

	resp, err := client.Do(req)
	if err != nil {
		log.Fatal("Fail to send request:", err)
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatal("Fail to read response body:", err)
	}

	var URA_Resp model.URA_Resp
	err = json.Unmarshal(body, &URA_Resp)
	if err != nil {
		log.Fatal("Fail to unmarshal JSON:", err)
	}

	*token = URA_Resp.Result
	log.Println("URA Token retrieved successfully")
}
