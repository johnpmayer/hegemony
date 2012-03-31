package main

import (
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
	_,err = io.Copy(ctx, gamePage)
}

func scriptHandler(ctx *web.Context, path string) {
	file, err := os.Open(path)
	check(err)
	ctx.ContentType("js")
	_,err = io.Copy(ctx, file)
}

func main() {

	web.Get("/", gamePageHandler)
	web.Get("/(scripts/.*[.]js)", scriptHandler)
	
	web.Run(":8000")

}
