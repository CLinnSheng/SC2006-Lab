package utils

func ConvertMeterToKm(meter int32) float64 {
	return float64(meter) / 1000.0
}

func ConvertSecondsToMinutes(seconds int64) float64 {
	return float64(seconds) / 60.0
}
