import {
  DocumentNotFoundError,
  InvalidDocumentError,
} from "../../modules/document/application/errors/document-errors";

export function handleHttpError(error: unknown) {
  console.error("HTTP error:", error);

  if (error instanceof DocumentNotFoundError) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: error.message,
      }),
    };
  }

  if (error instanceof InvalidDocumentError) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: error.message,
      }),
    };
  }

  return {
    statusCode: 500,
    body: JSON.stringify({
      message: "Internal server error",
    }),
  };
}
