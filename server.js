require('colors');
const express = require('express');
const { client, connectDB } = require('./config/db');
const variables = require('./config/variables');
const userRoutes = require('./routes/userRoutes');
const imageRoutes = require('./routes/imageRoutes');
require('./schemas/usersSchema');
require('./schemas/imagesSchema');

connectDB();
const app = express();
const PORT = variables.appPort || 3000;
app.use(express.json());

app.get('/', (req, res) => res.send('API is running...'));
app.use('/api/user', userRoutes);
app.use('/api/image', imageRoutes);

app.listen(PORT, () =>
	console.log(`>>> Server started at PORT ${PORT}`.yellow.underline)
);

process.on('SIGINT', () => {
	console.log('Server stopped!'.red);
	client.end();
});
