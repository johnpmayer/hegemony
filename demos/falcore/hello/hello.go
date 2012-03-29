package main

import (
	"fmt"
	"github.com/ngmoco/falcore"
	"net/http"
)

func main() {

	port := 8080

	pipeline := falcore.NewPipeline()

	pipeline.Upstream.PushBack(
		falcore.NewRequestFilter(
			func(req *falcore.Request) *http.Response {
				return falcore.SimpleResponse(
					req.HttpRequest,
					200,
					nil,
					"Hello, World!")
			}))

	server := falcore.NewServer(port, pipeline)

	if err := server.ListenAndServe(); err != nil {
		fmt.Println("Could not start server:" + err.Error())
	}

}
