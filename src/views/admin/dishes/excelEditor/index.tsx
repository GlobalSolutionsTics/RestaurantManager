import EditionTableCol from "@/components/editionTableCol";
import OptionSearcher from "@/components/OptionSearcher";
import { useExcelEditor } from "@/hooks/Dishes/admin/useExcelEditor";
import { ArrowBack, Done, Save } from "@mui/icons-material";
import { MenuItem, OutlinedInput, Select, Tooltip } from "@mui/material";
import { ExcelEditorProps } from "./type";

export const AdminExcelEditor = ({
  handleBackEditSection,
}: ExcelEditorProps) => {
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
    categorySelect,
    dishes,
    idItemSelect,
  } = useExcelEditor();
  return (
    <div className='flex flex-col w-full'>
      <div className='bg-blue font-secondary text-[1.25rem] w-full p-4 flex justify-between'>
        <div className='flex flex-row items-center'>
          <div className='flex items-center justify-center mr-4'>
            <Tooltip title='Regresar' arrow>
              <button onClick={handleBackEditSection} className='text-white'>
                <ArrowBack />
              </button>
            </Tooltip>
          </div>
          <div className='text-white flex items-center'>Editar precios</div>
        </div>
        {isChangesItems && (
          <div className='text-white text-[1.25rem]'>
            Tienes platillos con cambios sin guardar
          </div>
        )}
        <div className='flex items-center justify-center mr-4'>
          {isChangesItems ? (
            <Tooltip title='Guardar precios' arrow>
              <button onClick={handleSaveChanges} className='text-white'>
                <Save />
              </button>
            </Tooltip>
          ) : (
            <Tooltip title='Precios guardados' arrow>
              <span className='text-white'>
                <Done />
              </span>
            </Tooltip>
          )}
        </div>
      </div>
      <div className='flex flex-row p-4 bg-enabled'>
        <Select
          className='h-[2rem] outline-none w-full basis-1/6 rounded-none mr-4'
          placeholder='Categoría'
          onChange={handleEditingCategory}
        >
          {categories.length > 0 &&
            categories.map((itm, index) => (
              <MenuItem key={"itm-" + itm.id + "-" + index} value={itm.id}>
                {itm.value}
              </MenuItem>
            ))}
        </Select>
        <div className='w-full basis-5/6 relative'>
          <OutlinedInput
            className='h-[2rem] outline-none w-full rounded-none bg-white'
            id='outline-input-platillo'
            placeholder='Buscar platillo'
            value={textToSearch}
            onChange={handleSearch}
          />
          {posibleOptions.length > 0 && (
            <div
              className={`w-full absolute ${
                posibleOptions.length >= 4
                  ? "h-[10rem]"
                  : posibleOptions.length === 3
                    ? "h-[7.5rem]"
                    : posibleOptions.length === 2
                      ? "h-[5rem]"
                      : "h-[2.5rem]"
              } bg-white overflow-y-auto z-[20]`}
            >
              {posibleOptions.map((itm, idx) => (
                <OptionSearcher
                  onClick={() => handleOptionSelected(itm)}
                  key={"id-" + idx}
                >
                  {itm.type.replace("_", " ").toUpperCase()} - {itm.name}
                </OptionSearcher>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className='text-center'>
        {categorySelect !== "" ? (
          <div className='flex flex-col'>
            <div className='flex flex-row w-full bg-enabled-light'>
              <div className='w-[60px] bg-white'></div>
              <div className='basis-1/5 text-left px-4 py-2 border-[1px] border-enabled'>
                Nombre
              </div>
              <div className='basis-1/5 text-left px-4 py-2 border-[1px] border-enabled'>
                Precio
              </div>
              <div className='basis-1/5 text-left px-4 py-2 border-[1px] border-enabled'>
                Categoría
              </div>
              <div className='basis-1/5 text-left px-4 py-2 border-[1px] border-enabled'>
                ¿Es precio único?
              </div>
              <div className='basis-1/5 text-left px-4 py-2 border-[1px] border-enabled'>
                Acciones
              </div>
            </div>
            {dishes.map((itm, index) => (
              <EditionTableCol
                index={index}
                key={"key-" + index}
                data={itm}
                categories={categories}
                handleChange={handleChangeEditCol}
                handleDelete={() => handleDeleteColum(itm)}
                isSelected={itm.uuid === idItemSelect}
              />
            ))}
          </div>
        ) : loading ? (
          <div className='flex items-center p-2 font-secondary'>
            <span className='loader mr-4'></span> Cargando catálogo
          </div>
        ) : (
          <span>Seleccione una categoría</span>
        )}
      </div>
    </div>
  );
};
