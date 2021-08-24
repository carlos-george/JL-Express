import { ErrorRequestHandler } from 'express';
import { ValidationError } from 'yup';
import { AppErrors } from '../errors/AppErrors';

interface ValidationsErrors {
    [key: string]: string[];
}

const errorHandler: ErrorRequestHandler = (error, request, response, next) => {

    if (error instanceof ValidationError) {
        let errors: ValidationsErrors = {};

        error.inner.forEach(err => {
            if (err.path) {
                errors[err.path] = err.errors;
            }
        });
        return response.status(400).json({ message: 'Validations errors', errors });
    }

    if (error instanceof AppErrors) {
        return response.status(error.statusCod).json({ message: error.message });
    }

    console.log(error);

    return response.status(500).json({ message: 'Internal server error.' });
};

export default errorHandler;