import { resend, FROM_EMAIL, ADMIN_EMAIL } from '@/lib/resend';
import { ZONE_LABEL, type ShippingZone } from '@/lib/shop/shipping';

export type OrderWithItems = {
  id: string;
  orderNumber: string;
  name: string;
  email: string;
  phone: string;
  nif: string | null;
  addressLine1: string;
  addressLine2: string | null;
  postalCode: string;
  city: string;
  shippingZone: string;
  notes: string | null;
  locale: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  trackingCode?: string | null;
  items: { namePt: string; nameEn: string; unitPrice: number; quantity: number }[];
};

const euro = (value: number) => `${value.toFixed(2).replace('.', ',')}€`;

function isPt(order: OrderWithItems): boolean {
  return order.locale !== 'en';
}

function itemName(
  item: OrderWithItems['items'][number],
  pt: boolean,
): string {
  return pt ? item.namePt : item.nameEn;
}

/**
 * Customer receipt + admin picking notice for a paid shop order.
 * Called from the Stripe webhook once payment lands. Failures are logged,
 * never thrown — a broken mailbox must not break the payment flow.
 */
export async function sendOrderEmails(order: OrderWithItems): Promise<void> {
  const pt = isPt(order);

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: order.email,
      subject: pt
        ? `Encomenda confirmada — JetWash24 | ${order.orderNumber}`
        : `Order confirmed — JetWash24 | ${order.orderNumber}`,
      html: buildCustomerOrderHtml(order),
    });
  } catch (err) {
    console.error('Order customer email failed:', err);
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `Nova encomenda — ${order.orderNumber} | ${order.name} | ${euro(order.total)}`,
      html: buildAdminOrderHtml(order),
    });
  } catch (err) {
    console.error('Order admin email failed:', err);
  }
}

/** Sent when the admin marks an order as shipped (with the tracking code, if any). */
export async function sendOrderShippedEmail(order: OrderWithItems): Promise<void> {
  const pt = isPt(order);

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: order.email,
      subject: pt
        ? `Encomenda enviada — JetWash24 | ${order.orderNumber}`
        : `Order shipped — JetWash24 | ${order.orderNumber}`,
      html: shell(
        pt ? 'Encomenda enviada' : 'Order shipped',
        `
        <p style="color:#525252;margin:0 0 24px;">${
          pt
            ? `Olá ${order.name}, a sua encomenda <strong>${order.orderNumber}</strong> saiu do nosso armazém.`
            : `Hi ${order.name}, your order <strong>${order.orderNumber}</strong> has left our warehouse.`
        }</p>
        ${
          order.trackingCode
            ? `<div style="background:#F3F3F3;border-radius:6px;padding:16px;margin-bottom:24px;">
                 <p style="margin:0 0 4px;font-size:14px;color:#737373;">${pt ? 'Código de seguimento' : 'Tracking code'}</p>
                 <p style="margin:0;font-size:18px;font-weight:bold;letter-spacing:1px;">${order.trackingCode}</p>
               </div>`
            : ''
        }
        ${addressBlock(order, pt)}
      `,
      ),
    });
  } catch (err) {
    console.error('Order shipped email failed:', err);
  }
}

// ─── HTML builders ────────────────────────────────────────────────────────────

function shell(heading: string, inner: string): string {
  return `
<!DOCTYPE html>
<html lang="pt">
<head><meta charset="UTF-8"><title>${heading}</title></head>
<body style="font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden;">
    <div style="background: #0A0A0A; padding: 32px; text-align: center;">
      <h1 style="color: #C9A84C; margin: 0; font-size: 24px; letter-spacing: 2px;">JETWASH24</h1>
      <p style="color: #fff; margin: 8px 0 0; font-size: 14px;">Loja de Detailing</p>
    </div>
    <div style="padding: 32px;">
      <h2 style="color: #0A0A0A; margin: 0 0 16px;">${heading}</h2>
      ${inner}
    </div>
    <div style="background:#0A0A0A;padding:20px;text-align:center;">
      <p style="color:#ffffff66;font-size:12px;margin:0;">JetWash24 · N125 610, 8800-076 Guia, Algarve · +351 928 380 478</p>
    </div>
  </div>
</body>
</html>`;
}

