const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo //anotar todas las caracteristicas que trae de la api 
  //y poner allowNull false a los campos obligatorios(validación)

  sequelize.define('activity', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // id: {
    //   type: DataTypes.UUID,
    //   defaultValue: DataTypes.UUIDV4,
    //   allowNull: false,
    //   primaryKey: true
    // },
    duration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    season: {
      type: DataTypes.ENUM("spring", "fall", "summer", "winter"),
      allowNull: false,
    },
    // country: {
    //   type:DataTypes.STRING,
    //   allowNull: false,
    // },
    difficulty: {
        type: DataTypes.INTEGER,
        allowNull:false,
        validate: (value) => {
            if (value === null || value > 5) {
                throw new Error("Dificulty cannot be zero or greater than 5");
            }
            }
      }, 
     


  });
};




