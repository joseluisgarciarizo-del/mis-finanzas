-- ============================================
-- Esquema de base de datos: App Finanzas Personales
-- ============================================

create table categorias (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users(id) on delete cascade,
  nombre text not null,
  tipo text not null check (tipo in ('ingreso', 'gasto')),
  creado_en timestamp with time zone default now()
);

create table subcategorias (
  id uuid primary key default gen_random_uuid(),
  categoria_id uuid not null references categorias(id) on delete cascade,
  nombre text not null,
  creado_en timestamp with time zone default now()
);

create table transacciones (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users(id) on delete cascade,
  categoria_id uuid not null references categorias(id) on delete restrict,
  subcategoria_id uuid references subcategorias(id) on delete set null,
  monto numeric(12,2) not null check (monto > 0),
  fecha date not null default current_date,
  descripcion text,
  tipo text not null check (tipo in ('ingreso', 'gasto')),
  creado_en timestamp with time zone default now()
);

create index idx_transacciones_usuario_fecha on transacciones(usuario_id, fecha);
create index idx_transacciones_categoria on transacciones(categoria_id);
create index idx_subcategorias_categoria on subcategorias(categoria_id);

alter table categorias enable row level security;
alter table subcategorias enable row level security;
alter table transacciones enable row level security;

create policy "usuarios ven sus categorias"
  on categorias for all
  using (auth.uid() = usuario_id)
  with check (auth.uid() = usuario_id);

create policy "usuarios ven sus transacciones"
  on transacciones for all
  using (auth.uid() = usuario_id)
  with check (auth.uid() = usuario_id);

create policy "usuarios ven subcategorias de sus categorias"
  on subcategorias for all
  using (
    exists (
      select 1 from categorias
      where categorias.id = subcategorias.categoria_id
      and categorias.usuario_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from categorias
      where categorias.id = subcategorias.categoria_id
      and categorias.usuario_id = auth.uid()
    )
  );
