package main

import (
	"encoding/json"
	"fmt"
	. "geodesic"
	"net/http"
	. "vector"
)

func main() {

	vec := &Vector3{0, 0, 0}
	try(vec)

	node := MakeGeoNode(0, 0, 0, vec)
	try(node)

	geo := MakeGeodesic()
	geoObj := try(geo)

	u_array := geo.U_array
	all_count := 0
	unique_count := 0

	for u := 0; u < 7; u += 1 {
		for v := 0; v < 6; v += 1 {
			node := u_array[u][v]
			if node != nil {
				all_count += 1
				if node.FirstAt(u, v) {
					unique_count += 1
				}
			}
		}
	}

	fmt.Printf("All: %d, Unique: %d", all_count, unique_count)
	fmt.Println()

	handler := func(w http.ResponseWriter, req *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write(geoObj)
	}

	http.HandleFunc("/", handler)
	err := http.ListenAndServe(":12345", nil)
	if err != nil {
		panic(err.Error())
	}

}

func try(thing interface{}) []byte {

	object, err := json.Marshal(thing)

	if err != nil {
		panic(err.Error())
	}

	fmt.Print("Node: ")
	fmt.Println(string(object))

	return object

}
