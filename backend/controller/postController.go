package controller

import (
	"app/database"
	"app/models"
	"encoding/base64"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// create post
func CreatePost(c *gin.Context) {
	err := c.Request.ParseMultipartForm(32) // 32MB 的最大記憶體限制
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": "Failed to parse form data",
		})
		return
	}

	userIdStr := c.Request.FormValue("userId")
	userId, err := strconv.Atoi(userIdStr)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": "Invalid userId",
		})
		return
	}

	content := c.Request.FormValue("content")

	// 執行對 img 的後續處理
	// var imageBase64 string
	// imageFile, _, err := c.Request.FormFile("postimg")
	// if err == nil {
	// 	imageData, err := ioutil.ReadAll(imageFile)
	// 	if err != nil {
	// 		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
	// 			"error": "Failed to read image file",
	// 		})
	// 		return
	// 	}
	// 	imageBase64 = base64.StdEncoding.EncodeToString(imageData)
	// }

	//====================================================//

	// 	img url
	var imageUrl string
	imageFile, header, err := c.Request.FormFile("postimg")
	if err == nil {
		imageData, err := ioutil.ReadAll(imageFile)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to read image file",
			})
			return
		}

		fileExt := path.Ext(header.Filename)
		fileName := uuid.New().String() + fileExt
		filePath := filepath.Join("postsimg", fileName)

		err = ioutil.WriteFile(filePath, imageData, 0644)
		fmt.Println(err)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to save image file",
			})
			return
		}

		imageUrl = filePath
	}

	post := models.Post{UserId: userId, Content: content, PostImg: imageUrl}
	result := database.DB.Create(&post)

	if result.Error != nil {
		c.AbortWithStatusJSON(400, gin.H{
			"error": "Failed to create post",
		})
		return
	}

	c.JSON(http.StatusOK, post)
}

// put  post
func Putpost(c *gin.Context) {

	//get the id
	id := c.Param("id")

	//get the data body
	var body struct {
		Context string `json:"context"`
		PostImg string `json:"post_img"`
	}
	err := c.BindJSON(&body)
	if err != nil {
		c.JSON(http.StatusNotAcceptable, "error"+err.Error())
		return
	}

	//find the post
	var post models.Post
	database.DB.First(&post, id)

	//update it
	result := database.DB.Model(&post).Updates(models.Post{
		Content: body.Context,
		PostImg: body.PostImg,
	})

	if result.Error != nil {
		c.JSON(http.StatusNotFound, "update failed")
		return
	}

	c.JSON(http.StatusOK, post)
}

// delete post
func DeleteUser(c *gin.Context) {

}

//圖片轉成base64 讓前端可以讀取
func GetImageBase64(imagePath string) (string, error) {
	file, err := os.Open(imagePath)
	if err != nil {
		return "", err
	}
	defer file.Close()

	fileInfo, _ := file.Stat()
	fileSize := fileInfo.Size()
	buffer := make([]byte, fileSize)

	_, err = file.Read(buffer)
	if err != nil {
		return "", err
	}

	return base64.StdEncoding.EncodeToString(buffer), nil
}

func FindPostbyUser(c *gin.Context) {
	userId := c.Param("id")

	var posts []models.Post
	result := database.DB.Preload("Comments").Where("user_id = ?", userId).Find(&posts)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Not found"})
		return
	}

	var user models.User
	database.DB.First(&user, userId)

	type UserResponse struct {
		ID      int    `json:"id"`
		Name    string `json:"name"`
		UserImg string `json:"userImg"`
	}

	type CommentResponse struct {
		ID        int    `json:"id"`
		UserID    int    `json:"userId"`
		Username  string `json:"username"`
		Comment   string `json:"comment"`
		CreatedAt time.Time
	}

	type PostResponse struct {
		ID          int               `json:"postid"`
		User        UserResponse      `json:"user"`
		Content     string            `json:"content"`
		PostImg     string            `json:"postImg"`
		Likes       int               `json:"like"`
		Comments    []CommentResponse `json:"comments"`
		Create_time time.Time
	}

	var response []PostResponse
	for _, post := range posts {
		var comments []CommentResponse
		for _, comment := range post.Comments {
			comments = append(comments, CommentResponse{
				ID:        comment.ID,
				UserID:    comment.UserID,
				Username:  comment.Username,
				Comment:   comment.Comment,
				CreatedAt: comment.Create_time,
			})
		}

		postImgBase64, err := GetImageBase64(post.PostImg)
		if postImgBase64 != "" {
			if err != nil {
				// 處理讀取圖片或轉換出錯的情況
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process image"})
				return
			}
		}

		response = append(response, PostResponse{
			ID: post.PostId,
			User: UserResponse{
				ID:      user.Id,
				Name:    user.Name,
				UserImg: user.UserImg,
			},
			Content:     post.Content,
			PostImg:     postImgBase64,
			Likes:       post.Like,
			Comments:    comments,
			Create_time: post.Create_time,
		})
	}

	c.JSON(http.StatusOK, response)
}

