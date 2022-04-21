const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

//me instalo y me traigo axios para trabajar más práctico y me lo guardo en una constante
const axios = require("axios"); //lo llamo con comillas porque es un módulo y no neceita un path

const { Country, Activity, country_act } = require('../db');
//me traigo las tablas y la tabla intermedia// las voy a necesitar en las rutas//

const { Op } = require("sequelize"); //muchos métodos operadores que pueden servir/

const router = Router();

 const bringMeInfo = async () => {
     const arr = await axios.get("https://restcountries.com/v3/all");
     return arr.data;
 }

  router.get("/countries", async (req, res) => {
    const apiCountries = await bringMeInfo();
    const { name } = req.query;
    if (name) {
        try {
            const countriesName = await Country.findAll({
                where:{
                    name:{
                        [Op.iLike]: `%${name}%`,
                    }
                },
                
            })
            if(countriesName.length === 0){
                res.status(404).send("Country not found");
            } else {
                return res.json(countriesName);
            }
        } catch (error) {
            console.log(error);
        }
        
    } 
    else if(name == 0){
        return res.status(404).send("Write a country's name");
        
    }else{
        try {
            const infoIWant = await Country.findAll({include: [Activity]}); 
            if (!infoIWant.length) {
              await Country.bulkCreate(
               apiCountries?.map((e) => {
                  return {
                    id: e.cca3,
                    name: e.name.common,
                    flags: e.flags[0],
                    continents: e.continents[0],
                    capital: e.capital ? e.capital[0] : "There is no capital city",
                    subregion: e.subregion ? e.subregion : "There is no subregion",
                    area: e.area,
                    population: e.population,
                  };
                })
              );
              const allCountries = await Country.findAll(); //comprobación de los contenidos ya cargados de la tabla
              if (allCountries.length) {
                res.status(200).send(allCountries);
              } else {
                res.status(404).send("This country is not found");
              }
            } else {
              res.status(200).send(infoIWant);   //tabla ya rellenada
            }
          } catch (error) {
            console.log( error);
          }
    }
  });

router.get("/countries/:id", async(req, res) => {
    const { id } = req.params;
    try  {
        if(id.length !== 3){
         res.status(404).json("Incorrect ID. It must contain three letters");
        }
        if(id){
            const countriesID = await Country.findOne({
                where:{
                    id:{
                        [Op.iLike]:`%${id}`,
                    },
                  },
                  include: [Activity]
            });
            if(countriesID.length === 0){
                res.status(404).send("Country not found");
            }
            

res.status(200).json(countriesID);

        } 
        
    } catch (error) {
        res.status(404).json("ID not found");
         
    }
});

router.post("/activity", async (req, res) =>{
let {name, duration, season, difficulty, country} = req.body //recibe los datos por body mediante formulario
try {
    let newActivity = await Activity.create({
        name : name,
        difficulty : difficulty,
        duration : duration,
        season : season, 
        
       })
       
       let newActivityCountry = await Country.findAll({
        where: {name : country},
    })
    
    newActivity.addCountry(newActivityCountry); //actividad agregada a la DB
res.send("Activity successfully created");
} catch (error) {
    console.log("information missing",error);
}
});


router.get("/activity", async (req, res) => {
    const activity = await Activity.findAll({
      include:[Country],
    });
    res.send(activity);
  });

module.exports = router;

