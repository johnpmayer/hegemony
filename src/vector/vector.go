package vector

import (
	. "math"
)

type Vector3 struct {
	X, Y, Z float64
}

func FromSpherical(r, theta, phi float64) (p *Vector3) {
	x := r * Cos(phi) * Cos(theta)
	y := r * Sin(phi)
	z := r * Cos(phi) * Sin(theta)
	return &Vector3{X: x, Y: y, Z: z}
}

func Midpoint(v1, v2 *Vector3) *Vector3 {

	x := (v1.X + v2.X) / 2
	y := (v1.Y + v2.Y) / 2
	z := (v1.Z + v2.Z) / 2

	return &Vector3{X: x, Y: y, Z: z}

}

func (p *Vector3) Normalize() *Vector3 {

	mag := Sqrt(p.X*p.X + p.Y*p.Y + p.Z*p.Z)

	return p.Scale(1 / mag)

}

func (p *Vector3) Scale(s float64) *Vector3 {
	p.X *= s
	p.Y *= s
	p.Z *= s
	return p
}
