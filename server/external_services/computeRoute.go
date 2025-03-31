package external_services

import (
	"context"
	"crypto/tls"
	"fmt"
	"time"

	"github.com/SC2006-Lab/MobileAppProject/model"
	"github.com/SC2006-Lab/MobileAppProject/utils"
	routespb "google.golang.org/genproto/googleapis/maps/routing/v2"
	"google.golang.org/genproto/googleapis/type/latlng"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"google.golang.org/grpc/metadata"
)

var (
	fieldMask  = "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline"
	apiKey     = utils.GetEnvConfig().GOOGLE_API_KEY
	serverAddr = "routes.googleapis.com:443"
)

func ComputeRoute(originLat, originLng, destLat, destLng float64) (*model.RouteInfo, error) {
	config := tls.Config{}
	conn, err := grpc.Dial(serverAddr,
		grpc.WithTransportCredentials(credentials.NewTLS(&config)))
	if err != nil {
		return nil, fmt.Errorf("failed to connect: %v", err)
	}

	defer conn.Close()

	client := routespb.NewRoutesClient(conn)
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	ctx = metadata.AppendToOutgoingContext(ctx, "X-Goog-Api-Key", apiKey)
	ctx = metadata.AppendToOutgoingContext(ctx, "X-Goog-Fieldmask", fieldMask)
	defer cancel()

	origin := &routespb.Waypoint{
		LocationType: &routespb.Waypoint_Location{
			Location: &routespb.Location{
				LatLng: &latlng.LatLng{
					Latitude:  originLat,
					Longitude: originLng,
				},
			},
		},
	}
	destination := &routespb.Waypoint{
		LocationType: &routespb.Waypoint_Location{
			Location: &routespb.Location{
				LatLng: &latlng.LatLng{
					Latitude:  destLat,
					Longitude: destLng,
				},
			},
		},
	}

	req := &routespb.ComputeRoutesRequest{
		Origin:                   origin,
		Destination:              destination,
		TravelMode:               routespb.RouteTravelMode_DRIVE,
		RoutingPreference:        routespb.RoutingPreference_TRAFFIC_AWARE,
		ComputeAlternativeRoutes: false,
		Units:                    routespb.Units_METRIC,
		RouteModifiers: &routespb.RouteModifiers{
			AvoidTolls:    false,
			AvoidHighways: false,
			AvoidFerries:  false,
		},
		PolylineQuality: routespb.PolylineQuality_OVERVIEW,
	}

	resp, err := client.ComputeRoutes(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to compute routes: %v", err)
	}

	if len(resp.Routes) == 0 {
		return nil, fmt.Errorf("no routes found")
	}

	route := resp.GetRoutes()[0]

	// distance := route.GetDistanceMeters()
	// duration := route.GetDuration().GetSeconds()
	// polyline := route.GetPolyline().GetEncodedPolyline()

	// fmt.Printf("Distance: %d meters\n", distance)
	// fmt.Printf("Duration: %d seconds\n", duration)
	// fmt.Printf("Polyline: %s\n", polyline)

	routeInfo := &model.RouteInfo{
		Distance: route.GetDistanceMeters(),
		Duration: route.GetDuration().GetSeconds(),
		Polyline: route.GetPolyline().GetEncodedPolyline(),
	}

	return routeInfo, nil
}
