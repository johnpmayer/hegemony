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
