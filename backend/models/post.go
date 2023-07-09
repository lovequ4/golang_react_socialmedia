package models

import (
	"time"

	"gorm.io/gorm"
)

type BaseModel struct {
	CreatedAt time.Time
	UpdatedAt time.Time
}

func (p *Post) BeforeCreate(tx *gorm.DB) (err error) {
	p.Create_time = time.Now().In(time.FixedZone("Asia/Taipei", 8*60*60))
	return
}
func (p *Post) BeforeUpdate(tx *gorm.DB) (err error) {
	p.Update_time = time.Now().In(time.FixedZone("Asia/Taipei", 8*60*60))
	return
}

type Post struct {
	PostId      int        `gorm:"primaryKey;AUTO_INCREMENT" json:"Postid"`
	UserId      int        `gorm:"type:varchar;not null" json:"userId"`
	Content     string     `gorm:"type:varchar;not null" json:"content"`
	PostImg     string     `gorm:"type:varchar" json:"postimg"`
	Like        int        `gorm:"type:integer" json:"like"`
	Comments    []Comments `gorm:"foreignKey:PostID" json:"comments"`
	Create_time time.Time
	Update_time time.Time
}

type Comments struct {
	ID          int    `gorm:"primaryKey;AUTO_INCREMENT" json:"id"`
	PostID      int    `gorm:"type:integer;not null" json:"postId"`
	UserID      int    `json:"userId"`
	Username    string `json:"username"`
	Comment     string `json:"comment"`
	Create_time time.Time
	Update_time time.Time
}

// type Post struct {
// 	Id       int    `gorm:"primaryKey;AUTO_INCREMENT" json:"id"`
// 	Username User   `gorm:"foreignKey:UserID" json:"username"`
// 	UserID   int    `gorm:"not null" json:"-"`
// 	Context  string `gorm:"type:varchar;not null" json:"context"`
// 	PostImg  string `gorm:"type:varchar" json:"postimg"`
// 	Like     int    `gorm:"type:integer" json:"like"`

// }

func (Post) TableName() string {
	return "posts"
}
