import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    // Validate body
    if (schema.body) {
      const { error } = schema.body.validate(req.body);
      if (error) {
        errors.push(`Body: ${error.details.map(d => d.message).join(', ')}`);
      }
    }

    // Validate query
    if (schema.query) {
      const { error } = schema.query.validate(req.query);
      if (error) {
        errors.push(`Query: ${error.details.map(d => d.message).join(', ')}`);
      }
    }

    // Validate params
    if (schema.params) {
      const { error } = schema.params.validate(req.params);
      if (error) {
        errors.push(`Params: ${error.details.map(d => d.message).join(', ')}`);
      }
    }

    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors,
      });
      return;
    }

    next();
  };
};

// Common validation schemas
export const schemas = {
  // Auth schemas
  register: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      username: Joi.string().min(3).max(30).optional(),
      bio: Joi.string().max(500).optional(),
    }),
  },

  login: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  },

  // User schemas
  updateProfile: {
    body: Joi.object({
      username: Joi.string().min(3).max(30).optional(),
      bio: Joi.string().max(500).allow('').optional(),
      is_public: Joi.boolean().optional(),
    }),
  },

  // Meditation schemas
  startSession: {
    body: Joi.object({
      meditation_type: Joi.string().valid(
        'mindfulness',
        'body-scan',
        'loving-kindness',
        'focused-attention',
        'breathing'
      ).required(),
      duration_minutes: Joi.number().integer().min(1).max(120).required(),
      audio_settings: Joi.object().optional(),
    }),
  },

  completeSession: {
    body: Joi.object({
      mood_before: Joi.string().optional(),
      mood_after: Joi.string().optional(),
      notes: Joi.string().max(1000).optional(),
      session_data: Joi.object().optional(),
    }),
  },

  // Social schemas
  createPost: {
    body: Joi.object({
      content: Joi.string().max(2000).optional(),
      image_url: Joi.string().uri().optional(),
      audio_url: Joi.string().uri().optional(),
      is_guided_meditation: Joi.boolean().optional(),
      is_public: Joi.boolean().optional(),
    }).or('content', 'image_url', 'audio_url'),
  },

  createComment: {
    body: Joi.object({
      content: Joi.string().max(1000).required(),
    }),
  },

  // Pagination schemas
  pagination: {
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(20),
      sort: Joi.string().optional(),
      order: Joi.string().valid('asc', 'desc').default('desc'),
    }),
  },

  // ID params
  idParam: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },
};
