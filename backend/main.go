package main

import (
	"app/controller"
	"app/database"
	"app/middlewares"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func init() {
	database.DBconnect()
}

func main() {
	r := gin.Default()

	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	r.Use(cors.New(config))

	r.Use(middlewares.SetSession())

	//user//
	r.POST("/signup", controller.Signup)
	r.POST("/login", controller.Login)
	r.POST("/logout", controller.Logout)
	r.GET("/getuser/:id", controller.GetUser)
	r.PATCH("/updateuser/:id", controller.UpdateUser)
	//post//
	r.POST("/addpost", controller.CreatePost)
	r.GET("/posts/:id", controller.FindPostbyUser)
	r.POST("/comments/:id", controller.Addcomment)
	r.PATCH("/postlike/:id", controller.Postlike)
	r.PATCH("/postunlike/:id", controller.PostUnlike)
	r.Run()
}
