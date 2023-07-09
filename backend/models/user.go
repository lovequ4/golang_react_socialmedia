package models

type User struct {
	Id        int     `gorm:"primaryKey;AUTO_INCREMENT" json:"id"`
	Name      string  `gorm:"type:varchar;unique;not null;size:50" json:"name"`
	Password  string  `gorm:"type:varchar;unique;not null;size:50" json:"password"`
	Email     string  `gorm:"type:varchar;unique;not null" json:"email"`
	UserImg   string  `gorm:"type:varchar" json:"userimg"`
	Posts     []Post  `gorm:"foreignKey:UserId;references:Id" json:"posts"` //1對多 外部鍵
	Followers []*User `gorm:"many2many:user_followers;foreignkey:Id;association_foreignkey:Id;association_jointable_foreignkey:follower_id;jointable_foreignkey:user_id;" json:"-"`
	Following []*User `gorm:"many2many:user_following;foreignkey:Id;association_foreignkey:Id;association_jointable_foreignkey:user_id;jointable_foreignkey:following_id;" json:"-"`
}

func (User) TableName() string {
	return "users"
}
