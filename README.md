# Serverless Document Processor

API serverless para gestionar documentos y preparar su procesamiento asíncrono utilizando AWS.

## Objetivo

Este proyecto implementa una arquitectura modular basada en Clean Architecture, Domain-Driven Design (DDD) y Hexagonal Architecture.

Permite:

- Crear documentos.
- Consultar documentos por ID.
- Eliminar documentos.
- Generar URLs prefirmadas para subir archivos directamente a S3.
- Recibir eventos de creación de objetos mediante S3 y SQS.
- Preparar la publicación de eventos `DOCUMENT_PROCESSED` mediante SNS.

> El worker actual verifica la existencia del objeto en S3. El procesamiento real del contenido y el seguimiento persistente del estado todavía están pendientes.

## Stack tecnológico

- Node.js
- TypeScript
- AWS Lambda
- Amazon API Gateway
- Amazon S3
- Amazon SQS
- Amazon SNS
- Serverless Framework V4

## Arquitectura

```text
Client
  |
  v
API Gateway
  |
  v
HTTP Lambda
  |
  v
Document Module
  |
  +--> Application
  +--> Domain
  +--> Infrastructure

Client
  |
  | Upload using presigned URL
  v
Amazon S3
  |
  v
Amazon SQS
  |
  v
Document Worker Lambda
  |
  v
Verify object in S3
```

La publicación de eventos SNS está preparada mediante un puerto y un adaptador, pero su integración con el flujo de procesamiento está pendiente.

## Estructura del proyecto

```text
src/
├── modules/
│   └── document/
│       ├── domain/
│       └── application/
│           ├── ports/
│           ├── use-cases/
│           └── errors/
├── infrastructure/
│   ├── aws/
│   ├── config/
│   ├── http/
│   └── lambda/
└── ...
```

La estructura representa la organización objetivo; puede ajustarse a la estructura real del repositorio.

## Requisitos

- Node.js compatible con el runtime configurado.
- npm.
- Credenciales AWS para operaciones que requieran acceso a AWS.

## Instalación

```bash
npm install
```

## Desarrollo local

Configura la variable `DOCUMENTS_BUCKET` según tu configuración local.

```bash
npm run typecheck
npm run build
npm run dev
```

Consulta `package.json` para verificar los scripts disponibles.

## API

| Método | Endpoint          | Descripción                             |
| ------ | ----------------- | --------------------------------------- |
| POST   | `/documents`      | Crear documento y obtener URL de subida |
| GET    | `/documents/{id}` | Consultar documento                     |
| DELETE | `/documents/{id}` | Eliminar documento                      |

Las rutas y respuestas definitivas deben contrastarse con la implementación actual.

## Variables de entorno

| Variable              | Descripción                           |
| --------------------- | ------------------------------------- |
| `DOCUMENTS_BUCKET`    | Bucket S3 utilizado para documentos   |
| `DOCUMENTS_TOPIC_ARN` | ARN del tópico SNS, cuando se integre |

## Procesamiento asíncrono

S3 envía eventos de creación de objetos a SQS. El worker consume los mensajes y verifica la existencia del objeto.

SQS permite reintentos y el uso de una Dead Letter Queue (DLQ).

Los eventos pueden llegar duplicados o fuera de orden; los consumidores deben considerar la idempotencia.

## Limitaciones actuales

- El repositorio de documentos en memoria no proporciona persistencia confiable.
- El worker todavía no procesa el contenido del documento.
- La publicación SNS no está conectada al procesamiento exitoso.
- La integración de notificaciones S3 y la infraestructura AWS requieren configuración y validación.
- La eliminación del registro en memoria no implica borrar el objeto de S3.

## Calidad

```bash
npm run typecheck
npm run build
```

## Licencia

Pendiente de definir.
