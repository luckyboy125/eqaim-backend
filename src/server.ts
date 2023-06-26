import express from 'express';
import { addRouter } from './routes/add.route';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/add', addRouter);

app.listen(8080, () => {
  console.log('Server listening on port 8080');
});