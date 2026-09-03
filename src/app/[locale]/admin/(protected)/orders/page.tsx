import OrdersTable from '@/components/admin/OrdersTable';

export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-black text-black">Encomendas</h1>
      <p className="mb-8 text-surface-500">Encomendas pagas da loja online</p>
      <OrdersTable />
    </div>
  );
}
