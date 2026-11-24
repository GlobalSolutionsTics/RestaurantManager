import EditionTableCol from "@/components/editionTableCol";
import OptionSearcher from "@/components/OptionSearcher";
import { useExcelEditor } from "@/hooks/Dishes/admin/useExcelEditor";
import { ArrowBack, SaveOutlined } from "@mui/icons-material";
import { MenuItem, TextField } from "@mui/material";
import type { ExcelEditorProps } from "./type";

export function AdminExcelEditor({
  handleBackEditSection,
  kitchens,
  kitchensDisabled,
}: ExcelEditorProps) {
  const {
    handleSaveChanges,
    handleEditingCategory,
    handleSearch,
    handleOptionSelected,
    handleChangeEditCol,
    handleDeleteColum,
    categories,
    isChangesItems,
    textToSearch,
    posibleOptions,
    loading,
    saving,
    categorySelect,
    dishes,
    idItemSelect,
    confirmDiscardChanges,
  } = useExcelEditor();

  return (
    <section className='min-w-0 space-y-4'>
      <div className='flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
        <div className='flex flex-wrap items-center gap-3'>
          <button
            type='button'
            disabled={saving}
            onClick={async () => {
              if (await confirmDiscardChanges()) handleBackEditSection();
            }}
            className='inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-blue-dark hover:bg-slate-100 disabled:opacity-60'
          >
            <ArrowBack fontSize='small' /> Volver
          </button>
          <h2 className='text-lg font-semibold'>Editar precios</h2>
          {isChangesItems && (
            <span className='text-sm text-amber-800'>Cambios sin guardar</span>
          )}
        </div>
        <button
          type='button'
          disabled={!isChangesItems || saving}
          onClick={handleSaveChanges}
          className='inline-flex min-h-[2.5rem] items-center gap-2 rounded-xl bg-blue-dark px-4 text-sm font-semibold text-white hover:bg-slate-900 disabled:bg-slate-200 disabled:text-slate-600'
        >
          <SaveOutlined fontSize='small' />{" "}
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>

      <div className='grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[minmax(10rem,1fr)_2fr]'>
        <TextField
          select
          size='small'
          label='Categoría'
          value={categorySelect}
          onChange={(event) => handleEditingCategory(event.target.value)}
          disabled={loading || saving}
        >
          {categories.map(({ id, value }) => (
            <MenuItem key={id} value={id}>
              {value}
            </MenuItem>
          ))}
        </TextField>
        <div className='relative min-w-0'>
          <TextField
            fullWidth
            size='small'
            label='Buscar platillo'
            value={textToSearch}
            onChange={handleSearch}
            disabled={loading || saving}
          />
          {posibleOptions.length > 0 && (
            <div className='absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg'>
              {posibleOptions.map((dish, index) => (
                <OptionSearcher
                  key={dish.uuid ?? index}
                  onClick={() => handleOptionSelected(dish)}
                >
                  {categories.find(({ id }) => id === dish.type)?.value ??
                    dish.type}{" "}
                  · {dish.name}
                </OptionSearcher>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <p className='rounded-2xl bg-white p-6 text-slate-600' role='status'>
          Cargando platillos…
        </p>
      ) : categorySelect ? (
        <div className='overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm'>
          <div className='min-w-[58rem]'>
            <div className='grid grid-cols-[3rem_minmax(10rem,1.4fr)_minmax(6rem,0.8fr)_minmax(9rem,1fr)_minmax(9rem,1fr)_minmax(12rem,1.3fr)_5rem] gap-2 border-b border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700'>
              <span aria-hidden='true'>#</span>
              <span>Nombre</span>
              <span>Precio</span>
              <span>Categoría</span>
              <span>¿Es precio único?</span>
              <span>Cocina perteneciente</span>
              <span>Acciones</span>
            </div>
            {dishes.map((dish, index) => (
              <EditionTableCol
                index={index}
                key={dish.uuid ?? index}
                data={dish}
                categories={categories}
                kitchens={kitchens}
                kitchensDisabled={kitchensDisabled}
                disabled={saving}
                handleChange={(updatedDish) =>
                  handleChangeEditCol(index, updatedDish)
                }
                handleDelete={() => handleDeleteColum(index)}
                isSelected={!!dish.uuid && dish.uuid === idItemSelect}
              />
            ))}
            {dishes.length === 0 && (
              <p className='p-4 text-sm text-slate-600'>
                No hay platillos en esta categoría.
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className='rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600'>
          Selecciona una categoría para editar sus platillos.
        </p>
      )}
    </section>
  );
}
