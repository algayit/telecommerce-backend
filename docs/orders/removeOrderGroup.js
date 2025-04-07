module.exports = {
    // operation's method
    patch: {
      tags: ["Orders"], // operation's tag
      description: "Update all orders with a specific order number to 'DELETED'", // short description
      summary: "Update all orders' status to 'DELETED' for a specific order number", // short summary
      operationId: "deleteAllOrdersByOrderNo", // unique operation id
      security: [
        {
          JWT: [], // Security with JWT authentication
        },
      ],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "Order number for which all orders will be updated to 'DELETED'", // Describes the order number parameter
          required: true,
          schema: {
            type: "string", // Order number is a string
          },
        },
      ],
      requestBody: {
        content: {
          // content-type
          "application/json": {
            schema: {
              $ref: "#/components/schemas/OrderGroupRemove",
            },
          },
        },
      },
      responses: {
        200: {
          description: "All orders with the specified order number updated to 'DELETED' successfully", // Success response
        },
        400: {
          description: "Invalid input", // Invalid input error
        },
        404: {
          description: "Order number not found", // Order number not found error
        },
        500: {
          description: "Server error", // Server error
        },
      },
    },
  };
  