import Joi from "joi";

export const CreateReviewSchema = Joi.object({
  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .messages({
      'number.base': 'Rating must be a number',
      'number.integer': 'Rating must be an integer',
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating must be at most 5',
      'any.required': 'Rating is required'
    }),
  
  comment: Joi.string()
    .max(1000)
    .optional()
    .messages({
      'string.max': 'Comment must be at most 1000 characters'
    }),
  

});

export const UpdateReviewSchema = Joi.object({
  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .optional()
    .messages({
      'number.base': 'Rating must be a number',
      'number.integer': 'Rating must be an integer',
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating must be at most 5'
    }),
  
  comment: Joi.string()
    .max(1000)
    .optional()
    .messages({
      'string.max': 'Comment must be at most 1000 characters'
    })
});
