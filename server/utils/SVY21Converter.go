package utils

import "math"

// Ref: http://www.linz.govt.nz/geodetic/conversion-coordinates/projection-conversions/transverse-mercator-preliminary-computations/index.aspx
type SVY21 struct {
	a    float64 // Semi-major axis (WGS84)
	f    float64 // Flattening (WGS84)
	oLat float64 // Origin latitude (degrees)
	oLon float64 // Origin longitude (degrees)
	oN   float64 // False Northing
	oE   float64 // False Easting
	k    float64 // Scale factor
	b    float64
	e2   float64
	e4   float64
	e6   float64
	A0   float64
	A2   float64
	A4   float64
	A6   float64
}

func NewSVY21() *SVY21 {
	svy := &SVY21{
		a:    6378137,
		f:    1 / 298.257223563,
		oLat: 1.366666,
		oLon: 103.833333,
		oN:   38744.572,
		oE:   28001.642,
		k:    1,
	}
	svy.init()
	return svy
}

func (svy *SVY21) init() {
	svy.b = svy.a * (1 - svy.f)
	svy.e2 = 2*svy.f - svy.f*svy.f
	svy.e4 = svy.e2 * svy.e2
	svy.e6 = svy.e4 * svy.e2
	svy.A0 = 1 - svy.e2/4 - (3*svy.e4)/64 - (5*svy.e6)/256
	svy.A2 = (3 / 8.) * (svy.e2 + svy.e4/4. + (15*svy.e6)/128.)
	svy.A4 = (15 / 256.) * (svy.e4 + (3*svy.e6)/4.)
	svy.A6 = (35 * svy.e6) / 3072
}


// Helper methods
func (svy *SVY21) calcRho(sin2Lat float64) float64 {
	num := svy.a * (1 - svy.e2)
	denom := math.Pow(1-svy.e2*sin2Lat, 1.5)
	return num / denom
}

func (svy *SVY21) calcV(sin2Lat float64) float64 {
	poly := 1 - svy.e2*sin2Lat
	return svy.a / math.Sqrt(poly)
}

func (svy *SVY21) calcM(lat float64) float64 {
	latR := lat * math.Pi / 180.
	return svy.a * ((svy.A0 * latR) - (svy.A2 * math.Sin(2*latR)) + (svy.A4 * math.Sin(4*latR)) - (svy.A6 * math.Sin(6*latR)))
}

// Converts latitude and longitude to SVY21 northings and eastings
func (svy *SVY21) ToSVY21(lat, lon float64) (N, E float64) {

	latR := lat * math.Pi / 180.
	sinLat := math.Sin(latR)
	sin2Lat := sinLat * sinLat
	cosLat := math.Cos(latR)
	cos2Lat := cosLat * cosLat
	cos3Lat := cos2Lat * cosLat
	cos4Lat := cos3Lat * cosLat
	cos5Lat := cos4Lat * cosLat
	cos6Lat := cos5Lat * cosLat
	cos7Lat := cos6Lat * cosLat

	rho := svy.calcRho(sin2Lat)
	v := svy.calcV(sin2Lat)
	psi := v / rho
	t := math.Tan(latR)
	w := (lon - svy.oLon) * math.Pi / 180.

	M := svy.calcM(lat)
	Mo := svy.calcM(svy.oLat)

	w2 := w * w
	w4 := w2 * w2
	w6 := w4 * w2
	w8 := w6 * w2

	psi2 := psi * psi
	psi3 := psi2 * psi
	psi4 := psi3 * psi

	t2 := t * t
	t4 := t2 * t2
	t6 := t4 * t2

	// Compute northings
	nTerm1 := w2 / 2. * v * sinLat * cosLat
	nTerm2 := w4 / 24. * v * sinLat * cos3Lat * (4*psi2 + psi - t2)
	nTerm3 := w6 / 720. * v * sinLat * cos5Lat * ((8*psi4)*(11-24*t2) - (28*psi3)*(1-6*t2) + psi2*(1-32*t2) - psi*2*t2 + t4)
	nTerm4 := w8 / 40320. * v * sinLat * cos7Lat * (1385 - 3111*t2 + 543*t4 - t6)
	N = svy.oN + svy.k*(M-Mo+nTerm1+nTerm2+nTerm3+nTerm4)

	// Compute eastings
	eTerm1 := w2 / 6. * cos2Lat * (psi - t2)
	eTerm2 := w4 / 120. * cos4Lat * ((4*psi3)*(1-6*t2) + psi2*(1+8*t2) - psi*2*t2 + t4)
	eTerm3 := w6 / 5040. * cos6Lat * (61 - 479*t2 + 179*t4 - t6)
	E = svy.oE + svy.k*v*w*cosLat*(1+eTerm1+eTerm2+eTerm3)

	return N, E
}

