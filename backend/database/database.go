package database

import (
	"fmt"
	"log"
	"os"

	"app/models"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func DBconnect() {
	errorENV := godotenv.Load()
	if errorENV != nil {
		panic("Failed to load env file")
	}

	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASS")
	dbName := os.Getenv("DB_NAME")

	var err error
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Taipei", dbHost, dbUser, dbPass, dbName, dbPort)

	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("Fail to connect database")
	}

	DB.AutoMigrate(&models.User{}, &models.Post{}, &models.Comments{})
}
