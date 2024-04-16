const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { version, author, description } = require("./package.json");

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "myFlix - Movie API",
      version,
      description,
      contact: author,
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      responses: {
        UnauthorizedError: {
          description: "Unauthorized."
        },
        ValidationError: {
          description: "Unprocessable Content."
        },
        NotFound: {
          description: "Not Found.",
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: false
                  },
                  error: {
                    type: 'object',
                    properties: {
                      code: {
                        type: 'integer',
                        example: 404
                      },
                      message: {
                        type: 'string',
                        example: 'Not Found.'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        PermissionDenied: {
          description: "Permission denied.",
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: false
                  },
                  error: {
                    type: 'object',
                    properties: {
                      code: {
                        type: 'integer',
                        example: 403
                      },
                      message: {
                        type: 'string',
                        example: 'Permission denied'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        ApplicationError: {
          description: "Something broke!.",
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: false
                  },
                  error: {
                    type: 'object',
                    properties: {
                      code: {
                        type: 'integer',
                        example: 500
                      },
                      message: {
                        type: 'string',
                        example: 'Something broke!'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
    },
    security: {
      bearerAuth: [],
    },
  },
  apis: ["./controllers/*.js", "./models/*.js", "./auth.js"],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(router, port) {
  // Swagger page
  router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  router.use("/docs.json", (req, res) => {
    res.json(swaggerSpec);
  })
}

module.exports = swaggerDocs;
