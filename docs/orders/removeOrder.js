module.exports = {
    // operation's method
    patch: {
      tags: ["Orders"], // operation's tag
      description: "Update order status to 'DELETED' for a specific order", // short description
      summary: "Update a single order's status to 'DELETED'", // short summary
      operationId: "deleteOrder", // unique operation id
      security: [
        {
          JWT: [], // Security with JWT authentication
        },
      ],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of the order to be updated",
          required: true,
          schema: {
            type: "string", // ID is a string
          },
        },
      ],
      requestBody: {
        content: {
          // content-type
          "application/json": {
            schema: {
              $ref: "#/components/schemas/OrderRemove",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Order status updated to 'DELETED' successfully", // Success response
        },
        400: {
          description: "Invalid input", // Invalid input error
        },
        404: {
          description: "Order not found", // Order not found error
        },
        500: {
          description: "Server error", // Server error
        },
      },
    },
  };
  