package geodesic

import (
	"crypto/rand"
	"fmt"
	. "math"
	"math/big"
	. "vector"
)

type UVIndex struct {
	U, V int
}

func (p *UVIndex) doubleFrequency() {
	p.U *= 2
	p.V *= 2
}

type GeoNode struct {
	Generation int
	Point      *Vector3
	Locations  []UVIndex
	Elevation  int
}

const MAX_ELEVATION = 1000

func randomElevation(min, max int) int {

	spread := max - min

	defer func() {
		if r := recover(); r != nil {
			fmt.Println(spread)
			panic(r)
		}
	}()

	if spread == 0 {
		return min
	}

	elevation, err := rand.Int(rand.Reader, big.NewInt(int64(spread)))
	if err != nil {
		panic(err.Error())
	}

	return min + int(elevation.Int64())

}

func MakeGeoNode(f, u, v, el int, vec *Vector3) *GeoNode {

	p := new(GeoNode)
	p.Generation = f

	locations := make([]UVIndex, 0, 5)
	canonical := UVIndex{U: u, V: v}
	p.Locations = append(locations, canonical)

	p.Point = vec

	p.Elevation = el

	return p
}

func (p *GeoNode) FirstAt(u, v int) bool {
	loc := p.Locations[0]
	return (u == loc.U && v == loc.V)
}

func (p *GeoNode) addUV(u, v int) {
	p.Locations = append(p.Locations, UVIndex{U: u, V: v})
}

func (p *GeoNode) doubleFrequency() {
	for i := 0; i < len(p.Locations); i += 1 {
		p.Locations[i].doubleFrequency()
	}
}

func minmax(a, b int) (min, max int) {
	if a < b {
		min = a
		max = b
	} else {
		min = b
		max = a
	}
	return
}

func interpolate(f, u, v int, n1, n2 *GeoNode) *GeoNode {

	vec := Midpoint(n1.Point, n2.Point).Normalize()

	el_min, el_max := minmax(n1.Elevation, n2.Elevation)

	el := randomElevation(el_min, el_max)

	return MakeGeoNode(f, u, v, el, vec)
}

type Geodesic struct {
	Frequency int          // generation 0 denotes icosahedron
	U_Array   [][]*GeoNode // 2d storage of GeoNodes
}

func MakeGeodesic(phase1, phase2 int) *Geodesic {

	// Initialize the Geodesic, set generation
	p := new(Geodesic)
	f := 1
	p.Frequency = f

	u_array := make([][]*GeoNode, 7, 7)
	for u := range u_array {
		varray := make([]*GeoNode, 6, 6)
		u_array[u] = varray
	}

	// Create the canonical copies of the psahedron
	north_pole_point := &Vector3{X: 0, Y: 1, Z: 0}
	u_array[0][1] = MakeGeoNode(f, 0, 1, 0, north_pole_point)

	south_pole_point := &Vector3{X: 0, Y: -1, Z: 0}
	u_array[2][0] = MakeGeoNode(f, 2, 0, 0, south_pole_point)

	lat := Atan(0.5)
	for i := 0; i < 5; i += 1 {

		upper_t := float64(2*i) * Pi / 5.0
		upper_point := FromSpherical(1, upper_t, lat)
		u_array[i][i] = MakeGeoNode(f, i, i, 0, upper_point)

		lower_t := float64(2*i+1) * Pi / 5.0
		lower_point := FromSpherical(1, lower_t, -lat)
		u_array[i+1][i] = MakeGeoNode(f, i+1, i, 0, lower_point)
	}

	p.U_Array = u_array

	p.boundaryScan()

	for i := 0; i < phase1; i += 1 {
		p.doubleFrequency()
	}
	p.generateElevation()
	for i := 0; i < phase2; i += 1 {
		p.doubleFrequency()
	}

	return p

}

func (p *Geodesic) generateElevation() {

	u_array := p.U_Array
	for u := 0; u < len(u_array); u += 1 {
		v_array := u_array[u]
		for v := 0; v < len(v_array); v += 1 {
			node := v_array[v]
			if node != nil {
				node.Elevation = randomElevation(0, MAX_ELEVATION)
			}
		}
	}

}

