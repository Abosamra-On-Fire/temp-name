import Joi, { ObjectSchema } from "joi";
import { ValidationError } from "joi";

const validateEmail = (email: string) => {
    const schema: ObjectSchema = Joi.object({
        email: Joi.string().email().required(),
    });
    const error: ValidationError | undefined = schema.validate(
        { email },
        { abortEarly: false }
    ).error;
    if (error) {
        throw new Error(error.details[0].message);
    }
};

const validateCode = (email: string, code: string) => {
    const schema: ObjectSchema = Joi.object({
        email: Joi.string()
            .email()
            .required(),
        code: Joi.string().length(8).required(),
    });
    const error: ValidationError | undefined = schema.validate(
        { email, code },
        { abortEarly: false }
    ).error;
    if (error) {
        throw new Error(error.details[0].message);
    }
};
export { validateEmail, validateCode };
