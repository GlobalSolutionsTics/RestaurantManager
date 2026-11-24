# RestaurantManager 1.3.12

Resumen de la sesión en la rama `fix/pedidos-duplicados`.

## Creación y edición de pedidos

- La creación reutiliza una clave de envío al reintentar y devuelve el UUID original. Firebase valida la disponibilidad de la mesa, asigna el folio diario y guarda el pedido en una sola transacción. La API espera la confirmación de Firebase antes de responder con éxito.
- Los pedidos para llevar con los mismos platillos se conservan por separado cuando corresponden a envíos distintos.
- La edición y la adición de platillos vinculan cada borrador al UUID del pedido. La API rechaza ediciones que quedaron desactualizadas y aplica cada adición una sola vez por clave de envío. Las adiciones intencionales se conservan como tandas independientes.
- La revisión de una adición muestra un aviso informativo cuando el platillo ya existe en el pedido e indica que las unidades nuevas se sumarán a las pendientes.

## Presentación y comprobantes

- Meseros, cocina, administración y caja comparten un resumen que agrupa los platillos y muestra sus cantidades **Pendientes** y **Listas**.
- La cuenta y los comprobantes agrupan las cantidades de cada platillo entre tandas. Los precios unitarios distintos conservan sus propios renglones para mantener el desglose del cobro.
- El comprobante muestra los platillos, las cantidades y el total de cada comensal, además del importe sin asignar si la división es parcial.
- El ticket de impresión se extrajo a `PaymentTicketComponent`, con sus props en `interfaces.ts` y la referencia al contenedor de impresión conectada mediante `forwardRef`.
- `textToString` devuelve **Cero pesos** para cero, valores ausentes y números no finitos. También aplica el singular, escribe centenas y millares exactos y redondea a centavos.

## División de cuenta

- **Dividir cuenta** aparece en `/orders/notes/[id]` para pedidos con dos o más comensales registrados. El mesero puede asignar platillos y cantidades y consultar el total por comensal.
- **Actualizar pago** guarda el reparto en `TOrder.dinersDivisionTotal`, un arreglo opcional de `DinersDivisioTotal`. La API calcula los totales con los precios del pedido, valida las unidades disponibles y guarda el reparto en Firebase. El botón guarda la distribución de la cuenta sin efectuar cobros.
- El botón **Actualizar pago** se muestra en azul oscuro cuando está habilitado y en gris cuando está deshabilitado.

## Verificación

- `yarn test:ci --runInBand --no-watchman` completó 40 pruebas con éxito. Dos pruebas preexistentes quedaron omitidas.
- `yarn tsc --noEmit --incremental false` y `git diff --check` pasaron.
- Las pruebas de Firebase usaron mocks. Quedó pendiente validar las reglas reales de escritura del nodo diario y revisar el ticket en una impresión física. El trabajo quedó local, sin despliegue ni migración de Next.js.
