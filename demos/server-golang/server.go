package main

import (
	"io"
	"os"
	"github.com/jpmayer/web.go"
)

func static(ctx *web.Context, rsrc string) {

	file, err := os.Open("static/" + rsrc)
	check(err)

	_, err = io.Copy(ctx, file)

}

func rootRedirect(ctx *web.Context, val string) {
	ctx.Redirect(303, "static/index.html")
}

func main() {

	web.Get("/static/(.*)", static)
	web.Get("/(.*)", rootRedirect)
	web.Run("0.0.0.0:8080")

}

// check aborts the current execution if err is non-nil.
func check(err error) {
	if err != nil {
		panic(err)
	}
}
