const express = require('express');
const multer = require('multer');
const uploadconfig = require('./config/Uploads');

const SessionController = require('./controllers/SessionController');
const SpotController = require('./controllers/SpotController');
const DashboardController = require('./controllers/DashboardController');
const BookingController = require('./controllers/BookingController');
const ApprovalController = require('./controllers/ApprovalController');
const RejectionController = require('./controllers/RejectionController');

const upload = multer(uploadconfig);
const routes = express.Router();

routes.post('/sessions', SessionController.store);

routes.get('/spots', SpotController.index);
routes.delete('/spots/:spot_id', SpotController.delete);
routes.post('/spots', upload.single('thumbnail'), SpotController.store);  //upload.array('thumbnail'), para várias imgs

routes.get('/dashboard', DashboardController.show);
routes.delete('/dashboard/:id', DashboardController.delete);

//rota encadeada (uma dentro da outra): rota spots pegar id do spot, e entao realizar o booking na rota booking
// rota quer dizer: usuário querendo criar uma reserva dentro do spot com tal id
routes.post('/spots/:spot_id/bookings', BookingController.store);

routes.post('/bookings/:booking_id/approvals', ApprovalController.store);
routes.post('/bookings/:booking_id/rejections', RejectionController.store);
                                                    
                                                    
module.exports = routes;