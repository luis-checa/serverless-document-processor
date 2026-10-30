import { describe, it, expect, beforeEach } from "vitest";

import { GetDocumentUseCase } from "../../../src/modules/documents/application/use-cases/get-document.use-case";
import { DocumentNotFoundError } from "../../../src/modules/document/application/errors/document-errors";
import { InMemoryDocumentRepository } from "../../fakes/in-memory-document-repository";

describe("GetDocument", () => {
  let repository: InMemoryDocumentRepository;
  let useCase: GetDocumentUseCase;

  beforeEach(() => {
    repository = new InMemoryDocumentRepository();
    useCase = new GetDocumentUseCase(repository);
  });

  it("throws when document does not exist", async () => {
    await expect(useCase.execute("missing-id")).rejects.toThrow(
      DocumentNotFoundError,
    );
  });
});
