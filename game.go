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

func randomGlobeHandler(ctx *web.Context) {

	geo := geodesic.MakeGeodesic()
	obj, err := json.Marshal(geo)
	check(err)
	ctx.ContentType("json")
	_, err = ctx.Write(obj)
	check(err)

}

func main() {

	// Static routers
	web.Get("/", gamePageHandler)
	web.Get("/(scripts/.*[.]js)", scriptHandler)

	// Rangom globe
	web.Get("/randomGlobe", randomGlobeHandler)

	web.Run(":8000")

}
