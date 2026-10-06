export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'HealthX AI API',
    description: 'AI-Powered Personal Health Copilot REST API specification',
    version: '1.0.0',
    contact: {
      name: 'HealthX AI Engineering Team',
      email: 'support@healthx.ai',
    },
  },
  servers: [
    {
      url: '/api/v1',
      description: 'HealthX AI API v1 Gateway',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      CookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'healthx_token',
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'DOCUMENT_NOT_FOUND' },
              message: { type: 'string', example: 'The requested document could not be found.' },
              requestId: { type: 'string', example: 'req-abc123xyz' },
              details: { type: 'object' },
            },
            required: ['code', 'message', 'requestId'],
          },
        },
      },
      UserProfile: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string', example: 'Isaac Richard Noronha' },
          dob: { type: 'string', example: '2008-08-30' },
          sex: { type: 'string', example: 'Male' },
          preferredLanguage: { type: 'string', example: 'English' },
          location: { type: 'string', example: 'Himachal Pradesh' },
          bloodGroup: { type: 'string', example: 'A+' },
          heightCm: { type: 'number', example: 180 },
          weightKg: { type: 'number', example: 85 },
          allergies: { type: 'array', items: { type: 'string' } },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        summary: 'Service health check',
        responses: {
          '200': { description: 'Service is healthy' },
        },
      },
    },
    '/ready': {
      get: {
        summary: 'Readiness check',
        responses: {
          '200': { description: 'Service is ready' },
        },
      },
    },
    '/auth/request-otp': {
      post: {
        summary: 'Request passwordless 6-digit OTP',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  identifier: { type: 'string', example: 'isaac.noronha@example.com' },
                  role: { type: 'string', enum: ['PATIENT', 'DOCTOR', 'HOSPITAL', 'ADMIN'] },
                },
                required: ['identifier'],
              },
            },
          },
        },
        responses: {
          '200': { description: 'OTP dispatched successfully' },
        },
      },
    },
    '/auth/verify-otp': {
      post: {
        summary: 'Verify OTP and acquire JWT session',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  identifier: { type: 'string', example: 'isaac.noronha@example.com' },
                  otp: { type: 'string', example: '123456' },
                },
                required: ['identifier', 'otp'],
              },
            },
          },
        },
        responses: {
          '200': { description: 'Authenticated successfully' },
          '401': { description: 'Invalid or expired OTP' },
        },
      },
    },
    '/assistant/chat': {
      post: {
        summary: 'AI Copilot grounded chat with citations',
        security: [{ BearerAuth: [] }, { CookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  conversationId: { type: 'string' },
                  message: { type: 'string', example: 'What was my hemoglobin?' },
                  language: { type: 'string', example: 'English' },
                  detailLevel: { type: 'string', enum: ['SIMPLE', 'DETAILED'] },
                },
                required: ['message'],
              },
            },
          },
        },
        responses: {
          '200': { description: 'Grounded clinical response with citations' },
        },
      },
    },
    '/documents': {
      get: {
        summary: 'List user documents',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': { description: 'List of documents' },
        },
      },
      post: {
        summary: 'Upload medical document',
        security: [{ BearerAuth: [] }],
        responses: {
          '201': { description: 'Document uploaded and processing queued' },
        },
      },
    },
    '/labs': {
      get: {
        summary: 'List laboratory test results',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': { description: 'List of lab results with reference ranges' },
        },
      },
    },
    '/consents': {
      get: {
        summary: 'List patient consents',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': { description: 'List of consents' },
        },
      },
      post: {
        summary: 'Grant new consent to doctor or hospital',
        security: [{ BearerAuth: [] }],
        responses: {
          '201': { description: 'Consent granted' },
        },
      },
    },
  },
};