func (p *Geodesic) boundaryScan() {
	u_array := p.U_Array
	f := p.Frequency

	if f == 1 {

		north_pole := u_array[0][f]
		for i := 1; i < 5; i += 1 {
			u := i * f
			v := (i + 1) * f
			north_pole.addUV(u, v)
			u_array[u][v] = north_pole
		}

		south_pole := u_array[2][0]
		for i := 1; i < 5; i += 1 {
			u := (i + 2) * f
			v := i * f
			south_pole.addUV(u, v)
			u_array[u][v] = south_pole
		}

		upper_0 := u_array[0][0]
		upper_0.addUV(5, 5)
		u_array[5][5] = upper_0

		lower_0 := u_array[1][0]
		lower_0.addUV(6, 5)
		u_array[6][5] = lower_0

	} else {

		// mid stitch
		for i := 0; i <= f; i += 1 {
			node := u_array[i][0]
			if node.Generation == f {
				u := 5*f + i
				v := 5 * f
				node.addUV(u, v)
				u_array[u][v] = node
			}
		}

		// upper stitch x5
		for i := 0; i < 5; i += 1 {
			src_u_base := i * f
			src_v := (i + 1) * f
			dst_u := ((i + 1) % 5) * f
			dst_v_base := ((i + 1) % 5) * f
			for j := 1; j < f; j += 1 {
				src_u := src_u_base + j
				src := u_array[src_u][src_v]
				if src.Generation == f {
					dst_v := dst_v_base + (f - j)
					src.addUV(dst_u, dst_v)
					u_array[dst_u][dst_v] = src
				}
			}
		}

		// lower stitch x5
		for i := 0; i < 5; i += 1 {
			src_u := (i + 2) * f
			src_v_base := i * f
			dst_u_base := (((i + 1) % 5) + 1) * f
			dst_v := ((i + 1) % 5) * f
			for j := 1; j < f; j += 1 {
				src_v := src_v_base + j
				src := u_array[src_u][src_v]
				if src.Generation == f {
					dst_u := dst_u_base + (f - j)
					src.addUV(dst_u, dst_v)
					u_array[dst_u][dst_v] = src
				}
			}
		}

	}

}

func (p *Geodesic) doubleFrequency() {

	f := p.Frequency * 2
	u_len := 6*f + 1
	v_len := 5*f + 1

	// allocate new u_array
	u_array := make([][]*GeoNode, u_len)
	for u := 0; u < u_len; u += 1 {
		u_array[u] = make([]*GeoNode, v_len)
	}

	// copy old nodes
	for u := 0; u < len(p.U_Array); u += 1 {
		old_v_array := p.U_Array[u]
		v_array := u_array[2*u]
		for v := 0; v < len(old_v_array); v += 1 {
			node := old_v_array[v]
			if node != nil {
				if node.FirstAt(u, v) {
					node.doubleFrequency()
				}
				v_array[2*v] = old_v_array[v]
			}
		}
	}

	// interpolate along even v_arrays
	for u := 0; u < u_len; u += 2 {
		v_array := u_array[u]
		for v := 0; v+2 < v_len; v += 2 {
			node1 := v_array[v]
			node2 := v_array[v+2]
			if node1 != nil && node2 != nil {
				node := interpolate(f, u, v, v_array[v], v_array[v+2])
				v_array[v+1] = node
			}
		}
	}

	// interpolate between v_arrays
	for u := 0; u+2 < u_len; u += 2 {
		v_array_a := u_array[u]
		v_array_b := u_array[u+2]

		// horizontal
		for v := 0; v < v_len; v += 2 {
			node1 := v_array_a[v]
			node2 := v_array_b[v]
			if node1 != nil && node2 != nil {

				node := interpolate(f, u+1, v, node1, node2)
				u_array[u+1][v] = node

			}
		}

		// diagonal
		for v := 0; v+2 < v_len; v += 2 {
			node1 := v_array_a[v]
			node2 := v_array_b[v+2]
			if node1 != nil && node2 != nil {

				node := interpolate(f, u+1, v+1, node1, node2)
				u_array[u+1][v+1] = node

			}
		}

	}

	//todo()

	p.Frequency = f
	p.U_Array = u_array
	p.boundaryScan()

	return
}

func todo() {
	panic("ToDo")
}
