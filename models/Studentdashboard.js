const { sequelize } = require('../config/config');
const { DataTypes } = require('sequelize');

const Studentdashboard=sequelize.define("Studentdashboard",{
    examName:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    attemptDate:{
        type: DataTypes.DATE,
        allowNull: false,
    },
    totalMarks:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    scoredMarks:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    percentage:{
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    result:{
        type: DataTypes.ENUM("Passed","Failed"),
        allowNull: false,
    },
    yourAnswers:{
        type: DataTypes.ARRAY(DataTypes.JSONB),
        allowNull:true,
    },
    examId:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    correct:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    inCorrect:{
        type:DataTypes.INTEGER,
        allowNull:false
    }

})
module.exports=Studentdashboard;