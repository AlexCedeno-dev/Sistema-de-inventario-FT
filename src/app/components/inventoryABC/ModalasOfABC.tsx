import { Loader2, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
    } from '../ui/dialog';

export type Categoria = {
  categoria_id: number;
  nombre: string;
};

type InventarioABCItem = {
  inventario_abc_id: number;
  categoria_id: number;
  categoria: string;
  cantidad: number;
  cantidad_prestada?: number;
  nombre: string;
  marca: string | null;
  modelo: string | null;
  descripcion: string | null;
  estado_equipo: string | null;
  ticket_asignacion: string | null;
  solicitado_por: string | null;
  observaciones: string | null;
  imagen_principal?: string | null;
};

export type ImagenABC = {
  imagen_id: number;
  inventario_abc_id: number;
  nombre_archivo: string;
  ruta_archivo: string;
};

export type FormDataABC = {
  categoria_id: string;
  cantidad: string;
  nombre: string;
  marca: string;
  modelo: string;
  descripcion: string;
  estado_equipo: string;
  ticket_asignacion: string;
  solicitado_por: string;
  observaciones: string;
};

export type ExcelPreviewRow = {
  categoria: string;
  cantidad: number;
  nombre: string;
  marca: string;
  modelo: string;
  descripcion: string;
  estado_equipo: string;
  ticket_asignacion: string;
  solicitado_por: string;
  observaciones: string;
};

type ModalasOfABCProps = {
  isFormOpen: boolean;
  setIsFormOpen: (value: boolean) => void;
  editingItem: InventarioABCItem | null;
  formData: FormDataABC;
  setFormData: React.Dispatch<React.SetStateAction<FormDataABC>>;
  categorias: Categoria[];
  guardandoForm: boolean;
  handleSaveItem: () => void;
  setNewItemImages: (files: FileList | null) => void;

  isImagenesOpen: boolean;
  setIsImagenesOpen: (value: boolean) => void;
  imagenes: ImagenABC[];
  setSelectedFiles: (files: FileList | null) => void;
  subiendoImagenes: boolean;
  handleUploadImages: () => void;
  handleDeleteImage: (imagenId: number) => void;
  buildImageUrl: (ruta: string) => string;

  isImportOpen: boolean;
  setIsImportOpen: (value: boolean) => void;
  excelPreview: ExcelPreviewRow[];
  importandoExcel: boolean;
  handleConfirmImport: () => void;

  expandedImage: string | null;
  setExpandedImage: (value: string | null) => void;

 isMovimientoOpen: boolean;
  setIsMovimientoOpen: (value: boolean) => void;
  movimientoData: MovimientoPayload;
  setMovimientoData: React.Dispatch<React.SetStateAction<MovimientoPayload>>;
  guardandoMovimiento: boolean;
  handleSaveMovimiento: () => void;
  selectedItem: InventarioABCItem | null;

  isStockOpen: boolean;
  setIsStockOpen: (value: boolean) => void;
  selectedCategoria: string;
  stockEditValue: string;
  setStockEditValue: (value: string) => void;
  savingStock: boolean;
  handleSaveStock: () => void;

    isPrestamoOpen: boolean;
    setIsPrestamoOpen: (value: boolean) => void;
    prestamoForm: FormPrestamoABC;
    setPrestamoForm: React.Dispatch<React.SetStateAction<FormPrestamoABC>>;
    guardandoPrestamo: boolean;
    handleCrearPrestamo: () => void;

    isHistorialOpen: boolean;
    setIsHistorialOpen: (value: boolean) => void;
    prestamos: PrestamoABC[];
    loadingPrestamos: boolean;
    openDevolucionModal: (prestamo: PrestamoABC) => void;

    isDevolucionOpen: boolean;
    setIsDevolucionOpen: (value: boolean) => void;
    devolucionForm: FormDevolucionABC;
    setDevolucionForm: React.Dispatch<React.SetStateAction<FormDevolucionABC>>;
    guardandoDevolucion: boolean;
    handleDevolverPrestamo: () => void;
};