// Converts SVY21 northings and eastings to latitude and longitude
func (svy *SVY21) ToLatLon(N, E float64) (lat, lon float64) {
	Nprime := N - svy.oN
	Mo := svy.calcM(svy.oLat)
	Mprime := Mo + (Nprime / svy.k)
	n := (svy.a - svy.b) / (svy.a + svy.b)
	n2 := n * n
	n3 := n2 * n
	n4 := n2 * n2
	G := svy.a * (1 - n) * (1 - n2) * (1 + (9 * n2 / 4.) + (225 * n4 / 64.)) * (math.Pi / 180.)
	sigma := (Mprime * math.Pi) / (180 * G)

	latPrimeT1 := ((3 * n / 2.) - (27 * n3 / 32.)) * math.Sin(2*sigma)
	latPrimeT2 := ((21 * n2 / 16.) - (55 * n4 / 32.)) * math.Sin(4*sigma)
	latPrimeT3 := (151 * n3 / 96.) * math.Sin(6*sigma)
	latPrimeT4 := (1097 * n4 / 512.) * math.Sin(8*sigma)
	latPrime := sigma + latPrimeT1 + latPrimeT2 + latPrimeT3 + latPrimeT4

	sinLatPrime := math.Sin(latPrime)
	sin2LatPrime := sinLatPrime * sinLatPrime

	rhoPrime := svy.calcRho(sin2LatPrime)
	vPrime := svy.calcV(sin2LatPrime)
	psiPrime := vPrime / rhoPrime
	psiPrime2 := psiPrime * psiPrime
	psiPrime3 := psiPrime2 * psiPrime
	psiPrime4 := psiPrime3 * psiPrime
	tPrime := math.Tan(latPrime)
	tPrime2 := tPrime * tPrime
	tPrime4 := tPrime2 * tPrime2
	tPrime6 := tPrime4 * tPrime2
	Eprime := E - svy.oE
	x := Eprime / (svy.k * vPrime)
	x2 := x * x
	x3 := x2 * x
	x5 := x3 * x2
	x7 := x5 * x2

	// Compute latitude
	latFactor := tPrime / (svy.k * rhoPrime)
	latTerm1 := latFactor * ((Eprime * x) / 2.)
	latTerm2 := latFactor * ((Eprime * x3) / 24.) * ((-4 * psiPrime2) + (9*psiPrime)*(1-tPrime2) + (12 * tPrime2))
	latTerm3 := latFactor * ((Eprime * x5) / 720.) * ((8*psiPrime4)*(11-24*tPrime2) - (12*psiPrime3)*(21-71*tPrime2) + (15*psiPrime2)*(15-98*tPrime2+15*tPrime4) + (180*psiPrime)*(5*tPrime2-3*tPrime4) + 360*tPrime4)
	latTerm4 := latFactor * ((Eprime * x7) / 40320.) * (1385 - 3633*tPrime2 + 4095*tPrime4 + 1575*tPrime6)

	latRad := latPrime - latTerm1 + latTerm2 - latTerm3 + latTerm4
	lat = latRad / (math.Pi / 180.)

	// Compute Longitude
	secLatPrime := 1.0 / math.Cos(latRad)
	lonTerm1 := x * secLatPrime
	lonTerm2 := ((x3 * secLatPrime) / 6.) * (psiPrime + 2*tPrime2)
	lonTerm3 := ((x5 * secLatPrime) / 120.) * ((-4*psiPrime3)*(1-6*tPrime2) + psiPrime2*(9-68*tPrime2) + 72*psiPrime*tPrime2 + 24*tPrime4)
	lonTerm4 := ((x7 * secLatPrime) / 5040.) * (61 + 662*tPrime2 + 1320*tPrime4 + 720*tPrime6)

	lon = ((svy.oLon * math.Pi / 180.) + lonTerm1 - lonTerm2 + lonTerm3 - lonTerm4) / (math.Pi / 180.)

	return lat, lon
}
