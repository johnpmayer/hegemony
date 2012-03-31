package geodesic

import (
	. "math"
	. "vector"
)

type UVIndex struct {
	U, V int
}

type GeoNode struct {
	Generation int
	Point      *Vector3
	Locations  []UVIndex
}

func MakeGeoNode(f, u, v int, vec *Vector3) *GeoNode {

	p := new(GeoNode)
	p.Generation = f

	locations := make([]UVIndex, 0, 5)
	canonical := UVIndex{U: u, V: v}
	p.Locations = append(locations, canonical)

	p.Point = vec

	return p
}

func (p *GeoNode) FirstAt(u, v int) bool {
	loc := p.Locations[0]
	return (u == loc.U && v == loc.V)
}

func (p *GeoNode) addUV(u, v int) {
	p.Locations = append(p.Locations, UVIndex{U: u, V: v})
}

type Geodesic struct {
	Frequency int          // generation 0 denotes icosahedron
	U_array   [][]*GeoNode // 2d storage of GeoNodes
}

func MakeGeodesic() *Geodesic {

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
	u_array[0][1] = MakeGeoNode(f, 0, 1, north_pole_point)

	south_pole_point := &Vector3{X: 0, Y: -1, Z: 0}
	u_array[2][0] = MakeGeoNode(f, 2, 0, south_pole_point)

	lat := Atan(0.5)
	for i := 0; i < 5; i += 1 {

		upper_t := float64(2*i) * Pi / 5.0
		upper_point := FromSpherical(1, upper_t, lat)
		u_array[i][i] = MakeGeoNode(f, i, i, upper_point)

		lower_t := float64(2*i+1) * Pi / 5.0
		lower_point := FromSpherical(1, lower_t, -lat)
		u_array[i+1][i] = MakeGeoNode(f, i+1, i, lower_point)
	}

	p.U_array = u_array

	p.boundaryScan()

	return p

}

func (p *Geodesic) boundaryScan() {
	u_array := p.U_array
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

func (p *Geodesic) DoubleFrequency() {
	todo()
	return
}

func todo() {
	panic("ToDo")
}
