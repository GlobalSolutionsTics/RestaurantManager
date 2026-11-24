import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  createCategoryService,
  createDishService,
  getDishService,
} from "@/services/dishes";
import { listKitchens } from "@/services/kitchens";
import type { KitchenType } from "@/types/kitchen.types";
import type { TMenuResponse } from "@/types/menu.types";
import { AddRounded, EditOutlined, SetMealOutlined } from "@mui/icons-material";
import {
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import MenuAdmin from "../components/menu";
import { useRouter } from "next/router";
import Head from "next/head";
import ProtectPage from "../components/protectPage";
import { ADMIN } from "@/utils/users";
import { currencyFormat } from "@/utils/formats";
import { AdminExcelEditor } from "@/views/admin/dishes/excelEditor";
import { KitchenSelect } from "@/views/admin/dishes/KitchenSelect";
import { useDishes } from "@/hooks/Dishes/useDishes";

const primaryButton =
  "inline-flex min-h-[2.5rem] items-center justify-center gap-2 rounded-xl bg-blue-dark px-4 text-sm font-semibold text-white hover:bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark disabled:bg-slate-200 disabled:text-slate-600";
const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-blue-dark hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-dark disabled:opacity-60";
const emptyDish = { name: "", price: "", isUniquePrice: "1", kitchenType: "" };

export default function DishesAdminPage() {
  const router = useRouter();
  const { getAllCategories, categories } = useDishes();
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [dishes, setDishes] = useState<TMenuResponse[]>([]);
  const [kitchens, setKitchens] = useState<KitchenType[]>([]);
  const [kitchenError, setKitchenError] = useState(false);
  const [loadingKitchens, setLoadingKitchens] = useState(true);
  const [loadingDishes, setLoadingDishes] = useState(false);
  const [saving, setSaving] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [dialog, setDialog] = useState<"dish" | "category" | null>(null);
  const [draftDish, setDraftDish] = useState(emptyDish);
  const [draftCategory, setDraftCategory] = useState("");
  const [error, setError] = useState("");
  const [listError, setListError] = useState("");
  const [notice, setNotice] = useState("");

  const loadKitchens = useCallback(async () => {
    setLoadingKitchens(true);
    setKitchenError(false);
    try {
      setKitchens(await listKitchens());
    } catch {
      setKitchenError(true);
    } finally {
      setLoadingKitchens(false);
    }
  }, []);

  useEffect(() => {
    void loadKitchens();
  }, [loadKitchens]);

  const loadDishes = useCallback(async (id: string) => {
    setLoadingDishes(true);
    setListError("");
    const result = await getDishService(id);
    setDishes(Array.isArray(result) ? result : []);
    if (!Array.isArray(result))
      setListError("No se pudieron cargar los platillos.");
    setLoadingDishes(false);
  }, []);

  const selectCategory = (id: string, name: string) => {
    setCategoryId(id);
    setCategoryName(name);
    setDishes([]);
    setNotice("");
    void loadDishes(id);
  };

  const openDialog = (mode: "dish" | "category") => {
    setError("");
    setNotice("");
    setDraftDish(emptyDish);
    setDraftCategory("");
    setDialog(mode);
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (dialog === "category") {
        const name = draftCategory.trim();
        if (!name) return;
        const created = await createCategoryService({
          id: name.toLowerCase().replace(" ", "_"),
          value: name,
        });
        if (!created) {
          setError("No se pudo crear la categoría.");
          return;
        }
        await getAllCategories();
        setNotice("Categoría creada.");
      } else {
        const name = draftDish.name.trim();
        const price = Number(draftDish.price);
        if (
          !categoryId ||
          !name ||
          !draftDish.price ||
          !Number.isFinite(price) ||
          price < 0
        )
          return;

        const dish: TMenuResponse = {
          name,
          price,
          isUniquePrice: draftDish.isUniquePrice === "1",
          type: categoryId,
          ...(draftDish.kitchenType
            ? { kitchenType: draftDish.kitchenType }
            : {}),
        };
        if (!(await createDishService({ collection: categoryId, dish }))) {
          setError("No se pudo crear el platillo.");
          return;
        }
        await loadDishes(categoryId);
        setNotice("Platillo creado.");
      }
      setDialog(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectPage push={router.push} requiredProfiles={ADMIN}>
      <Head>
        <title>Platillos | Administración</title>
      </Head>
      <div className='flex min-h-screen bg-slate-100'>
        <MenuAdmin router={router} basePath={router.pathname} />
        <main className='min-w-0 flex-1 px-3 py-5 text-slate-900 sm:px-8 lg:py-10'>
          <div className='mx-auto max-w-6xl space-y-6'>
            <header className='flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-gradient-to-br from-slate-900 to-blue-dark p-5 text-white shadow-sm sm:p-8'>
              <div className='flex items-center gap-4'>
                <span className='grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15'>
                  <SetMealOutlined />
                </span>
                <h1 className='text-3xl font-semibold tracking-tight sm:text-4xl'>
                  Platillos
                </h1>
              </div>
              {!openEdit && (
                <button
                  type='button'
                  className={secondaryButton}
                  onClick={() => setOpenEdit(true)}
                >
                  <EditOutlined fontSize='small' /> Editar precios
                </button>
              )}
            </header>
            {openEdit && kitchenError && (
              <Alert
                severity='error'
                action={
                  <button
                    type='button'
                    className={secondaryButton}
                    onClick={loadKitchens}
                  >
                    Reintentar
                  </button>
                }
              >
                No se pudo cargar el catálogo de cocinas.
              </Alert>
            )}
            {openEdit ? (
              <AdminExcelEditor
                kitchens={kitchens}
                kitchensDisabled={loadingKitchens || kitchenError}
                handleBackEditSection={() => {
                  setOpenEdit(false);
                  if (categoryId) void loadDishes(categoryId);
                }}
              />
            ) : (
              <>
                {notice && (
                  <Alert severity='success' onClose={() => setNotice("")}>
                    {notice}
                  </Alert>
                )}
                <div className='grid items-start gap-4 lg:grid-cols-[minmax(12rem,1fr)_minmax(0,3fr)]'>
                  <section className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
                    <h2 className='mb-3 text-lg font-semibold'>Categorías</h2>
                    <div className='grid gap-1'>
                      {categories.map(({ id, value }) => (
                        <button
                          key={id}
                          type='button'
                          aria-pressed={id === categoryId}
                          disabled={loadingDishes}
                          onClick={() => selectCategory(id, value)}
                          className={`rounded-xl px-3 py-2 text-left text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-dark ${
                            id === categoryId
                              ? "bg-blue-dark text-white"
                              : "text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                      <button
                        type='button'
                        className={secondaryButton}
                        onClick={() => openDialog("category")}
                      >
                        <AddRounded fontSize='small' /> Añadir categoría
                      </button>
                    </div>
                  </section>
                  <section className='min-w-0'>
                    <div className='mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
                      <h2 className='text-lg font-semibold'>
                        {categoryName || "Catálogo"}
                      </h2>
                      <button
                        type='button'
                        className={primaryButton}
                        disabled={!categoryId || loadingDishes}
                        onClick={() => openDialog("dish")}
                      >
                        <AddRounded fontSize='small' /> Agregar platillo
                      </button>
                    </div>
                    {listError && (
                      <Alert
                        severity='error'
                        action={
                          <button
                            type='button'
                            className={secondaryButton}
                            onClick={() => loadDishes(categoryId)}
                          >
                            Reintentar
                          </button>
                        }
                      >
                        {listError}
                      </Alert>
                    )}
                    {loadingDishes && (
                      <p
                        className='rounded-2xl bg-white p-6 text-slate-600'
                        role='status'
                      >
                        Cargando platillos…
                      </p>
                    )}
                    {!loadingDishes && !listError && dishes.length === 0 && (
                      <p className='rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600'>
                        {categoryId
                          ? "No hay platillos en esta categoría."
                          : "Selecciona una categoría para ver sus platillos."}
                      </p>
                    )}
                    {dishes.length > 0 && (
                      <ul
                        className='grid gap-3 sm:grid-cols-2 xl:grid-cols-3'
                        aria-label='Platillos de la categoría'
                      >
                        {dishes.map((dish, index) => (
                          <li
                            key={dish.uuid ?? index}
                            className='min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'
                          >
                            <div className='flex items-start gap-3'>
                              <span className='grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-dark/10 text-blue-dark'>
                                <SetMealOutlined fontSize='small' />
                              </span>
                              <div className='min-w-0'>
                                <h3 className='break-words font-semibold'>
                                  {dish.name}
                                </h3>
                                <p className='mt-1 text-sm font-medium text-blue-dark'>
                                  {currencyFormat(dish.price)}
                                </p>
                              </div>
                            </div>
                            <p className='mt-3 break-words border-t border-slate-100 pt-3 text-sm text-slate-600'>
                              {dish.kitchenType
                                ? kitchens.find(
                                    ({ id }) => id === dish.kitchenType,
                                  )?.name ?? "Cocina asignada"
                                : "Todas las cocinas"}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
      <Dialog
        open={dialog !== null}
        onClose={() => {
          if (!saving) setDialog(null);
        }}
        fullWidth
        maxWidth='sm'
        PaperProps={{ sx: { borderRadius: 4 } }}
        aria-labelledby='dish-dialog-title'
      >
        <DialogTitle id='dish-dialog-title'>
          {dialog === "category" ? "Añadir categoría" : "Añadir platillo"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={save} className='space-y-4 pt-2'>
            {dialog === "category" ? (
              <TextField
                fullWidth
                label='Nombre de la categoría'
                value={draftCategory}
                onChange={(event) => setDraftCategory(event.target.value)}
                required
                disabled={saving}
              />
            ) : (
              <>
                <div className='grid gap-4 sm:grid-cols-2'>
                  <TextField
                    label='Nombre'
                    value={draftDish.name}
                    onChange={(event) =>
                      setDraftDish({ ...draftDish, name: event.target.value })
                    }
                    required
                    disabled={saving}
                  />
                  <TextField
                    label='Precio'
                    type='number'
                    inputProps={{ min: 0, step: "0.01" }}
                    value={draftDish.price}
                    onChange={(event) =>
                      setDraftDish({ ...draftDish, price: event.target.value })
                    }
                    required
                    disabled={saving}
                  />
                  <TextField label='Categoría' value={categoryName} disabled />
                  <TextField
                    select
                    label='¿El precio es fijo?'
                    value={draftDish.isUniquePrice}
                    onChange={(event) =>
                      setDraftDish({
                        ...draftDish,
                        isUniquePrice: event.target.value,
                      })
                    }
                    disabled={saving}
                  >
                    <MenuItem value='0'>No</MenuItem>
                    <MenuItem value='1'>Sí</MenuItem>
                  </TextField>
                </div>
                <label className='grid gap-2 text-sm font-medium text-slate-700'>
                  Cocina perteneciente
                  <KitchenSelect
                    label='Cocina perteneciente'
                    kitchens={kitchens}
                    value={draftDish.kitchenType}
                    onChange={(id) =>
                      setDraftDish({ ...draftDish, kitchenType: id })
                    }
                    disabled={saving || loadingKitchens}
                  />
                </label>
                {loadingKitchens && (
                  <p role='status' className='text-sm text-slate-600'>
                    Cargando cocinas…
                  </p>
                )}
                {kitchenError && (
                  <Alert
                    severity='error'
                    action={
                      <button
                        type='button'
                        className={secondaryButton}
                        onClick={loadKitchens}
                      >
                        Reintentar
                      </button>
                    }
                  >
                    No se pudo cargar el catálogo de cocinas.
                  </Alert>
                )}
              </>
            )}
            {error && <Alert severity='error'>{error}</Alert>}
            <div className='flex flex-wrap justify-end gap-2'>
              <button
                type='button'
                className={secondaryButton}
                onClick={() => setDialog(null)}
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                type='submit'
                className={primaryButton}
                disabled={
                  saving ||
                  (dialog === "category"
                    ? !draftCategory.trim()
                    : !draftDish.name.trim() || !draftDish.price)
                }
              >
                {saving ? "Guardando…" : "Añadir"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </ProtectPage>
  );
}