function itemsTable(order: OrderWithItems, pt: boolean): string {
  const rows = order.items
    .map(
      (item) => `
      <tr style="border-bottom:1px solid #E8E8E8;">
        <td style="padding:12px 0;font-size:14px;">${itemName(item, pt)} <span style="color:#737373;">× ${item.quantity}</span></td>
        <td style="padding:12px 0;text-align:right;font-weight:bold;">${euro(item.unitPrice * item.quantity)}</td>
      </tr>`,
    )
    .join('');

  return `
  <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
    ${rows}
    <tr style="border-bottom:1px solid #E8E8E8;">
      <td style="padding:12px 0;color:#737373;font-size:14px;">${pt ? 'Subtotal' : 'Subtotal'}</td>
      <td style="padding:12px 0;text-align:right;">${euro(order.subtotal)}</td>
    </tr>
    <tr style="border-bottom:1px solid #E8E8E8;">
      <td style="padding:12px 0;color:#737373;font-size:14px;">${pt ? 'Portes' : 'Shipping'}</td>
      <td style="padding:12px 0;text-align:right;">${
        order.shippingCost === 0 ? (pt ? 'Grátis' : 'Free') : euro(order.shippingCost)
      }</td>
    </tr>
    <tr>
      <td style="padding:12px 0;font-weight:bold;">${pt ? 'Total pago' : 'Total paid'}</td>
      <td style="padding:12px 0;text-align:right;font-weight:bold;font-size:18px;color:#C9A84C;">${euro(order.total)}</td>
    </tr>
  </table>`;
}

function addressBlock(order: OrderWithItems, pt: boolean): string {
  const zone = ZONE_LABEL[(order.shippingZone as ShippingZone) ?? 'CONTINENTAL'];
  return `
  <div style="background:#F3F3F3;border-radius:6px;padding:16px;margin-bottom:24px;">
    <p style="margin:0 0 8px;font-weight:bold;font-size:14px;">${pt ? 'Morada de envio' : 'Shipping address'}</p>
    <p style="margin:0;color:#525252;font-size:14px;line-height:1.6;">
      ${order.name}<br>
      ${order.addressLine1}${order.addressLine2 ? `<br>${order.addressLine2}` : ''}<br>
      ${order.postalCode} ${order.city}<br>
      ${pt ? zone.pt : zone.en}<br>
      ${order.phone}
    </p>
  </div>`;
}

function buildCustomerOrderHtml(order: OrderWithItems): string {
  const pt = isPt(order);

  return shell(
    pt ? 'Encomenda confirmada!' : 'Order confirmed!',
    `
    <p style="color:#525252;margin:0 0 8px;">${
      pt
        ? `Olá ${order.name}, recebemos o seu pagamento. Preparamos a encomenda e enviamos em 1–2 dias úteis.`
        : `Hi ${order.name}, we received your payment. We'll pack your order and ship it within 1–2 working days.`
    }</p>
    <p style="color:#737373;margin:0 0 24px;font-size:14px;">${pt ? 'Referência' : 'Reference'}: <strong>${order.orderNumber}</strong></p>
    ${itemsTable(order, pt)}
    ${addressBlock(order, pt)}
    <p style="color:#737373;font-size:13px;margin:0;">${
      pt
        ? 'Dúvidas? Responda a este email ou escreva-nos por WhatsApp para +351 928 380 478.'
        : 'Questions? Reply to this email or message us on WhatsApp at +351 928 380 478.'
    }</p>
  `,
  );
}

function buildAdminOrderHtml(order: OrderWithItems): string {
  return shell(
    `Nova encomenda ${order.orderNumber}`,
    `
    <p style="color:#525252;margin:0 0 24px;">Pagamento recebido. Preparar e expedir.</p>
    ${itemsTable(order, true)}
    ${addressBlock(order, true)}
    <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
      <tr style="border-bottom:1px solid #E8E8E8;">
        <td style="padding:10px 0;color:#737373;font-size:14px;">Email</td>
        <td style="padding:10px 0;text-align:right;">${order.email}</td>
      </tr>
      <tr style="border-bottom:1px solid #E8E8E8;">
        <td style="padding:10px 0;color:#737373;font-size:14px;">Telefone</td>
        <td style="padding:10px 0;text-align:right;">${order.phone}</td>
      </tr>
      ${
        order.nif
          ? `<tr style="border-bottom:1px solid #E8E8E8;">
               <td style="padding:10px 0;color:#737373;font-size:14px;">NIF</td>
               <td style="padding:10px 0;text-align:right;">${order.nif}</td>
             </tr>`
          : ''
      }
    </table>
    ${
      order.notes
        ? `<div style="background:#FFF8E1;border-left:3px solid #C9A84C;padding:12px 16px;">
             <p style="margin:0;font-size:14px;color:#525252;"><strong>Nota do cliente:</strong> ${order.notes}</p>
           </div>`
        : ''
    }
  `,
  );
}
