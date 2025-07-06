"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemas = exports.validateRequest = void 0;
const joi_1 = __importDefault(require("joi"));
const validateRequest = (schema) => {
    return (req, res, next) => {
        const errors = [];
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
exports.validateRequest = validateRequest;
// Common validation schemas
exports.schemas = {
    // Auth schemas
    register: {
        body: joi_1.default.object({
            email: joi_1.default.string().email().required(),
            password: joi_1.default.string().min(8).required(),
            username: joi_1.default.string().min(3).max(30).optional(),
            bio: joi_1.default.string().max(500).optional(),
        }),
    },
    login: {
        body: joi_1.default.object({
            email: joi_1.default.string().email().required(),
            password: joi_1.default.string().required(),
        }),
    },
    // User schemas
    updateProfile: {
        body: joi_1.default.object({
            username: joi_1.default.string().min(3).max(30).optional(),
            bio: joi_1.default.string().max(500).allow('').optional(),
            is_public: joi_1.default.boolean().optional(),
        }),
    },
    // Meditation schemas
    startSession: {
        body: joi_1.default.object({
            meditation_type: joi_1.default.string().valid('mindfulness', 'body-scan', 'loving-kindness', 'focused-attention', 'breathing').required(),
            duration_minutes: joi_1.default.number().integer().min(1).max(120).required(),
            audio_settings: joi_1.default.object().optional(),
        }),
    },
    completeSession: {
        body: joi_1.default.object({
            mood_before: joi_1.default.string().optional(),
            mood_after: joi_1.default.string().optional(),
            notes: joi_1.default.string().max(1000).optional(),
            session_data: joi_1.default.object().optional(),
        }),
    },
    // Social schemas
    createPost: {
        body: joi_1.default.object({
            content: joi_1.default.string().max(2000).optional(),
            image_url: joi_1.default.string().uri().optional(),
            audio_url: joi_1.default.string().uri().optional(),
            is_guided_meditation: joi_1.default.boolean().optional(),
            is_public: joi_1.default.boolean().optional(),
        }).or('content', 'image_url', 'audio_url'),
    },
    createComment: {
        body: joi_1.default.object({
            content: joi_1.default.string().max(1000).required(),
        }),
    },
    // Pagination schemas
    pagination: {
        query: joi_1.default.object({
            page: joi_1.default.number().integer().min(1).default(1),
            limit: joi_1.default.number().integer().min(1).max(100).default(20),
            sort: joi_1.default.string().optional(),
            order: joi_1.default.string().valid('asc', 'desc').default('desc'),
        }),
    },
    // ID params
    idParam: {
        params: joi_1.default.object({
            id: joi_1.default.string().required(),
        }),
    },
};
//# sourceMappingURL=validation.js.map