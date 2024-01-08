package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

var db *gorm.DB
var err error

type Inventory struct {
	ID           int    `json:"id"`
	NamaBarang   string `json:"nama_barang"`
	Jumlah       int    `json:"jumlah"`
	HargaSatuan  int    `json:"harga_satuan"`
	Lokasi       string `json:"lokasi"`
	Deskripsi    string `json:"deskripsi"`
}

func main() {
	// Replace with your MySQL database credentials
	db, err = gorm.Open("mysql", "root@tcp(localhost:3306)/db_2210199_riowillian_uas?parseTime=true")

	if err != nil {
		fmt.Println(err)
	}
	defer db.Close()
	db.AutoMigrate(&Inventory{})
	r := gin.Default()
	r.GET("/api/inventory", getInventory)
	r.GET("/api/inventory/:id", getInventoryByID)
	r.POST("/api/inventory", createInventory)
	r.PUT("/api/inventory/:id", updateInventory)
	r.DELETE("/api/inventory/:id", deleteInventory)
	r.Run(":8080")
}

func getInventory(c *gin.Context) {
	var inventory []Inventory
	if err := db.Find(&inventory).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.JSON(200, inventory)
	}
}

func getInventoryByID(c *gin.Context) {
	id := c.Params.ByName("id")
	var inventory Inventory
	if err := db.Where("id = ?", id).First(&inventory).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.JSON(200, inventory)
	}
}

func createInventory(c *gin.Context) {
	var inventory Inventory
	c.BindJSON(&inventory)

	db.Create(&inventory)
	c.JSON(200, inventory)
}

func updateInventory(c *gin.Context) {
	id := c.Params.ByName("id")
	var inventory Inventory
	if err := db.Where("id = ?", id).First(&inventory).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	}
	c.BindJSON(&inventory)
	db.Save(&inventory)
	c.JSON(200, inventory)
}

func deleteInventory(c *gin.Context) {
	id := c.Params.ByName("id")
	var inventory Inventory
	d := db.Where("id = ?", id).Delete(&inventory)
	fmt.Println(d)
	c.JSON(200, gin.H{"id #" + id: "deleted"})
}
