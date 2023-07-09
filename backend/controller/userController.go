package controller

import (
	"app/database"
	"app/middlewares"
	"app/models"
	"encoding/base64"
	"io/ioutil"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func Signup(c *gin.Context) {
	user := models.User{}

	var SignupData struct {
		Id       int    `json:"id"`
		Name     string `json:"username"`
		Password string `json:"password"`
		Email    string `json:"email"`
	}

	err := c.BindJSON(&SignupData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if username or email already exists
	checkUserName := database.DB.Where("name = ?", SignupData.Name).First(&user)
	if checkUserName.Error == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username already exists"})
		return
	}

	checkUserEmail := database.DB.Where("email = ?", SignupData.Email).First(&user)
	if checkUserEmail.Error == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email already exists"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(SignupData.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Error occurred encrypting password",
		})
		return
	}

	user = models.User{
		Name:     SignupData.Name,
		Password: string(hashedPassword),
		Email:    SignupData.Email,
	}

	result := database.DB.Create(&user)
	if result.Error != nil {
		c.AbortWithStatusJSON(400, gin.H{
			"error": "Failed to create user",
		})
		return
	}
	c.JSON(http.StatusOK, user)

	// var body struct {
	// 	Id       int    `json:"id"`
	// 	Name     string `json:"username"`
	// 	Password string `json:"password"`
	// 	Email    string `json:"email"`
	// }

	// c.Bind(&body)

	// // Check if username exists
	// var existingUser models.User

	// if existingUser.Id != 0 {
	// 	if existingUser.Name == body.Name {
	// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Username  already exists"})
	// 		return
	// 	}
	// 	if existingUser.Email == body.Email {
	// 		c.JSON(http.StatusBadRequest, gin.H{"error": "email already exists"})
	// 		return
	// 	}
	// }

	// newuser := models.User{
	// 	Id:       body.Id,
	// 	Name:     body.Name,
	// 	Password: body.Password,
	// 	Email:    body.Email,
	// }

	// //check name or email empty
	// if body.Name == "" || body.Email == "" || body.Password == "" {
	// 	c.JSON(http.StatusBadRequest, gin.H{
	// 		"error": "cannot be empty",
	// 	})
	// 	return
	// }

	// hashPassword, err := bcrypt.GenerateFromPassword([]byte(newuser.Password), bcrypt.DefaultCost)
	// if err != nil {
	// 	c.JSON(http.StatusInternalServerError, gin.H{
	// 		"message": "Error occurred encrypting password",
	// 	})
	// 	return
	// }

	// newuser.Password = string(hashPassword)

	// result := database.DB.Create(&newuser)
	// if result.Error != nil {
	// 	c.AbortWithStatusJSON(400, gin.H{
	// 		"error": "Failed to create user",
	// 	})
	// 	return
	// }

	// c.JSON(200, gin.H{
	// 	"message": newuser,
	// })

}

func Login(c *gin.Context) {

	user := models.User{}
	var loginData struct {
		Name     string `json:"username"`
		Password string `json:"password"`
	}
	err := c.BindJSON(&loginData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result := database.DB.Where("name = ?", loginData.Name).First(&user)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(loginData.Password))
	if err != nil {
		// Passwords don't match

		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	middlewares.SaveSession(c, user.Id)

	c.JSON(200, gin.H{
		"id":       middlewares.GetSession(c),
		"username": user.Name,
		"userimg":  user.UserImg,
	})

	// c.JSON(http.StatusOK, gin.H{
	// 	"message":  "Login Successfully",
	// 	"User":     user,
	// 	"Sessions": middlewares.GetSession(c),
	// })
}

func Logout(c *gin.Context) {
	middlewares.ClearSession(c)
	c.JSON(http.StatusOK, gin.H{
		"message": "Logout Successfully",
	})
}

func GetUser(c *gin.Context) {
	userId := c.Param("id")

	var user models.User
	result := database.DB.Where("id = ?", userId).First(&user)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"username": user.Name,
		"email":    user.Email,
		"userImg":  user.UserImg,
	})

}

func UpdateUser(c *gin.Context) {
	userId := c.Param("id")

	var user models.User
	result := database.DB.Where("id = ?", userId).First(&user)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	err := c.Request.ParseMultipartForm(32)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": "Failed to parse form data",
		})
		return
	}

	username := c.Request.FormValue("username")
	password := c.Request.FormValue("password")
	email := c.Request.FormValue("email")

	var imageBase64 string
	imageFile, _, err := c.Request.FormFile("userimg")
	if err == nil {
		imageData, err := ioutil.ReadAll(imageFile)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to read image file",
			})
			return
		}
		imageBase64 = base64.StdEncoding.EncodeToString(imageData)
	}

	// Check if username or email already exists
	checkUserName := database.DB.Where("name = ?", username).First(&user)
	if checkUserName.Error == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username already exists"})
		return
	}

	checkUserEmail := database.DB.Where("email = ?", email).First(&user)
	if checkUserEmail.Error == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email already exists"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Error occurred encrypting password",
		})
		return
	}

	if username != "" {
		user.Name = username
	}
	if password != "" {
		user.Password = string(hashedPassword)
	}
	if email != "" {
		user.Email = email
	}
	if imageBase64 != "" {
		user.UserImg = imageBase64
	}

	result = database.DB.Save(&user)

	if result.Error != nil {
		c.AbortWithStatusJSON(400, gin.H{
			"error": "Failed to updata user",
		})
		return
	}

	c.JSON(http.StatusOK, user)
}

func Followers(c *gin.Context) {
	currentUserID := middlewares.GetSession(c)
	if currentUserID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	friendID := c.Param("id") // Assuming the friend ID is passed as a URL parameter

	// Check if the friend ID is valid
	friend := models.User{}
	result := database.DB.First(&friend, friendID)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid friend ID"})
		return
	}

	// Get the current user
	currentUser := models.User{}
	result = database.DB.Preload("Following").First(&currentUser, currentUserID)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get current user"})
		return
	}

	// Check if the current user is already following the friend
	for _, following := range currentUser.Following {
		if following.Id == friend.Id {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Already following this user"})
			return
		}
	}

	// Add the friend to the current user's following list
	currentUser.Following = append(currentUser.Following, &friend)

	// Save the changes in the database
	result = database.DB.Save(&currentUser)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add friend"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Friend added successfully"})
}
