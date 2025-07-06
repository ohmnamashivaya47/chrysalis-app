import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
export declare const validateRequest: (schema: {
    body?: Joi.ObjectSchema;
    query?: Joi.ObjectSchema;
    params?: Joi.ObjectSchema;
}) => (req: Request, res: Response, next: NextFunction) => void;
export declare const schemas: {
    register: {
        body: Joi.ObjectSchema<any>;
    };
    login: {
        body: Joi.ObjectSchema<any>;
    };
    updateProfile: {
        body: Joi.ObjectSchema<any>;
    };
    startSession: {
        body: Joi.ObjectSchema<any>;
    };
    completeSession: {
        body: Joi.ObjectSchema<any>;
    };
    createPost: {
        body: Joi.ObjectSchema<any>;
    };
    createComment: {
        body: Joi.ObjectSchema<any>;
    };
    pagination: {
        query: Joi.ObjectSchema<any>;
    };
    idParam: {
        params: Joi.ObjectSchema<any>;
    };
};
//# sourceMappingURL=validation.d.ts.map