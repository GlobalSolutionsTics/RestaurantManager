import { listKitchens } from "@/services/kitchens";
import {
  createUserService,
  deleteUserService,
  listUserSerive,
  updateUserService,
} from "@/services/users";
import type { TCreateUser } from "@/services/users";
import type { IUsersResponse } from "@/pages/api/auth/controller/users";
import type { KitchenType } from "@/types/kitchen.types";
import { TOKEN_ID } from "@/utils/strings";
import { ADMIN, CASHER, CHECKS, KITCHEN } from "@/utils/users";
import {
  AddRounded,
  DeleteOutlineRounded,
  EditOutlined,
  PeopleOutline,
  PersonOutline,
} from "@mui/icons-material";
import {
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { Formik } from "formik";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import MenuAdmin from "../components/menu";
import ProtectPage from "../components/protectPage";

const roles: Record<string, string> = {
  [ADMIN]: "Administrador",
  [CHECKS]: "Mesero",
  [KITCHEN]: "Cocina",
  [CASHER]: "Caja",
};
const initialUser: TCreateUser = { name: "", user: "", password: "", type: "" };
const primaryButton =
  "inline-flex min-h-[2.5rem] items-center justify-center gap-2 rounded-xl bg-blue-dark px-4 text-sm font-semibold text-white hover:bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark disabled:bg-slate-200 disabled:text-slate-600";
const secondaryButton =
  "rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 disabled:opacity-60";
const deleteButton =
  "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50 focus-visible:outline focus-visible:outline-2 disabled:opacity-60";

export default function UsersAdministratorPage() {
  const router = useRouter();
  const [users, setUsers] = useState<IUsersResponse[]>([]);
  const [kitchens, setKitchens] = useState<KitchenType[]>([]);
  const [search, setSearch] = useState("");
  const [editor, setEditor] = useState<IUsersResponse | "new" | null>(null);
  const [deleting, setDeleting] = useState<IUsersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingKitchens, setLoadingKitchens] = useState(true);
  const [saving, setSaving] = useState(false);
  const [listError, setListError] = useState("");
  const [kitchenError, setKitchenError] = useState("");
  const [operationError, setOperationError] = useState("");
  const [notice, setNotice] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setListError("");
    const token = sessionStorage.getItem(TOKEN_ID);
    const result = token ? await listUserSerive(token) : false;
    if (Array.isArray(result)) setUsers(result);
    else setListError("No se pudieron cargar los usuarios.");
    setLoading(false);
  }, []);

  const loadKitchens = useCallback(async () => {
    setLoadingKitchens(true);
    setKitchenError("");
    try {
      setKitchens(await listKitchens());
    } catch {
      setKitchenError("No se pudieron cargar las cocinas.");
    } finally {
      setLoadingKitchens(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
    void loadKitchens();
  }, [loadUsers, loadKitchens]);

  const editUser = (user: IUsersResponse | "new") => {
    setOperationError("");
    setNotice("");
    setEditor(user);
    void loadKitchens();
  };

  const submitUser = async (values: TCreateUser) => {
    setSaving(true);
    setOperationError("");
    const token = sessionStorage.getItem(TOKEN_ID);
    const payload = {
      ...values,
      kitchenType:
        values.type === KITCHEN ? values.kitchenType || undefined : undefined,
    };
    const creating = editor === "new";
    try {
      const success =
        token &&
        (creating
          ? await createUserService(payload, token)
          : editor &&
            (await updateUserService(
              { ...payload, uuid: editor.uuid },
              token,
            )));
      if (!success) {
        setOperationError("No se pudo guardar el usuario.");
        return;
      }
      setEditor(null);
      setNotice(creating ? "Usuario creado." : "Usuario actualizado.");
      await loadUsers();
    } finally {
      setSaving(false);
    }
  };

  const removeUser = async () => {
    if (!deleting) return;
    setSaving(true);
    setOperationError("");
    const token = sessionStorage.getItem(TOKEN_ID);
    try {
      if (!token || !(await deleteUserService(deleting.uuid, token))) {
        setOperationError("No se pudo eliminar el usuario.");
        return;
      }
      setDeleting(null);
      setNotice("Usuario eliminado.");
      await loadUsers();
    } finally {
      setSaving(false);
    }
  };

  const query = search.trim().toLocaleLowerCase();
  const visibleUsers = users.filter(({ name, user, type }) =>
    [name, user, roles[type] ?? type].some((value) =>
      value.toLocaleLowerCase().includes(query),
    ),
  );

  return (
    <ProtectPage push={router.push} requiredProfiles={ADMIN}>
      <Head>
        <title>Usuarios | Administración</title>
      </Head>
      <div className='flex min-h-screen bg-slate-100'>
        <MenuAdmin router={router} basePath={router.pathname} />
        <main className='min-w-0 flex-1 px-3 py-5 text-slate-900 sm:px-8 lg:py-10'>
          <div className='mx-auto max-w-6xl space-y-6'>
            <header className='flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-gradient-to-br from-slate-900 to-blue-dark p-5 text-white shadow-sm sm:p-8'>
              <div className='flex items-center gap-4'>
                <span className='grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15'>
                  <PeopleOutline />
                </span>
                <h1 className='text-3xl font-semibold tracking-tight sm:text-4xl'>
                  Usuarios
                </h1>
              </div>
              {!loading && !listError && (
                <p className='rounded-full bg-white/15 px-3 py-1 text-sm font-medium'>
                  {users.length}{" "}
                  {users.length === 1
                    ? "usuario registrado"
                    : "usuarios registrados"}
                </p>
              )}
            </header>

            <div className='flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between'>
              <TextField
                label='Buscar usuarios'
                size='small'
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <button
                type='button'
                className={primaryButton}
                onClick={() => editUser("new")}
              >
                <AddRounded fontSize='small' /> Añadir usuario
              </button>
            </div>
            {notice && (
              <Alert severity='success' onClose={() => setNotice("")}>
                {notice}
              </Alert>
            )}
            {listError && (
              <Alert
                severity='error'
                action={
                  <button
                    type='button'
                    className={secondaryButton}
                    onClick={loadUsers}
                  >
                    Reintentar
                  </button>
                }
              >
                {listError}
              </Alert>
            )}
            {loading && (
              <p
                role='status'
                className='rounded-2xl bg-white p-6 text-slate-600'
              >
                Cargando usuarios…
              </p>
            )}
            {!loading && !listError && visibleUsers.length === 0 && (
              <p className='rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600'>
                {query
                  ? "No se encontraron usuarios."
                  : "No hay usuarios registrados."}
              </p>
            )}
            {visibleUsers.length > 0 && (
              <ul
                className='grid gap-3 md:grid-cols-2 xl:grid-cols-3'
                aria-label='Usuarios registrados'
              >
                {visibleUsers.map((user) => (
                  <li
                    key={user.uuid}
                    className='min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'
                  >
                    <div className='flex items-start gap-3'>
                      <span className='grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-dark/10 text-blue-dark'>
                        <PersonOutline fontSize='small' />
                      </span>
                      <div className='min-w-0'>
                        <h2 className='break-words font-semibold'>
                          {user.name}
                        </h2>
                        <p className='break-words text-sm text-slate-600'>
                          {user.user}
                        </p>
                      </div>
                    </div>
                    <p className='mt-3 break-words text-sm text-slate-700'>
                      <span className='rounded-full bg-slate-100 px-2 py-1 font-medium'>
                        {roles[user.type] ?? user.type}
                      </span>
                      {user.type === KITCHEN && user.kitchenType && (
                        <span className='ml-2'>
                          {kitchens.find(({ id }) => id === user.kitchenType)
                            ?.name ?? user.kitchenType}
                        </span>
                      )}
                    </p>
                    <div className='mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3'>
                      <button
                        type='button'
                        className={secondaryButton}
                        aria-label={`Editar ${user.name}`}
                        onClick={() => editUser(user)}
                      >
                        <EditOutlined fontSize='small' /> Editar
                      </button>
                      <button
                        type='button'
                        className={deleteButton}
                        aria-label={`Eliminar ${user.name}`}
                        onClick={() => {
                          setNotice("");
                          setOperationError("");
                          setDeleting(user);
                        }}
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

      <Dialog
        open={editor !== null}
        onClose={() => {
          if (!saving) setEditor(null);
        }}
        fullWidth
        maxWidth='sm'
        aria-labelledby='user-editor-title'
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogTitle id='user-editor-title'>
          {editor === "new" ? "Añadir usuario" : "Editar usuario"}
        </DialogTitle>
        <DialogContent>
          {editor && (
            <Formik<TCreateUser>
              initialValues={editor === "new" ? initialUser : editor}
              onSubmit={submitUser}
            >
              {({ values, handleChange, handleSubmit }) => {
                const isKitchen = values.type === KITCHEN;
                const needsKitchen =
                  isKitchen && (editor === "new" || editor.type !== KITCHEN);
                const selectedKitchen = values.kitchenType ?? "";
                const inCatalog = kitchens.some(
                  ({ id }) => id === selectedKitchen,
                );
                return (
                  <form onSubmit={handleSubmit} className='space-y-4 pt-2'>
                    <div className='grid gap-4 sm:grid-cols-2'>
                      <TextField
                        label='Nombre'
                        name='name'
                        value={values.name}
                        onChange={handleChange}
                        disabled={saving}
                        required
                      />
                      <TextField
                        label='Usuario'
                        name='user'
                        value={values.user}
                        onChange={handleChange}
                        disabled={saving}
                        required
                      />
                      <TextField
                        label='Contraseña'
                        name='password'
                        type='password'
                        value={values.password}
                        onChange={handleChange}
                        disabled={saving}
                        required
                      />
                      <TextField
                        select
                        label='Tipo de usuario'
                        name='type'
                        value={values.type}
                        onChange={handleChange}
                        disabled={saving}
                        required
                      >
                        {Object.entries(roles).map(([value, label]) => (
                          <MenuItem key={value} value={value}>
                            {label}
                          </MenuItem>
                        ))}
                        {values.type && !roles[values.type] && (
                          <MenuItem value={values.type}>{values.type}</MenuItem>
                        )}
                      </TextField>
                    </div>
                    {isKitchen && (
                      <>
                        <TextField
                          select
                          fullWidth
                          label='Cocina asignada'
                          name='kitchenType'
                          value={selectedKitchen}
                          onChange={handleChange}
                          disabled={saving || loadingKitchens || !!kitchenError}
                          required={needsKitchen}
                          helperText={
                            loadingKitchens
                              ? "Cargando cocinas…"
                              : !kitchenError && kitchens.length === 0
                                ? "No hay cocinas registradas."
                                : undefined
                          }
                        >
                          <MenuItem value='' disabled>
                            Selecciona una cocina
                          </MenuItem>
                          {selectedKitchen && !inCatalog && (
                            <MenuItem value={selectedKitchen}>
                              Cocina asignada ({selectedKitchen})
                            </MenuItem>
                          )}
                          {kitchens.map(({ id, name }) => (
                            <MenuItem key={id} value={id}>
                              {name}
                            </MenuItem>
                          ))}
                        </TextField>
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
                            {kitchenError}
                          </Alert>
                        )}
                      </>
                    )}
                    {operationError && (
                      <Alert severity='error'>{operationError}</Alert>
                    )}
                    <div className='flex justify-end gap-2'>
                      <button
                        type='button'
                        className={secondaryButton}
                        disabled={saving}
                        onClick={() => setEditor(null)}
                      >
                        Cancelar
                      </button>
                      <button
                        type='submit'
                        className={primaryButton}
                        disabled={
                          saving ||
                          (needsKitchen &&
                            (loadingKitchens || !!kitchenError || !inCatalog))
                        }
                      >
                        {saving
                          ? "Guardando…"
                          : editor === "new"
                            ? "Crear usuario"
                            : "Guardar cambios"}
                      </button>
                    </div>
                  </form>
                );
              }}
            </Formik>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleting !== null}
        onClose={() => {
          if (!saving) setDeleting(null);
        }}
        fullWidth
        maxWidth='xs'
        aria-labelledby='delete-user-title'
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogTitle id='delete-user-title'>Eliminar usuario</DialogTitle>
        <DialogContent>
          <p className='mb-4 text-slate-700'>
            ¿Eliminar a <strong>{deleting?.name}</strong>?
          </p>
          {operationError && <Alert severity='error'>{operationError}</Alert>}
          <div className='mt-4 flex justify-end gap-2'>
            <button
              type='button'
              className={secondaryButton}
              disabled={saving}
              onClick={() => setDeleting(null)}
            >
              Cancelar
            </button>
            <button
              type='button'
              className={deleteButton}
              disabled={saving}
              onClick={removeUser}
            >
              {saving ? "Eliminando…" : "Eliminar"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </ProtectPage>
  );
}
