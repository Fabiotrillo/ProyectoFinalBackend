import { Router } from "express";

const router = Router();


router.get('/loggerTest', (req, res) => {
    req.logger.debug('Debug message');
    req.logger.http('HTTP message');
    req.logger.info('Info message');
    req.logger.warning('Warning message');
    req.logger.error('Error message');
    req.logger.fatal('Fatal message');

    res.send('Logs generados en /loggerTest');
});

export {router as LoggerRouter}