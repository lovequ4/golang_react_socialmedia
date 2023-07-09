package database

import (
	"github.com/gomodule/redigo/redis"
)

var pool *redis.Pool

func init() {
	pool = &redis.Pool{
		MaxIdle:     3,
		MaxActive:   0,
		IdleTimeout: 300,
		Dial: func() (redis.Conn, error) { //要连接的redis数据库
			return redis.Dial("tcp", "127.0.0.1:6379")
		},
	}
}