// func FindPostById(c *gin.Context) {
// 	postId := c.Param("id")
// 	var post []models.Post
// 	result := database.DB.Where("id = ?", postId).First(&post)
// 	if result.Error != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "Not found"})
// 		return
// 	}
// 	var user models.User
// 	database.DB.First(&user, postId)

// 	type UserResponse struct {
// 		ID      int    `json:"id"`
// 		Name    string `json:"name"`
// 		UserImg string `json:"userImg"`
// 	}

// 	type CommentResponse struct {
// 		ID          int    `json:"id"`
// 		UserID      int    `json:"userId"`
// 		Username    string `json:"username"`
// 		Content     string `json:"content"`
// 		Create_time time.Time
// 	}

// 	type PostResponse struct {
// 		ID          int               `json:"postid"`
// 		User        UserResponse      `json:"user"`
// 		Content     string            `json:"content"`
// 		PostImg     string            `json:"postImg"`
// 		Likes       int               `json:"like"`
// 		Comments    []CommentResponse `json:"comments"`
// 		Create_time time.Time
// 	}

// 	var response []PostResponse
// 	for _, post := range post {
// 		var comments []CommentResponse
// 		for _, comment := range post.Comments {
// 			comments = append(comments, CommentResponse{
// 				ID:          comment.ID,
// 				UserID:      comment.UserID,
// 				Username:    comment.Username,
// 				Content:     comment.Content,
// 				Create_time: comment.Create_time,
// 			})
// 		}

// 		response = append(response, PostResponse{
// 			ID: post.PostId,
// 			User: UserResponse{
// 				ID:      user.Id,
// 				Name:    user.Name,
// 				UserImg: user.Img,
// 			},
// 			Content:     post.Content,
// 			PostImg:     post.PostImg,
// 			Likes:       post.Like,
// 			Comments:    comments,
// 			Create_time: post.Create_time,
// 		})
// 	}

// 	c.JSON(http.StatusOK, response)
// }

func Addcomment(c *gin.Context) {
	postId := c.Param("id")

	var comment struct {
		UserID   int    `json:"userId"`
		Username string `json:"username"`
		Comment  string `json:"comment"`
	}
	if err := c.ShouldBindJSON(&comment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid comment data"})
		return
	}

	var post models.Post
	result := database.DB.Where("post_id = ?", postId).First(&post)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	// Create a new comment with user information
	newComment := models.Comments{
		PostID:      post.PostId,
		UserID:      comment.UserID,
		Username:    comment.Username,
		Comment:     comment.Comment,
		Create_time: time.Now(),
		Update_time: time.Now(),
	}

	// Add the comment to the post
	post.Comments = append(post.Comments, newComment)

	// Save the updated post to the database
	if err := database.DB.Save(&post).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add comment"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Comment added successfully"})
}

func Postlike(c *gin.Context) {
	postid := c.Param("id")

	//find the post
	var post models.Post
	database.DB.First(&post, postid)

	// update it
	post.Like = post.Like + 1
	result := database.DB.Save(&post)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, "update failed")
		return
	}

	c.JSON(http.StatusOK, post)
}

func PostUnlike(c *gin.Context) {
	postid := c.Param("id")

	// Find the post
	var post models.Post
	database.DB.First(&post, postid)

	// Decrement the like count
	post.Like = post.Like - 1

	// Update the post
	result := database.DB.Save(&post)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, "update failed")
		return
	}

	c.JSON(http.StatusOK, post)
}
