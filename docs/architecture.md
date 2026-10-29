# Architecture

## Architectural principles

### Clean Architecture

La lógica de negocio no depende de AWS ni de frameworks.

### Domain-Driven Design

El módulo `document` agrupa los conceptos y reglas relacionados con documentos.

### Hexagonal Architecture

Los puertos definen las dependencias necesarias y los adaptadores implementan las integraciones externas.

## Layers

- **Domain:** entidades, estados y reglas de negocio.
- **Application:** casos de uso y puertos.
- **Infrastructure:** Lambda, HTTP, S3, SQS, SNS y adaptadores.

## Asynchronous flow

1. El cliente solicita una URL prefirmada.
2. El cliente carga el archivo en S3.
3. S3 emite una notificación a SQS.
4. El worker consume el mensaje.
5. El worker verifica el objeto.

## Event publication

El puerto `DocumentEventPublisher` abstrae la publicación de eventos.

El adaptador SNS implementa la integración con AWS SNS.

`DOCUMENT_PROCESSED` solo debe publicarse cuando el procesamiento real haya finalizado correctamente.

## Current limitations

- Persistencia temporal en memoria.
- Procesamiento de contenido pendiente.
- Integración del publicador SNS pendiente.
- Idempotencia de negocio pendiente.
- Despliegue y validación AWS pendientes.