export type MovimientoPayload = {
  inventario_abc_id: number;
  tipo_movimiento: 'entrada' | 'salida' | 'ajuste';
  cantidad: number;
  numero_ticket: string;
  solicitado_por: string;
  comentario: string;
};

export type PrestamoABC = {
prestamo_id: number;
inventario_abc_id: number;
ticket_prestamo: string;
solicitante_nombre: string;
departamento: string;
cantidad: number;
estado_entrega: string;
fecha_asignacion: string;
estado_prestamo: 'prestado' | 'devuelto';
estado_devolucion: string | null;
detalle_devolucion: string | null;
fecha_devolucion: string | null;
comentario: string | null;
};

export type FormPrestamoABC = {
solicitante_nombre: string;
departamento: string;
cantidad: string;
estado_entrega: string;
fecha_asignacion: string;
comentario: string;
};

export type FormDevolucionABC = {
prestamo_id: number;
estado_devolucion: string;
detalle_devolucion: string;
fecha_devolucion: string;
};

export function ModalasOfABC(props: ModalasOfABCProps) {
  const {
    isFormOpen,
    setIsFormOpen,
    editingItem,
    formData,
    setFormData,
    categorias,
    guardandoForm,
    handleSaveItem,
    setNewItemImages,

    isImagenesOpen,
    setIsImagenesOpen,
    imagenes,
    setSelectedFiles,
    subiendoImagenes,
    handleUploadImages,
    handleDeleteImage,
    buildImageUrl,

    isImportOpen,
    setIsImportOpen,
    excelPreview,
    importandoExcel,
    handleConfirmImport,

    expandedImage,
    setExpandedImage,
        isMovimientoOpen,
    setIsMovimientoOpen,
    movimientoData,
    setMovimientoData,
    guardandoMovimiento,
    handleSaveMovimiento,
    selectedItem,

    isStockOpen,
    setIsStockOpen,
    selectedCategoria,
    stockEditValue,
    setStockEditValue,
    savingStock,
    handleSaveStock,

    isPrestamoOpen,
    setIsPrestamoOpen,
    prestamoForm,
    setPrestamoForm,
    guardandoPrestamo,
    handleCrearPrestamo,

    isHistorialOpen,
    setIsHistorialOpen,
    prestamos,
    loadingPrestamos,
    openDevolucionModal,

    isDevolucionOpen,
    setIsDevolucionOpen,
    devolucionForm,
    setDevolucionForm,
    guardandoDevolucion,
    handleDevolverPrestamo,

    

    
  } = props;

  

  

  return (
    <>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="!w-[95vw] !max-w-[95vw] xl:!max-w-[1400px] rounded-3xl p-0 overflow-hidden">
          <div className="bg-white">
            <DialogHeader className="px-8 py-6 border-b border-slate-200">
              <DialogTitle className="text-4xl font-bold">
                {editingItem ? 'Editar artículo' : 'Agregar artículo'}
              </DialogTitle>
            </DialogHeader>

            <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Categoría</label>
                <select
                  value={formData.categoria_id}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, categoria_id: e.target.value }))
                  }
                  className="w-full h-14 rounded-2xl border border-slate-200 px-4 bg-white outline-none text-base"
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map((categoria) => (
                    <option
                      key={categoria.categoria_id}
                      value={String(categoria.categoria_id)}
                    >
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Stock actual</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.cantidad}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, cantidad: e.target.value }))
                  }
                  className="h-14 rounded-2xl text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Nombre</label>
                <Input
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, nombre: e.target.value }))
                  }
                  className="h-14 rounded-2xl text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Marca</label>
                <Input
                  value={formData.marca}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, marca: e.target.value }))
                  }
                  className="h-14 rounded-2xl text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Modelo</label>
                <Input
                  value={formData.modelo}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, modelo: e.target.value }))
                  }
                  className="h-14 rounded-2xl text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Estado</label>
                <select
                  value={formData.estado_equipo}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, estado_equipo: e.target.value }))
                  }
                  className="w-full h-14 rounded-2xl border border-slate-200 px-4 bg-white outline-none text-base"
                >
                  <option value="">Selecciona un estado</option>
                  <option value="Nuevo">Nuevo</option>
                  <option value="Usado">Usado</option>
                  <option value="Dañado">Dañado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Ticket</label>
                <Input
                  value={formData.ticket_asignacion}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, ticket_asignacion: e.target.value }))
                  }
                  className="h-14 rounded-2xl text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Solicitado por</label>
                <Input
                  value={formData.solicitado_por}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, solicitado_por: e.target.value }))
                  }
                  className="h-14 rounded-2xl text-base"
                />
              </div>

              <div className="xl:col-span-2">
                <label className="block text-sm font-semibold mb-2">Descripción</label>
                <Textarea
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, descripcion: e.target.value }))
                  }
                  className="rounded-2xl min-h-[180px] text-base"
                />
              </div>

              {!editingItem && (
                <div className="xl:col-span-2">
                  <label className="block text-sm font-semibold mb-2">Observaciones</label>
                  <Textarea
                    value={formData.observaciones}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, observaciones: e.target.value }))
                    }
                    className="rounded-2xl min-h-[180px] text-base"
                  />
                </div>
              )}

              <div className="xl:col-span-4">
                <label className="block text-sm font-semibold mb-2">
                  Imágenes del artículo
                </label>
                <Input
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={(e) => setNewItemImages(e.target.files)}
                  className="rounded-2xl h-14 text-base"
                />
                <p className="text-sm text-slate-500 mt-2">
                  Puedes subir fotos manualmente al crear o editar el artículo.
                </p>
              </div>
            </div>

            <DialogFooter className="px-8 py-6 border-t border-slate-200">
              <Button
                variant="outline"
                className="rounded-2xl h-12 px-6"
                onClick={() => setIsFormOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveItem}
                disabled={guardandoForm}
                className="rounded-2xl bg-slate-950 hover:bg-slate-800 text-white h-12 px-6"
              >
                {guardandoForm && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingItem ? 'Guardar cambios' : 'Crear artículo'}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isImagenesOpen} onOpenChange={setIsImagenesOpen}>
        <DialogContent className="!w-[88vw] !max-w-5xl rounded-3xl p-0 overflow-hidden">
          <div className="bg-white">
            <DialogHeader className="px-8 py-6 border-b border-slate-200">
              <DialogTitle className="text-4xl font-bold">Imágenes</DialogTitle>
            </DialogHeader>

            <div className="px-8 py-6 space-y-6">
              <div className="flex flex-col lg:flex-row gap-4 items-start">
                <div className="flex-1">
                  <Input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={(e) => setSelectedFiles(e.target.files)}
                    className="rounded-2xl h-14 text-base"
                  />
                </div>

                <Button
                  onClick={handleUploadImages}
                  disabled={subiendoImagenes}
                  className="rounded-2xl bg-slate-950 hover:bg-slate-800 text-white h-14 px-6"
                >
                  {subiendoImagenes && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Subir imágenes
                </Button>
              </div>

              {imagenes.length === 0 ? (
                <div className="text-center py-14 text-slate-500">
                  Este artículo todavía no tiene imágenes
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {imagenes.map((imagen) => (
                    <div
                      key={imagen.imagen_id}
                      className="border border-slate-200 rounded-3xl p-4 bg-white shadow-sm"
                    >
                      <button
                        type="button"
                        className="w-full text-left"
                        onClick={() => setExpandedImage(buildImageUrl(imagen.ruta_archivo))}
                      >
                        <div className="aspect-video rounded-2xl overflow-hidden bg-slate-100 mb-4">
                          <img
                            src={buildImageUrl(imagen.ruta_archivo)}
                            alt={imagen.nombre_archivo}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </button>

                      <p className="text-sm font-medium truncate mb-4">
                        {imagen.nombre_archivo}
                      </p>

                      <Button
                        variant="outline"
                        className="w-full rounded-2xl text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteImage(imagen.imagen_id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar imagen
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent className="!w-[96vw] !max-w-[96vw] !h-[88vh] p-0 rounded-3xl overflow-hidden flex flex-col">
          <div className="flex h-full flex-col bg-white">
            <DialogHeader className="shrink-0 border-b border-slate-200 px-6 py-5">
              <DialogTitle className="text-2xl font-bold text-slate-900">
                Vista previa de importación Excel
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 min-h-0 px-6 py-4">
              <div className="h-full w-full overflow-auto rounded-2xl border border-slate-200">
                <table className="w-full min-w-[1100px] text-sm">
                  <thead className="sticky top-0 z-10 bg-slate-100">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold">Categoría</th>
                      <th className="text-left px-4 py-3 font-semibold">Cantidad</th>
                      <th className="text-left px-4 py-3 font-semibold">Nombre</th>
                      <th className="text-left px-4 py-3 font-semibold">Modelo</th>
                      <th className="text-left px-4 py-3 font-semibold">Descripción</th>
                      <th className="text-left px-4 py-3 font-semibold">Estado</th>
                      <th className="text-left px-4 py-3 font-semibold">Ticket</th>
                    </tr>
                  </thead>
                  <tbody>
                    {excelPreview.map((row, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-4 py-3">{row.categoria}</td>
                        <td className="px-4 py-3">{row.cantidad}</td>
                        <td className="px-4 py-3">{row.nombre}</td>
                        <td className="px-4 py-3">{row.modelo}</td>
                        <td className="px-4 py-3">{row.descripcion}</td>
                        <td className="px-4 py-3">{row.estado_equipo}</td>
                        <td className="px-4 py-3">{row.ticket_asignacion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="shrink-0 border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3 bg-white">
              <Button
                variant="outline"
                className="rounded-2xl"
                onClick={() => setIsImportOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmImport}
                disabled={importandoExcel}
                className="rounded-2xl bg-slate-950 hover:bg-slate-800 text-white"
              >
                {importandoExcel && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Importar registros
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {expandedImage && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 p-4">
          <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h3 className="text-2xl font-bold text-slate-900">Vista de imagen</h3>
              <button
                type="button"
                onClick={() => setExpandedImage(null)}
                className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Cerrar
              </button>
            </div>

            <div className="p-6 flex items-center justify-center bg-white">
              <img
                src={expandedImage}
                alt="Vista ampliada"
                className="max-w-full max-h-[65vh] object-contain rounded-2xl border border-slate-200"
              />
            </div>
          </div>
        </div>
      )}

      <Dialog open={isStockOpen} onOpenChange={setIsStockOpen}>
  <DialogContent className="max-w-md rounded-3xl">
    <DialogHeader>
      <DialogTitle className="text-2xl font-bold">
        Editar stock
      </DialogTitle>
      <p className="text-sm text-slate-500">
        Categoría: {selectedCategoria}
      </p>
    </DialogHeader>

    <div className="py-4">
      <label className="block text-sm font-semibold mb-2">
        Stock en almacén
      </label>
      <Input
        type="number"
        min="0"
        value={stockEditValue}
        onChange={(e) => setStockEditValue(e.target.value)}
        className="h-12 rounded-2xl"
      />
    </div>

        <DialogFooter>
        <Button
            variant="outline"
            className="rounded-2xl"
            onClick={() => setIsStockOpen(false)}
        >
            Cancelar
        </Button>

        <Button
            onClick={handleSaveStock}
            disabled={savingStock}
            className="rounded-2xl bg-slate-950 hover:bg-slate-800 text-white"
        >
            {savingStock && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar stock
        </Button>
        </DialogFooter>
    </DialogContent>
    </Dialog>

    <Dialog open={isPrestamoOpen} onOpenChange={setIsPrestamoOpen}>
  <DialogContent className="!w-[90vw] !max-w-4xl rounded-3xl p-0 overflow-hidden">
    <div className="bg-white">
      <DialogHeader className="px-8 py-6 border-b border-slate-200">
        <DialogTitle className="text-3xl font-bold">
          Prestar / Asignar artículo
        </DialogTitle>
        <p className="text-sm text-slate-500 mt-1">
          Producto: {selectedItem?.nombre ?? 'N/A'} · Stock disponible: {selectedItem?.cantidad ?? 0}
        </p>
      </DialogHeader>

      <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold mb-2">Nombre solicitante</label>
          <Input
            value={prestamoForm.solicitante_nombre}
            onChange={(e) =>
              setPrestamoForm((prev) => ({
                ...prev,
                solicitante_nombre: e.target.value,
              }))
            }
            className="h-12 rounded-2xl"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Departamento</label>
          <Input
            value={prestamoForm.departamento}
            onChange={(e) =>
              setPrestamoForm((prev) => ({
                ...prev,
                departamento: e.target.value,
              }))
            }
            className="h-12 rounded-2xl"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Cantidad</label>
          <Input
            type="number"
            min="1"
            value={prestamoForm.cantidad}
            onChange={(e) =>
              setPrestamoForm((prev) => ({
                ...prev,
                cantidad: e.target.value,
              }))
            }
            className="h-12 rounded-2xl"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Fecha de asignación</label>
          <Input
            type="datetime-local"
            value={prestamoForm.fecha_asignacion}
            onChange={(e) =>
              setPrestamoForm((prev) => ({
                ...prev,
                fecha_asignacion: e.target.value,
              }))
            }
            className="h-12 rounded-2xl"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Estado de entrega</label>
          <select
            value={prestamoForm.estado_entrega}
            onChange={(e) =>
              setPrestamoForm((prev) => ({
                ...prev,
                estado_entrega: e.target.value,
              }))
            }
            className="w-full h-12 rounded-2xl border border-slate-200 px-4 bg-white outline-none"
          >
            <option value="Buen estado">Buen estado</option>
            <option value="Regular">Regular</option>
            <option value="Malo">Malo</option>
            <option value="Personalizado">Personalizado</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-2">Comentario</label>
          <Textarea
            value={prestamoForm.comentario}
            onChange={(e) =>
              setPrestamoForm((prev) => ({
                ...prev,
                comentario: e.target.value,
              }))
            }
            className="rounded-2xl min-h-[110px]"
          />
        </div>
      </div>

      <DialogFooter className="px-8 py-6 border-t border-slate-200">
        <Button
          variant="outline"
          className="rounded-2xl"
          onClick={() => setIsPrestamoOpen(false)}
        >
          Cancelar
        </Button>

        <Button
          onClick={handleCrearPrestamo}
          disabled={guardandoPrestamo}
          className="rounded-2xl bg-slate-950 hover:bg-slate-800 text-white"
        >
          {guardandoPrestamo && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Guardar préstamo
        </Button>
      </DialogFooter>
    </div>
  </DialogContent>
</Dialog>


<Dialog open={isHistorialOpen} onOpenChange={setIsHistorialOpen}>
  <DialogContent className="!w-[95vw] !max-w-6xl !h-[85vh] rounded-3xl p-0 overflow-hidden">
    <div className="flex h-full flex-col bg-white">
      <DialogHeader className="px-8 py-6 border-b border-slate-200">
        <DialogTitle className="text-3xl font-bold">
          Historial de préstamos
        </DialogTitle>
        <p className="text-sm text-slate-500 mt-1">
          Producto: {selectedItem?.nombre ?? 'N/A'}
        </p>
      </DialogHeader>

      <div className="flex-1 min-h-0 px-8 py-6 overflow-auto">
        {loadingPrestamos ? (
          <div className="flex items-center justify-center py-14 text-slate-500 gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Cargando historial...
          </div>
        ) : prestamos.length === 0 ? (
          <div className="text-center py-14 text-slate-500">
            Este artículo todavía no tiene préstamos registrados
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[1000px] text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Ticket</th>
                  <th className="text-left px-4 py-3 font-semibold">Solicitante</th>
                  <th className="text-left px-4 py-3 font-semibold">Departamento</th>
                  <th className="text-left px-4 py-3 font-semibold">Cantidad</th>
                  <th className="text-left px-4 py-3 font-semibold">Fecha asignación</th>
                  <th className="text-left px-4 py-3 font-semibold">Estado</th>
                  <th className="text-left px-4 py-3 font-semibold">Devolución</th>
                  <th className="text-left px-4 py-3 font-semibold">Acción</th>
                </tr>
              </thead>

              <tbody>
                {prestamos.map((prestamo) => (
                  <tr key={prestamo.prestamo_id} className="border-b border-slate-100">
                    <td className="px-4 py-3 font-mono">{prestamo.ticket_prestamo}</td>
                    <td className="px-4 py-3">{prestamo.solicitante_nombre}</td>
                    <td className="px-4 py-3">{prestamo.departamento}</td>
                    <td className="px-4 py-3 font-semibold">{prestamo.cantidad}</td>
                    <td className="px-4 py-3">
                      {prestamo.fecha_asignacion
                        ? new Date(prestamo.fecha_asignacion).toLocaleString()
                        : 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          prestamo.estado_prestamo === 'prestado'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {prestamo.estado_prestamo}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {prestamo.fecha_devolucion
                        ? new Date(prestamo.fecha_devolucion).toLocaleString()
                        : 'Pendiente'}
                    </td>
                    <td className="px-4 py-3">
                      {prestamo.estado_prestamo === 'prestado' ? (
                        <Button
                          size="sm"
                          className="rounded-xl bg-slate-950 hover:bg-slate-800 text-white"
                          onClick={() => openDevolucionModal(prestamo)}
                        >
                          Reasignar al almacén
                        </Button>
                      ) : (
                        <span className="text-slate-400 text-xs">Finalizado</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

                <DialogFooter className="px-8 py-6 border-t border-slate-200">
                    <Button
                    variant="outline"
                    className="rounded-2xl"
                    onClick={() => setIsHistorialOpen(false)}
                    >
                    Cerrar
                    </Button>
                </DialogFooter>
                </div>
            </DialogContent>
            </Dialog>


            <Dialog open={isDevolucionOpen} onOpenChange={setIsDevolucionOpen}>
            <DialogContent className="!w-[90vw] !max-w-3xl rounded-3xl p-0 overflow-hidden">
                <div className="bg-white">
                <DialogHeader className="px-8 py-6 border-b border-slate-200">
                    <DialogTitle className="text-3xl font-bold">
                    Reasignar al almacén
                    </DialogTitle>
                    <p className="text-sm text-slate-500 mt-1">
                    Este movimiento regresará la cantidad prestada al stock del artículo.
                    </p>
                </DialogHeader>

                <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                    <label className="block text-sm font-semibold mb-2">Fecha devolución</label>
                    <Input
                        type="datetime-local"
                        value={devolucionForm.fecha_devolucion}
                        onChange={(e) =>
                        setDevolucionForm((prev) => ({
                            ...prev,
                            fecha_devolucion: e.target.value,
                        }))
                        }
                        className="h-12 rounded-2xl"
                    />
                    </div>

                    <div>
                    <label className="block text-sm font-semibold mb-2">Estado al regresar</label>
                    <select
                        value={devolucionForm.estado_devolucion}
                        onChange={(e) =>
                        setDevolucionForm((prev) => ({
                            ...prev,
                            estado_devolucion: e.target.value,
                        }))
                        }
                        className="w-full h-12 rounded-2xl border border-slate-200 px-4 bg-white outline-none"
                    >
                        <option value="Buen estado">Buen estado</option>
                        <option value="Regular">Regular</option>
                        <option value="Malo">Malo</option>
                        <option value="Personalizado">Personalizado</option>
                    </select>
                    </div>

                    <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Detalles de devolución</label>
                    <Textarea
                        value={devolucionForm.detalle_devolucion}
                        onChange={(e) =>
                        setDevolucionForm((prev) => ({
                            ...prev,
                            detalle_devolucion: e.target.value,
                        }))
                        }
                        className="rounded-2xl min-h-[130px]"
                        placeholder="Ejemplo: Regresó completo, con cable, en buen estado..."
                    />
                    </div>
                </div>

                <DialogFooter className="px-8 py-6 border-t border-slate-200">
                    <Button
                    variant="outline"
                    className="rounded-2xl"
                    onClick={() => setIsDevolucionOpen(false)}
                    >
                    Cancelar
                    </Button>

                    <Button
                    onClick={handleDevolverPrestamo}
                    disabled={guardandoDevolucion}
                    className="rounded-2xl bg-slate-950 hover:bg-slate-800 text-white"
                    >
                    {guardandoDevolucion && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Agregar al inventario
                    </Button>
                </DialogFooter>
                </div>
            </DialogContent>
            </Dialog>
    </>
  );
}