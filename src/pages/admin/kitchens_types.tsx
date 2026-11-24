import {
  createKitchen,
  deleteKitchen,
  listKitchens,
  updateKitchen,
} from "@/services/kitchens";
import type { KitchenType } from "@/types/kitchen.types";
import { ADMIN } from "@/utils/users";
import {
  AddRounded,
  CheckRounded,
  DeleteOutlineRounded,
  EditOutlined,
  OutdoorGrillOutlined,
} from "@mui/icons-material";
import { Alert, Button, TextField } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import Swal from "sweetalert2";
import MenuAdmin from "./components/menu";
import ProtectPage from "./components/protectPage";

export default function KitchenTypesPage() {
  const router = useRouter();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [kitchens, setKitchens] = useState<KitchenType[]>([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [operationError, setOperationError] = useState("");
  const busy = isLoading || isSaving;

  const loadKitchens = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      setKitchens(await listKitchens());
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar las cocinas.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadKitchens();
  }, [loadKitchens]);

  const resetForm = () => {
    setName("");
    setEditingId(null);
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const kitchenName = name.trim();
    if (!kitchenName || busy) return;

    setIsSaving(true);
    setOperationError("");
    try {
      const saved = editingId
        ? await updateKitchen({ id: editingId, name: kitchenName })
        : await createKitchen(kitchenName);
      setKitchens((current) =>
        editingId
          ? current.map((kitchen) =>
              kitchen.id === saved.id ? saved : kitchen,
            )
          : [...current, saved],
      );
      resetForm();
    } catch (error) {
      setOperationError(
        error instanceof Error
          ? error.message
          : "No se pudo guardar la cocina.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (kitchen: KitchenType) => {
    setIsSaving(true);
    setOperationError("");
    try {
      const confirmation = await Swal.fire({
        title: "Eliminar cocina",
        text: kitchen.name,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
        focusCancel: true,
      });
      if (!confirmation.isConfirmed) return;

      await deleteKitchen(kitchen.id);
      setKitchens((current) => current.filter(({ id }) => id !== kitchen.id));
      if (editingId === kitchen.id) resetForm();
    } catch (error) {
      setOperationError(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la cocina.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProtectPage push={router.push} requiredProfiles={ADMIN}>
      <Head>
        <title>Cocinas | Administración</title>
      </Head>
      <div className='flex min-h-screen bg-slate-100'>
        <MenuAdmin router={router} basePath={router.pathname} />
        <main className='min-w-0 flex-1 px-3 py-5 text-slate-900 sm:px-8 lg:py-10'>
          <div className='mx-auto max-w-6xl space-y-6'>
            <header className='flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-gradient-to-br from-slate-900 to-blue-dark p-5 text-white shadow-sm sm:p-8'>
              <div className='flex items-center gap-4'>
                <span
                  className='grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15'
                  aria-hidden='true'
                >
                  <OutdoorGrillOutlined />
                </span>
                <h1 className='text-3xl font-semibold tracking-tight sm:text-4xl'>
                  Cocinas
                </h1>
              </div>
              {!isLoading && !loadError && (
                <p className='rounded-full bg-white/15 px-3 py-1 text-sm font-medium'>
                  {kitchens.length}{" "}
                  {kitchens.length === 1
                    ? "cocina registrada"
                    : "cocinas registradas"}
                </p>
              )}
            </header>

            <section
              className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6'
              aria-labelledby='kitchen-form-title'
            >
              <h2
                id='kitchen-form-title'
                className='mb-4 text-lg font-semibold'
              >
                {editingId ? "Editar cocina" : "Nueva cocina"}
              </h2>
              <form
                onSubmit={handleSave}
                className='flex flex-col gap-3 sm:flex-row sm:items-start'
              >
                <TextField
                  id='kitchen-name'
                  inputRef={nameInputRef}
                  label='Nombre de la cocina'
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  size='small'
                  disabled={busy}
                  fullWidth
                  required
                />
                <button
                  type='submit'
                  disabled={busy || !name.trim()}
                  className='inline-flex min-h-[2.5rem] shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-dark px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-600'
                >
                  {editingId ? (
                    <CheckRounded fontSize='small' />
                  ) : (
                    <AddRounded fontSize='small' />
                  )}
                  {editingId ? "Guardar cambios" : "Crear cocina"}
                </button>
                {editingId && (
                  <button
                    type='button'
                    onClick={resetForm}
                    disabled={busy}
                    className='min-h-[2.5rem] rounded-xl px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-dark disabled:opacity-60'
                  >
                    Cancelar
                  </button>
                )}
              </form>
              {operationError && (
                <Alert className='mt-4' severity='error'>
                  {operationError}
                </Alert>
              )}
            </section>

            {loadError && (
              <Alert
                severity='error'
                action={
                  <Button onClick={loadKitchens} disabled={busy}>
                    Reintentar
                  </Button>
                }
              >
                {loadError}
              </Alert>
            )}
            {isLoading && (
              <p
                className='rounded-2xl border border-slate-200 bg-white p-6 text-slate-600'
                role='status'
              >
                Cargando cocinas…
              </p>
            )}
            {!isLoading && !loadError && kitchens.length === 0 && (
              <div className='rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-slate-600'>
                <OutdoorGrillOutlined className='mb-2 text-slate-500' />
                <p>No hay cocinas registradas.</p>
              </div>
            )}
            {kitchens.length > 0 && (
              <ul
                className='grid gap-3 md:grid-cols-2 xl:grid-cols-3'
                aria-label='Cocinas registradas'
              >
                {kitchens.map((kitchen) => (
                  <li
                    key={kitchen.id}
                    className={`min-w-0 rounded-2xl border bg-white p-4 shadow-sm ${
                      editingId === kitchen.id
                        ? "border-blue-dark ring-1 ring-blue-dark"
                        : "border-slate-200"
                    }`}
                  >
                    <div className='flex items-start gap-3'>
                      <span
                        className='grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-dark/10 text-blue-dark'
                        aria-hidden='true'
                      >
                        <OutdoorGrillOutlined fontSize='small' />
                      </span>
                      <div className='min-w-0'>
                        <h2 className='break-words text-base font-semibold'>
                          {kitchen.name}
                        </h2>
                        <p className='mt-1 break-all font-mono text-xs text-slate-600'>
                          <span className='sr-only'>ID </span>
                          {kitchen.id}
                        </p>
                      </div>
                    </div>
                    <div className='mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3'>
                      <button
                        type='button'
                        onClick={() => {
                          setOperationError("");
                          setEditingId(kitchen.id);
                          setName(kitchen.name);
                          nameInputRef.current?.focus();
                        }}
                        disabled={busy}
                        aria-label={`Editar ${kitchen.name}`}
                        className='inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-blue-dark hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-dark disabled:opacity-60'
                      >
                        <EditOutlined fontSize='small' /> Editar
                      </button>
                      <button
                        type='button'
                        onClick={() => handleDelete(kitchen)}
                        disabled={busy}
                        aria-label={`Eliminar ${kitchen.name}`}
                        className='inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-rose-700 hover:bg-rose-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-700 disabled:opacity-60'
                      >
                        <DeleteOutlineRounded fontSize='small' /> Eliminar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </ProtectPage>
  );
}
