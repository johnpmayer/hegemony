package main

import (
	"encoding/json"
	"geodesic"
	"github.com/hoisie/web.go"
	"io"
	"os"
)

func check(err error) {
	if err != nil {
		panic(err.Error())
	}
}

func gamePageHandler(ctx *web.Context) {
	gamePage, err := os.Open("index.html")
	check(err)
	ctx.ContentType("html")
	_, err = io.Copy(ctx, gamePage)
	check(err)
}

func scriptHandler(ctx *web.Context, path string) {
	file, err := os.Open(path)
	check(err)
	ctx.ContentType("js")
	_, err = io.Copy(ctx, file)
	check(err)
}


func main() {
	
	globe := geodesic.MakeGeodesic()
	
	globeHandler := func (ctx *web.Context) {
		
		obj, err := json.Marshal(globe)
		check(err)
		ctx.ContentType("json")
		_, err = ctx.Write(obj)
		check(err)
		
	}

	
	// Static routers
	web.Get("/", gamePageHandler)
	web.Get("/(scripts/.*[.]js)", scriptHandler)

	// Rangom globe
	web.Get("/globe", globeHandler)

	web.Run(":8000")

}
