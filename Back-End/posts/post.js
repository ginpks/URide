import { Sequelize, DataTypes } from "sequelize";

// Solving db path issue
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a new instance of Sequelize using sqlite as our database
// and storing it in posts.sqlite
const postDatabase = new Sequelize({
    dialect: 'sqlite',
    // sqlite db created at root dir, don't know the reason
    storage: path.resolve(__dirname, '../source/posts.sqlite'), // Solving db path issue
    logging: console.log,
});

// Defining the Post model
const Post = postDatabase.define('Post', {
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    from: {
        type: DataTypes.STRING,
        allowNull: false
    },
    destination: {
        type: DataTypes.STRING,
        allowNull: false
    },
    time: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    people: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    luggage: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    extraInfo: {
        type: DataTypes.STRING,
        defaultValue: 'No additional comment'
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Create the table if it doesn't exist or update existing table to match model definition above
// await postDatabase.sync();

//test database connection
postDatabase.authenticate().then(() => {
    console.log("Connection for chatpage databse has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the chatpage database:", error);
  });

export default postDatabase;

// Export the User model to make database accessible for other components of our app.
// module.exports = { postDatabase, Post };
export { postDatabase, Post }; //ES Module